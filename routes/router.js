"use strict";
let express = require('express');
let router = express.Router();
let adm_usuario = require('../models/usuarios');
let cliente = require('../models/cliente')

//Renderizar views
router.get('/', function(req, res){
	res.render('index');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/registrarse', function(req, res){
	res.render('registro');
});

//loginvalidar
router.post('/login', function(req, res, next){
	adm_usuario.authenticate(req.body.email, req.body.password, function(error,adm_usuario){
		if(error)
			next(error);
		else if(!adm_usuario) {
			var err = new Error('Usuario o contraseña incorrecta');
            err.status = 401;
			next(err); }
		else{
			req.session.username = adm_usuario.username;
			res.redirect('/CRUD_Prueba');  }
	});
});

//Estudiantes
router.get('/CRUD_Prueba',function(req, res, next){
	if(!req.session.username){
		res.redirect('/login');
	}
	cliente.findAll(function(error,adm_usuario){
		if(error)
			next(error);
		else if(!adm_usuario)
			adm_usuario = [];
		else
			res.render('CRUD_Prueba',{usuarios:req.session.username, modelo:adm_usuario});
	}); 
});

//INSERTAR
router.post('/insertar', function(req, res, next){
	cliente.insert(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono,req.body.password,req.body.passConfirm, function(error,user){
		if(error)
			next(error);
		else if(adm_usuario){
			var err = new Error('Usuario ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/CRUD_Prueba');
	  });
});

//ACTUALIZAR
router.post('/actualizar', function(req, res, next){
	cliente.update(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono, function(error,msg){
		console.log(req.body.username);
		if(error)
			next(error);
		else if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);}
		res.redirect('/CRUD_Prueba');
		
	  });
});

//ELIMINAR
router.post('/eliminar', function(req, res, next){
	cliente.delete(req.body.username, function(error,msg){
		if(error)
			next(error);
		else if(msg){
			var err = new Error('usuario no existe');
			err.status = 401;
			next(err);
		}
		else{
			console.log('exito');
			res.redirect('/CRUD_Prueba');}
	  });
});

module.exports = router;