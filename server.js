const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const OSS = require('ali-oss');
const Database = require('better-sqlite3');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  personality TEXT,
  traits TEXT,
  image_url TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`);

function getOssClient() {
  const { OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET, OSS_ENDPOINT } = process.env;
  if (!OSS_ACCESS_KEY_ID || !OSS_ACCESS_KEY_SECRET || !OSS_BUCKET || !OSS_ENDPOINT) {
    return null;
  }
  return new OSS({
    accessKeyId: OSS_ACCESS_KEY_ID,
    accessKeySecret: OSS_ACCESS_KEY_SECRET,
    bucket: OSS_BUCKET,
    endpoint: OSS_ENDPOINT,
  });
}

app.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM characters ORDER BY created_at DESC').all();
  res.render('index', { characters: rows });
});

app.get('/create', (req, res) => {
  res.render('create', { error: null });
});

app.post('/create', upload.single('avatar'), async (req, res) => {
  const { name, description, personality, traits } = req.body;
  const avatar = req.file;

  if (!name || !description || !avatar) {
    if (avatar && fs.existsSync(avatar.path)) fs.unlinkSync(avatar.path);
    return res.render('create', { error: 'Name, description, and avatar are required.' });
  }

  const ossClient = getOssClient();
  if (!ossClient) {
    if (fs.existsSync(avatar.path)) fs.unlinkSync(avatar.path);
    return res.render('create', { error: 'OSS environment variables are not set. Check .env.' });
  }

  try {
    const fileExt = path.extname(avatar.originalname).toLowerCase() || '.jpg';
    const key = `characters/${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
    await ossClient.put(key, avatar.path);
    const imageUrl = `https://${process.env.OSS_BUCKET}.${process.env.OSS_ENDPOINT.replace(/^https?:\/\//, '')}/${key}`;

    db.prepare(
      'INSERT INTO characters (name, description, personality, traits, image_url) VALUES (?, ?, ?, ?, ?)'    ).run(name, description, personality || '', traits || '', imageUrl);

    if (fs.existsSync(avatar.path)) fs.unlinkSync(avatar.path);
    res.redirect('/');
  } catch (err) {
    console.error('Upload error:', err);
    if (avatar && fs.existsSync(avatar.path)) fs.unlinkSync(avatar.path);
    res.render('create', { error: 'Upload failed. Check OSS credentials and permissions.' });
  }
});

app.get('/api/characters', (req, res) => {
  const rows = db.prepare('SELECT id, name, description, personality, traits, image_url, created_at FROM characters ORDER BY created_at DESC').all();
  res.json(rows);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Anime Character site running on http://localhost:${port}`);
});
