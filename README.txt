سبحتي — إعداد الرسائل العامة

الموقع جاهز كملفات، لكن النشر للجميع يتطلب ربط Firebase بحسابك. لم أضع بيانات دخول أو مفاتيح خاصة.

1. افتح https://console.firebase.google.com وأنشئ مشروعًا.
2. Project settings > Your apps > Add app (Web). انسخ إعدادات التطبيق إلى firebase-config.js.
3. Authentication > Sign-in method: فعّل Email/Password.
4. Authentication > Users: أنشئ حسابك يدويًا من لوحة Firebase.
5. انسخ User UID لحسابك وضعه بدل PASTE_ADMIN_UID في firebase-config.js وfirestore.rules.
6. أنشئ Firestore Database. من Rules الصق محتوى firestore.rules بعد وضع UID الصحيح ثم Publish.
7. في Authentication > Settings > Authorized domains أضف نطاق استضافتك.
8. ارفع index.html وstyle.css وapp.js وadmin.html وadmin.js وfirebase-config.js إلى استضافة HTTPS مثل GitHub Pages أو Netlify.
9. افتح موقعك ثم /admin.html. سجّل الدخول واكتب الرسالة واضغط نشر الرسالة للجميع.

الأمان:
- الزوار يستطيعون قراءة الرسالة فقط.
- حساب UID المحدد فقط يستطيع النشر أو التعديل أو الحذف.
- لا تسمح بإنشاء حسابات عامة للمشرفين.
- لا تضع كلمة مرور أو Service Account key في ملفات الموقع.
- Firebase Web config يظهر في تطبيق الويب بطبيعته؛ الحماية الحقيقية في Authentication وقواعد Firestore.
- الرسالة عامة؛ لا تكتب بيانات شخصية أو سرية.
- عداد السبحة محفوظ محليًا في متصفح كل زائر.

بدون إكمال إعداد Firebase ستظل السبحة تعمل وستظهر رسالة ترحيبية ثابتة.
