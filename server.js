import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Route API tao Video (Khop voi fetch /api/video)
app.post('/api/video', upload.single('image'), async (req, res) => {
  try {
    const { prompt, subtitle, ratio, duration } = req.body;
    
    // In thông tin nhận được để kiểm tra log trên Vercel
    console.log("Prompt:", prompt);
    console.log("Subtitle:", subtitle);
    console.log("Ratio:", ratio);

    // Trả về dữ liệu JSON phản hồi
    res.json({
      success: true,
      message: "Đã nhận yêu cầu tạo video thành công!",
      url: "" // Điền URL video tạo từ RunwayML vào đây khi xử lý xong
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route API tao Giong doc (Khop voi fetch /api/tts)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    
    res.json({
      success: true,
      message: "Đã nhận yêu cầu tạo giọng đọc!",
      audioUrl: ""
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tra ve giao dien trang chu cho tat ca cac route con lai
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
