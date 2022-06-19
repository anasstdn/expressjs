var express = require('express');
var router = express.Router();

const{
	indexLogin,
	authLogin,
	indexRegisterUser,
	storeRegister
} = require('../../controllers/v1/login.js');

router.get('/', indexLogin);
router.post('/auth-login', authLogin);

router.get('/register', indexRegisterUser);
router.post('/store-register', storeRegister);
// == END == //

module.exports = router;