import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";
import Groq from "groq-sdk";

dotenv.config();

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer();

/* ---------- Groq client ---------- */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* Health check */
app.get("/", (req, res) => {
  res.send("FitScore backend is running");
});

/* Resume upload + AI analysis (Groq LLM) */
app.post("/upload-analyze", upload.single("resume"), async (req, res) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file || !jobDescription) {
      return res
        .status(400)
        .json({ error: "Missing resume file or job description" });
    }

    /* ---------- Resume preprocessing ---------- */
    let resumeText = "";

    if (file.mimetype === "application/pdf") {
      const data = await pdfParse(file.buffer);
      resumeText = data.text;
    } else if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = data.value;
    } else if (file.mimetype === "text/plain") {
      resumeText = file.buffer.toString("utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    /* ---------- LLM prompt (resume coach style) ---------- */
    const prompt = `
You are a professional resume coach and ATS expert.

Analyze the resume against the job description and provide:

1. Overall fit score out of 100
2. Key strengths aligned with the job description
3. Missing or weak areas
4. Section-wise improvement suggestions (Experience, Projects, Skills)
5. Rewrite 2–3 example resume bullets with metrics and impact
   (e.g. "Reduced latency by 20%", "Improved uptime to 99.9%")

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    /* ---------- Groq LLM call ---------- */
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 700,
    });

    const aiOutput =
      completion.choices?.[0]?.message?.content ||
      "AI did not return a valid response.";

    return res.json({ analysis: aiOutput });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Resume processing or AI analysis failed" });
  }
});

/* Server start */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`FitScore backend running on port ${PORT}`);
});
