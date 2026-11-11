import {initializeApp} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getFirestore,doc,onSnapshot} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {firebaseConfig,FIREBASE_CONFIGURED} from "./firebase-config.js";
const $=id=>document.getElementById(id),key="sob7aty-state-v1";let count=0,goal=33,dhikr="سبحان الله",timer;
try{const s=JSON.parse(localStorage.getItem(key)||"null");if(s&&Number.isSafeInteger(s.count)&&s.count>=0&&s.count<=1e7)count=s.count;if(s&&[33,99,100,1000].includes(s.goal))goal=s.goal;if(s&&["سبحان الله","الحمد لله","الله أكبر","أستغفر الله","لا إله إلا الله"].includes(s.dhikr))dhikr=s.dhikr}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify({count,goal,dhikr}))}catch{}}
function render(){$("count").textContent=count;$("currentDhikr").textContent=dhikr;$("goalSelect").value=goal;$("progressText").textContent=`${count} / ${goal}`;$("progressFill").style.width=Math.min(100,count/goal*100)+"%";document.querySelectorAll("[data-dhikr]").forEach(b=>b.classList.toggle("active",b.dataset.dhikr===dhikr))}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");clearTimeout(timer);timer=setTimeout(()=>$("toast").classList.remove("show"),1600)}
$("tasbeehButton").onclick=()=>{if(count<1e7)count++;render();save();if(count===goal)toast("ما شاء الله! وصلت لهدفك 🌿")};
$("resetButton").onclick=()=>{if(confirm("هل تريد تصفير العداد؟")){count=0;render();save();toast("تم تصفير العداد")}};
$("goalSelect").onchange=()=>{goal=Number($("goalSelect").value);render();save()};
$("dhikrGrid").onclick=e=>{const b=e.target.closest("[data-dhikr]");if(b){dhikr=b.dataset.dhikr;render();save()}};
$("year").textContent=new Date().getFullYear();render();
if(FIREBASE_CONFIGURED){try{const db=getFirestore(initializeApp(firebaseConfig));onSnapshot(doc(db,"siteMessages","current"),s=>{if(s.exists()&&typeof s.data().text==="string"&&s.data().text.trim()){$("publicMessage").textContent=s.data().text.trim().slice(0,240);$("messageStatus").textContent="رسالة منشورة من المصمم"}} ,()=>{$("messageStatus").textContent="تعذر تحديث الرسالة حاليًا"})}catch{}}
