import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stat = promisify(fs.stat);

const serveUploads = async (req, res, next) => {
    const filePath = path.join(__dirname, '../uploads', req.path);
    try {
        const fileStat = await stat(filePath);
        if (fileStat.isFile()) {
            res.sendFile(filePath);
        } else {
            next();
        }
    } catch (err) {
        next();
    }
};

export default serveUploads;