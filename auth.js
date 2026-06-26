const firebaseConfig = {
  apiKey: "AIzaSyDcfiHqsjFIf6ECVfh_M9Lij0aDVVe8Ho8",
  authDomain: "school-989d1.firebaseapp.com",
  databaseURL: "https://school-989d1-default-rtdb.firebaseio.com",
  projectId: "school-989d1",
  storageBucket: "school-989d1.firebasestorage.app",
  messagingSenderId: "217947078105",
  appId: "1:217947078105:web:5abaec6b22344523fd2dc8",
  measurementId: "G-R0TSR9VR3L",
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function checkLogin() {
  const groupInp = document.getElementById("groupSelect").value.trim();
  const userInp  = document.getElementById("username").value.trim();
  const passInp  = document.getElementById("password").value;
  const errorTxt = document.getElementById("errorMsg");

  errorTxt.style.display = "none";

  if (userInp === "") {
    errorTxt.textContent = "برجاء كتابة الإسم!";
    errorTxt.style.display = "block";
    return;
  }

  /* ─── خادم ─── */
  if (groupInp === "teachers") {
    if (passInp === "") {
      errorTxt.textContent = "برجاء كتابة الباسورد الخاص بالمعلم!";
      errorTxt.style.display = "block";
      return;
    }
    database.ref("teachers/" + userInp).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        const teacherData = snapshot.val();
        if (String(passInp) === String(teacherData.password)) {
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("role", "teacher");
          sessionStorage.setItem("teacherName", userInp);
          window.location.href = "index.html";
        } else {
          errorTxt.textContent = "الباصورد غير صحيح!";
          errorTxt.style.display = "block";
        }
      } else {
        errorTxt.textContent = "هذا الاسم غير مسجل في هيئة التدريس!";
        errorTxt.style.display = "block";
      }
    }).catch((err) => console.error("خطأ في جلب بيانات المعلم:", err));

  /* ─── تلميذ ─── */
  } else {
    database.ref("groups/" + groupInp + "/" + userInp).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", "student");
        sessionStorage.setItem("studentName", userInp);
        sessionStorage.setItem("studentGroup", groupInp);
        sessionStorage.setItem("studentGrades",     userData.grades     !== undefined ? userData.grades     : "");
        sessionStorage.setItem("studentAttendance", userData.attendance !== undefined ? userData.attendance : 0);
        sessionStorage.setItem("studentAbsence",    userData.absence    !== undefined ? userData.absence    : 0);
        window.location.href = "index.html";
      } else {
        errorTxt.textContent = "هذا الاسم غير موجود في هذه المجموعة!";
        errorTxt.style.display = "block";
      }
    }).catch((err) => console.error("خطأ في جلب بيانات الطالب:", err));
  }
}
