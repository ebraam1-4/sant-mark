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

  /* ─── خادم (المدرسين) ─── */
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
        
        // ربط عدادات الحضور والغياب الجديدة
        sessionStorage.setItem("studentAttendance", userData.presence !== undefined ? userData.presence : 0);
        sessionStorage.setItem("studentAbsence",    userData.absence  !== undefined ? userData.absence  : 0);
        
        // 🎯 إضافة المواد التفصيلية الجديدة جوه الـ sessionStorage بناءً على طلبك
        if (userData.grades !== undefined) {
          sessionStorage.setItem("studentGrades",         userData.grades.total       !== undefined ? userData.grades.total : 0);
          sessionStorage.setItem("studentBibleGrade",     userData.grades.bible_sheet !== undefined ? userData.grades.bible_sheet : 0);
          sessionStorage.setItem("studentAl7anGrade",     userData.grades.al7an       !== undefined ? userData.grades.al7an : 0);
          sessionStorage.setItem("studentPracticesGrade", userData.grades.practices   !== undefined ? userData.grades.practices : 0);
          sessionStorage.setItem("studentCopticGrade",    userData.grades.coptic      !== undefined ? userData.grades.coptic : 0);
          sessionStorage.setItem("studentLecturesGrade",  userData.grades.lectures    !== undefined ? userData.grades.lectures : 0);
        } else {
          // تصفير احتياطي لو البيانات لسه مفيهاش درجات
          sessionStorage.setItem("studentGrades", 0);
          sessionStorage.setItem("studentBibleGrade", 0);
          sessionStorage.setItem("studentAl7anGrade", 0);
          sessionStorage.setItem("studentPracticesGrade", 0);
          sessionStorage.setItem("studentCopticGrade", 0);
          sessionStorage.setItem("studentLecturesGrade", 0);
        }

        window.location.href = "index.html";
      } else {
        errorTxt.textContent = "هذا الاسم غير موجود في هذه المجموعة!";
        errorTxt.style.display = "block";
      }
    }).catch((err) => console.error("خطأ في جلب بيانات الطالب:", err));
  }
}