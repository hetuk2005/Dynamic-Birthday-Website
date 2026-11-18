import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const fields =
  "id,recipient_name,relationship,message,message_type,theme,gallery_type,images,playlist";
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function reply(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
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

export default async function (request) {
  if (request.method === "GET") {
    const id = new URL(request.url).searchParams.get("id");
    if (!uuid.test(id ?? "")) {
      return reply({ error: "Invalid birthday link." }, 400);
    }

    const { data, error } = await supabase
      .from("birthdays")
      .select(fields)
      .eq("id", id)
      .maybeSingle();

    if (error) return reply({ error: "Could not load the birthday." }, 500);
    if (!data) return reply({ error: "Birthday page not found." }, 404);
    return reply(data);
  }

  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { Allow: "GET, POST" },
    });
  }

  const input = await request.json().catch(() => null);
  if (!input || typeof input !== "object") {
    return reply({ error: "Invalid birthday data." }, 400);
  }

  const {
    recipient_name,
    relationship,
    message,
    message_type,
    theme,
    gallery_type,
    images,
    playlist,
  } = input;

  const validImages =
    Array.isArray(images) &&
    images.length <= (gallery_type === "simple" ? 3 : 15) &&
    images.every(
      (url) =>
        isCloudinaryUrl(url) || (gallery_type === "simple" && url === null),
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
            isCloudinaryUrl(song.audioURL))),
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
    return reply({ error: "Check the birthday details and uploads." }, 400);
  }

  const { data, error } = await supabase
    .from("birthdays")
    .insert({
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
    })
    .select("id")
    .single();

  if (error) {
    console.error(
      "Supabase birthday insert failed:",
      error.code,
      error.message,
    );
    return reply({ error: "Could not save the birthday." }, 500);
  }
  return reply({ id: data.id }, 201);
}
