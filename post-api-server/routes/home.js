const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home page', isHome: true });
});

module.exports = router;
