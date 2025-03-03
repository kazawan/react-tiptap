const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;
const uuid = require('uuid');   
const fs = require('fs');
const path = require('path');
const db = require('./db/db.js');

app.use(cors());

app.use(express.json({limit: '50mb'}));    
app.use(express.urlencoded({ extended: true ,limit: '50mb'}));
app.use('/uploads', express.static('uploads'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    const { file } = req;
    const { image_alt } = req.body;
    const image_url = file.path;
    // 把 \ 转换为 /
    const image_urltoslash = image_url.replace(/\\/g, '/');
    console.log('image_url', image_urltoslash);
    console.log('image_alt', image_alt);
    
    const sql = `INSERT INTO images (image_url, image_alt) VALUES (?, ?)`;
    db.run(sql, [image_url, image_alt], (err) => {
        if (err) {
            console.error('插入数据失败', err);
            res.status(500).send('插入数据失败');
            return;
        }
        res.send({
            code:200,
            msg: '上传成功',
            image_url: image_urltoslash,
            image_alt: image_alt,
        });
    });
});

app.get('/images',(req,res)=>{
    console.log('查询数据'); 
    // connect to the database  
    
    const sql = `SELECT * FROM images order by created_at desc`;
    db.all(sql,(err,rows)=>{
        if(err){
            console.error('查询数据失败',err);
            res.status(500).send('查询数据失败');
            return;
        }
        res.send(rows);
    });
});












app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
