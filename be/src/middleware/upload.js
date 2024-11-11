import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Lấy đường dẫn hiện tại và chuyển đổi thành đường dẫn thư mục
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn tới thư mục uploads cùng cấp với middleware
const uploadDir = path.join(__dirname, '../uploads');

// Kiểm tra và tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Thiết lập nơi lưu trữ tệp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Thư mục lưu trữ tệp
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên tệp
    }
});

// Thiết lập bộ lọc tệp để chỉ chấp nhận các tệp ảnh
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Giới hạn kích thước tệp là 5MB
    fileFilter: fileFilter
});

export default upload;