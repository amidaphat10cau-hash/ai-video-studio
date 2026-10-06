import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ các tệp tĩnh trong cùng thư mục
app.use(express.static(__dirname));

// Route cho API tạo video (trả về JSON chuẩn)
app.post('/generate', async (req, res) => {
  try {
    // Thêm logic gọi RunwayML hoặc xử lý video của bạn ở đây
    res.json({ success: true, message: "Đang xử lý tạo video..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route trả về giao diện trang chủ index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default app;
