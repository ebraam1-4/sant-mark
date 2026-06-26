/* ════════════════════════════════════════════════════
   ✨ مدرسة مار مرقس — التأثيرات والأنيميشن
   ════════════════════════════════════════════════════ */

/* ── حماية الصفحات: يتشغل فوراً قبل أي حاجة ── */
(function guardPage() {
  if (window.location.pathname.endsWith("login.html")) return;
  if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
})();

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
          setTimeout(() => entry.target.classList.add("visible"), i * 80);
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
  if (!document.querySelector("#ripple-style")) {
    const style = document.createElement("style");
    style.id = "ripple-style";
    style.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
    document.head.appendChild(style);
  }

  document.querySelectorAll(".year-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px; top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.25); border-radius:50%;
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards; pointer-events:none;
      `;
      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ── Tilt على الكروت (ديسكتوب فقط) ── */
function initTilt() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll(".subject-card, .info-card").forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.style.transform = `translateY(-8px) perspective(600px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) scale(1.01)`;
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
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
  subtitle.style.cssText +=
    "opacity:1; border-right:2px solid rgba(212,175,55,0.7); white-space:nowrap; overflow:hidden; display:inline-block;";
  let i = 0;
  setTimeout(() => {
    const interval = setInterval(() => {
      subtitle.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => {
          subtitle.style.borderRight = "none";
        }, 1500);
      }
    }, 60);
  }, 1200);
}

/* ── Gold Sparkles على الـ Nav ── */
function initNavSparkles() {
  if (!document.querySelector("#spark-style")) {
    const style = document.createElement("style");
    style.id = "spark-style";
    style.textContent = `@keyframes sparkFly { 0%{transform:scale(1) translate(0,0);opacity:1} 100%{transform:scale(0) translate(15px,-20px);opacity:0} }`;
    document.head.appendChild(style);
  }
  document.querySelectorAll(".nav-tab a").forEach((link) => {
    link.addEventListener("mouseenter", function (e) {
      for (let i = 0; i < 4; i++) {
        const spark = document.createElement("span");
        spark.style.cssText = `
          position:fixed; width:4px; height:4px; background:#d4af37; border-radius:50%;
          pointer-events:none; z-index:9999;
          left:${e.clientX + (Math.random() - 0.5) * 30}px;
          top:${e.clientY + (Math.random() - 0.5) * 20}px;
          animation:sparkFly 0.7s ease-out forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 700);
      }
    });
  });
}

/* ── تبديل الوضع الداكن / الفاتح ── */
function initThemeSwitcher() {
  const switcher = document.querySelector("#theme-switcher");
  if (!switcher) return;
  const label = switcher.querySelector(".theme-switcher-label");
  const icon = switcher.querySelector(".theme-switcher-icon");
  const body = document.body;

  body.classList.toggle(
    "light-theme",
    localStorage.getItem("mm-theme") === "light",
  );

  function updateSwitcher() {
    const isLight = body.classList.contains("light-theme");
    label.textContent = isLight ? "الوضع الفاتح" : "الوضع الداكن";
    icon.textContent = isLight ? "☀️" : "🌙";
    switcher.style.background = isLight
      ? "rgba(15,23,30,0.1)"
      : "rgba(255,255,255,0.08)";
  }

  switcher.addEventListener("click", () => {
    const activeLight = !body.classList.contains("light-theme");
    body.classList.toggle("light-theme", activeLight);
    localStorage.setItem("mm-theme", activeLight ? "light" : "dark");
    updateSwitcher();
  });
  updateSwitcher();
}

/* ── إضافة تبويب الـ Nav حسب الدور ── */
function createNavTab(id, href, title) {
  const existing = document.getElementById(id);
  if (existing) {
    const link = existing.querySelector("a");
    if (link) {
      link.href = href;
      link.textContent = title;
    }
    return existing;
  }
  const navTabs = document.querySelector(".nav-tabs");
  if (!navTabs) return null;
  const item = document.createElement("li");
  item.className = "nav-tab";
  item.id = id;
  const link = document.createElement("a");
  link.href = href;
  link.textContent = title;
  item.appendChild(link);
  navTabs.appendChild(item);
  return item;
}

function updateRoleNavItem() {
  const role = sessionStorage.getItem("role");
  const teacherTab = document.getElementById("teacherTab");
  const teacherControlTab = document.getElementById("teacherControlTab");
  const studentTab = document.getElementById("studentTab");

  if (role === "teacher") {
    if (studentTab) studentTab.style.display = "none";
    const tab = createNavTab("teacherTab", "scanner.html", "📸 تسجيل الطلاب");
    if (tab) tab.style.display = "";
    const controlTab = createNavTab(
      "teacherControlTab",
      "teacher.html",
      "🔒 قفل الحضور",
    );
    if (controlTab) controlTab.style.display = "";
  } else if (role === "student") {
    if (teacherTab) teacherTab.style.display = "none";
    if (teacherControlTab) teacherControlTab.style.display = "none";
    const tab = createNavTab("studentTab", "card.html", "📊 درجاتي وغيابي");
    if (tab) tab.style.display = "";
  } else {
    if (teacherTab) teacherTab.style.display = "none";
    if (teacherControlTab) teacherControlTab.style.display = "none";
    if (studentTab) studentTab.style.display = "none";
  }
}

/* ── تشغيل كل الحاجات عند تحميل الصفحة ── */
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initRipple();
  initTilt();
  initTypingSubtitle();
  initNavSparkles();
  initThemeSwitcher();
  updateRoleNavItem();
});
// 1. تحديد كل عناصر الصوت أو أزرار التشغيل في الصفحة
// (قم بتغيير الكلاس '.audio-element' للكلاس الخاص بعناصر الصوت عندك)
const allAudios = document.querySelectorAll(".audio-element");

allAudios.forEach((currentAudio) => {
  // الاستماع لحدث بدء التشغيل (play) على كل عنصر صوت
  currentAudio.addEventListener("play", () => {
    // الميزة المطلوبة: المرور على باقي الأصوات وإيقافها
    allAudios.forEach((otherAudio) => {
      if (otherAudio !== currentAudio) {
        otherAudio.pause(); // إيقاف الصوت الآخر
        otherAudio.currentTime = 0; // (اختياري) إرجاع الصوت القديم من البداية
      }
    });
  });
});
