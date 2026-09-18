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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

/* بترجّع قايمة المجموعات اللي الخادم مسموح له بيها */
function getAllowedGroups(teacherData) {
  const list = [];
  const collect = (val) => {
    if (val === undefined || val === null) return;
    if (typeof val === "string") {
      if (val.trim() !== "") list.push(val.trim());
    } else if (Array.isArray(val)) {
      val.forEach(collect);
    } else if (typeof val === "object") {
      Object.keys(val).forEach((k) => {
        if (typeof val[k] === "string") list.push(val[k].trim()); // { "0": "اسم المجموعة" }
        else if (val[k]) list.push(k.trim());                     // { "اسم المجموعة": true }
      });
    }
  };
  collect(teacherData.group);
  collect(teacherData.groups);
  return list;
}

function checkLogin() {
  const groupInp = document.getElementById("groupSelect").value.trim();
  const userInp  = document.getElementById("username").value.trim();
  const passInp  = document.getElementById("password").value.trim();
  const errorTxt = document.getElementById("errorMsg");

  errorTxt.style.display = "none";
  errorTxt.style.color = "#f09595";

  if (userInp === "") {
    errorTxt.textContent = "برجاء كتابة الإسم!";
    errorTxt.style.display = "block";
    return;
  }

  /* ─── خادم (المدرسين) ─── */
  if (groupInp === "teachers") {
    const teacherGroupEl = document.getElementById("teacherGroupSelect");
    const teacherGroup = teacherGroupEl ? teacherGroupEl.value.trim() : "";

    if (teacherGroup === "") {
      errorTxt.textContent = "برجاء اختيار مجموعتك!";
      errorTxt.style.display = "block";
      return;
    }

    if (passInp === "") {
      errorTxt.textContent = "برجاء كتابة الباسورد الخاص بالمعلم!";
      errorTxt.style.display = "block";
      return;
    }

    database.ref("teachers/" + userInp).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        const teacherData = snapshot.val();

        const inputPassword = String(passInp).trim();
        const dbPassword = String(teacherData.password).trim();

        if (inputPassword !== dbPassword) {
          errorTxt.textContent = "الباسورد غلط! برجاء المحاولة تاني";
          errorTxt.style.display = "block";
          return;
        }

        /* المجموعات المسموح بيها للخادم ده (لو متسجلة في الفايربيز).
           بيقبل: group: "اسم"  أو  groups: ["اسم1","اسم2"]  أو  groups: { "اسم1": true } */
        const allowedGroups = getAllowedGroups(teacherData);

        if (allowedGroups.length > 0 && allowedGroups.indexOf(teacherGroup) === -1) {
          errorTxt.textContent = `حضرتك مش مسجل خادم في مجموعة (${teacherGroup})`;
          errorTxt.style.display = "block";
          return;
        }

        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", "teacher");
        sessionStorage.setItem("teacherName", userInp);
        sessionStorage.setItem("teacherGroup", teacherGroup);
        window.location.href = "index.html";
      } else {
        errorTxt.textContent = `الاسم (${userInp}) مش موجود في فرع الخدام بالفايربيز. اتأكد من المسافات والهمزات!`;
        errorTxt.style.display = "block";
      }
    }).catch((err) => {
      errorTxt.textContent = "خطأ من الفايربيز: " + err.message;
      errorTxt.style.display = "block";
    });

  /* ─── تلميذ ─── */
  } else {
    database.ref("groups/" + groupInp + "/" + userInp).once("value").then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("role", "student");
        sessionStorage.setItem("studentName", userInp);
        sessionStorage.setItem("studentGroup", groupInp);
        
        sessionStorage.setItem("studentAttendance", userData.presence !== undefined ? userData.presence : 0);
        sessionStorage.setItem("studentAbsence",    userData.absence  !== undefined ? userData.absence  : 0);
        sessionStorage.setItem("studentCode",       userData.code     !== undefined ? userData.code     : "");
        
        if (userData.grades !== undefined) {
          sessionStorage.setItem("studentGrades",         userData.grades.total       !== undefined ? userData.grades.total : 0);
          sessionStorage.setItem("studentBibleGrade",     userData.grades.bible_sheet !== undefined ? userData.grades.bible_sheet : 0);
          sessionStorage.setItem("studentAl7anGrade",     userData.grades.al7an       !== undefined ? userData.grades.al7an : 0);
          sessionStorage.setItem("studentPracticesGrade", userData.grades.practices   !== undefined ? userData.grades.practices : 0);
          sessionStorage.setItem("studentCopticGrade",    userData.grades.coptic      !== undefined ? userData.grades.coptic : 0);
          sessionStorage.setItem("studentLecturesGrade",  userData.grades.lectures    !== undefined ? userData.grades.lectures : 0);
        } else {
          sessionStorage.setItem("studentGrades", 0);
          sessionStorage.setItem("studentBibleGrade", 0);
          sessionStorage.setItem("studentAl7anGrade", 0);
          sessionStorage.setItem("studentPracticesGrade", 0);
          sessionStorage.setItem("studentCopticGrade", 0);
          sessionStorage.setItem("studentLecturesGrade", 0);
        }

        window.location.href = "index.html";
      } else {
        errorTxt.textContent = `الاسم ده مش جوه مجموعة (${groupInp})`;
        errorTxt.style.display = "block";
      }
    }).catch((err) => {
      errorTxt.textContent = "خطأ طالب: " + err.message;
      errorTxt.style.display = "block";
    });
  }
}