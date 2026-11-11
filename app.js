
const $ = id => document.getElementById(id);

const key = "sob7aty-state-v1";

let count = 0;
let goal = 33;
let dhikr = "سبحان الله";
let timer;

// استرجاع بيانات السبحة
try {
  const s = JSON.parse(localStorage.getItem(key) || "null");

  if (s && Number.isSafeInteger(s.count) && s.count >= 0 && s.count <= 1e7) {
    count = s.count;
  }

  if (s && [33, 99, 100, 1000].includes(s.goal)) {
    goal = s.goal;
  }

  if (
    s &&
    ["سبحان الله", "الحمد لله", "الله أكبر", "أستغفر الله", "لا إله إلا الله"].includes(s.dhikr)
  ) {
    dhikr = s.dhikr;
  }
} catch {}

// حفظ البيانات
function save() {
  try {
    localStorage.setItem(key, JSON.stringify({
      count,
      goal,
      dhikr
    }));
  } catch {}
}

// تحديث الواجهة
function render() {
  $("count").textContent = count;
  $("currentDhikr").textContent = dhikr;
  $("goalSelect").value = goal;
  $("progressText").textContent = `${count} / ${goal}`;

  $("progressFill").style.width =
    Math.min(100, (count / goal) * 100) + "%";

  document.querySelectorAll("[data-dhikr]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.dhikr === dhikr
    );
  });
}

// الإشعارات
function toast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");

  clearTimeout(timer);

  timer = setTimeout(() => {
    $("toast").classList.remove("show");
  }, 1600);
}

// زر التسبيح
$("tasbeehButton").onclick = () => {
  if (count < 1e7) count++;

  render();
  save();

  if (count === goal) {
    toast("ما شاء الله! وصلت لهدفك 🌿");
  }
};

// تصفير العداد
$("resetButton").onclick = () => {
  if (confirm("هل تريد تصفير العداد؟")) {
    count = 0;
    render();
    save();
    toast("تم تصفير العداد");
  }
};

// اختيار الهدف
$("goalSelect").onchange = () => {
  goal = Number($("goalSelect").value);
  render();
  save();
};

// اختيار الذكر
$("dhikrGrid").onclick = event => {
  const button = event.target.closest("[data-dhikr]");

  if (button) {
    dhikr = button.dataset.dhikr;
    render();
    save();
  }
};

// السنة الحالية
$("year").textContent = new Date().getFullYear();

render();

// ===================================
// الرسالة العامة من Google Sheets
// ===================================

async function loadMessage() {
  const messageElement = $("publicMessage");
  const statusElement = $("messageStatus");

  if (!messageElement || !statusElement) return;

  const url =
    "https://docs.google.com/spreadsheets/d/1q5THzJM4frfUiHffdvam1CGvcwGiXXaDX7micYwB43Q/gviz/tq?tqx=out:csv&sheet=Sheet1&range=A1";

  try {
    const response = await fetch(url + "&cache=" + Date.now());

    if (!response.ok) {
      throw new Error("Google Sheets error: " + response.status);
    }

    const csv = await response.text();

    let message = csv.trim();

    // استخراج النص من CSV
    if (message.startsWith('"') && message.endsWith('"')) {
      message = message.slice(1, -1).replace(/""/g, '"');
    }

    message = message.trim();

    if (!message) {
      statusElement.textContent = "لا توجد رسالة منشورة";
      return;
    }

    messageElement.textContent = message.slice(0, 240);
    statusElement.textContent = "رسالة منشورة من المصمم";

  } catch (error) {
    console.error("Google Sheets Error:", error);
    statusElement.textContent = "تعذر تحديث الرسالة حاليًا";
  }
}

// تحميل الرسالة عند فتح الموقع
loadMessage();

// تحديث كل 20 ثانية
setInterval(loadMessage, 20000);
