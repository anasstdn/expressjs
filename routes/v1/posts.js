var express = require('express');
var router = express.Router();

const{
	indexPosts,
	createPosts,
	storePosts,
	editPosts,
	updatePosts,
	deletePosts
} = require('../../controllers/v1/posts.js');

router.get('/', indexPosts);
router.get('/create', createPosts);
router.post('/store', storePosts);
router.get('/edit/(:id)', editPosts);
router.post('/update/:id', updatePosts);
router.get('/delete/(:id)', deletePosts)
// == END == //

module.exports = router;