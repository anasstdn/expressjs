var connection = require('../../libraries/database');

const indexPosts = ((req, res, next) => {
	connection.query("SELECT * FROM posts ORDER BY id desc", function (err, rows){
		if(err){
			req.flash('error', err);
			res.render('posts',{
				data:''
			});
		}else{
			res.render('v1/posts/index', {
				data:rows
			});
		}
	});
})

const createPosts = ((req, res, next) => {
	res.render('v1/posts/create',{
		title : '',
		content : ''
	});
})

const storePosts = ((req, res, next) => {
	let title = req.body.title;
	let content = req.body.content;
	let errors = false;

	if(title.length === 0){
		errors = true;

		req.flash('error', "Silahkan masukkan title");
		res.render('v1/posts/create',{
			title : title,
			content : content
		});
	}

	if(content.length === 0){
		errors = true;

		req.flash('error', "Silahkan masukkan content");
		res.render('v1/posts/create',{
			title:title,
			content:content
		});
	}

	if(!errors){
		let formData = {
			title : title,
			content : content
		}

		connection.query("INSERT INTO posts SET ?", formData, function(err, result){
			if(err){
				req.flash('error',err);
				res.render('v1/posts/create',{
					title:formData.title,
					content:formData.content
				});
			}else{
				req.flash('success', 'Data berhasil disimpan');
				res.redirect('/v1/posts') 
			}
		});
	}
});

const editPosts = ((req, res, next) => {
	let id = req.params.id;

	connection.query("SELECT * FROM posts WHERE id = "+id, function(err, rows, fields){
		if(err) throw err
			if(rows.length <= 0){
				req.flash('error','Data Post dengan ID = '+id+' tidak ditemukan');
				res.redirect('/v1/posts');
			}else{
				res.render('v1/posts/edit', {
					id:rows[0].id,
					title:rows[0].title,
					content:rows[0].content
				});
			}
	});
});

const updatePosts = ((req, res, next) => {
	let id = req.params.id;
	let title = req.body.title;
	let content = req.body.content;
	let errors = false;

	if(title.length === 0){
		errors = true;

		req.flash('error','Silahkan masukkan title');
		res.render('v1/posts/edit',{
			id: req.params.id,
			title:title,
			content:content
		});
	}

	if(content.length === 0){
		errors = true;

		req.flash('error','Silahkan masukkan content');
		res.render('v1/posts/edit',{
			id: req.params.id,
			title:title,
			content:content
		});
	}

	if(!errors){
		let formData = {
			title:title,
			content:content
		}

		connection.query("UPDATE posts SET ? WHERE id = "+id, formData, function(err, result){
			if(err){
				req.flash('error', err);
				res.render('v1/posts/edit',{
					id:req.params.id,
					title:formData.title,
					content:formData.content
				});
			}else{
				req.flash('success','Data berhasil ditambahkan');
				res.redirect('/v1/posts');
			}
		});
	}
});

const deletePosts = ((req, res, next) => {
	let id = req.params.id;

	connection.query("DELETE FROM posts WHERE id ="+id, function(err,result){
		if(err){
			req.flash('error', err);
			res.redirect('/v1/posts');
		}else{
			req.flash('success', 'Data berhasil dihapus');
			res.redirect('/v1/posts');
		}
	});
});

module.exports = {
	indexPosts,
	createPosts,
	storePosts,
	editPosts,
	updatePosts,
	deletePosts
}