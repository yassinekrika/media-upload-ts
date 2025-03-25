import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { FileRequest } from './types';
import { getMimeType } from './utils';

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100 // 100MB limit
  }
});

app.post('/upload', upload.single('media'), (req: FileRequest, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  
  res.status(201).json({ 
    message: 'File uploaded successfully',
    fileId: path.parse(req.file.filename).name, // Return the UUID without extension
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    fileUrl
  });
});

app.get('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const uploadDir = 'uploads/';
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading upload directory' });
    }

    const file = files.find(f => f.startsWith(fileId));
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadDir, file);
    const fileStats = fs.statSync(filePath);
    const fileExt = path.extname(file);
    const mimeType = getMimeType(fileExt);

    res.json({ 
      fileId,
      fileName: file,
      fileType: mimeType,
      fileSize: fileStats.size,
      fileUrl: `${req.protocol}://${req.get('host')}/uploads/${file}`,
      createdAt: fileStats.birthtime,
      lastModified: fileStats.mtime
    });
  });
});

app.delete('/files/:id', (req, res) => {
  const fileId = req.params.id;
  const uploadDir = 'uploads/';
  
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading upload directory' });
    }

    const fileToDelete = files.find(file => file.startsWith(fileId));
    
    if (!fileToDelete) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlink(path.join(uploadDir, fileToDelete), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error deleting file' });
      }
      
      res.json({ message: 'File deleted successfully' });
    });
  });
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});