const express = require("express");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

app.use(express.json({ limit: "5kb" }));

app.use("/api/contact", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5
}));

app.post("/api/contact", async (req, res) => {
    try {
        const { name, phone, message } = req.body;

        if (
            typeof name !== "string" ||
            typeof phone !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            name.length > 100 ||
            message.length > 1000 ||
            !/^[0-9+ ]{8,15}$/.test(phone)
        ) {
            return res.status(400).json({ error: "بيانات غير صحيحة" });
        }

        const text =
            "📩 طلب تواصل جديد\n\n" +
            "👤 الاسم: " + name.trim() + "\n" +
            "📱 الهاتف: " + phone.trim() + "\n" +
            "📝 الملاحظة: " + (message.trim() || "لا توجد");

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text
                })
            }
        );

        if (!response.ok) {
            return res.status(502).json({ error: "فشل إرسال الرسالة" });
        }

        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ error: "حدث خطأ" });
    }
});

app.listen(process.env.PORT || 3000);
