//gate
document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById('enterBtn');
  const hero = document.getElementById('hero');
  const gate = document.getElementById('gate');
  let savedScrollY = 0;

  function lockScroll() {
    savedScrollY = window.scrollY || window.pageYOffset;
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

  // Lock on load
  lockScroll();

  enterBtn.addEventListener('click', () => {
    unlockScroll();

    // scroll dulu
    hero.scrollIntoView({ behavior: 'smooth' });

    // baru fade out setelah delay
    if (gate) {
      setTimeout(() => {
        gate.classList.add('hidden');
        setTimeout(() => gate.remove(), 600); // hapus setelah animasi selesai
      }, 800); // tunggu scroll selesai dulu (atur sesuai kebutuhan)
    }
  });
});


      // param
      // Ambil parameter dari URL
      const urlParams = new URLSearchParams(window.location.search);
      const nama = urlParams.get('to'); // baca nilai ?to=
  
      // Kalau ada nama → tampilkan di <h3>
      if (nama) {
        document.getElementById("penerima").innerText = nama;
      }
    
    //ganti bg
  const images = [
    "./img/galery/ft1.jpg",
    "./img/galery/ft2.jpg",
    "./img/galery/ft3.jpg",
    "./img/galery/ft4.jpg",
    "./img/galery/ft5.jpg",
    "./img/galery/ft6.jpg"
  ];

  // preload biar nggak kedip putih saat ganti
  images.forEach(src => { const i = new Image(); i.src = src; });

  const bgA = document.getElementById("bgA");
  const bgB = document.getElementById("bgB");

  let showingA = true;   // layer mana yang sedang kelihatan
  let index = 1;         // next image index (kita tampilkan ft1 dulu di A)

  // set foto awal
  bgA.style.backgroundImage = `url('${images[0]}')`;
  bgB.style.backgroundImage = `url('${images[1 % images.length]}')`;

  function crossfade() {
    const nextUrl = images[index % images.length];
    const fadeIn = showingA ? bgB : bgA;
    const fadeOut = showingA ? bgA : bgB;

    // siapkan gambar berikutnya di layer yang akan fade-in
    fadeIn.style.backgroundImage = `url('${nextUrl}')`;

    // lakukan crossfade
    fadeOut.classList.remove("opacity-100");
    fadeOut.classList.add("opacity-0");
    fadeIn.classList.remove("opacity-0");
    fadeIn.classList.add("opacity-100");

    // toggle state
    showingA = !showingA;
    index++;
  }

  // mulai slideshow
  setInterval(crossfade, 3000); // ganti tiap 5 detik
  
  // Set target tanggal
  const targetDate = new Date("Dec 14, 2025 08:00:00").getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      // Kalau sudah lewat tanggal
      document.getElementById("countdown").innerHTML = "<p class='text-lg font-semibold'>The Wedding Has Started 🎉</p>";
      return;
    }

    // Hitung waktu
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update ke elemen HTML
    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
  }

  // Panggil pertama kali
  updateCountdown();

  // Update tiap 1 detik
  setInterval(updateCountdown, 1000);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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

        observer.unobserve(el); // Stop observe biar ga diulang
      }
    });
  });

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  
  // Swiper init
  function initGallerySwiper() {
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
  }

  // Load Section + Animasi + Gallery
  function loadSection(id, url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Gagal load " + url);
        return response.text();
      })
      .then((data) => {
        const container = document.getElementById(id);
        container.innerHTML = data;

        // 🔹 Re-init observer animasi
        container.querySelectorAll(".reveal").forEach((el) => {
          observer.observe(el);
        });

        // 🔹 Khusus gallery → init swiper
        if (id === "gallery") {
          initGallerySwiper();
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  // 🔹 Call semua section
  loadSection("mempelai", "./mempelai.html");
  loadSection("acara", "./acara.html");
  loadSection("story", "./story.html");
  loadSection("gallery", "./gallery.html");
  loadSection("qoutes", "./qoutes.html");
  loadSection("closing", "./closing.html");
  loadSection("footer", "./footer.html");
  loadSection("amplop", "./amplop.html");
  loadSection("navbar", "./navbar.html");
  
  // copyy
  document.addEventListener("click", (e) => {
  if (e.target.classList.contains("copy-btn")) {
    const norek = e.target.getAttribute("data-norek");
    navigator.clipboard.writeText(norek).then(() => {
      const toast = document.getElementById("toast");
      toast.classList.remove("opacity-0");
      toast.classList.add("opacity-100");

      setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");
      }, 2500);
    });
  }
});

//script musik dan autiscroll
    // Ambil elemen musik
const music = document.getElementById("bg-music");
const btnMusic = document.getElementById("btn-music");
const iconMusic = document.getElementById("icon-music");
const enterBtn = document.getElementById("enterBtn");

// Coba autoplay waktu load
window.addEventListener("load", () => {
  music.play().then(() => {
    console.log("Autoplay berhasil ✅");
  }).catch(err => {
    console.log("Autoplay diblokir ❌:", err);
    // kalau autoplay gagal, musik bakal mulai saat user klik gate
  });
});

// Event tombol gate (Buka Undangan)
enterBtn.addEventListener("click", () => {
  unlockScroll();
  hero.scrollIntoView({ behavior: "smooth" });

  // coba play musik kalau belum jalan
  if (music.paused) {
    music.play().then(() => {
      console.log("Musik mulai setelah klik gate ✅");
      iconMusic.className = "fa-solid fa-pause"; // update icon
    }).catch(err => {
      console.log("Play gagal setelah klik gate ❌:", err);
    });
  }
});


// Kontrol manual tombol musik
btnMusic.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    iconMusic.className = "fa-solid fa-pause";
    btnMusic.classList.add("playing"); // glow on
  } else {
    music.pause();
    iconMusic.className = "fa-solid fa-play";
    btnMusic.classList.remove("playing"); // glow off
  }
});
