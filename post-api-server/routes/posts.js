const router = require('express').Router();
const Post = require('../models/post');

router.get('/', async (req, res) => {
  const posts = await Post.getAllPosts();

  res.render('posts', { title: 'Posts', posts, isPosts: true });
});

router.get('/:id/edit', async (req, res) => {
  const post = await Post.getPostById(req.params.id);

  if (!req.query.allow) {
    return res.redirect('/');
  } else {
    res.render('edit-post', { title: `Edit ${post.title}`, post, isPostEdit: true });
  }
});

router.get('/:id', async (req, res) => {
  const post = await Post.getPostById(req.params.id);
  res.render('post', { post, isPost: true });
});

router.post('/edit', async (req, res) => {
  await Post.update(req.body);
  res.redirect('/posts');
});

router.get('/:id/delete', async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/posts');
  } else {
    await Post.delete(req.params.id);
    res.redirect('/posts');
  }
});

module.exports = router;
