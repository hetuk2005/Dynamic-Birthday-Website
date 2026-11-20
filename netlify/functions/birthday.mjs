import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const fields =
  "id,recipient_name,relationship,message,message_type,theme,gallery_type,images,playlist,created_at";
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

function reply(body, status = 200) {
  return Response.json(body, {
    status,
    headers: corsHeaders,
  });
}

function isCloudinaryUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;

  try {
    const url = new URL(value);
    return (
      url.origin === "https://res.cloudinary.com" &&
      url.pathname.startsWith("/demvl3niy/")
    );
  } catch {
    return false;
  }
}

function validatePayload(input) {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Invalid birthday data format." };
  }

  const {
    recipient_name,
    relationship,
    message = "",
    message_type,
    theme,
    gallery_type,
    images = [],
    playlist = [],
  } = input;

  const validImages =
    Array.isArray(images) &&
    images.length <= (gallery_type === "simple" ? 3 : 15) &&
    images.every(
      (url) =>
        isCloudinaryUrl(url) ||
        url?.startsWith("data:image/") ||
        (gallery_type === "simple" && (url === null || url === "")),
    );

  const validPlaylist =
    Array.isArray(playlist) &&
    playlist.length <= 30 &&
    playlist.every(
      (song) =>
        song &&
        ((Number.isInteger(song.defaultId) &&
          song.defaultId >= 1 &&
          song.defaultId <= 7) ||
          (typeof song.title === "string" &&
            song.title.trim() &&
            song.title.length <= 150 &&
            typeof song.artist === "string" &&
            song.artist.length <= 150 &&
            (isCloudinaryUrl(song.audioURL) || typeof song.audioURL === "string"))),
    );

  if (
    typeof recipient_name !== "string" ||
    !recipient_name.trim() ||
    recipient_name.trim().length > 100 ||
    typeof relationship !== "string" ||
    relationship.length > 50 ||
    typeof message !== "string" ||
    message.length > 5000 ||
    !["default", "custom"].includes(message_type) ||
    !["classic", "royal", "galaxy", "floral", "romantic"].includes(theme) ||
    !["simple", "animated"].includes(gallery_type) ||
    !validImages ||
    !validPlaylist
  ) {
    return { valid: false, error: "Validation error: Check details, images, and playlist." };
  }

  return {
    valid: true,
    sanitized: {
      recipient_name: recipient_name.trim(),
      relationship,
      message: message_type === "custom" ? message : "",
      message_type,
      theme,
      gallery_type,
      images,
      playlist: playlist.map((song) =>
        Number.isInteger(song.defaultId) &&
        song.defaultId >= 1 &&
        song.defaultId <= 7
          ? { defaultId: song.defaultId }
          : { title: song.title, artist: song.artist, audioURL: song.audioURL },
      ),
    },
  };
}

export default async function (request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);

  // ==========================================
  // READ / SEARCH (GET)
  // ==========================================
  if (request.method === "GET") {
    const id = url.searchParams.get("id");

    // 1. Single Record Retrieval
    if (id) {
      if (!uuid.test(id)) {
        return reply({ error: "Invalid birthday link or identifier." }, 400);
      }

      const { data, error } = await supabase
        .from("birthdays")
        .select(fields)
        .eq("id", id)
        .maybeSingle();

      if (error) return reply({ error: "Could not load the birthday from database." }, 500);
      if (!data) return reply({ error: "Birthday page not found in database." }, 404);
      return reply(data);
    }

    // 2. Search / List Records (CRUD: Read & Search)
    const searchQuery = url.searchParams.get("search")?.trim() || "";
    const relationFilter = url.searchParams.get("relation")?.trim() || "";
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 50);

    let query = supabase
      .from("birthdays")
      .select("id,recipient_name,relationship,message,message_type,theme,gallery_type,created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (searchQuery) {
      query = query.ilike("recipient_name", `%${searchQuery}%`);
    }

    if (relationFilter && relationFilter !== "all") {
      query = query.eq("relationship", relationFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase search error:", error);
      return reply({ error: "Could not search birthday records." }, 500);
    }

    return reply({ count: data?.length || 0, birthdays: data || [] });
  }

  // ==========================================
  // CREATE / INSERT (POST)
  // ==========================================
  if (request.method === "POST") {
    const input = await request.json().catch(() => null);
    const validation = validatePayload(input);
    if (!validation.valid) {
      return reply({ error: validation.error }, 400);
    }

    const { data, error } = await supabase
      .from("birthdays")
      .insert(validation.sanitized)
      .select("id,created_at")
      .single();

    if (error) {
      console.error("Supabase birthday insert failed:", error.code, error.message);
      return reply({ error: "Could not save birthday to database." }, 500);
    }
    return reply({ success: true, id: data.id, created_at: data.created_at }, 201);
  }

  // ==========================================
  // UPDATE (PUT)
  // ==========================================
  if (request.method === "PUT") {
    const input = await request.json().catch(() => null);
    if (!input || !input.id) {
      return reply({ error: "Record ID is required for update." }, 400);
    }

    if (!uuid.test(input.id)) {
      return reply({ error: "Invalid record ID." }, 400);
    }

    const validation = validatePayload(input);
    if (!validation.valid) {
      return reply({ error: validation.error }, 400);
    }

    const { data, error } = await supabase
      .from("birthdays")
      .update(validation.sanitized)
      .eq("id", input.id)
      .select("id,recipient_name,relationship")
      .maybeSingle();

    if (error) {
      console.error("Supabase birthday update failed:", error);
      return reply({ error: "Could not update birthday in database." }, 500);
    }

    if (!data) {
      return reply({ error: "Birthday record not found to update." }, 404);
    }

    return reply({ success: true, id: data.id, message: "Birthday record updated successfully." });
  }

  // ==========================================
  // DELETE (DELETE)
  // ==========================================
  if (request.method === "DELETE") {
    let targetId = url.searchParams.get("id");
    if (!targetId) {
      const body = await request.json().catch(() => null);
      targetId = body?.id;
    }

    if (!targetId || !uuid.test(targetId)) {
      return reply({ error: "A valid record ID is required to delete." }, 400);
    }

    const { error } = await supabase.from("birthdays").delete().eq("id", targetId);

    if (error) {
      console.error("Supabase birthday delete failed:", error);
      return reply({ error: "Could not delete birthday from database." }, 500);
    }

    return reply({ success: true, id: targetId, message: "Birthday record deleted successfully." });
  }

  return new Response(null, {
    status: 405,
    headers: { Allow: "GET, POST, PUT, DELETE, OPTIONS", ...corsHeaders },
  });
}
