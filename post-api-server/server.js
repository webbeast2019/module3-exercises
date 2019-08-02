const express = require('express');
const app = express();
const fs = require('fs');
const Joi = require('joi');

//load Data from DB
let posts = null;
const inputFileName = 'db.json';
fs.readFile(inputFileName, 'utf8', function (err, data) {
    if (err) throw err;
    posts = JSON.parse(data);
});

//update DB
function updateDb(file,val,callback){
    const json = JSON.stringify(val);
    fs.writeFile(file, json,'utf8' , function (err) {
        if (err) {
            throw err;
        }else{
            callback();
        }
    });
}

//add json phrasing middleware
app.use(express.json());

//Validation for posts
function validatePost(post){
    const schema = {
        userId: Joi.number().required(),
        title: Joi.string().min(3).required(),
        body: Joi.string().min(10).required()
    };
    return Joi.validate(post,schema);
}

app.all('*', (req, res, next) => {
    let dbLoadInterval = setInterval(function() {
        if (posts) {
            clearInterval(dbLoadInterval);
            next();
        }
    }, 20);
});


app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id', (req, res) => {
    const post = posts.find(c => c.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('post not found');
    res.send(post);
});

app.get('/', (req, res) => {
    res.redirect('/posts')
});


app.delete('/posts/:id', (req, res) => {
    const post = posts.find(c => c.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('post not found');

    const index = posts.indexOf(post);
    posts.splice(index, 1);

    res.send(post);
});

app.post('/posts',(req,res)=>{
    const {error} = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const post = {
        userId: req.body.userId,
        id: posts[posts.length-1].id+1,
        title: req.body.title,
        body: req.body.body
    };
    posts.push(post);
    updateDb("DB.json",posts,()=>{res.send(post)});
});

app.put('/posts/:id',(req,res)=>{
    const post = posts.find(c=>c.id === parseInt(req.params.id));
    if(!post)return res.status(404).send('post not found');

    const {error} = validatePost(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    post.userId = req.body.userId;
    post.title = req.body.title;
    post.body = req.body.body;

    updateDb("DB.json",posts,()=>{res.send(post)});
});


app.all('*', function (req, res) {
    res.send('Why are you trying such evil things?????')
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));