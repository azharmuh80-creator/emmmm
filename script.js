/* LITTLE THINGS ♡ — untuk Bubu */
 
// Reveal section saat masuk viewport
const revealElements = document.querySelectorAll(".reveal");
 
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
 
  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${(index % 3) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}
 
// Cahaya halus mengikuti kursor, hanya pada perangkat pointer
const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX - 110}px`;
    glow.style.top = `${event.clientY - 110}px`;
  }, { passive: true });
}
 
// Tilt 3D lembut pada kartu galeri
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch" || window.innerWidth < 760) return;
 
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
 
    card.style.transform =
      `perspective(800px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
  });
 
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
 
// Pesan berdasarkan mood Bubu
const moodMessages = {
  happy: "YAYYY, simpan sedikit bahagia itu buat nanti juga yaa. Semoga hal baik datang bertubi-tubi ✨",
  tired: "Hari ini kamu udah berusaha. Istirahat dulu, nggak perlu jadi produktif setiap saat. Peluk virtual dari jauh 🧸",
  chaos: "WKWK tarik napas dulu bestie 😭 Satu-satu aja, kamu nggak harus menyelesaikan seluruh semesta malam ini.",
  soft: "Mode gemoy diaktifkan 🌷 Semoga kamu dapat perhatian kecil, makanan enak, dan alasan buat senyum hari ini."
};
 
const moodMessage = document.querySelector(".mood-message p");
const moodButtons = document.querySelectorAll(".mood-btn");
 
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    moodButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
 
    if (moodMessage) {
      moodMessage.textContent = moodMessages[button.dataset.mood] || "Semoga hari Bubu menyenangkan ♡";
      moodMessage.animate(
        [{ opacity: 0.25, transform: "translateY(5px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 350, easing: "ease-out" }
      );
    }
 
    if (["happy", "soft"].includes(button.dataset.mood)) sprinkleHearts(5);
  });
});
 
// Buka / tutup surat
const openLetterButton = document.getElementById("open-letter");
const letterContent = document.getElementById("letter-content");
 
if (openLetterButton && letterContent) {
  openLetterButton.addEventListener("click", () => {
    const willOpen = letterContent.hidden;
    letterContent.hidden = !willOpen;
    openLetterButton.innerHTML = willOpen
      ? 'tutup suratnya <span>♡</span>'
      : 'buka surat kecilnya <span>♡</span>';
 
    if (willOpen) {
      sprinkleHearts(12);
      letterContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}
 
// Hati dan bintang terbang
const floatingLayer = document.querySelector(".floating-layer");
 
function sprinkleHearts(amount = 3) {
  if (!floatingLayer) return;
 
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.className = "float-heart";
    heart.textContent = Math.random() > 0.35 ? "♡" : "✦";
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.fontSize = `${12 + Math.random() * 15}px`;
    heart.style.animationDuration = `${3.5 + Math.random() * 2.5}s`;
    heart.style.animationDelay = `${Math.random() * 0.35}s`;
    floatingLayer.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}
 
// Klik foto untuk melihat ukuran besar dalam dialog sederhana
document.querySelectorAll(".photo-frame img").forEach((img) => {
  img.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "image-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", img.alt);
    overlay.innerHTML = `
      <button class="lightbox-close" type="button" aria-label="Tutup foto">×</button>
      <img src="${img.getAttribute("src")}" alt="${img.alt}">
      <p>${img.alt} ♡</p>
    `;
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
 
    const close = () => {
      overlay.remove();
      document.body.style.overflow = "";
    };
    overlay.querySelector(".lightbox-close").addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", function onKey(event) {
      if (event.key === "Escape") {
        close();
        document.removeEventListener("keydown", onKey);
      }
    });
  });
});
 
// Musik latar: "Perfect" — Ed Sheeran
// Browser memblokir autoplay bersuara, jadi lagu dicoba diputar langsung;
// kalau diblokir, otomatis mulai pada sentuhan/klik/tombol pertama pengunjung.
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
 
if (music && musicToggle) {
  music.volume = 0.5;
  let userPaused = false;
  const unlockEvents = ["pointerdown", "click", "touchend", "keydown"];
 
  const setPlayingState = (playing) => {
    musicToggle.classList.toggle("playing", playing);
    musicToggle.classList.toggle("waiting", !playing && !userPaused);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
  };
 
  const tryPlay = async () => {
    try {
      await music.play();
      setPlayingState(true);
      return true;
    } catch (err) {
      setPlayingState(false);
      return false;
    }
  };
 
  const unlock = async (event) => {
    if (userPaused || musicToggle.contains(event.target)) return;
    if (await tryPlay()) {
      unlockEvents.forEach((name) => window.removeEventListener(name, unlock, true));
    }
  };
 
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      userPaused = false;
      await tryPlay();
    } else {
      userPaused = true;
      music.pause();
      setPlayingState(false);
    }
    unlockEvents.forEach((name) => window.removeEventListener(name, unlock, true));
  });
 
  music.addEventListener("error", () => {
    musicToggle.hidden = true;
    console.warn("File lagu tidak ditemukan: audio/perfect.mp3");
  });
 
  // 1) coba langsung putar  2) kalau diblokir, tunggu interaksi pertama
  tryPlay().then((ok) => {
    if (!ok) unlockEvents.forEach((name) => window.addEventListener(name, unlock, true));
  });
}
 
// Hujan boneka & permen ♡
const treatLayer = document.querySelector(".treat-rain");
const treatToggle = document.getElementById("treat-toggle");
const treatEmojis = ["🧸", "🍬", "🍭", "🎀", "🍓", "🍡", "🐰", "🩷", "🧁", "🌸", "🍒", "⭐"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const MAX_TREATS = window.innerWidth < 760 ? 14 : 26;
let treatsOn = true;
let treatTimer = null;
 
function dropTreat(burst = false) {
  if (!treatLayer || reduceMotion) return;
  if (treatLayer.childElementCount >= MAX_TREATS + (burst === true ? 20 : 0)) return;
 
  const item = document.createElement("div");
  const inner = document.createElement("span");
  const big = Math.random() < 0.2; // sesekali ada yang lebih besar
  inner.textContent = treatEmojis[Math.floor(Math.random() * treatEmojis.length)];
  item.className = "treat";
  item.appendChild(inner);
  item.style.left = `${Math.random() * 96}%`;
  item.style.fontSize = `${big ? 34 + Math.random() * 12 : 18 + Math.random() * 14}px`;
  item.style.setProperty("--dur", `${(big ? 11 : 7) + Math.random() * 6}s`);
  item.style.setProperty("--delay", burst === true ? `${Math.random() * 0.6}s` : "0s");
  item.style.setProperty("--sway", `${(Math.random() - 0.5) * 120}px`);
  item.style.setProperty("--r0", `${(Math.random() - 0.5) * 50}deg`);
  item.style.setProperty("--spin", `${(Math.random() - 0.5) * 360}deg`);
  item.style.setProperty("--o", `${0.6 + Math.random() * 0.3}`);
  item.style.setProperty("--wob", `${1.2 + Math.random() * 1.2}s`);
  treatLayer.appendChild(item);
  item.addEventListener("animationend", (e) => {
    if (e.target === item) item.remove();
  });
}
 
function treatBurst(amount = 14) {
  for (let i = 0; i < amount; i++) dropTreat(true);
}
 
function startTreats() {
  if (treatTimer || reduceMotion) return;
  treatTimer = setInterval(dropTreat, 650);
}
 
function stopTreats() {
  clearInterval(treatTimer);
  treatTimer = null;
}
 
if (treatLayer && !reduceMotion) {
  treatBurst(10); // sambutan pembuka
  startTreats();
 
  // hemat baterai: berhenti saat tab tidak aktif
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTreats();
    else if (treatsOn) startTreats();
  });
 
  if (treatToggle) {
    treatToggle.addEventListener("click", () => {
      treatsOn = !treatsOn;
      treatToggle.setAttribute("aria-pressed", String(treatsOn));
      treatToggle.setAttribute("aria-label", treatsOn ? "Matikan hujan boneka" : "Nyalakan hujan boneka");
      if (treatsOn) { startTreats(); treatBurst(8); }
      else { stopTreats(); treatLayer.innerHTML = ""; }
    });
  }
 
  // hujan ekstra saat momen spesial
  document.querySelectorAll(".mood-btn").forEach((b) => b.addEventListener("click", () => treatsOn && treatBurst(10)));
  const letterBtn = document.getElementById("open-letter");
  if (letterBtn) letterBtn.addEventListener("click", () => treatsOn && treatBurst(18));
} else if (treatToggle) {
  treatToggle.hidden = true;
}