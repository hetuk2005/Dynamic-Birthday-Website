// const params = new URLSearchParams(window.location.search);

async function startBirthdayPage() {
  const params = new URLSearchParams(window.location.search);
  let savedBirthday = null;
  let currentMusicVolume = 0.8;
  let soundEffectsEnabled = true;
  let globalAudioCtx = null;

  if (params.has("id")) {
    const id = params.get("id");

    try {
      const response = await fetch(
        `/.netlify/functions/birthday?id=${encodeURIComponent(id)}`,
      );

      if (!response.ok) {
        throw new Error(
          response.status === 400 || response.status === 404
            ? "This birthday link is invalid or no longer exists."
            : "Could not load this birthday. Please try again.",
        );
      }

      savedBirthday = await response.json();

      // Give the existing display code the fields it already reads.
      params.set("name", savedBirthday.recipient_name);
      params.set("type", savedBirthday.relationship);
      params.set("message", savedBirthday.message);
      params.set("theme", savedBirthday.theme);
      params.set("gallery", savedBirthday.gallery_type);

      const photos = savedBirthday.images;
      const isSimple = savedBirthday.gallery_type === "simple";

      for (let i = 0; i < 3; i++) {
        params.set(`img${i + 1}`, isSimple ? (photos[i] ?? "") : "");
      }

      params.set("galleryImages", JSON.stringify(isSimple ? [] : photos));
    } catch (error) {
      const message = document.createElement("p");
      message.textContent =
        error instanceof TypeError
          ? "Could not connect. Please try again."
          : error.message;

      const createLink = document.createElement("a");
      createLink.href = window.location.pathname;
      createLink.textContent = "Create a birthday";

      document.body.replaceChildren(message, createLink);
      return;
    }
  }

  function decodeImageUrl(url) {
    if (!url) return "";
    try {
      return decodeURIComponent(url);
    } catch {
      return url;
    }
  }

  // Bulb Animation

  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("show");
    } else {
      nav.classList.remove("show");
    }
  });

  const bulbs = document.querySelectorAll("#bulbs ellipse");

  bulbs.forEach((bulb, i) => {
    const duration = 1 + Math.random() * 1.5;
    const delay = Math.random() * 2;

    bulb.style.animation = `twinkle ${duration}s ${delay}s infinite alternate`;
  });

  // Petal Animation

  const theme = params.get("theme") || "classic";

  const hero = document.querySelector(".hero");

  const colors = ["#e8b4b8", "#b8aed2", "#a8c5ac", "#f5d6d9", "#c9e8c0"];

  if (
    theme !== "royal" &&
    theme !== "galaxy" &&
    theme !== "romantic" &&
    theme !== "floral"
  ) {
    for (let i = 0; i < 25; i++) {
      const petal = document.createElement("div");
      petal.classList.add("petal");

      petal.style.left = Math.random() * 100 + "%";
      petal.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      petal.style.width = 9 + Math.random() * 11 + "px";
      petal.style.height = 13 + Math.random() * 15 + "px";

      petal.style.animationDuration = 7 + Math.random() * 8 + "s";
      petal.style.animationDelay = -Math.random() * 11 + "s";

      petal.style.transform = `rotate(${Math.random() * 360}deg)`;

      if (hero) {
        hero.append(petal);
      }
    }
  }

  // Royal Gold Theme

  if (theme === "royal") {
    const sparkleContainer = document.querySelector(".royal_sparkles");

    if (sparkleContainer) {
      for (let i = 0; i < 41; i++) {
        const sparkle = document.createElement("div");
        const sparkleIcon = ["✨", "⭐", "✦", "✧"];
        sparkle.innerHTML =
          sparkleIcon[Math.floor(Math.random() * sparkleIcon.length)];
        sparkle.classList.add("sparkle");
        sparkle.style.left = Math.random() * 100 + "%";
        sparkle.style.top = Math.random() * 100 + "%";
        sparkle.style.animationDuration = 3 + Math.random() * 4 + "s";
        sparkle.style.animationDelay = Math.random() * 5 + "s";
        sparkleContainer.appendChild(sparkle);
      }
    }
  }

  // MidNight Galaxy Theme

  if (theme === "galaxy") {
    const stars = document.querySelector(".galaxy_stars");

    if (stars) {
      for (let i = 0; i < 81; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        star.innerHTML = Math.random() > 0.5 ? "✦" : "✧";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        stars.appendChild(star);
      }
    }
  }

  let currentTrackIndex = -1;

  function setUpTrack(track) {
    const audio = track.querySelector("audio");
    const icon = track.querySelector(".music_icon");

    if (audio) {
      audio.volume = currentMusicVolume;
    }

    audio.addEventListener("ended", () => {
      track.classList.remove("active");
      icon.textContent = "▶";
    });

    track.addEventListener("click", () => {
      const allTrack = document.querySelectorAll(".music");

      if (track.classList.contains("active")) {
        if (!audio.paused) {
          audio.pause();
          icon.textContent = "▶";
        } else {
          audio.play();
          icon.textContent = "⏸";
        }
      } else {
        allTrack.forEach((t) => {
          t.classList.remove("active");

          const a = t.querySelector("audio");
          const i = t.querySelector(".music_icon");

          a.pause();
          i.textContent = "▶";
        });

        track.classList.add("active");

        const allTracks = [...document.querySelectorAll(".music")];
        currentTrackIndex = allTracks.indexOf(track);

        audio.currentTime = 0;
        audio.play();

        icon.textContent = "⏸";
      }
    });
  }

  function playTrack(index) {
    const tracks = [...document.querySelectorAll(".music")];

    if (!tracks.length) return;

    if (index < 0) {
      index = tracks.length - 1;
    }

    if (index >= tracks.length) {
      index = 0;
    }

    currentTrackIndex = index;

    tracks[index].click();
  }

  function nextTrack() {
    playTrack(currentTrackIndex + 1);
  }

  function previousTrack() {
    playTrack(currentTrackIndex - 1);
  }

  function toggleCurrentTrack() {
    const tracks = [...document.querySelectorAll(".music")];

    if (currentTrackIndex === -1) {
      playTrack(0);
      return;
    }

    tracks[currentTrackIndex].click();
  }

  // Rose Quartz Romantic Theme

  if (theme === "romantic") {
    const container = document.querySelector(".romantic_petals");

    if (container) {
      for (let i = 0; i < 41; i++) {
        const petal = document.createElement("div");
        const roseIcon = ["🌹", "✦", "♥"];
        petal.innerHTML = roseIcon[Math.floor(Math.random() * roseIcon.length)];
        petal.classList.add("petal");
        petal.style.left = Math.random() * 100 + "%";
        petal.style.top = Math.random() * 100 + "%";
        petal.style.animationDuration = 3 + Math.random() * 4 + "s";
        petal.style.animationDelay = Math.random() * 5 + "s";
        container.appendChild(petal);
      }
    }
  }

  // Floral Garden Theme

  if (theme === "floral") {
    const container = document.querySelector(".floral_petals");

    if (container) {
      for (let i = 0; i < 41; i++) {
        const leaf = document.createElement("div");
        leaf.classList.add("floral_leaf");
        const icons = ["🌸", "🌿", "🍃"];
        leaf.innerHTML = icons[Math.floor(Math.random() * icons.length)];
        leaf.style.left = Math.random() * 100 + "%";
        leaf.style.animationDuration = 8 + Math.random() * 7 + "s";
        leaf.style.animationDelay = Math.random() * 8 + "s";
        container.appendChild(leaf);
      }
    }
  }

  const defaultSongs = [
    {
      id: 1,
      title: "Baar Baar Ye Din Aaye",
      artist: "Mohammed Rafi",
      audioURL: "../Utili/Songs/Baar Baar Ye Din Aaye.mp3",
      default: true,
    },
    {
      id: 2,
      title: "Happy Birthday Song",
      artist: "Nakas Aziz",
      audioURL: "../Utili/Songs/Happy Birthday Song.mp3",
      default: true,
    },
    {
      id: 3,
      title: "Cutiepie",
      artist: "Nakas Aziz",
      audioURL: "../Utili/Songs/Cutiepie.mp3",
      default: true,
    },
    {
      id: 4,
      title: "Ude Dil Befikre",
      artist: "Jaideep",
      audioURL: "../Utili/Songs/Ude Dil Befikre.mp3",
      default: true,
    },
    {
      id: 5,
      title: "Kar Gayi Chull",
      artist: "Badshaa",
      audioURL: "../Utili/Songs/Kar Gayi Chull.mp3",
      default: true,
    },
    {
      id: 6,
      title: "love you zindagi",
      artist: "jasleena royal",
      audioURL: "../Utili/Songs/Love You Zindagi.mp3",
      default: true,
    },
    {
      id: 7,
      title: "ilahi",
      artist: "arjit sing",
      audioURL: "../Utili/Songs/Ilahi.mp3",
      default: true,
    },
    {
      id: 8,
      title: "Aaj Ki Party",
      artist: "Mika Singh",
      audioURL: "../Utili/Songs/Aaj Ki Party.mp3",
      default: true,
    },
    {
      id: 9,
      title: "Gallan Goodiyaan",
      artist: "Yashita Sharma",
      audioURL: "../Utili/Songs/Gallan Goodiyaan.mp3",
      default: true,
    },
  ];

  // Music Active

  const tracks = document.querySelectorAll(".music");

  let currentAudio = null;

  tracks.forEach((track) => {
    setUpTrack(track);
  });

  // Active Navbar Highlight

  const sections = document.querySelectorAll("div[id]");
  const navLinks = document.querySelectorAll(".flex a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // Taking Image And Setting

  // Loading

  const loading = document.getElementById("loading");

  function showLoading() {
    if (loading) loading.style.display = "flex";
  }

  // Image Injection

  const uploadBoxes = document.querySelectorAll(".upload_box");

  let images = ["", "", ""];

  let customSongs = [];

  let allSongs = (() => {
    if (savedBirthday) {
      return savedBirthday.playlist.flatMap((song, index) => {
        if (Number.isInteger(song.defaultId)) {
          const defaultSong = defaultSongs.find(
            (track) => track.id === song.defaultId,
          );
          return defaultSong ? [{ ...defaultSong }] : [];
        }

        return [
          {
            id: -(index + 1),
            title: song.title,
            artist: song.artist,
            audioURL: song.audioURL,
          },
        ];
      });
    }
    try {
      const sharedSongs = params.get("songs");
      if (sharedSongs) {
        const parsed = JSON.parse(sharedSongs);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn("Could not read playlist from shared link.", error);
    }
    return [...defaultSongs];
  })();

  // Temporary Playlist (Apply Changes Feature)

  let tempSongs = [...allSongs];

  let playlistChanged = false;

  const applyMusicChangesBtn = document.getElementById("applyMusicChanges");

  function markPlaylistChanged() {
    playlistChanged = true;

    applyMusicChangesBtn.style.display = "inline-flex";
  }

  function resetPlaylistChanged() {
    playlistChanged = false;

    applyMusicChangesBtn.style.display = "none";
  }

  uploadBoxes.forEach((box, index) => {
    // Drag Over

    box.addEventListener("dragover", (e) => {
      e.preventDefault();
      box.style.background = "#e8f2e4";
    });

    box.addEventListener("dragleave", () => {
      box.style.background = "transparent";
    });

    // Drop

    box.addEventListener("drop", (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleFile(file, index, box);
    });

    // Click Upload

    box.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";

      input.onchange = () => {
        const file = input.files[0];
        handleFile(file, index, box);
      };

      input.click();
    });
  });

  const messageRadios = document.querySelectorAll('input[name="messageType"]');

  const customMessage = document.getElementById("customMessage");

  const galleryRadios = document.querySelectorAll('input[name="galleryType"]');

  const animatedContainer = document.getElementById("animatedUploadContainer");

  const uploadBoxesContainer = document.querySelectorAll(".upload_row");

  galleryRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked && radio.value === "animated") {
        animatedContainer.style.display = "flex";

        uploadBoxesContainer.forEach((box) => {
          box.style.display = "none";
        });
      } else if (radio.checked && radio.value === "simple") {
        animatedContainer.style.display = "none";

        uploadBoxesContainer.forEach((box) => {
          box.style.display = "flex";
        });
      }
    });
  });

  messageRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom" && radio.checked) {
        customMessage.style.display = "block";
      } else {
        customMessage.style.display = "none";
      }
    });
  });

  async function uploadSong(file) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "playlist_audio");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/demvl3niy/video/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    // console.log("✈️  data: ", data);

    return data.secure_url;
  }

  async function handleFile(file, index, box, isReplace = false) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please Upload An Image File!");
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      if (typeof showToast === "function") {
        showToast("Image Size Must Be Under 5MB!", "warning");
      } else {
        alert("Image Size Must Be Under 5MB!");
      }
      return;
    }

    // Local JavaScript FileReader Instant Preview (Local File Handling)
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof renderLocalFilePreview === "function") {
          renderLocalFilePreview(file, e.target.result, `Slot #${index + 1}`);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.warn("FileReader error:", e);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "birthday_upload");

    box.innerHTML = "Uploading... ⏳";

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/demvl3niy/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      images[index] = encodeURIComponent(data.secure_url);

      box.innerHTML = isReplace ? "Image Replaced ✅" : "Image Uploaded ✅";

      document.querySelector(
        `.imagePreviewBtn[data-index="${index}"]`,
      ).disabled = false;

      document.querySelector(
        `.replaceImageBtn[data-index="${index}"]`,
      ).disabled = false;

      document.querySelector(
        `.deleteImageBtn[data-index="${index}"]`,
      ).disabled = false;
    } catch (err) {
      // console.log("✈️  err: ", err);
      box.innerHTML = "Upload Failed ❌";
    }
  }

  function deleteImage(index) {
    if (!confirm("Delete This Image?")) return;

    // Remove from images array
    images[index] = "";

    // Restore upload box
    const uploadBox = document.querySelector(
      `.upload_box[data-index="${index}"]`,
    );

    uploadBox.innerHTML = `Image ${index + 1}`;

    // Enable clicking again
    uploadBox.style.pointerEvents = "auto";

    // Disable buttons
    document.querySelector(`.imagePreviewBtn[data-index="${index}"]`).disabled =
      true;

    document.querySelector(`.replaceImageBtn[data-index="${index}"]`).disabled =
      true;

    document.querySelector(`.deleteImageBtn[data-index="${index}"]`).disabled =
      true;
  }

  function markGalleryChanged() {
    galleryChanged = true;
    confirmGalleryChangesBtn.style.display = "inline-flex";
  }

  function resetGalleryChanged() {
    galleryChanged = false;
    confirmGalleryChangesBtn.style.display = "none";
  }

  // Set Images

  function setImage(selector, img) {
    if (img) {
      const el = document.querySelector(selector);
      if (!el) return;

      el.style.backgroundImage = `url(${img})`;
      el.style.backgroundSize = "cover";
      el.innerHTML = "";
    }
  }
  // Animated Gallery

  let animatedImages = [];

  let tempAnimatedImages = [];

  let uploadedCount = 0;

  let galleryChanged = false;

  const confirmGalleryChangesBtn = document.getElementById(
    "confirmGalleryChanges",
  );

  const previewGalleryBtn = document.getElementById("previewAnimatedGallery");

  const imageCount = document.getElementById("imageCount");

  function updateAnimatedGalleryCounter() {
    uploadedCount = animatedImages.length;

    const remaining = Math.max(0, 10 - uploadedCount);

    imageCount.innerHTML = `
        📸 Uploaded : ${uploadedCount}/15
        <br><br>
        ${
          uploadedCount < 10
            ? `⚠️ ${remaining} More Required`
            : uploadedCount < 15
              ? "✅ Minimum Requirement Complete"
              : "🎉 Maximum Reached"
        }
    `;

    previewGalleryBtn.disabled = uploadedCount === 0;

    previewGalleryBtn.innerHTML = `👁 Preview Gallery (${uploadedCount})`;
  }

  confirmGalleryChangesBtn.addEventListener("click", () => {
    animatedImages = [...tempAnimatedImages];

    const remaining = Math.max(0, 10 - uploadedCount);

    updateAnimatedGalleryCounter();

    previewGalleryBtn.disabled = uploadedCount === 0;

    previewGalleryBtn.innerHTML = `👁 Preview Gallery (${uploadedCount})`;

    galleryOverlay.style.display = "none";

    resetGalleryChanged();
  });

  const animatedInput = document.getElementById("animatedImages");

  const animatedUploadBox = document.getElementById("animatedUploadBox");

  animatedImages = [];
  uploadedCount = 0;

  animatedUploadBox.addEventListener("click", () => {
    animatedInput.click();
  });

  animatedInput.addEventListener("change", async () => {
    const files = [...animatedInput.files];

    if (uploadedCount + files.length > 15) {
      alert(
        `Maximum 15 Images Allowed.
You Can Upload ${15 - uploadedCount} More Images`,
      );

      animatedInput.value = "";
      return;
    }

    imageCount.innerHTML = "⏳ Uploading...";

    // Local JavaScript FileReader Instant Preview for animated gallery batch
    if (files.length > 0) {
      try {
        const batchReader = new FileReader();
        batchReader.onload = (e) => {
          if (typeof renderLocalFilePreview === "function") {
            renderLocalFilePreview(
              files[0],
              e.target.result,
              `Animated Batch (${files.length} images)`,
            );
          }
        };
        batchReader.readAsDataURL(files[0]);
      } catch (e) {}
    }

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          continue;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("upload_preset", "birthday_upload");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/demvl3niy/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        animatedImages.push(data.secure_url);

        uploadedCount++;

        document.getElementById("previewAnimatedGallery").disabled =
          uploadedCount === 0;
      }

      const remaining = Math.max(0, 10 - uploadedCount);

      updateAnimatedGalleryCounter();

      const previewBtn = document.getElementById("previewAnimatedGallery");

      previewBtn.disabled = uploadedCount === 0;

      previewBtn.innerHTML = `👁 Preview Gallery (${uploadedCount})`;

      animatedInput.value = "";
    } catch (err) {
      console.error(err);

      imageCount.innerHTML = "❌ Upload Failed";
    }
  });

  const typeInput = document.getElementById("typeInput");

  const romanticThemeOption = document.getElementById("romanticThemeOption");

  typeInput.addEventListener("change", () => {
    const value = typeInput.value.toLowerCase();

    const romanticTypes = ["gf", "bf", "wife", "husband"];

    if (romanticTypes.includes(value)) {
      romanticThemeOption.style.display = "block";
    } else {
      romanticThemeOption.style.display = "none";

      const romanticRadio = romanticThemeOption.querySelector("input");

      romanticRadio.checked = false;

      document.querySelector('input[value="classic"]').checked = true;
    }
  });

  async function generate() {
    const galleryType = document.querySelector(
      'input[name="galleryType"]:checked',
    ).value;

    const selectedTheme = document.querySelector(
      'input[name="themeType"]:checked',
    ).value;

    const selectedType = document.querySelector(
      'input[name="messageType"]:checked',
    ).value;

    const btn = document.querySelector('button[onclick="generate()"]');
    const name = document.getElementById("nameInput").value.trim();
    const type = document.getElementById("typeInput").value;
    const bdayDateInput = document.getElementById("birthdayDateInput");
    const bdayDate = bdayDateInput ? bdayDateInput.value.trim() : "";

    if (!name || !type) {
      alert("Please Fill All Details!");
      return;
    }

    // Past Date Validation: If date is in the past, countdown cannot be started!
    if (bdayDate) {
      const parts = bdayDate.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);

        const chosenDate = new Date(y, m, d, 0, 0, 0);
        const now = new Date();
        const todayMidnight = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
        );

        if (chosenDate < todayMidnight) {
          alert(
            `⚠️ Celebration Date Already Passed!\n\nThe date you selected (${bdayDate}) has already passed, so the countdown cannot be started.\n\nPlease select today's date for an instant celebration, or an upcoming future date!`,
          );
          bdayDateInput.style.border = "2px solid #e74c3c";
          bdayDateInput.focus();
          return;
        } else {
          bdayDateInput.style.border = "";
        }
      }
    }

    if (galleryType === "simple" && (!images[0] || !images[1] || !images[2])) {
      alert("Please Upload All 3 Images!");
      return;
    }

    if (galleryType === "animated" && animatedImages.length < 10) {
      alert(`Please Upload ${10 - animatedImages.length} More Images!`);
      return;
    }

    const message =
      selectedType === "custom"
        ? document.getElementById("customMessage").value.trim()
        : "";

    if (selectedType === "custom" && !message) {
      alert("Please Write Your Message!");
      return;
    }

    const originalButtonText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Generating...";
    showLoading();

    try {
      const response = await fetch("/.netlify/functions/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: name,
          relationship: type,
          message,
          message_type: selectedType,
          theme: selectedTheme,
          gallery_type: galleryType,
          images:
            galleryType === "animated"
              ? [...animatedImages]
              : images.map(decodeImageUrl),
          playlist: allSongs.map((song) =>
            song.default
              ? { defaultId: song.id }
              : {
                  title: song.title,
                  artist: song.artist || "",
                  audioURL: song.audioURL,
                },
          ),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.id) {
        throw new Error(result?.error || "Could not save the birthday.");
      }

      const shareUrl = new URL(
        window.location.pathname,
        window.location.origin,
      );
      shareUrl.searchParams.set("id", result.id);
      if (bdayDate) {
        shareUrl.searchParams.set("date", bdayDate);
      }
      window.location.assign(shareUrl.href);
    } catch (error) {
      if (loading) loading.style.display = "none";
      btn.disabled = false;
      btn.textContent = originalButtonText;
      alert(error.message);
    }
  }

  window.generate = generate;

  const overlay = document.getElementById("form_overlay");

  if (theme) {
    document.body.classList.remove("royal", "galaxy", "romantic", "floral");
    document.body.classList.add(theme);
  }

  /* ---------- Restore Dark Mode ---------- */

  const themeToggleBtn = document.getElementById("themeToggleBtn");

  const upgradeLegacyLinkBtn = document.getElementById("upgradeLegacyLinkBtn");
  if (params.has("name") && !params.has("id") && upgradeLegacyLinkBtn) {
    upgradeLegacyLinkBtn.style.display = "block";
  }

  if (!params.has("name")) {
    themeToggleBtn.style.display = "none";

    const actionMenu = document.querySelector(".action_menu");
    if (actionMenu) {
      actionMenu.style.display = "none";
    }
    $(".action_items").hide();
    $("#mainActionBtn").show();
    $("#scrollTopBtn").hide();
  }

  const savedDarkMode = "false";

  if (savedDarkMode === "true") {
    document.body.classList.add("dark");
    themeToggleBtn.innerHTML = '<span class="theme-icon">☀️</span>';
  } else {
    themeToggleBtn.innerHTML = '<span class="theme-icon">🌙</span>';
  }

  const galleryType = params.get("gallery") || "simple";

  const animatedGallery = (() => {
    try {
      const sharedGallery = params.get("galleryImages");
      if (sharedGallery) {
        const parsed = JSON.parse(sharedGallery);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn("Could not read animated gallery from shared link.", error);
    }
    return [];
  })();

  const photo = document.querySelector(".photo");

  const divider = document.querySelector(".divider");

  const gallery = document.querySelector(".animated_gallery");

  if (galleryType === "animated" && animatedGallery.length > 0) {
    if (photo) photo.style.display = "none";

    if (divider) divider.style.display = "none";

    if (gallery) gallery.style.display = "block";

    const track = document.querySelector(".animated_gallery_track");

    if (track) {
      track.innerHTML = "";

      animatedGallery.forEach((imgUrl, index) => {
        const img = document.createElement("img");

        img.src = imgUrl;

        img.className = index % 2 === 0 ? "large_img" : "small_img";

        track.appendChild(img);
      });

      animatedGallery.forEach((imgUrl, index) => {
        const img = document.createElement("img");

        img.src = imgUrl;

        img.className = index % 2 === 0 ? "large_img" : "small_img";

        track.appendChild(img);
      });
    }
  } else {
    if (photo) photo.style.display = "grid";
    if (divider) divider.style.display = "flex";
    if (gallery) gallery.style.display = "none";
  }

  const name = params.get("name");
  const type = params.get("type");
  const languages = [
    "hi", //Hindi
    "mr", //Marathi
    "gu", //Gujarati
    "bn", // Bengali
    "ta", // Tamil
    "te", // Telegu
    "kn", //Kannad
    "ml", //Malayalam
    "pa", //Punjabi
    "ur", // Urdu
    "ru", //Russian
    "ja", //Japanese
    "ko", //Korean
    "ar", //Arabic
    "zh-CN", //Chinese(Simplified)
  ];

  async function translateText(text, target) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(url);

    const data = await res.json();

    const translated = data[0][0][0];
    const romanized = data[0] && data[0][0] && data[0][0][2];
    return romanized || translated;
  }

  async function getTranslations(name) {
    const words = [name];

    for (const lang of languages) {
      try {
        const translated = await translateText(name, lang);
        if (translated && !words.includes(translated)) {
          words.push(translated);
        }
      } catch (err) {
        console.error("Translation Error", err);
      }
    }

    return words;
  }

  const customMessageParam = params.get("message");
  const img1 = params.get("img1");
  const img2 = params.get("img2");
  const img3 = params.get("img3");

  setImage(".photo_child1", img1);
  setImage(".photo_child2", img2);
  setImage(".photo_child3", img3);

  if (!name) {
    const closeBtn = document.querySelector(".popup_close");
    if (closeBtn) {
      closeBtn.style.display = "none";
    }
    if (overlay) overlay.style.display = "flex";
    setTimeout(() => {
      document.getElementById("nameInput").focus();
    }, 100);
    document.body.style.overflow = "hidden";
    const actionMenu = document.querySelector(".action_menu");
    if (actionMenu) {
      actionMenu.style.display = "none";
    }
  } else {
    const actionMenu = document.querySelector(".action_menu");
    if (actionMenu) {
      actionMenu.style.display = "block";
    }

    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "auto";
  }

  if (name) {
    document.querySelectorAll(".name").forEach((el) => {
      el.textContent = name;
    });

    document.querySelectorAll(".nav_name").forEach((el) => {
      el.textContent = `${name}\u00a0 ✦`;
    });

    document.querySelectorAll(".memory_name").forEach((el) => {
      el.textContent = name;
    });

    document.querySelectorAll(".footer_name").forEach((el) => {
      el.textContent = `${name}\u00a0 ✦`;
    });

    const head = document.querySelector(".head");
    if (head) head.textContent = `Dear ${name},`;

    const typedTarget = document.querySelector(".name");
  }

  async function startNameAnimation() {
    if (!name) return;

    const words = await getTranslations(name);

    const target = document.querySelector(".name");

    if (!target) return;

    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    function type() {
      const currentWord = words[wordIndex];

      if (!deleting) {
        target.textContent = currentWord.substring(0, charIndex + 1);

        charIndex++;

        if (charIndex === currentWord.length) {
          deleting = true;

          setTimeout(type, 1500);

          return;
        }
      } else {
        charIndex--;

        target.textContent = currentWord.substring(0, charIndex);

        if (charIndex <= 0) {
          deleting = false;

          wordIndex = (wordIndex + 1) % words.length;

          charIndex = 0;
        }
      }

      setTimeout(type, deleting ? 50 : 120);
    }

    setTimeout(type, 1500);
  }

  startNameAnimation();

  const letters = {
    sir: `
                    <p>
                        On this special day, I just want to express my heartfelt
                        gratitude for everything you've taught us — not just
                        academically, but in life. Your guidance, patience, and
                        dedication have truly made a lasting impact on all of
                        us.
                        <br>
                    </p>

                    <p>
                        You have a unique way of inspiring students and bringing
                        out
                        the best in everyone around you. Your words, lessons,
                        and
                        encouragement will always stay with us.
                        <br>
                    </p>

                    <p>
                        Wishing you a very Happy Birthday! May your life be
                        filled
                        with good health, happiness, and continued success.
                        Thank
                        you for being such an incredible mentor.
                        <br>
                        <br>
                    </p>

                    <span>
                        - With respect and best wishes <span
                            class="pink">✿</span>
                    </span>
                    `,
    friend: `
  <p>
  On this special day, I just want to remind you how much you mean to me. Your friendship has been one of the best parts of my life — full of laughter, support, and unforgettable memories.
  <br>
</p>

<p>
  You have this amazing way of making even the simplest moments feel special. Your presence brings comfort, happiness, and a kind of warmth that is truly rare.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your life be filled with endless joy, success, and all the happiness you bring to others.
  <br><br>
</p>

<span>
  - With love and best wishes <span class="pink">✿</span>
</span>
  `,
    bestfriend: `
                    <p>
                    On this magical day, I just want you to know how much light you bring into the world — and into my life. Your laughter is the kind that makes ordinary moments feel like little celebrations, and your kindness is one of the rarest things I've ever known.
                        <br>
                    </p>

                    <p>
                    You have this quiet superpower of making everyone around you feel seen and loved. The world is a warmer, softer, more beautiful place simply because you're in it.
                        <br>
                    </p>

                    <p>
                    So today, on your birthday — eat the cake, dance like no one's watching, and please know that you deserve every single wonderful thing that's heading your way. This year is going to be your year.
                        <br>
                        <br>
                    </p>

                    <span>
                        - With all my love and good wishes <span
                            class="pink">✿</span>
                    </span>
  `,
    gf: `
  <p>
  On this beautiful day, I just want to tell you how incredibly special you are to me. You bring so much love, warmth, and happiness into my life that words can hardly express.
  <br>
</p>

<p>
  Your smile lights up my world, and your presence makes everything feel more meaningful. Every moment with you feels like something I’ll always cherish.
  <br>
</p>

<p>
  Wishing you the happiest birthday, my love. May your life be filled with dreams come true, endless smiles, and all the love you deserve.
  <br><br>
</p>

<span>
  - Forever yours <span class="pink">✿</span>
</span>
  `,
    bf: `
  <p>
  On this special day, I just want to remind you how important you are to me. You are not just someone I love, but someone who makes my world feel complete.
  <br>
</p>

<p>
  Your strength, kindness, and the way you care make every day better. Being with you is something I truly treasure.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your life be filled with success, happiness, and all the things you dream of.
  <br><br>
</p>

<span>
  - With all my love <span class="pink">✿</span>
</span>
  `,
    boss: `
  <p>
  On this special day, I would like to express my sincere appreciation for your leadership and guidance. Your dedication and vision inspire everyone around you.
  <br>
</p>

<p>
  You have a remarkable ability to motivate and lead with clarity and confidence. Working under your guidance is truly a valuable experience.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your journey ahead be filled with continued success, good health, and great achievements.
  <br><br>
</p>

<span>
  - With respect and best wishes <span class="pink">✿</span>
</span>
  `,
    wife: `
  <p>
  On this special day, I just want to remind you how much you mean to me. You are not just my partner, but my happiness, my comfort, and my everything.
  <br>
</p>

<p>
  Your love makes life beautiful, and every moment with you feels like a blessing I never take for granted.
  <br>
</p>

<p>
  Wishing you the happiest birthday, my love. May your life be filled with endless joy, love, and all your dreams coming true.
  <br><br>
</p>

<span>
  - Always yours <span class="pink">✿</span>
</span>
  `,
    husband: `
  <p>
  On this special day, I want to tell you how grateful I am to have you in my life. You are my strength, my support, and my greatest happiness.
  <br>
</p>

<p>
  Your love and care make everything feel complete, and every moment with you is something I deeply cherish.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your life be filled with success, happiness, and all the love you deserve.
  <br><br>
</p>

<span>
  - With all my love <span class="pink">✿</span>
</span>
  `,
    mom: `
  <p>
  On this special day, I just want to thank you for everything you have done for me. Your love, care, and sacrifices are the foundation of who I am today.
  <br>
</p>

<p>
  You have always been my biggest support and my safest place. Your kindness and strength inspire me every single day.
  <br>
</p>

<p>
  Wishing you the happiest birthday, Mom. May your life be filled with peace, joy, and all the love you give to everyone.
  <br><br>
</p>

<span>
  - With all my love <span class="pink">✿</span>
</span>
  `,
    dad: `
  <p>
  On this special day, I want to thank you for being my guide and strength. Your support, wisdom, and encouragement have shaped my life in the best way.
  <br>
</p>

<p>
  You have always been someone I look up to, and your values continue to inspire me every day.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your life be filled with happiness, good health, and all the respect you truly deserve.
  <br><br>
</p>

<span>
  - With love and respect <span class="pink">✿</span>
</span>
  `,
    brother: `
  <p>
  On this special day, I just want to remind you how much you mean to me. Having you as my brother is one of the greatest blessings in my life.
  <br>
</p>

<p>
  You have always been my support, my strength, and sometimes even my best friend. The memories we share are truly priceless, and I’m grateful for every moment.
  <br>
</p>

<p>
  Wishing you a very Happy Birthday! May your life be filled with success, happiness, and everything you’ve ever wished for.
  <br><br>
</p>

<span>
  - With love and care <span class="pink">✿</span>
</span>
  `,
    sister: `
  <p>
  On this special day, I just want to tell you how special you are to me. You are not just my sister, but also my friend, my support, and my happiness.
  <br>
</p>

<p>
  Your presence brings so much warmth and joy into my life. The bond we share is something I will always cherish.
  <br>
</p>

<p>
  Wishing you the happiest birthday! May your life be filled with love, laughter, and all the beautiful things you deserve.
  <br><br>
</p>

<span>
  - With all my love <span class="pink">✿</span>
</span>
  `,
  };

  const letterBox = document.querySelector(".letter_content");

  // if (type && letters[type] && letterBox) {
  //   document.querySelector(".letter_content").innerHTML = letters[type];
  // }

  if (customMessageParam && letterBox) {
    const decodedMessage = savedBirthday
      ? customMessageParam
      : decodeImageUrl(customMessageParam);

    letterBox.innerHTML = `
    <p class="custom_letter_message"></p>

    <br>

    <span>
      - With respect and best wishes
      <span class="pink">✿</span>
    </span>
  `;

    letterBox.querySelector(".custom_letter_message").textContent =
      decodedMessage;
  } else if (type && letters[type] && letterBox) {
    letterBox.innerHTML = letters[type];
  }

  // Share & Copy Link Button

  function copyLink() {
    const link = window.location.href;

    navigator.clipboard.writeText(link);

    alert("Link copied! 🔗");
  }

  // Whatsapp Copy Link

  function shareWhatsApp() {
    const link = window.location.href;

    const message = `🎉  I made something special for you!\n${link}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  }

  async function upgradeLegacyLink() {
    if (params.has("id")) return;

    const recipientName = params.get("name") || "";
    const relationship = params.get("type") || "";
    const message = params.get("message") || "";
    const legacyTheme = [
      "classic",
      "royal",
      "galaxy",
      "floral",
      "romantic",
    ].includes(theme)
      ? theme
      : "classic";
    const legacyGalleryType = ["simple", "animated"].includes(galleryType)
      ? galleryType
      : "simple";

    if (!recipientName.trim() || !relationship) {
      alert(
        "This old link is missing the name or relationship, so it cannot be converted.",
      );
      return;
    }

    const confirmed = confirm(
      "This will create a new database-backed link using details in this old URL and, if available, the old playlist saved in this browser. Missing photos or theme cannot be recovered and will use defaults. Continue?",
    );
    if (!confirmed) return;

    const button = upgradeLegacyLinkBtn;
    const originalText = button?.textContent || "Make a new short link ↗";
    if (button) {
      button.disabled = true;
      button.textContent = "Creating new link…";
    }

    const legacyImages =
      legacyGalleryType === "animated"
        ? [...animatedGallery]
        : [1, 2, 3].map((index) => params.get(`img${index}`) || null);

    // Older versions kept the playlist in localStorage instead of the URL.
    // Read it only as a one-time migration source when the user explicitly
    // converts a legacy link; normal page views never restore browser data.
    let playlistSource = allSongs;
    if (!params.has("songs")) {
      try {
        const oldPlaylist = JSON.parse(
          localStorage.getItem("allSongs") || "null",
        );
        if (Array.isArray(oldPlaylist) && oldPlaylist.length) {
          playlistSource = oldPlaylist;
        } else {
          const oldCustomSongs = JSON.parse(
            localStorage.getItem("customSongs") || "null",
          );
          if (Array.isArray(oldCustomSongs) && oldCustomSongs.length) {
            playlistSource = [...defaultSongs, ...oldCustomSongs];
          }
        }
      } catch (error) {
        console.warn(
          "Could not read the old saved playlist for migration.",
          error,
        );
      }
    }

    const playlist = playlistSource
      .slice(0, 30)
      .map((song) => {
        const defaultId = Number(
          song.defaultId ?? (song.default ? song.id : Number.NaN),
        );
        if (Number.isInteger(defaultId) && defaultId >= 1 && defaultId <= 50) {
          return { defaultId };
        }

        if (
          typeof song.title === "string" &&
          typeof song.artist === "string" &&
          typeof song.audioURL === "string"
        ) {
          return {
            title: song.title,
            artist: song.artist,
            audioURL: song.audioURL,
          };
        }
        return null;
      })
      .filter(Boolean);

    try {
      const response = await fetch("/.netlify/functions/birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: recipientName,
          relationship,
          message,
          message_type: message ? "custom" : "default",
          theme: legacyTheme,
          gallery_type: legacyGalleryType,
          images: legacyImages,
          playlist,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.id) {
        throw new Error(result?.error || "Could not convert this old link.");
      }

      const newLink = new URL(window.location.pathname, window.location.origin);
      newLink.searchParams.set("id", result.id);
      window.location.assign(newLink.href);
    } catch (error) {
      alert(
        error.message || "Could not convert this old link. Please try again.",
      );
      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }

  function editAgain() {
    const savedTheme = theme;

    if (savedTheme) {
      const themeRadio = document.querySelector(
        `input[name="themeType"][value="${savedTheme}"]`,
      );

      if (themeRadio) {
        themeRadio.checked = true;
      }
    }

    const savedGalleryType = galleryType;

    if (savedGalleryType) {
      const galleryRadio = document.querySelector(
        `input[name="galleryType"][value="${savedGalleryType}"]`,
      );

      if (galleryRadio) {
        galleryRadio.checked = true;
        galleryRadio.dispatchEvent(new Event("change"));
      }
    }

    const savedAnimatedGallery = [...animatedGallery];

    if (savedAnimatedGallery.length) {
      animatedImages = [...savedAnimatedGallery];

      uploadedCount = savedAnimatedGallery.length;

      updateAnimatedGalleryCounter();
    }

    const overlay = document.getElementById("form_overlay");

    overlay.style.display = "flex";

    isEditingPopup = true;

    themeToggleBtn.style.display = "none";

    const actionMenu = document.querySelector(".action_menu");
    if (actionMenu) {
      actionMenu.style.display = "none";
    }
    $(".action_items").hide();
    $("#mainActionBtn").show();
    $("#scrollTopBtn").hide();

    document.body.style.overflow = "hidden";

    document.getElementById("nameInput").value = params.get("name") || "";

    document.getElementById("typeInput").value = params.get("type") || "";

    if (params.get("date")) {
      const bdayInput = document.getElementById("birthdayDateInput");
      if (bdayInput) bdayInput.value = params.get("date");
    }

    typeInput.dispatchEvent(new Event("change"));

    if (params.get("message")) {
      document.querySelector('input[value="custom"]').checked = true;

      customMessage.style.display = "block";

      customMessage.value = savedBirthday
        ? params.get("message")
        : decodeImageUrl(params.get("message"));
    }

    images[0] = encodeURIComponent(params.get("img1") || "");
    images[1] = encodeURIComponent(params.get("img2") || "");
    images[2] = encodeURIComponent(params.get("img3") || "");

    uploadBoxes.forEach((box, i) => {
      if (images[i]) {
        box.innerHTML = "Image Uploaded ✅";
      }
    });

    setTimeout(() => {
      document.getElementById("nameInput").focus();
    }, 100);
  }

  let draggedSong = null;

  let editMode = false;

  function togglePlayList() {
    editMode = !editMode;

    renderSongs();
  }

  const playlistOverlay = document.getElementById("playlist_overlay");

  function openPlay() {
    playlistOverlay.style.display = "flex";

    tempSongs = [...allSongs];

    resetPlaylistChanged();

    renderPlaylistEditor();
  }

  function closePlay() {
    tempSongs = [...allSongs];

    resetPlaylistChanged();

    playlistOverlay.style.display = "none";

    document.getElementById("songTitle").value = "";
    document.getElementById("songArtist").value = "";
    document.getElementById("songFile").value = "";
  }

  applyMusicChangesBtn.addEventListener("click", () => {
    allSongs = [...tempSongs];

    customSongs = allSongs.filter((song) => !song.default);

    renderSongs();
    renderPlaylistEditor();

    resetPlaylistChanged();

    closePlay();
  });

  const addSong = document.getElementById("addSong");

  if (addSong) {
    addSong.addEventListener("click", async () => {
      const title = document.getElementById("songTitle");
      const artist = document.getElementById("songArtist");
      const fileInput = document.getElementById("songFile");

      const titleValue = title.value.trim();
      const artistValue = artist.value.trim();
      const file = fileInput.files[0];

      if (!titleValue || !artistValue || !file) {
        alert("Please Fill All The Details");
        return;
      }

      addSong.disabled = true;
      addSong.innerHTML = "Uploading...";

      try {
        const audioURL = await uploadSong(file);

        const song = {
          id: Date.now(),
          title: titleValue,
          artist: artistValue,
          audioURL,
        };

        tempSongs.push(song);

        markPlaylistChanged();

        renderPlaylistEditor();

        // console.log(customSongs);

        alert("Song Captured Successfully 🎵");

        title.value = "";
        artist.value = "";
        fileInput.value = "";
      } catch (err) {
        console.error(err);
        alert("Upload Failed ❌");
      }

      addSong.disabled = false;
      addSong.innerHTML = "Add Song";
    });
  }

  function createSongElement(song, index) {
    const div = document.createElement("div");

    div.dataset.id = song.id;

    div.className = song.default ? "music default_song" : "music custom_song";

    const tracknum = index + 1;

    div.innerHTML = `
        <div class="music_child1">
            <p class="track_num">${String(tracknum).padStart(2, "0")}</p>
            <span class="music_icon">▶</span>
            <span>🎵</span>
            <div class="music_text">
                <p class="track_name"></p>
                <p class="track_artist"></p>
            </div>
        </div>

        <audio></audio>
    `;

    div.querySelector(".track_name").textContent = song.title;
    div.querySelector(".track_artist").textContent = song.artist;
    div.querySelector("audio").src = song.audioURL;

    setUpTrack(div);
    // playlist.append(div);
    return div;
  }

  function refreshCustom() {
    document.querySelectorAll(".custom_song").forEach((el) => el.remove());

    renderSongs();
  }

  function renderSongs() {
    const playlist = document.querySelector(".playlist_music");

    if (!playlist) return;

    playlist.innerHTML = "";

    allSongs.forEach((song, index) => {
      playlist.append(createSongElement(song, index));
    });
  }

  renderSongs();

  function renderPlaylistEditor() {
    const editor = document.querySelector(".playlist_editor");

    editor.innerHTML = "";

    tempSongs.forEach((song, index) => {
      const row = document.createElement("div");

      row.draggable = true;

      row.dataset.id = song.id;

      row.addEventListener("dragstart", () => {
        draggedSong = song.id;

        row.classList.add("dragging");
      });

      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
      });

      row.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      row.addEventListener("drop", (e) => {
        e.preventDefault();

        if (draggedSong === song.id) return;

        const fromIndex = tempSongs.findIndex((s) => s.id === draggedSong);

        const toIndex = tempSongs.findIndex((s) => s.id === song.id);

        const [movedSong] = tempSongs.splice(fromIndex, 1);

        tempSongs.splice(toIndex, 0, movedSong);

        markPlaylistChanged();
        renderPlaylistEditor();

        renderSongs();
        renderPlaylistEditor();
      });

      row.className = "editor_song";

      row.innerHTML = `
      <span class="drag_handle">☰</span>
      <span class="editor_song_title"></span>
      <button
        class="editor_delete"
        data-id="${song.id}"
      >
        🗑️
      </button>
    `;

      row.querySelector(".editor_song_title").textContent = song.title;

      editor.append(row);
    });
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("editor_delete")) {
      const id = Number(e.target.dataset.id);

      tempSongs = tempSongs.filter((song) => song.id !== id);

      markPlaylistChanged();

      renderPlaylistEditor();
    }
  });

  const dot = document.getElementById("cursor_dot");
  const ring = document.getElementById("cursor_ring");

  let ringX = 0,
    ringY = 0;

  let mouseX = 0,
    mouseY = 0;

  document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";

    ring.style.left = mouseX + "px";
    ring.style.top = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 1.0;
    ringY += (mouseY - ringY) * 1.0;

    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";

    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.addEventListener("mouseover", (e) => {
    if (
      e.target.matches(
        "a, button, input, textarea, select, label,.upload_box,.photo_child1,.photo_child2,.photo_child3",
      )
    ) {
      dot.classList.add("hovered");
      ring.classList.add("hovered");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (
      e.target.closest(
        "a, button, input, textarea, select, label,.upload_box,.photo_child1,.photo_child2,.photo_child3",
      )
    ) {
      dot.classList.remove("hovered");
      ring.classList.remove("hovered");
    }
  });

  document.addEventListener("mouseleave", function () {
    dot.style.opacity = "0";
    ring.style.opacity = "0";
  });

  document.addEventListener("mouseenter", function () {
    dot.style.opacity = "1";
    ring.style.opacity = "0.4";
  });

  function closeEditPopup() {
    isEditingPopup = false;

    const overlay = document.getElementById("form_overlay");

    overlay.style.display = "none";

    if (params.has("name")) {
      themeToggleBtn.style.display = "flex";
      const actionMenu = document.querySelector(".action_menu");
      if (actionMenu) {
        actionMenu.style.display = "block";
      }
    }

    document.body.style.overflow = "auto";
    playlistOverlay.style.display = "none";
    const bdayInput = document.getElementById("birthdayDateInput");
    if (bdayInput) bdayInput.style.border = "";
  }

  function openEditPopup() {
    const actionMenu = document.querySelector(".action_menu");
    if (actionMenu) {
      actionMenu.style.display = "none";
    }
    $(".action_items").hide();
    $("#mainActionBtn").show();
    themeToggleBtn.style.display = "none";
    const overlay = document.getElementById("form_overlay");

    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      document.getElementById("nameInput").focus();
    }, 100);
  }

  $(window).on("scroll", function () {
    let scrollTop = $(window).scrollTop();

    let docHeight = $(document).height() - $(window).height();

    let progress = (scrollTop / docHeight) * 100;

    $("#progress_bar").css("width", progress + "%");
  });

  // JQuery

  $(function () {
    $("#mainActionBtn").click(function () {
      $(this).hide();
      $(".action_items").slideDown(300);
    });

    $("#closeActionBtn").click(function () {
      $(".action_items").slideUp(300, function () {
        $("#mainActionBtn").show();
      });
    });

    $(window).scroll(function () {
      if ($(this).scrollTop() > 300) {
        $("#scrollTopBtn").fadeIn();
      } else {
        $("#scrollTopBtn").fadeOut();
      }
    });

    $("#scrollTopBtn").click(function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        700,
      );
    });
    $(".flex a").on("click", function (e) {
      e.preventDefault();

      const target = $(this).attr("href");

      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - 70,
        },
        900,
      );
    });
  });

  // Dark/ Light Mode Button

  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    document.querySelectorAll(".theme_card_preview").forEach((card) => {
      card.classList.toggle("dark");
    });

    const isDark = document.body.classList.contains("dark");
    themeToggleBtn.innerHTML = `<span class="theme-icon">${isDark ? "☀️" : "🌙"}</span>`;
  });

  // Theme Preview

  // ── Theme Preview ──
  (() => {
    const overlay = document.getElementById("themePreviewOverlay");
    const closeBtn = document.getElementById("themePreviewClose");
    const previewCard = document.getElementById("previewCard");
    const previewTitle = document.getElementById("previewTitle");
    const previewEmoji = document.getElementById("previewEmoji");

    const themeInfo = {
      classic: { label: "🎂 Classic Birthday", emoji: "🎂" },
      floral: { label: "🌸 Floral Garden", emoji: "🌸" },
      royal: { label: "👑 Royal Gold", emoji: "👑" },
      galaxy: { label: "🌌 Midnight Galaxy", emoji: "🌌" },
      romantic: { label: "💖 Rose Quartz", emoji: "💖" },
    };

    document.querySelectorAll(".previewBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // stop radio button from toggling
        const theme = btn.dataset.theme;

        // Update modal content
        previewCard.className = `preview_card ${theme}`;
        previewTitle.textContent = themeInfo[theme].label + " Preview";
        previewEmoji.textContent = themeInfo[theme].emoji;

        // Show modal
        overlay.classList.add("active");
      });
    });

    // Close on X button
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("active");
    });

    // Close on clicking outside modal
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("active");
    });
  })();

  // Image Preview

  let touchStartX = 0;
  let touchEndX = 0;

  const minSwipeDistance = 50;

  const imagePreviewButtons = document.querySelectorAll(".imagePreviewBtn");

  const replaceInput = document.getElementById("replaceImageInput");

  let replaceIndex = -1;

  let animatedReplaceIndex = -1;

  let draggedImageIndex = -1;

  const replaceImageButtons = document.querySelectorAll(".replaceImageBtn");

  replaceImageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      replaceIndex = Number(button.dataset.index);
      replaceInput.click();
    });
  });

  replaceInput.addEventListener("change", async () => {
    if (!replaceInput.files.length) return;

    const file = replaceInput.files[0];

    // Animated Gallery
    if (animatedReplaceIndex !== -1) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", "birthday_upload");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/demvl3niy/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();

        tempAnimatedImages[animatedReplaceIndex] = data.secure_url;

        markGalleryChanged();

        renderGalleryPreview();
      } catch (err) {
        alert("Image Replace Failed!");
      }

      animatedReplaceIndex = -1;
    }

    // Simple Gallery
    else {
      const uploadBox = document.querySelector(
        `.upload_box[data-index="${replaceIndex}"]`,
      );

      handleFile(file, replaceIndex, uploadBox, true);
    }

    replaceInput.value = "";
  });

  const deleteImageButtons = document.querySelectorAll(".deleteImageBtn");

  deleteImageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      deleteImage(index);
    });
  });

  const imagePreviewOverlay = document.querySelector(".image_preview_overlay");

  const previewImage = document.getElementById("previewImage");

  previewImage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });

  previewImage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;

    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      nextImageBtn.click();
    } else {
      prevImageBtn.click();
    }
  });

  const closeImagePreview = document.querySelector(".closeImagePreview");

  const prevImageBtn = document.getElementById("prevImage");

  const nextImageBtn = document.getElementById("nextImage");

  const imageCounter = document.getElementById("imageCounter");

  let currentPreviewIndex = 0;

  let previewIndexes = [];

  function showPreviewImage(index) {
    previewIndexes = [];

    images.forEach((img, i) => {
      if (img) {
        previewIndexes.push(i);
      }
    });

    previewMode = "simple";

    currentPreviewIndex = previewIndexes.indexOf(index);

    previewImage.src = decodeURIComponent(
      images[previewIndexes[currentPreviewIndex]],
    );
    const uploadedImagesCount = images.filter((img) => img !== "").length;

    imageCounter.textContent = `${currentPreviewIndex + 1} / ${previewIndexes.length}`;
    imagePreviewOverlay.style.display = "flex";
  }

  // Open Preview

  imagePreviewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      showPreviewImage(index);
    });
  });

  // Close Button

  closeImagePreview.addEventListener("click", closeImagePreviewModal);

  // Click Outside Close

  imagePreviewOverlay.addEventListener("click", (e) => {
    if (e.target === imagePreviewOverlay) {
      closeImagePreviewModal();
    }
  });

  // Previous Button

  prevImageBtn.addEventListener("click", () => {
    if (previewMode === "simple") {
      currentPreviewIndex--;

      if (currentPreviewIndex < 0) {
        currentPreviewIndex = previewIndexes.length - 1;
      }

      const actualIndex = previewIndexes[currentPreviewIndex];

      previewImage.src = decodeURIComponent(images[actualIndex]);

      imageCounter.textContent = `${currentPreviewIndex + 1} / ${previewIndexes.length}`;
    } else if (previewMode === "animated") {
      currentPreviewIndex--;

      if (currentPreviewIndex < 0) {
        currentPreviewIndex = tempAnimatedImages.length - 1;
      }

      previewImage.src = tempAnimatedImages[currentPreviewIndex];

      imageCounter.textContent = `${currentPreviewIndex + 1} / ${tempAnimatedImages.length}`;
    }
  });

  // Next Button

  nextImageBtn.addEventListener("click", () => {
    if (previewMode === "simple") {
      currentPreviewIndex++;

      if (currentPreviewIndex >= previewIndexes.length) {
        currentPreviewIndex = 0;
      }

      const actualIndex = previewIndexes[currentPreviewIndex];

      previewImage.src = decodeURIComponent(images[actualIndex]);

      imageCounter.textContent = `${currentPreviewIndex + 1} / ${previewIndexes.length}`;
    } else if (previewMode === "animated") {
      currentPreviewIndex++;

      if (currentPreviewIndex >= tempAnimatedImages.length) {
        currentPreviewIndex = 0;
      }

      previewImage.src = tempAnimatedImages[currentPreviewIndex];

      imageCounter.textContent = `${currentPreviewIndex + 1} / ${tempAnimatedImages.length}`;
    }
  });

  // Animated Gallery Preview

  const galleryOverlay = document.querySelector(".gallery_preview_overlay");

  const galleryGrid = document.getElementById("galleryPreviewGrid");

  const closeGalleryBtn = document.querySelector(".closeGalleryPreview");

  // Gallery Opening

  function renderGalleryPreview() {
    galleryGrid.innerHTML = "";

    tempAnimatedImages.forEach((img, index) => {
      const card = document.createElement("div");

      card.className = "galleryCard";

      card.draggable = true;

      card.addEventListener("dragstart", () => {
        draggedImageIndex = index;
        card.classList.add("dragging");
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
      });

      card.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      card.addEventListener("drop", (e) => {
        e.preventDefault();

        if (draggedImageIndex === index) return;
        const movedImage = tempAnimatedImages.splice(draggedImageIndex, 1)[0];
        tempAnimatedImages.splice(index, 0, movedImage);
        markGalleryChanged();
        renderGalleryPreview();
      });

      card.innerHTML = `
            <img
                data-index="${index}"
                class="galleryPreviewImage"
            >

            <div class="galleryActions">

                <button
                    class="animatedReplaceBtn"
                    data-index="${index}"
                >
                    🔄
                </button>

                <button
                    class="animatedDeleteBtn"
                    data-index="${index}"
                >
                    🗑
                </button>

            </div>
        `;

      card.querySelector(".galleryPreviewImage").src = img;

      galleryGrid.appendChild(card);
    });
  }

  previewGalleryBtn.addEventListener("click", () => {
    if (animatedImages.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    tempAnimatedImages = [...animatedImages];

    resetGalleryChanged();

    renderGalleryPreview();

    galleryOverlay.style.display = "flex";
  });

  // Close Gallery

  closeGalleryBtn.addEventListener("click", closeGalleryPreviewModal);

  // Gallery Close Outside

  galleryOverlay.addEventListener("click", (e) => {
    if (e.target === galleryOverlay) {
      closeGalleryPreviewModal();
    }
  });

  // Thumbnail Open

  galleryGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("animatedReplaceBtn")) {
      animatedReplaceIndex = Number(e.target.dataset.index);
      replaceInput.click();
      return;
    }

    if (e.target.classList.contains("animatedDeleteBtn")) {
      const index = Number(e.target.dataset.index);

      tempAnimatedImages.splice(index, 1);

      markGalleryChanged();

      renderGalleryPreview();

      return;
    }

    if (!e.target.classList.contains("galleryPreviewImage")) return;

    currentPreviewIndex = Number(e.target.dataset.index);

    previewMode = "animated";

    previewImage.src = tempAnimatedImages[currentPreviewIndex];

    imageCounter.textContent = `${currentPreviewIndex + 1} / ${animatedImages.length}`;

    galleryOverlay.style.display = "none";
    imagePreviewOverlay.style.display = "flex";
  });

  let previewMode = "simple";

  let isEditingPopup = false;

  document.addEventListener("keydown", handleKeyboardShortcuts);

  function closeImagePreviewModal() {
    imagePreviewOverlay.style.display = "none";
  }

  function closeGalleryPreviewModal() {
    galleryOverlay.style.display = "none";
  }

  function handleKeyboardShortcuts(e) {
    if (e.key === "Escape") {
      if (isEditingPopup && $("#form_overlay").is(":visible")) {
        closeEditPopup();
      }

      if ($("#playlist_overlay").is(":visible")) {
        closePlay();
      }

      if ($(".image_preview_overlay").is(":visible")) {
        closeImagePreviewModal();
      }

      if ($(".gallery_preview_overlay").is(":visible")) {
        closeGalleryPreviewModal();
      }
    }

    // Image Preview Navigation

    if ($(".image_preview_overlay").is(":visible")) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImageBtn.click();
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImageBtn.click();
      }
    }

    // Playlist Shortcuts

    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.code === "Space") {
      e.preventDefault();
      toggleCurrentTrack();
    }

    if (e.key.toLowerCase() === "n") {
      nextTrack();
    }

    if (e.key.toLowerCase() === "p") {
      previousTrack();
    }

    if (e.key.toLowerCase() === "m") {
      if ($("#playlist_overlay").is(":visible")) {
        closePlay();
      } else {
        openPlay();
      }
    }
  }

  // Live Network Capsule

  const networkStatus = document.getElementById("networkStatus");

  let compactTimer = null;

  function scheduleCompact() {
    clearTimeout(compactTimer);
    compactTimer = setTimeout(() => {
      networkStatus.classList.add("compact");
    }, 5000);
  }

  function updateNetworkStatus() {
    // Always expand back to full capsule so the change is visible
    networkStatus.classList.remove("compact", "online", "offline");

    if (navigator.onLine) {
      networkStatus.classList.add("online");
      networkStatus.querySelector(".status-text").textContent = "Online";
      // Shrink to dot after 5s when online
      scheduleCompact();
    } else {
      networkStatus.classList.add("offline");
      networkStatus.querySelector(".status-text").textContent = "Offline";
      // Keep offline capsule fully visible — don't auto-compact so user notices
      clearTimeout(compactTimer);
    }
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);

  updateNetworkStatus();

  // Live Battery Status

  const batteryStatus = document.getElementById("batteryStatus");

  async function initBatteryStatus() {
    if (!("getBattery" in navigator)) {
      batteryStatus.style.display = "none";
      return;
    }

    const battery = await navigator.getBattery();

    function updateBattery() {
      const percent = Math.round(battery.level * 100);

      if (battery.charging) {
        batteryStatus.innerHTML = `<span class="battery-text">⚡ ${percent}%</span>`;
      } else {
        batteryStatus.innerHTML = `<span class="battery-text">🔋 ${percent}%</span>`;
      }

      if (percent <= 20) {
        batteryStatus.style.background = "#e74c3c";
        batteryStatus.style.color = "#fff";
        batteryStatus.style.borderColor = "transparent";
      } else if (battery.charging) {
        batteryStatus.style.background = "#2ecc71";
        batteryStatus.style.color = "#fff";
        batteryStatus.style.borderColor = "transparent";
      } else {
        batteryStatus.style.background = "";
        batteryStatus.style.color = "";
        batteryStatus.style.borderColor = "";
      }
    }

    updateBattery();

    battery.addEventListener("chargingchange", updateBattery);
    battery.addEventListener("levelchange", updateBattery);
  }

  initBatteryStatus();

  // =========================================================================
  // COLLEGE PROFESSOR REQUIREMENTS: TOASTS, CRUD, FILE HANDLING, 3RD API, NAV
  // =========================================================================

  // 1. Toast Notification System (Error & Status Feedback)
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) {
      console.log(`[${type.toUpperCase()}] ${message}`);
      return;
    }

    const toast = document.createElement("div");
    toast.className = `toast_item toast_${type}`;

    const icon =
      type === "success"
        ? "✅"
        : type === "error"
          ? "❌"
          : type === "warning"
            ? "⚠️"
            : "ℹ️";
    toast.innerHTML = `<span>${icon} ${message}</span><button style="background:none;border:none;color:#fff;cursor:pointer;font-weight:bold;margin-left:8px;" onclick="this.parentElement.remove()">✕</button>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // 2. Birthday Countdown & Celebration Logic
  let countdownInterval = null;

  function startCountdown(targetDateStr) {
    if (countdownInterval) clearInterval(countdownInterval);

    const banner = document.getElementById("todayCelebrationBanner");
    const timerWrap = document.getElementById("countdownTimerWrap");
    const cdDays = document.getElementById("cdDays");
    const cdHours = document.getElementById("cdHours");
    const cdMinutes = document.getElementById("cdMinutes");
    const cdSeconds = document.getElementById("cdSeconds");
    const cdHeader = document.getElementById("countdownHeader");

    const now = new Date();
    const todayMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
    );

    // Default Case: No date given -> Celebrate Today!
    if (!targetDateStr) {
      if (banner) banner.style.display = "block";
      if (timerWrap) timerWrap.style.display = "none";
      return;
    }

    const parts = targetDateStr.split("-");
    if (parts.length < 3) {
      if (banner) banner.style.display = "block";
      if (timerWrap) timerWrap.style.display = "none";
      return;
    }

    const chosenYear = parseInt(parts[0], 10);
    const chosenMonth = parseInt(parts[1], 10) - 1; // 0-indexed
    const chosenDay = parseInt(parts[2], 10);
    const targetDate = new Date(chosenYear, chosenMonth, chosenDay, 0, 0, 0);

    // CASE 1: IS IT TODAY?
    if (targetDate.getTime() === todayMidnight.getTime()) {
      if (banner) banner.style.display = "block";
      if (timerWrap) timerWrap.style.display = "none";
      showToast("🎉 Today is the Special Day! Happy Birthday! 🎂", "success");
      return;
    }

    // CASE 2: PAST DATE
    if (targetDate < todayMidnight) {
      if (banner) banner.style.display = "none";
      if (timerWrap) timerWrap.style.display = "block";
      if (cdHeader) {
        cdHeader.textContent = `⚠️ This celebration date (${targetDateStr}) has already passed!`;
      }
      if (cdDays) cdDays.textContent = "00";
      if (cdHours) cdHours.textContent = "00";
      if (cdMinutes) cdMinutes.textContent = "00";
      if (cdSeconds) cdSeconds.textContent = "00";
      return;
    }

    // CASE 3: FUTURE DATE -> LIVE COUNTDOWN
    if (banner) banner.style.display = "none";
    if (timerWrap) timerWrap.style.display = "block";

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedTarget = `${monthNames[chosenMonth]} ${chosenDay}, ${chosenYear}`;
    if (cdHeader) {
      cdHeader.textContent = `Counting down to celebration on ${formattedTarget}! 🎂`;
    }

    showToast(
      `Counting down to birthday on ${monthNames[chosenMonth]} ${chosenDay}! ⏳`,
      "info",
    );

    function tick() {
      const current = new Date();
      let diff = targetDate - current;

      if (diff <= 0) {
        if (banner) banner.style.display = "block";
        if (timerWrap) timerWrap.style.display = "none";
        clearInterval(countdownInterval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      if (cdDays) cdDays.textContent = String(days).padStart(2, "0");
      if (cdHours) cdHours.textContent = String(hours).padStart(2, "0");
      if (cdMinutes) cdMinutes.textContent = String(mins).padStart(2, "0");
      if (cdSeconds) cdSeconds.textContent = String(secs).padStart(2, "0");
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
  }

  startCountdown(params.get("date") || "");

  // 3. Third External API: Quotes / Birthday Inspiration API
  async function fetchQuoteFromAPI() {
    const messageArea = document.getElementById("customMessage");
    const customRadio = document.querySelector(
      'input[name="messageType"][value="custom"]',
    );

    showToast("Connecting to External Quotes API... 🌐", "info");

    const birthdayWisdom = [
      "May your year ahead be full of magical adventures, laughter that echoes forever, and dreams that turn into reality!",
      "Count your life by smiles, not tears. Count your age by friends, not years. Happy, happiest birthday!",
      "Another year older, another year wiser, and a million times more incredible! Celebrate today to the fullest!",
      "May your special day bring you as much joy, warmth, and brightness as you bring to everyone around you!",
      "Wishing you infinite reasons to smile, relentless success, and peace in every single heartbeat this year.",
    ];

    try {
      let quoteText = "";
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (res.ok) {
        const data = await res.json();
        const base =
          birthdayWisdom[Math.floor(Math.random() * birthdayWisdom.length)];
        quoteText = `${base}\n\n"${data.quote}" — ${data.author}`;
      } else {
        quoteText =
          birthdayWisdom[Math.floor(Math.random() * birthdayWisdom.length)];
      }

      if (customRadio) customRadio.checked = true;
      if (messageArea) {
        messageArea.value = quoteText;
        messageArea.focus();
      }
      showToast("External Quote loaded and applied to letter! ✨", "success");
    } catch (err) {
      console.warn("External Quotes API fallback:", err);
      const fallbackQuote =
        birthdayWisdom[Math.floor(Math.random() * birthdayWisdom.length)];
      if (customRadio) customRadio.checked = true;
      if (messageArea) messageArea.value = fallbackQuote;
      showToast("Birthday quote applied to letter! ✨", "success");
    }
  }

  // Toggle quote suggest button based on custom message radio
  const msgRadios = document.querySelectorAll('input[name="messageType"]');
  const quoteBtn = document.getElementById("fetchQuoteBtn");
  msgRadios.forEach((r) => {
    r.addEventListener("change", () => {
      if (quoteBtn) {
        quoteBtn.style.display =
          r.value === "custom" && r.checked ? "inline-block" : "none";
      }
    });
  });

  function escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(
      /[&<>"']/g,
      (m) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[m],
    );
  }

  // 4. Local JavaScript File Handling: FileReader Preview & Metadata Inspector
  function renderLocalFilePreview(file, dataUrl, label) {
    const box = document.getElementById("localFileReaderBox");
    const thumbs = document.getElementById("fileReaderThumbnails");
    const meta = document.getElementById("fileReaderMetadata");
    if (!box || !thumbs) return;

    box.style.display = "block";

    const img = document.createElement("img");
    img.className = "filereader_thumb";
    img.src = dataUrl;
    img.title = file.name;
    thumbs.prepend(img);

    while (thumbs.children.length > 5) {
      thumbs.removeChild(thumbs.lastChild);
    }

    const sizeKb = (file.size / 1024).toFixed(1);
    if (meta) {
      meta.innerHTML = `<strong>Local JS FileReader:</strong> Loaded <code>${escapeHtml(file.name)}</code> (${sizeKb} KB, ${file.type || "image"}) locally into browser memory.`;
    }
    showToast(`Instant preview generated locally via FileReader! 📸`, "info");
  }

  function inspectLocalFile(event) {
    const file = event.target.files[0];
    const output = document.getElementById("fileInspectionResults");
    if (!file || !output) return;

    output.style.display = "block";
    output.innerHTML = "Reading file locally with JavaScript FileReader... ⏳";

    const reader = new FileReader();
    const startTime = performance.now();

    reader.onload = (e) => {
      const elapsed = (performance.now() - startTime).toFixed(2);
      const sizeKb = (file.size / 1024).toFixed(2);
      const base64Len = e.target.result.length;

      output.innerHTML = `Name: ${escapeHtml(file.name)}\nSize: ${sizeKb} KB (${file.size} bytes)\nMIME: ${file.type || "unknown"}\nRead Time: ${elapsed} ms\nDataURL Length: ${base64Len.toLocaleString()} chars\nLocal File API: OK (FileReader.readAsDataURL)`;
      showToast(
        `Inspected ${file.name} locally using FileReader API! 🔬`,
        "success",
      );
    };

    reader.onerror = () => {
      output.innerHTML = "Error reading local file.";
      showToast("FileReader failed to read file.", "error");
    };

    reader.readAsDataURL(file);
  }

  // 5. Local File Export (Blob + URL.createObjectURL)
  function exportCurrentBirthdayJSON() {
    const data = getActiveBirthdayPayload();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `Birthday-Wish-${(data.recipient_name || "Card").replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    showToast(
      "Birthday card exported as JSON via client-side Blob! 📥",
      "success",
    );
  }

  async function exportSingleRecordJSON(id) {
    try {
      const res = await fetch(
        `/.netlify/functions/birthday?id=${encodeURIComponent(id)}`,
      );
      if (!res.ok) throw new Error("Could not retrieve record to export.");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Birthday-${(data.recipient_name || id).replace(/\s+/g, "_")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(
        `Exported ${data.recipient_name}'s record as JSON! 📥`,
        "success",
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  function exportGreetingCardText() {
    const data = getActiveBirthdayPayload();
    const cardText = `=============================================================
           🎂 HAPPY BIRTHDAY, ${(data.recipient_name || "FRIEND").toUpperCase()}! 🎂
=============================================================

Relationship : ${data.relationship || "Special One"}
Celebration  : Dynamic Birthday Experience
Date Created : ${new Date().toLocaleDateString()}
Theme Style  : ${data.theme || "Classic"}

--------------------- SPECIAL LETTER ------------------------
${data.message || "May every single petal of this day bring you the same warmth, happiness, and peace that you bring into the lives of everyone around you!"}

-------------------- CURATED SOUNDTRACK ---------------------
${(data.playlist || []).map((s, idx) => `  ${idx + 1}. ${s.title || "Melody"} - ${s.artist || "Special Artist"}`).join("\n")}

=============================================================
Generated with Dynamic Birthday Celebration Platform
=============================================================`;

    const blob = new Blob([cardText], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `Greeting-Card-${(data.recipient_name || "Friend").replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    showToast("Printable greeting card downloaded (.txt)! 📄", "success");
  }

  // 6. Local File Import (FileReader.readAsText)
  function handleImportJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.recipient_name) {
          throw new Error("JSON file must contain recipient_name.");
        }

        document.getElementById("nameInput").value =
          imported.recipient_name || "";
        if (imported.relationship)
          document.getElementById("typeInput").value = imported.relationship;
        if (imported.message) {
          document.getElementById("customMessage").value = imported.message;
          const msgRadio = document.querySelector(
            'input[name="messageType"][value="custom"]',
          );
          if (msgRadio) msgRadio.checked = true;
        }
        if (imported.theme) {
          const tr = document.querySelector(
            `input[name="themeType"][value="${imported.theme}"]`,
          );
          if (tr) tr.checked = true;
        }

        closeFileHub();
        openEditPopup();
        showToast(
          `Loaded "${imported.recipient_name}" from local JSON! 📂`,
          "success",
        );
      } catch (err) {
        showToast("Invalid JSON file: " + err.message, "error");
      }
    };
    reader.readAsText(file);
  }

  // 7. Local File Hub Navigation
  function openFileHub() {
    const overlay = document.getElementById("file_hub_overlay");
    if (overlay) overlay.style.display = "flex";
  }

  function closeFileHub() {
    const overlay = document.getElementById("file_hub_overlay");
    if (overlay) overlay.style.display = "none";
  }

  // 8. Interactive UI Controls Handlers (Typography, Volume, Sound FX, Accents)
  function updateFontSize(val) {
    const display = document.getElementById("fontSizeDisplay");
    if (display) display.textContent = val + "px";

    const letterDiv = document.querySelector(".letter_div");
    if (letterDiv) letterDiv.style.fontSize = val + "px";

    const letterContent = document.querySelector(".letter_content");
    if (letterContent) letterContent.style.fontSize = val + "px";

    document
      .querySelectorAll(
        ".letter_content p, .letter_content span, .letter_div .head, .custom_letter_message",
      )
      .forEach((el) => {
        el.style.fontSize = val + "px";
        el.style.lineHeight = Number(val) * 1.6 + "px";
      });
  }

  function updateMusicVolume(val) {
    currentMusicVolume = Number(val) / 100;
    const display = document.getElementById("volumeDisplay");
    if (display) display.textContent = val + "%";
    document.querySelectorAll("audio").forEach((a) => {
      a.volume = currentMusicVolume;
    });
  }

  function updateAccentColor(color) {
    document.documentElement.style.setProperty("--rose", color);
    document.body.style.setProperty("--rose", color);

    // Apply color to key theme elements across the webpage
    document
      .querySelectorAll(".name, .nav_name, .memory_name")
      .forEach((el) => {
        el.style.color = color;
      });

    const actionBtn = document.getElementById("mainActionBtn");
    if (actionBtn) actionBtn.style.background = color;

    const hexDisplay = document.getElementById("colorHexDisplay");
    if (hexDisplay) {
      hexDisplay.textContent = color;
      hexDisplay.style.color = color;
    }

    document.querySelectorAll(".countdown_pill").forEach((el) => {
      el.style.borderColor = color;
      el.style.color = color;
    });

    document.querySelectorAll(".c_box span").forEach((el) => {
      el.style.color = color;
    });

    showToast(
      `Accent color set to ${color}! (Changes hero name, countdown & accents)`,
      "info",
    );
  }

  function playCelebrationChime(notes = [523.25, 659.25, 783.99, 1046.5]) {
    if (!soundEffectsEnabled) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!globalAudioCtx) {
        globalAudioCtx = new AudioCtxClass();
      }
      if (globalAudioCtx.state === "suspended") {
        globalAudioCtx.resume();
      }

      const startTime = globalAudioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = globalAudioCtx.createOscillator();
        const gain = globalAudioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.09);

        gain.gain.setValueAtTime(0.0001, startTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(
          0.25,
          startTime + idx * 0.09 + 0.02,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startTime + idx * 0.09 + 0.3,
        );

        osc.connect(gain);
        gain.connect(globalAudioCtx.destination);

        osc.start(startTime + idx * 0.09);
        osc.stop(startTime + idx * 0.09 + 0.32);
      });
    } catch (e) {
      console.warn("Web Audio chime could not play:", e);
    }
  }

  function toggleSoundEffects(enabled) {
    soundEffectsEnabled = !!enabled;
    if (soundEffectsEnabled) {
      playCelebrationChime();
      showToast("Sound effects & celebration chimes enabled! 🔔", "info");
    } else {
      showToast("Sound effects muted. 🔕", "info");
    }
  }

  // Interactive Wish Buttons Chime Effect
  document.querySelectorAll(".wish_button").forEach((btn) => {
    btn.addEventListener("click", () => {
      playCelebrationChime();
      btn.style.transform = "scale(1.08)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 250);
      showToast(
        `Celebration wish shared: ${btn.textContent.trim()} ✨`,
        "success",
      );
    });
  });

  function toggleConfetti(enabled) {
    const heroPetals = document.querySelectorAll(
      ".floral_petals, .romantic_petals, .royal_sparkles, .galaxy_stars, .shooting_stars",
    );
    heroPetals.forEach((el) => (el.style.display = enabled ? "block" : "none"));
    showToast(`Festive particles ${enabled ? "enabled" : "disabled"}.`, "info");
  }

  function getActiveBirthdayPayload() {
    const recipientName =
      params.get("name") ||
      document.getElementById("nameInput")?.value ||
      "Friend";
    const relationship =
      params.get("type") ||
      document.getElementById("typeInput")?.value ||
      "friend";
    const message =
      params.get("message") ||
      document.getElementById("customMessage")?.value ||
      "";
    const currentTheme = params.get("theme") || "classic";
    const currentGallery = params.get("gallery") || "simple";
    const currentPhotos =
      currentGallery === "animated"
        ? animatedImages
        : images.map(decodeImageUrl);
    const bdayDate =
      params.get("date") ||
      document.getElementById("birthdayDateInput")?.value ||
      "";

    return {
      recipient_name: recipientName,
      relationship: relationship,
      birthday_date: bdayDate,
      message: message,
      theme: currentTheme,
      gallery_type: currentGallery,
      images: currentPhotos,
      playlist: allSongs,
    };
  }

  function openSettingsModal() {
    const overlay = document.getElementById("settings_overlay");
    if (overlay) overlay.style.display = "flex";
  }

  function closeSettingsModal() {
    const overlay = document.getElementById("settings_overlay");
    if (overlay) overlay.style.display = "none";
  }

  // 9. Global Error & Exception Handlers
  window.addEventListener("error", (event) => {
    console.error("Global captured error:", event.error || event.message);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.warn("Unhandled promise rejection:", event.reason);
  });

  // Global window functions export
  Object.assign(window, {
    generate,
    closeEditPopup,
    openEditPopup,
    openPlay,
    closePlay,
    copyLink,
    shareWhatsApp,
    editAgain,
    upgradeLegacyLink,
    showToast,
    fetchQuoteFromAPI,
    openFileHub,
    closeFileHub,
    exportCurrentBirthdayJSON,
    exportGreetingCardText,
    handleImportJSON,
    inspectLocalFile,
    updateFontSize,
    updateMusicVolume,
    updateAccentColor,
    toggleConfetti,
    toggleSoundEffects,
    playCelebrationChime,
    openSettingsModal,
    closeSettingsModal,
  });
}

startBirthdayPage();
