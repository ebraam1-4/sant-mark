const firebaseConfig = {
  apiKey: "AIzaSyDcfiHqsjFIf6ECVfh_M9Lij0aDVVe8Ho8",
  authDomain: "school-989d1.firebaseapp.com",
  databaseURL: "https://school-989d1-default-rtdb.firebaseio.com",
  projectId: "school-989d1",
  storageBucket: "school-989d1.firebasestorage.app",
  messagingSenderId: "217947078105",
  appId: "1:217947078105:web:5abaec6b22344523fd2dc8",
  measurementId: "G-R0TSR9VR3L"
};
// تشغيل Firebase في الموقع
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function checkLogin() {
    const userInp = document.getElementById('username').value.trim().toLowerCase();
    const passInp = document.getElementById('password').value;
    const errorTxt = document.getElementById('errorMsg');

    if (userInp === "" || passInp === "") {
        errorTxt.textContent = "برجاء كتابة الاسم والباسورد!";
        errorTxt.style.display = "block";
        return;
    }

    // بندخل الداتا بيز ندور جوه الـ users على الاسم المكتوب
    database.ref('users/' + userInp).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const correctPassword = snapshot.val(); // الباصورد الصح اللي متخزن عندك
            
            if (passInp == correctPassword) {
                // لو صح، بنعلم في ذاكرة الجلسة إنه تمام ومسموح له بالدخول
                // استخدم sessionStorage عشان مايتذكرش الدخول بين جلسات المتصفح
                sessionStorage.setItem('isLoggedIn', 'true');
                
                // بنقله لصفحة المدرسة الرئيسية (تأكد إن اسمها index.html عندك)
                window.location.href = "index.html"; 
            } else {
                errorTxt.textContent = "الباصورد غير صحيح!";
                errorTxt.style.display = "block";
            }
        } else {
            errorTxt.textContent = "هذا الحساب غير مسجل في نظام المدرسة!";
            errorTxt.style.display = "block";
        }
    }).catch((error) => {
        console.error("خطأ في الاتصال بالداتا بيز:", error);
    });
}