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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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
            code: 200,
            msg: '上传成功',
            image_url: image_urltoslash,
            image_alt: image_alt,
        });
    });
});

app.get('/images', (req, res) => {
    console.log('查询数据');
    // connect to the database  

    const sql = `SELECT * FROM images order by created_at desc`;
    db.all(sql, (err, rows) => {
        if (err) {
            console.error('查询数据失败', err);
            res.status(500).send('查询数据失败');
            return;
        }
        res.send(rows);
    });
});


app.post('/blog',(req,res)=>{
    console.log('上传blog...')
    
    // 重命名变量
    const {blog_title,blog_content} = req.body;
    console.log('blog_title:', blog_title);
    console.log('blog_content:', blog_content);
    // 插入数据
    try{
        const sql = `INSERT INTO blog (blog_title, blog_content) VALUES (?, ?)`;
       const data =  db.run(sql, [blog_title, blog_content], (err) => {
            if (err) {
                console.error('插入数据失败', err);
                res.status(500).send('插入数据失败');
                return;
            }
        });
        res.send(
            {
                code:200,
                msg:'上传成功',
               data
            }
        )
    }catch(e){
        console.log('插入数据失败', e);
        res.send({
            code:500,
            msg:'插入数据失败'
        })
    }
    
   
})


app.get('/blog/:id',(req,res)=>{
    console.log('查询blog...')
    const {id} = req.params;
    console.log('id:', id);
    const sql = `SELECT * FROM blog where id = ?`;
    db.get(sql,[id],(err,row)=>{
        if(err){
            console.error('查询数据失败', err);
            res.status(500).send('查询数据失败');
            return;
        }
        res.send(row);
    })
})











app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
