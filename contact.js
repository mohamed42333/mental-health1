
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwQUuWUZPOFxUmv02SIuFito3UQ7pBT6UKfFgXbgsDgfsBhBuZCLHIcIAD-ezJEWydL/exec";

const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const note = form.querySelector('[name="note"]').value.trim();

    const imageInput = document.getElementById("myFile");
    const image = imageInput ? imageInput.files[0] : null;

    if (!name || !phone) {
      alert("من فضلك اكتب الاسم ورقم الهاتف");
      return;
    }

    if (image && !image.type.startsWith("image/")) {
      alert("من فضلك اختر صورة صحيحة");
      return;
    }

    if (image && image.size > 5 * 1024 * 1024) {
      alert("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    const submitButton = form.querySelector('[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "جاري الإرسال...";
    }

    try {
      let imageData = "";

      if (image) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const data = new URLSearchParams({
        name: name,
        phone: phone,
        note: note,
        imageData: imageData,
        imageName: image ? image.name : ""
      });

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: data
      });

      alert("تم إرسال طلبك بنجاح، شكرًا لتواصلك معنا!");
      form.reset();

      const preview = document.getElementById("previewImage");
      const fileName = document.getElementById("fileName");

      if (preview) {
        preview.src = "";
        preview.style.display = "none";
      }

      if (fileName) {
        fileName.textContent = "";
      }

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
