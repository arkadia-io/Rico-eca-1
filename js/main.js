// main.js - FULL CLEANED VERSION
// Gabungan: gate, scroll lock, bg crossfade, countdown, reveal observer,
// loadSection (fetch), swiper init, copy-btn, musik + control (fixed autoplay)

// ======================
// UTIL: safeGet - ambil elemen aman
// ======================
function safeGet(id) {
  return document.getElementById(id) || null;
}

// ======================
// GATE: scroll lock / unlock
// ======================
let savedScrollY = 0;
function lockScroll() {
  savedScrollY = window.scrollY || window.pageYOffset || 0;
  document.documentElement.style.position = 'fixed';
  document.documentElement.style.top = `-${savedScrollY}px`;
  document.documentElement.style.left = '0';
  document.documentElement.style.right = '0';
  document.documentElement.style.width = '100%';
  document.body.classList.add('locked-scroll');
}

function unlockScroll() {
  document.documentElement.style.position = '';
  document.documentElement.style.top = '';
  document.documentElement.style.left = '';
  document.documentElement.style.right = '';
  document.documentElement.style.width = '';
  document.body.classList.remove('locked-scroll');
  window.scrollTo(0, savedScrollY);
}

// ======================
// DOMContentLoaded: inisialisasi dasar yang perlu DOM
// ======================
document.addEventListener("DOMContentLoaded", () => {
  // ambil elemen utama (bisa null jika tidak ada di halaman tertentu)
  const enterBtn = safeGet('enterBtn');
  const hero = safeGet('hero');
  const gate = safeGet('gate');

  // Lock on load kalau gate ada
  if (gate) lockScroll();

  // Jika ada enterBtn, tapi pastikan kita pakai 1 event handler yang bersih
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      // Musik dimainkan langsung di event handler (kalau ada)
      const music = safeGet("bg-music");
      const iconMusic = safeGet("icon-music");
      if (music) {
        // Pastikan try/catch via promise .then/.catch
        if (music.paused) {
          music.play()
            .then(() => {
              console.log("Musik sukses jalan dari gate 🎶");
              if (iconMusic) iconMusic.className = "fa-solid fa-pause";
            })
            .catch(err => {
              console.warn("Play via gate diblokir (normal):", err);
            });
        }
      }

      // unlock scroll & scroll ke hero (hanya jika elemen ada)
      unlockScroll();
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });

      // fade out gate (jika ada)
      if (gate) {
        gate.classList.add('hidden');
        setTimeout(() => {
          try { gate.remove(); } catch (e) { /* safe */ }
        }, 600);
      }
    });
  }

  // Jika enterBtn tidak ada tapi ada hero/gate, kita tetap biarkan locked atau unlock sesuai kebutuhan
  // (tidak otomatis memanggil play/autoscroll tanpa gesture)
});

// ======================
// PARAM: ambil dari URL ?to=
// ======================
(function handleUrlParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get('to'); // baca nilai ?to=
  if (nama) {
    const penerima = safeGet("penerima");
    if (penerima) penerima.innerText = nama;
  }
})();

// ======================
// BACKGROUND CROSSFADE SLIDESHOW
// ======================
(function bgCrossfade() {
  const images = [
    "./img/galery/ft1.jpg",
    "./img/galery/ft2.jpg",
    "./img/galery/ft3.jpg",
    "./img/galery/ft4.jpg",
    "./img/galery/ft5.jpg",
    "./img/galery/ft6.jpg"
  ];

  // preload
  images.forEach(src => { const i = new Image(); i.src = src; });

  const bgA = safeGet("bgA");
  const bgB = safeGet("bgB");
  if (!bgA || !bgB) return;

  let showingA = true;
  let index = 1;

  bgA.style.backgroundImage = `url('${images[0]}')`;
  bgB.style.backgroundImage = `url('${images[1 % images.length]}')`;

  function crossfade() {
    const nextUrl = images[index % images.length];
    const fadeIn = showingA ? bgB : bgA;
    const fadeOut = showingA ? bgA : bgB;

    fadeIn.style.backgroundImage = `url('${nextUrl}')`;

    fadeOut.classList.remove("opacity-100");
    fadeOut.classList.add("opacity-0");
    fadeIn.classList.remove("opacity-0");
    fadeIn.classList.add("opacity-100");

    showingA = !showingA;
    index++;
  }

  setInterval(crossfade, 3000);
})();

// ======================
// COUNTDOWN
// ======================
(function countdownInit() {
  // Pastikan zona waktu lokal pengguna dipakai oleh Date()
  const targetDate = new Date("Dec 14, 2025 08:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const countdownEl = safeGet("countdown");
    if (!countdownEl) return;

    if (distance < 0) {
      countdownEl.innerHTML = "<p class='text-lg font-semibold'>The Wedding Has Started 🎉</p>";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = safeGet("days"), h = safeGet("hours"), m = safeGet("minutes"), s = safeGet("seconds");
    if (d) d.innerText = days;
    if (h) h.innerText = hours;
    if (m) m.innerText = minutes;
    if (s) s.innerText = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// ======================
// REVEAL ANIMATIONS (IntersectionObserver)
// ======================
(function revealObserver() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals || reveals.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains("slide-left")) {
        el.classList.remove("opacity-0", "-translate-x-10");
        el.classList.add("opacity-100", "translate-x-0");
      }

      if (el.classList.contains("slide-right")) {
        el.classList.remove("opacity-0", "translate-x-10");
        el.classList.add("opacity-100", "translate-x-0");
      }

      if (el.classList.contains("slide-down")) {
        el.classList.remove("opacity-0", "-translate-y-10");
        el.classList.add("opacity-100", "translate-y-0");
      }

      if (el.classList.contains("slide-up")) {
        el.classList.remove("opacity-0", "translate-y-10");
        el.classList.add("opacity-100", "translate-y-0");
      }

      if (el.classList.contains("fade-in")) {
        el.classList.remove("opacity-0");
        el.classList.add("opacity-100");
      }

      if (el.classList.contains("zoom-in")) {
        el.classList.remove("opacity-0", "scale-95");
        el.classList.add("opacity-100", "scale-100");
      }

      obs.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

// ======================
// SWIPER (gallery) INIT
// ======================
function initGallerySwiper() {
  // Pastikan Swiper ada (library) sebelum inisialisasi
  if (typeof Swiper === "undefined") return;
  try {
    const swiper = new Swiper(".mySwiper", {
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      }
    });
  } catch (e) {
    console.warn("Swiper init failed:", e);
  }
}

// ======================
// LOAD SECTION (fetch partials) - reinit observer & swiper where needed
// ======================
function loadSection(id, url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Gagal load " + url);
      return response.text();
    })
    .then((data) => {
      const container = document.getElementById(id);
      if (!container) return;
      container.innerHTML = data;

      // re-init reveal observer on newly injected nodes
      container.querySelectorAll(".reveal").forEach((el) => {
        // create a small one-off observer for new nodes
        const obs = new IntersectionObserver((entries, o) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const eln = entry.target;
            eln.classList.remove("opacity-0");
            eln.classList.add("opacity-100");
            o.unobserve(eln);
          });
        }, { threshold: 0.15 });
        obs.observe(el);
      });

      if (id === "gallery") {
        initGallerySwiper();
      }
    })
    .catch((error) => console.error("Error loadSection:", error));
}

// Call all sections (sesuaikan nama file partials)
loadSection("mempelai", "./mempelai.html");
loadSection("acara", "./acara.html");
loadSection("story", "./story.html");
loadSection("gallery", "./gallery.html");
loadSection("qoutes", "./qoutes.html");
loadSection("closing", "./closing.html");
loadSection("footer", "./footer.html");
loadSection("amplop", "./amplop.html");
loadSection("navbar", "./navbar.html");

// ======================
// COPY to clipboard (toast)
// ======================
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList && e.target.classList.contains("copy-btn")) {
    const norek = e.target.getAttribute("data-norek") || "";
    navigator.clipboard.writeText(norek).then(() => {
      const toast = safeGet("toast");
      if (!toast) return;
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100");
      setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
      }, 2500);
    }).catch(err => console.warn("Clipboard write failed:", err));
  }
});

// ======================
// MUSIC + CONTROL (FIXED)
// ======================
(function musicAndControls() {
  const music = safeGet("bg-music");
  const btnMusic = safeGet("btn-music");
  const iconMusic = safeGet("icon-music");
  // Preload jika ada audio
  if (music) music.preload = "auto";

  // Manual control: tombol play/pause
  if (btnMusic) {
    btnMusic.addEventListener("click", () => {
      if (!music) return;
      if (music.paused) {
        music.play()
          .then(() => {
            if (iconMusic) iconMusic.className = "fa-solid fa-pause";
            btnMusic.classList.add("playing");
          })
          .catch(err => console.warn("Gagal play:", err));
      } else {
        music.pause();
        if (iconMusic) iconMusic.className = "fa-solid fa-play";
        btnMusic.classList.remove("playing");
      }
    });
  }

  // Try autoplay on load (best-effort, non-blocking)
  window.addEventListener("load", () => {
    if (!music) return;
    music.play()
      .then(() => console.log("Autoplay berhasil (jarang)"))
      .catch(() => console.log("Autoplay diblokir — normal"));
  });
})();

// ======================
// SAFETY: fallback jika enterBtn dipanggil sebelum DOMContentLoaded
// (misal script diletakkan di head). Kode ini melakukan noop safe checks.
// ======================
(function safetyNoop() {
  // nothing to do, but keeps file safe if things loaded in diferent orders
})();

// ======================
// END OF FILE
// ======================
