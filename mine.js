/* ════════════════════════════════════════════════════
   ✨ مدرسة مار مرقس — التأثيرات والأنيميشن
   ════════════════════════════════════════════════════ */

/* ── Scroll Reveal: عناصر تظهر عند التمرير ── */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    ".subject-card, .info-card, .intro, .page-hero, .year-selector, .psalm-card",
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  targets.forEach((el) => observer.observe(el));
}

/* ── Ripple Effect على الأزرار ── */
function initRipple() {
  document.querySelectorAll(".year-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;

      if (!document.querySelector("#ripple-style")) {
        const style = document.createElement("style");
        style.id = "ripple-style";
        style.textContent = `
          @keyframes rippleAnim {
            to { transform: scale(1); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ── Tilt Effect على الكروت (Desktop فقط) ── */
function initTilt() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll(".subject-card, .info-card").forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const tiltX = (-y * 8).toFixed(2);
      const tiltY = (x * 8).toFixed(2);
      this.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    });

    card.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.1s ease";
    });
  });
}

/* ── Typing Effect على الـ Subtitle ── */
function initTypingSubtitle() {
  const subtitle = document.querySelector(".subtitle");
  if (!subtitle) return;

  const text = subtitle.textContent.trim();
  subtitle.textContent = "";
  subtitle.style.opacity = "1";
  subtitle.style.borderRight = "2px solid rgba(212,175,55,0.7)";
  subtitle.style.whiteSpace = "nowrap";
  subtitle.style.overflow = "hidden";
  subtitle.style.display = "inline-block";

  let i = 0;
  const delay = 1200; // ابدأ بعد ظهور الهيدر

  setTimeout(() => {
    const interval = setInterval(() => {
      subtitle.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        // إزالة cursor بعد الانتهاء
        setTimeout(() => {
          subtitle.style.borderRight = "none";
        }, 1500);
      }
    }, 60);
  }, delay);
}

/* ── Gold Particle عند الـ Hover على Nav ── */
function initNavSparkles() {
  document.querySelectorAll(".nav-tab a").forEach((link) => {
    link.addEventListener("mouseenter", function (e) {
      for (let i = 0; i < 4; i++) {
        const spark = document.createElement("span");
        const rect = this.getBoundingClientRect();
        spark.style.cssText = `
          position: fixed;
          width: 4px; height: 4px;
          background: #d4af37;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          left: ${e.clientX + (Math.random() - 0.5) * 30}px;
          top:  ${e.clientY + (Math.random() - 0.5) * 20}px;
          animation: sparkFly 0.7s ease-out forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 700);
      }
    });
  });

  if (!document.querySelector("#spark-style")) {
    const style = document.createElement("style");
    style.id = "spark-style";
    style.textContent = `
      @keyframes sparkFly {
        0%   { transform: scale(1) translate(0, 0);   opacity: 1; }
        100% { transform: scale(0) translate(${Math.random() > 0.5 ? "+" : "-"}${Math.round(Math.random() * 20 + 10)}px, -${Math.round(Math.random() * 25 + 10)}px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ── تبديل الوضع الداكن / الفاتح */
function initThemeSwitcher() {
  const switcher = document.querySelector("#theme-switcher");
  const body = document.body;
  if (!switcher) return;

  const label = switcher.querySelector(".theme-switcher-label");
  const icon = switcher.querySelector(".theme-switcher-icon");

  const currentTheme = localStorage.getItem("mm-theme");
  const lightMode = currentTheme === "light";
  body.classList.toggle("light-theme", lightMode);

  function updateSwitcher() {
    const isLight = body.classList.contains("light-theme");
    label.textContent = isLight ? "الوضع الفاتح" : "الوضع الداكن";
    icon.textContent = isLight ? "☀️" : "🌙";
    switcher.style.background = isLight
      ? "rgba(15, 23, 30, 0.1)"
      : "rgba(255, 255, 255, 0.08)";
  }

  switcher.addEventListener("click", () => {
    const activeLight = !body.classList.contains("light-theme");
    body.classList.toggle("light-theme", activeLight);
    localStorage.setItem("mm-theme", activeLight ? "light" : "dark");
    updateSwitcher();
  });

  updateSwitcher();
}

/* ── Counter Animation للأرقام ── */
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count);
    let count = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count;
      if (count >= target) clearInterval(timer);
    }, 40);
  });
}

/* ── تشغيل كل التأثيرات عند جهوزية الصفحة ── */
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initRipple();
  initTilt();
  initTypingSubtitle();
  initNavSparkles();
  initThemeSwitcher();
});

/* ── حماية الصفحات: لو مش مسجل دخول، ارجع على login ── */
(function guardPage() {
  // login.html مش محتاجة حماية
  if (window.location.pathname.endsWith('login.html')) return;

  if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
  }
})();
