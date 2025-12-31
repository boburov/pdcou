const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

/**
 * POST /api/page-count
 * body: form-data
 * key: pdf (file)
 */
app.post("/api/page-count", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: "PDF fayl yuborilmadi",
            });
        }

        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({
                error: "Faqat PDF fayl qabul qilinadi",
            });
        }

        const pdfBytes = req.file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pageCount = pdfDoc.getPageCount();

        return res.json({
            page_count: pageCount,
        });
    } catch (err) {
        return res.status(500).json({
            error: "PDF o‘qishda xatolik",
            message: err.message,
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 PDF Page Counter API ishlayapti: http://localhost:${PORT}`);
});
