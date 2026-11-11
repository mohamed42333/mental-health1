
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

import {
  firebaseConfig,
  ADMIN_UID,
  FIREBASE_CONFIGURED
} from "./firebase-config.js";

// إعداد Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// عناصر الصفحة
const $ = id => document.getElementById(id);

const loginForm = $("loginForm");
const adminPanel = $("adminPanel");
const status = $("status");

// عرض الرسائل
function showStatus(message) {
  if (status) status.textContent = message;
}

// التحقق من المدير
function isAdmin(user) {
  return user && ADMIN_UID !== "PASTE_ADMIN_UID"
    && user.uid === ADMIN_UID;
}

// تسجيل الدخول
loginForm?.addEventListener("submit", async e => {
  e.preventDefault();

  if (!FIREBASE_CONFIGURED) {
    showStatus("أكمل إعداد Firebase وADMIN_UID أولاً");
    return;
  }

  const email = $("adminEmail")?.value.trim();
  const password = $("adminPassword")?.value;

  try {
    showStatus("جارٍ تسجيل الدخول...");

    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!isAdmin(result.user)) {
      await signOut(auth);
      showStatus("غير مسموح لك بدخول لوحة التحكم");
      return;
    }

    loginForm.hidden = true;
    if (adminPanel) adminPanel.hidden = false;

    showStatus("تم تسجيل الدخول بنجاح");
  } catch (error) {
    showStatus("فشل تسجيل الدخول: تأكد من البيانات");
  }
});

// نشر رسالة عامة
$("publishButton")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  const message = $("messageInput")?.value.trim();

  if (!isAdmin(user)) {
    showStatus("غير مصرح لك بالنشر");
    return;
  }

  if (!message || message.length > 240) {
    showStatus("اكتب رسالة من 1 إلى 240 حرفًا");
    return;
  }

  try {
    await setDoc(doc(db, "siteMessages", "current"), {
      text: message,
      sender: "محمد",
      uid: user.uid,
      updatedAt: serverTimestamp()
    });

    $("messageInput").value = "";
    showStatus("تم نشر الرسالة بنجاح");
  } catch (error) {
    showStatus("تعذر نشر الرسالة، راجع صلاحيات Firestore");
  }
});

// حذف الرسالة
$("deleteButton")?.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!isAdmin(user)) {
    showStatus("غير مصرح لك بالحذف");
    return;
  }

  if (!confirm("هل تريد حذف الرسالة المنشورة؟")) return;

  try {
    await deleteDoc(doc(db, "siteMessages", "current"));
    showStatus("تم حذف الرسالة");
  } catch (error) {
    showStatus("تعذر حذف الرسالة");
  }
});

// تسجيل الخروج
$("logoutButton")?.addEventListener("click", async () => {
  await signOut(auth);

  if (loginForm) loginForm.hidden = false;
  if (adminPanel) adminPanel.hidden = true;

  showStatus("تم تسجيل الخروج");
});

// إخفاء لوحة التحكم في البداية
if (adminPanel) adminPanel.hidden = true;
