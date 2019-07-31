const router = require('express').Router();
const Post = require('../models/post');

router.get('/', (req, res) => res.render('add', { title: 'Add post', isAdd: true }));

router.post('/', async (req, res) => {
  const newPost = new Post(req.body.title, req.body.text);
  await newPost.save();
  res.redirect('/posts');
});

module.exports = router;
