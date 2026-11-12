
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQUuWUZPOFxUmv02SIuFito3UQ7pBT6UKfFgXbgsDgfsBhBuZCLHIcIAD-ezJEWydL/exec";

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const note = form.querySelector('[name="note"]').value.trim();

    if (!name || !phone) {
      alert("من فضلك اكتب الاسم ورقم الهاتف");
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "جاري الإرسال...";
    }

    const data = new URLSearchParams({
      name: name,
      phone: phone,
      note: note
    });

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      alert("تم إرسال طلبك بنجاح، شكرًا لتواصلك معنا!");
      form.reset();

    } catch (error) {
      alert("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
      console.error(error);

    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "إرسال";
      }
    }
  });
}
