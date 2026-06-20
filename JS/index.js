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

const hero = document.querySelector(".hero");

const colors = ["#e8b4b8", "#b8aed2", "#a8c5ac", "#f5d6d9", "#c9e8c0"];

for (let i = 0; i < 25; i++) {
  const petal = document.createElement("div");
  petal.classList.add("petal");

  petal.style.left = Math.random() * 100 + "%";
  petal.style.background = colors[Math.floor(Math.random() * colors.length)];

  petal.style.width = 9 + Math.random() * 11 + "px";
  petal.style.height = 13 + Math.random() * 15 + "px";

  petal.style.animationDuration = 7 + Math.random() * 8 + "s";
  petal.style.animationDelay = -Math.random() * 11 + "s";

  petal.style.transform = `rotate(${Math.random() * 360}deg)`;

  if (hero) {
    hero.append(petal);
  }
}

// Royal Gold Theme

const currentTheme = localStorage.getItem("theme");

if (currentTheme === "royal") {
  const sparkleContainer = document.querySelector(".royal_sparkles");

  if (sparkleContainer) {
    for (let i = 0; i < 25; i++) {
      const sparkle = document.createElement("div");
      sparkle.classList.add("sparkle");
      sparkle.style.left = Math.random() * 100 + "%";
      sparkle.style.top = Math.random() * 100 + "%";
      sparkle.style.animationDuration = 3 + Math.random() * 4 + "s";
      sparkle.style.animationDelay = Math.random() * 5 + "s";
      sparkleContainer.appendChild(sparkle);
    }
  }
}

function setUpTrack(track) {
  const audio = track.querySelector("audio");
  const icon = track.querySelector(".music_icon");

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

      audio.currentTime = 0;
      audio.play();

      icon.textContent = "⏸";
    }
  });
}

const defaultSongs = [
  {
    id: 1,
    title: "golden hour",
    artist: "jVKE",
    audioURL: "../Utili/Golden Hour.mp3",
    default: true,
  },
  {
    id: 2,
    title: "ilahi",
    artist: "arjit sing",
    audioURL: "../Utili/Ilahi.mp3",
    default: true,
  },
  {
    id: 3,
    title: "iktara",
    artist: "kavita seth",
    audioURL: "../Utili/Iktara.mp3",
    default: true,
  },
  {
    id: 4,
    title: "safarnama",
    artist: "lucky ali",
    audioURL: "../Utili/Safarnama.mp3",
    default: true,
  },
  {
    id: 5,
    title: "aashayein",
    artist: "kk",
    audioURL: "../Utili/Aashayein.mp3",
    default: true,
  },
  {
    id: 6,
    title: "love you zindagi",
    artist: "jasleena royal",
    audioURL: "../Utili/Love You Zindagi.mp3",
    default: true,
  },
  {
    id: 7,
    title: "phir se ud chala",
    artist: "mohit chauhan",
    audioURL: "../Utili/Phir Se Ud Chala.mp3",
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

let customSongs = JSON.parse(localStorage.getItem("customSongs")) || [];

let allSongs = JSON.parse(localStorage.getItem("allSongs")) || [
  ...defaultSongs,
];

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

const uploadBoxesContainer = document.querySelectorAll(".upload_box");

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
  console.log("✈️  data: ", data);

  return data.secure_url;
}

async function handleFile(file, index, box) {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please Upload An Image File!");
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    alert("Image Size Must Be Under 5MB!");
    return;
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

    box.innerHTML = "Image Uploaded ✅";
  } catch (err) {
    box.innerHTML = "Upload Failed ❌";
  }
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
let uploadedCount = 0;

const animatedInput = document.getElementById("animatedImages");

const animatedUploadBox = document.getElementById("animatedUploadBox");

const imageCount = document.getElementById("imageCount");

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
    }

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

function generate() {
  const galleryType = document.querySelector(
    'input[name="galleryType"]:checked',
  ).value;

  const selectedTheme = document.querySelector(
    'input[name="themeType"]:checked',
  ).value;

  const btn = document.querySelector(".popup button");
  const name = document.getElementById("nameInput").value;
  const type = document.getElementById("typeInput").value;

  if (!name.trim() || !type) {
    alert("Please Fill All Details!");
    return;
  }

  if (galleryType === "simple") {
    if (!images[0] || !images[1] || !images[2]) {
      alert("Please Upload All 3 Images!");
      return;
    }
  }

  if (galleryType === "animated" && animatedImages.length < 10) {
    alert(`Please Upload ${10 - animatedImages.length} More Images!`);

    return;
  }

  showLoading();

  btn.disabled = true;
  btn.innerHTML = "Generating...";

  let message = "";

  const selectedType = document.querySelector(
    `input[name="messageType"]:checked`,
  ).value;

  localStorage.setItem("galleryType", galleryType);

  if (selectedType === "custom") {
    message = document.getElementById("customMessage").value.trim();

    if (!message) {
      alert("Please Write Your Message!");
      return;
    }
  }

  localStorage.setItem("animatedGallery", JSON.stringify(animatedImages));

  localStorage.setItem("theme", selectedTheme);

  setTimeout(() => {
    const url = `?name=${encodeURIComponent(name)}&type=${type}&message=${encodeURIComponent(message)}&img1=${images[0]}&img2=${images[1]}&img3=${images[2]}`;
    window.location.href = url;
  }, 3000);
}

const overlay = document.getElementById("form_overlay");

const params = new URLSearchParams(window.location.search);

const theme = localStorage.getItem("theme");

if (theme) {
  document.body.classList.add(theme);
}

const galleryType = localStorage.getItem("galleryType");

const animatedGallery =
  JSON.parse(localStorage.getItem("animatedGallery")) || [];

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
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

  const res = await fetch(url);

  const data = await res.json();

  return data[0][0][0];
}

async function getTranslations(name) {
  const words = [name];

  for (const lang of languages) {
    try {
      const translated = await translateText(name, lang);

      words.push(translated);
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

const editName = localStorage.getItem("edit_name");
const editType = localStorage.getItem("edit_type");
const editing_mode = localStorage.getItem("editing_mode");

if (editName || editType) {
  if (overlay) overlay.style.display = "flex";

  document.getElementById("nameInput").value = editName || "";
  document.getElementById("typeInput").value = editType || "";

  document.body.style.overflow = "hidden";

  const closeBtn = document.querySelector(".popup_close");

  if (closeBtn) {
    closeBtn.style.display = editing_mode ? "block" : "none";
  }

  // Clear After Use (Optional)
  localStorage.removeItem("edit_name");
  localStorage.removeItem("edit_type");
  localStorage.removeItem("editing_mode");
}

const editImg1 = localStorage.getItem("edit_img1");
const editImg2 = localStorage.getItem("edit_img2");
const editImg3 = localStorage.getItem("edit_img3");

// Restore Images Array
if (editImg1) images[0] = editImg1;
if (editImg2) images[1] = editImg2;
if (editImg3) images[2] = editImg3;

// Show Uploaded UI
if (editImg1 && uploadBoxes[0]) {
  uploadBoxes[0].innerHTML = "Image Uploaded ✅";
}
if (editImg2 && uploadBoxes[1]) {
  uploadBoxes[1].innerHTML = "Image Uploaded ✅";
}
if (editImg3 && uploadBoxes[2]) {
  uploadBoxes[2].innerHTML = "Image Uploaded ✅";
}

// Clear Storage
localStorage.removeItem("edit_img1");
localStorage.removeItem("edit_img2");
localStorage.removeItem("edit_img3");

if (name) {
  document.querySelectorAll(".name").forEach((el) => {
    el.textContent = name;
  });

  document.querySelectorAll(".nav_name").forEach((el) => {
    el.innerHTML = `${name} &nbsp; ✦`;
  });

  document.querySelectorAll(".memory_name").forEach((el) => {
    el.textContent = name;
  });

  document.querySelectorAll(".footer_name").forEach((el) => {
    el.innerHTML = `${name} &nbsp; ✦`;
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
  let charIndex = 0;
  let deleting = false;

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
      target.textContent = currentWord.substring(0, charIndex - 1);

      charIndex--;

      if (charIndex === 0) {
        deleting = false;

        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? 50 : 120);
  }

  type();
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
  letterBox.innerHTML = `
    <p>
      ${customMessageParam}
    </p>
  `;
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

  const message = `🎉 I made something special for you!\n${link}`;

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
}

// Edit Button

// function editAgain() {
//   const params = new URLSearchParams(window.location.search);

//   localStorage.setItem("edit_name", params.get("name"));
//   localStorage.setItem("edit_type", params.get("type"));

//   // ✅ SAVE IMAGES

//   localStorage.setItem("edit_img1", params.get("img1"));
//   localStorage.setItem("edit_img2", params.get("img2"));
//   localStorage.setItem("edit_img3", params.get("img3"));

//   localStorage.setItem("editing_mode", "true");

//   window.scrollTo({
//     top: 0,
//     behavior: "smooth",
//   });

//   setTimeout(() => {
//     window.location.href = window.location.pathname;
//   }, 300);
// }

function editAgain() {
  const overlay = document.getElementById("form_overlay");

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  const params = new URLSearchParams(window.location.search);

  document.getElementById("nameInput").value = params.get("name") || "";

  document.getElementById("typeInput").value = params.get("type") || "";

  if (params.get("message")) {
    document.querySelector('input[value="custom"]').checked = true;

    customMessage.style.display = "block";

    customMessage.value = decodeURIComponent(params.get("message"));
  }

  images[0] = params.get("img1") || "";
  images[1] = params.get("img2") || "";
  images[2] = params.get("img3") || "";

  uploadBoxes.forEach((box, i) => {
    if (images[i]) {
      box.innerHTML = "Image Uploaded ✅";
    }
  });
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
  renderPlaylistEditor();
}

function closePlay() {
  playlistOverlay.style.display = "none";

  document.getElementById("songTitle").value = "";
  document.getElementById("songArtist").value = "";
  document.getElementById("songFile").value = "";
}

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

      allSongs.push(song);
      customSongs.push(song);

      localStorage.setItem("customSongs", JSON.stringify(customSongs));

      const playlist = document.querySelector(".playlist_music");

      // playlist.append(createSongElement(song, customSongs.length - 1));

      renderSongs();
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
                <p class="track_name">${song.title}</p>
                <p class="track_artist">${song.artist}</p>
            </div>
        </div>

        <audio src="${song.audioURL}"></audio>
    `;

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

  allSongs.forEach((song, index) => {
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

      const fromIndex = allSongs.findIndex((s) => s.id === draggedSong);

      const toIndex = allSongs.findIndex((s) => s.id === song.id);

      // [allSongs[fromIndex], allSongs[toIndex]] = [
      //   allSongs[toIndex],
      //   allSongs[fromIndex],
      // ];

      const [movedSong] = allSongs.splice(fromIndex, 1);

      allSongs.splice(toIndex, 0, movedSong);

      localStorage.setItem("allSongs", JSON.stringify(allSongs));

      renderSongs();
      renderPlaylistEditor();
    });

    row.className = "editor_song";

    row.innerHTML = `
      <span class="drag_handle">☰</span>
      <span>${song.title}</span>
      <button
        class="editor_delete"
        data-id="${song.id}"
      >
        🗑️
      </button>
    `;

    editor.append(row);
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("editor_delete")) {
    const id = Number(e.target.dataset.id);

    allSongs = allSongs.filter((song) => song.id !== id);

    localStorage.setItem("allSongs", JSON.stringify(allSongs));

    renderSongs();
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
  const overlay = document.getElementById("form_overlay");

  overlay.style.display = "none";

  document.body.style.overflow = "auto";
}

function openEditPopup() {
  const overlay = document.getElementById("form_overlay");

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
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
});
