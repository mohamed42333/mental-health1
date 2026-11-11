
const $ = id => document.getElementById(id);
const key = "sob7aty-state-v1";

let count = 0, goal = 33, dhikr = "سبحان الله", timer;

try {
  const s = JSON.parse(localStorage.getItem(key) || "null");
  if (s && Number.isSafeInteger(s.count) && s.count >= 0 && s.count <= 1e7) count = s.count;
  if (s && [33, 99, 100, 1000].includes(s.goal)) goal = s.goal;
  if (s && ["سبحان الله", "الحمد لله", "الله أكبر", "أستغفر الله", "لا إله إلا الله"].includes(s.dhikr)) dhikr = s.dhikr;
} catch {}

function save() {
  try { localStorage.setItem(key, JSON.stringify({count, goal, dhikr})); } catch {}
}

function render() {
  $("count").textContent = count;
  $("currentDhikr").textContent = dhikr;
  $("goalSelect").value = goal;
  $("progressText").textContent = `${count} / ${goal}`;
  $("progressFill").style.width = Math.min(100, count / goal * 100) + "%";
  document.querySelectorAll("[data-dhikr]").forEach(b =>
    b.classList.toggle("active", b.dataset.dhikr === dhikr)
  );
}

function toast(t) {
  $("toast").textContent = t;
  $("toast").classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => $("toast").classList.remove("show"), 1600);
}

$("tasbeehButton").onclick = () => {
  if (count < 1e7) count++;
  render(); save();
  if (count === goal) toast("ما شاء الله! وصلت لهدفك 🌿");
};

$("resetButton").onclick = () => {
  if (confirm("هل تريد تصفير العداد؟")) {
    count = 0; render(); save(); toast("تم تصفير العداد");
  }
};

$("goalSelect").onchange = () => {
  goal = Number($("goalSelect").value); render(); save();
};

$("dhikrGrid").onclick = e => {
  const b = e.target.closest("[data-dhikr]");
  if (b) { dhikr = b.dataset.dhikr; render(); save(); }
};

$("year").textContent = new Date().getFullYear();
render();

// قراءة الرسالة المنشورة من Google Sheets
async function loadMessage() {
  try {
    const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT0qjDOq-MWb0VGBZTwnS9L-9d6TjYheZlQpIhASKy2HtkKZ9jbXBzbsmNHxx-7znOqJ2nb2yi9z7TK/pub?output=csv";
    const response = await fetch(url);
    if (!response.ok) throw new Error("تعذر تحميل الجدول");

    const csv = await response.text();
    const rows = csv.trim().split(/\r?\n/);
    const lastRow = rows[rows.length - 1];

    const message = lastRow.replace(/^"|"$/g, "").replace(/""/g, '"').trim();

    if (message) {
      $("publicMessage").textContent = message.slice(0, 240);
      $("messageStatus").textContent = "رسالة منشورة من المصمم";
    }
  } catch {
    $("messageStatus").textContent = "تعذر تحديث الرسالة حاليًا";
  }
}

loadMessage();
setInterval(loadMessage, 60000);
