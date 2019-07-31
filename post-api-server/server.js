'use strict'

const fs = require('fs');
const express = require('express');
const app = express();
const posts = require('./data/posts')
const PORT = 3000;

app.use(express.json())

app.listen(PORT, () => console.log(`post-api-server is listening on port ${PORT}!`));

app.get('/', (req, res) =>
    res.send('Supported routes:</br>' +
        'GET /posts - read all posts</br>' +
        'GET /posts/1 - read post by id</br>' +
        'POST /posts - add new post, data in body</br>' +
        'PUT /posts/1 - update post by id, data in body</br>' +
        'DELETE /posts/1 - delete post by id</br>')
);

// read all posts
app.get('/posts', (req, res) => {
    res.json(posts)
})

// read a post by id
app.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id == req.params.id);
    if(post) {
        res.json(post);
    }
    else {
        notfound(req.params.id, res);
    }
})

// add post
app.post('/posts', (req, res) => {
    // data from body
    const {userId, title, body} = req.body
    
    // find next allocated id
    const postIds = posts.map(p => p.id)
    const newId = (postIds.length > 0 ? Math.max(...postIds) : 0) + 1
    const post = {
        userId,
        id: newId,
        title,
        body
    }
    const new_posts = posts.concat(post)

    writeposts(new_posts)
    res.json(post)
})

// update post
app.put('/posts/:id', (req, res) => {
    const {id} = req.params
    const post = posts.find(p => p.id == id)
    if(post) {
        const keys = ['userId', 'title', 'body']
        keys.forEach(key => {
            if (req.body[key]) post[key] = req.body[key]
        })

        writeposts(posts)
        res.json(post)
    }
    else {
        notfound(id, res);
    }
})

app.delete('/posts/:id', (req, res) => {
    const {id} = req.params

    const post = posts.find(p => p.id == req.params.id);
    if(post) {
        // substract deleted post
        const new_posts = posts.filter(p => p.id != id)

        writeposts(new_posts)
        res.json(new_posts)
    }
    else {
        notfound(id, res);
    }
})

// writes json to file
const writeposts = json => {
    fs.writeFile('./data/posts.json', JSON.stringify(json), err => console.log(err))
}

const notfound = (id, res) => {
    console.log(`Post id=${id} not found`)
    res.send('Check your input!')
}


