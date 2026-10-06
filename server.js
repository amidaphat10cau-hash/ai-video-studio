import express from "express";
import multer from "multer";
import RunwayML from "@runwayml/sdk";

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(express.json({ limit: "2mb" }));

const client = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET });

app.get("/", (req, res) => {
  res.sendFile(new URL("./index.html", import.meta.url).pathname);
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/api/video", upload.single("image"), async (req, res) => {
  try {
    if (!process.env.RUNWAYML_API_SECRET) {
      return res.status(500).json({ error: "Chưa cài RUNWAYML_API_SECRET trên Vercel." });
    }

    const promptText = (req.body.prompt || "").trim();
    const ratio = req.body.ratio || "720:1280";
    const duration = Math.min(Number(req.body.duration || 5), 10);

    if (!promptText) return res.status(400).json({ error: "Bạn chưa nhập mô tả video." });

    const input = {
      model: "gen4.5",
      promptText,
      ratio,
      duration
    };

    if (req.file) {
      const mime = req.file.mimetype || "image/jpeg";
      input.promptImage = `data:${mime};base64,${req.file.buffer.toString("base64")}`;
    }

    const task = await client.imageToVideo.create(input).waitForTaskOutput();
    const url = task?.output?.[0];

    if (!url) return res.status(502).json({ error: "AI không trả về video.", detail: task });

    res.json({ url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e?.message || "Lỗi tạo video AI." });
  }
});

app.post("/api/tts", async (req, res) => {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: "Chưa cài ELEVENLABS_API_KEY trên Vercel." });
    }

    const text = (req.body.text || "").trim();
    const voiceId = req.body.voiceId || "JBFqnCBsd6RMkjVDRZzb";
    if (!text) return res.status(400).json({ error: "Chưa có nội dung đọc." });

    const r = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_flash_v2_5",
          language_code: "vi"
        })
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      return res.status(r.status).json({ error: "ElevenLabs lỗi.", detail });
    }

    const audio = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e?.message || "Lỗi tạo giọng đọc." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`AI Video Studio running on ${port}`));
