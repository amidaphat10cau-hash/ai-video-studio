import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Route xử lý tạo video - Trả về JSON chuẩn
app.post('/generate', (req, res) => {
  res.json({ success: true, message: "Đã nhận yêu cầu tạo video thành công!" });
});

app.post('/api/generate', (req, res) => {
  res.json({ success: true, message: "Đã nhận yêu cầu tạo video thành công!" });
});

// Route trả về giao diện HTML cho các trang khác
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
