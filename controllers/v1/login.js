const connection = require('../../libraries/database');
const crypto = require("crypto");
const model = require("../../models");
const {
	verifyCallback,
	validPassword,
	genPassword,
	isAuth,
	isAdmin,
	userExists,
	passport
  } = require('../../libraries/passport.js');

const indexLogin = ((req, res, next) => {
	res.render('v1/login/index');
});

const authLogin = ((req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.json({
                msg: err
            })
        }

        if (!user) {
            return res.json({
                msg: "Email or password incorrect"
            })
        }

        return res.json({
            msg: "Success, you've been logged in ",
            user : {
                "id" : user.id,
                "email" : user.email,
                "name" : user.name
            }
        })
    })
})

const indexRegisterUser = ((req, res, next) =>{
	res.render('v1/login/register');
})

const storeRegister = ((req, res, next) => {
	const { name, username, password } = req.body;
	const saltHash = genPassword(password);
  	const salt = saltHash.salt;
  	const hash = saltHash.hash;

	model.User
	.create({
		name: name,
		username : username,
		hash: hash,
		salt: salt,
		isAdmin : "0"
	})
	.then(user => {
		return res.json({
			msg: "Success, user added",
			user
		})
	})
	.catch(err => {
		return res.json({
			msg: "Error",
			err
		})
	})
})

module.exports = {
	indexLogin,
	authLogin,
	indexRegisterUser,
	storeRegister
}