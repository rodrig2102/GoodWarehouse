"use strict";
let express = require('express');
let router = express.Router();
//let adm_usuario = require('../models/usuarios');
let adm_cliente = require('../models/adm_clientes');
let clientes = require('../models/cliente');
let producto = require('../models/depositos');

//Renderizar pantallas
router.get('/', function(req, res){
	res.render('index');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.get('/cliente', function(req, res){
	res.render('cliente');
});


//Ver articulos
router.post('/depositos', function(req, res, next){
	producto.findById(req.body.id_art,function(error,producto){
		console.log(producto);
		if(error)
			next(error);
		else
			res.render('depositos',{miproducto:producto});
	}); 

});

//-------------------------------------------------Clientes-----------------------------------
//loginvalidar cliente
router.post('/login', function(req, res, next){
	clientes.authenticate(req.body.correo, req.body.password, function(error,clientes){
		if(error)
			next(error);
		else if(!clientes) {
			var err = new Error('Usuario o contraseña incorrecta');
            err.status = 401;
			next(err); }
		else{
			req.session.username = clientes.username;
			res.redirect('/cliente');  }
	});
});


//Registrar cliente
router.post('/registrar', function(req, res, next){
	adm_cliente.insert(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono,req.body.password,req.body.passConfirm, function(error,adm_usuario){
		if(error)
			next(error);
		else if(adm_usuario){
			var err = new Error('Correo ya existente');
			err.status = 401;
			next(err);}
		else
			res.redirect('/login');
	  });
});


//-------------------------------------------------Administrador-----------------------------------
//loginvalidar Administrador

//logian Administrador

// router.post('/login', function(req, res, next){
// 	adm_usuario.authenticate(req.body.email, req.body.password, function(error,adm_usuario){
// 		if(error)
// 			next(error);
// 		else if(!adm_usuario) {
// 			var err = new Error('Usuario o contraseña incorrecta');
//             err.status = 401;
// 			next(err); }
// 		else{
// 			req.session.username = adm_usuario.username;
// 			res.redirect('/CRUD_Prueba');  }
// 	});
// });

//Administrador
router.get('/CRUD_Prueba',function(req, res, next){
	if(!req.session.username){
		res.redirect('/login');
	}
	adm_cliente.findAll(function(error,adm_usuario){
		if(error)
			next(error);
		else if(!adm_usuario)
			adm_usuario = [];
		else
			res.render('CRUD_Prueba',{usuarios:req.session.username, modelo:adm_usuario});
	}); 
});

//INSERTAR cliente
router.post('/insertar', function(req, res, next){
	adm_cliente.insert(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono,req.body.password,req.body.passConfirm, function(error,adm_usuario){
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

//ACTUALIZAR cliente
router.post('/actualizar', function(req, res, next){
	adm_cliente.update(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono, function(error,msg){
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

//ELIMINAR cliente
router.post('/eliminar', function(req, res, next){
	adm_cliente.delete(req.body.username, function(error,msg){
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