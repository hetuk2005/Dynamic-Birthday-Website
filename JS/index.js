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

// Music Active

const tracks = document.querySelectorAll(".music");

let currentAudio = null;

tracks.forEach((track) => {
  const audio = track.querySelector("audio");
  const icon = track.querySelector(".music_icon");

  track.addEventListener("click", () => {
    if (track.classList.contains("active")) {
      if (!audio.paused) {
        audio.pause();
        icon.textContent = "▶";
      } else {
        audio.play();
        icon.textContent = "⏸";
      }
    } else {
      // Remove Active From All
      tracks.forEach((t) => {
        t.classList.remove("active");
        const a = t.querySelector("audio");
        const i = t.querySelector(".music_icon");
        a.pause();
        i.textContent = "▶";
      });

      // Add Active To Clicked One
      track.classList.add("active");
      audio.currentTime = 0;
      audio.play();
      icon.textContent = "⏸";

      currentAudio = audio;
    }
  });
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

async function handleFile(file, index, box) {
  if (!file) return;

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
    el.style.backgroundPosition = "center";
    el.innerHTML = "";
  }
}

function generate() {
  const name = document.getElementById("nameInput").value;
  const type = document.getElementById("typeInput").value;

  if (!name || !type) {
    alert("Please Fill All Details!");
    return;
  }

  showLoading();

  if (!images[0] || !images[1] || !images[2]) {
    alert("Please Upload All 3 Images!");
    return;
  }

  setTimeout(() => {
    const url = `?name=${encodeURIComponent(name)}&type=${type}&img1=${images[0]}&img2=${images[1]}&img3=${images[2]}`;
    window.location.href = url;
  }, 3000);
}

const overlay = document.getElementById("form_overlay");

const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const type = params.get("type");
const img1 = params.get("img1");
const img2 = params.get("img2");
const img3 = params.get("img3");

setImage(".photo_child1", img1);
setImage(".photo_child2", img2);
setImage(".photo_child3", img3);

if (!name) {
  if (overlay) overlay.style.display = "flex";
  document.body.style.overflow = "hidden";
  document.querySelector(".action_buttons").style.display = "none";
} else {
  if (overlay) overlay.style.display = "none";
  document.body.style.overflow = "auto";
}

const editName = localStorage.getItem("edit_name");
const editType = localStorage.getItem("edit_type");

if (editName || editType) {
  if (overlay) overlay.style.display = "flex";

  document.getElementById("nameInput").value = editName || "";
  document.getElementById("typeInput").value = editType || "";

  document.body.style.overflow = "hidden";

  // Clear After Use (Optional)
  localStorage.removeItem("edit_name");
  localStorage.removeItem("edit_type");
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
}

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

if (type && letters[type] && letterBox) {
  document.querySelector(".letter_content").innerHTML = letters[type];
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

function editAgain() {
  const params = new URLSearchParams(window.location.search);

  localStorage.setItem("edit_name", params.get("name"));
  localStorage.setItem("edit_type", params.get("type"));

  // ✅ SAVE IMAGES

  localStorage.setItem("edit_img1", params.get("img1"));
  localStorage.setItem("edit_img2", params.get("img2"));
  localStorage.setItem("edit_img3", params.get("img3"));

  window.location.href = window.location.pathname;
}