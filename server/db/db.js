const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/db.sqlite3', (err) => {
    if (err) {
        console.error('数据库连接失败', err);
        return;
    }
    console.log('数据库连接成功');
})
db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)`);
}
)
module.exports = db;