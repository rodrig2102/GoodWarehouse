"use strict";
let express = require('express');
let router = express.Router();
let paypal = require('paypal-rest-sdk');
let adm_usuario = require('../models/usuarios');
let adm_cliente = require('../models/adm_clientes');
let clientes = require('../models/cliente');
let producto = require('../models/depositos');
let reservacion = require('../models/reservacion');




//----------------------Administrador--------------------------------------------------------------


//Renderizar Vista Login Administracion
router.get('/index_adm', function(req, res){
	res.render('index_adm',{message:'',err_reg:''});
});

//Renderizar pantallas
router.get('/administracion', function(req, res){
	if(!req.session.username){
		res.redirect('/index_adm');
	}
	adm_cliente.findAll(function(error,adm_usuario){
		if(error)
			next(error);
		else if(!adm_usuario)
			adm_usuario = [];
		else
			res.render('administracion',{username:req.session.username, modelo:adm_usuario, message:''});
	}); 
});

//Login Administrador
router.post('/login_adm', function(req, res, next){
	adm_usuario.authenticate(req.body.correo, req.body.password, function(error,adm_usuario){
		if(error)
			next(error);
		else if(!adm_usuario) {
			res.render('index_adm', {message:('Usuario o contraseña incorrecta')});
		}
		else{
			req.session.username = adm_usuario.username;
			res.redirect('/administracion');  
		}
	});
});


//INSERTAR cliente
router.post('/insertar', function(req, res, next){
	adm_cliente.insert(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono,req.body.password, function(error,adm_usuario){
		if(error)
			next(error);
		if(adm_usuario){
			var err = new Error('Usuario ya existente');
			err.status = 401;
			next(err);
		}
		if(!adm_usuario){
			res.redirect('/administracion');
		}
	  });
});

//ACTUALIZAR cliente
router.post('/actualizar', function(req, res, next){
	adm_cliente.update(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono, function(error,msg){
		console.log(req.body.username);
		if(error)
			next(error);
		if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);
			//res.redirect('administracion', {message:('Usuario no existe')});
		}
		if(msg){
			res.redirect('/administracion');
		}
		
	  });
});

//ELIMINAR cliente
router.post('/eliminar', function(req, res, next){
	adm_cliente.delete(req.body.username, function(error,msg){
		if(error)
			next(error);
		if(msg){
			var err = new Error('usuario no existe');
			err.status = 401;
			next(err);
		}
		if(!msg){
			console.log('exito');
			res.redirect('/administracion');}
	  });
});



//------------------------------------Cliente-----------------------------------------



//Renderizar pantallas

//Pantalla Inicio
router.get('/', function(req, res){
	res.render('index');
});
//Error Pagina
router.get('/404Page', function(req, res){
	res.render('404Page');
});
//Perfil Cliente
router.get('/perfil', function(req, res){
	if(req.session.user){
		//console.log('pruebaPerfil',req.session.user.username);
		let usuario = req.session.user.username;
		adm_cliente.findOne({username:usuario},function(err,docs){
			console.log('pruebaPerfil',docs);
			if(err)
				next(err);
			if(!docs)
				docs = [];
			if(docs)
				console.log('ESTO ES LO QUE SE MANDA',docs);
				res.render('perfil',{docs:docs,username:req.session.user.username, message:''});
		});
	}
	else{
		res.redirect('/login');
	}
});
//Perfil Cliente
router.post('/perfil', function(req, res){
	adm_cliente.updatePerfil(req.body.username,req.body.nombre,req.body.apellido,req.session.user.correo,req.body.telefono, function(error,msg){
		console.log(req.body.username);
		if(error)
			next(error);
		if(!msg){
			var err = new Error('Usuario no existe');
			err.status = 401;
			next (err);
			//res.redirect('administracion', {message:('Usuario no existe')});
		}
		if(msg){
			res.redirect('/reservacion');
		}
		
	  });
});
//Login Cliente
router.get('/login', function(req, res){
	res.render('login',{message:'',err_reg:''});
});
//No 
router.get('/cliente#top', function(req, res){
	res.render('cliente#top');
});
router.get('/cliente#about', function(req, res){
	res.render('cliente#about');
});
router.get('/cliente#team', function(req, res){
	res.render('cliente#team');
});
router.get('/cliente#courses', function(req, res){
	res.render('cliente#courses');
});
router.get('/cliente#testimonial', function(req, res){
	res.render('cliente#testimonial');
});
router.get('/cliente#contact', function(req, res){
	res.render('cliente#contact');
});

//Pantall Solicitud de Reservacion
router.get('/reservar', function(req, res){
	if(req.session.user){
		res.render('reservar',{message:'',err_reg:'',username:req.session.user.username});
	}
	else{
		res.redirect('/login');
	}
});
//Pantalla Factura
router.get('/factura', function(req, res){
	if(req.session.user){
		res.render('factura',{message:'',err_reg:'',username:req.session.user.username});
	}
	else{
		res.redirect('/login');
	}
});
//Pantalla Reservaciones Cliente
router.get('/reservaciones', function(req, res){
	if(req.session.user){
		let usuario = req.session.user._id;
		reservacion.find({_idCliente:usuario},function(err,docs){
			if(err)
			next(err);
			else if(!docs)
			docs = [];
			else
			res.render('reservaciones',{username:req.session.user.username, reservaciones:docs, message:''});
	
		});
	}
	else{
		res.redirect('/login');
	}
});


//Verificar Disponibilidad por Fechas
router.post('/verificar', function(req, res, next){
	 req.session.factura = []; 
	 let fecha_i = (req.body.check_in);
	 let fecha_f = (req.body.check_out);
	 let depo = req.body.deposito;

	//PRUEBA DE PARA EL DIA
	function parseDate(str) {
		var strDate = str.split('/');
		return new Date(strDate[1], strDate[0] - 1, strDate[2]); // AAAA/MMM/DD
	  }
    var f1 = parseDate(fecha_i);
    var f2 = parseDate(fecha_f);
	var dias = Math.round((f2 - f1) / (1000 * 60 * 60 * 24)); // CALCULO EN DIAS
	//FIN PRUEBA DIA

	reservacion.find({fecha_ini:fecha_i},'_idCliente fecha_ini fecha_fin ',function(error, reservaciones){
		// console.log('hola', reservaciones);
		// console.log('Fecha de Inicio',fecha_i);
		// console.log('Fecha Final',fecha_f);
		 console.log('dias:',dias);
		
		let fi;
		let ff;
		reservaciones.forEach(res => {		
			 fi = (res.fecha_ini);
			 ff = (res.fecha_fin);
		});	
		if(error){
			return res.status(500).send({message:'Error en la consulta'})
		}
		if(fi && ff){
			res.render('reservar', {message:('Fecha no disponible')});
		}
		if(!fi && !ff){
			producto.find({id_art:depo},'id_art nombre precio',function(err,depositos){
				if(err)
					next(err);
				else{
						console.log(depositos);
						console.log(dias);
						depositos.forEach(deposito => {		
							let precio = parseInt(deposito.precio);
							let costo = (precio*dias);
							let tax = ((precio * dias) * 0.07)
							let total= (costo + tax);
						
							req.session.factura.push({
								IDDepo:deposito._id,
								Producto: deposito.id_art,
								Descripcion : deposito.nombre,
								Precio:precio,
								Estancia:dias,
								Costo:costo,
								Impuesto: tax.toFixed(2),
								Total: total.toFixed(2),
								Fecha_i : fecha_i,
								Fecha_f : fecha_f
							});
						});			
					}

			res.render('factura',{factura:req.session.factura, username:req.session.user.username,});
			});
		};
	});
});


//login validar cliente
router.post('/login', function(req, res, next){
	clientes.login(req.body.correo, req.body.password, function(error,user){
		if(error)
			next(error);
		else if(!user) {
			// var err = new Error('Usuario o contraseña incorrecta');
            // err.status = 401;
			// next(err); 
			res.render('login', {message:('Usuario o contraseña incorrecta')});
		}
		else{
			req.session.user = user;
			res.redirect('/cliente');  }		
	});
});
//Index Cliente
router.get('/cliente', (req, res, next) =>{	
	if(req.session.user){
		res.render('cliente',{username:req.session.user.username},);
	}
	else{
		res.redirect('/login');
	}
});

//Registrar cliente
router.post('/registrar', function(req, res, next){
	adm_cliente.insert(req.body.username,req.body.nombre,req.body.apellido,req.body.correo,req.body.telefono,req.body.password, function(error,adm_usuario){
		if(error){
			// //next(error);
			// //esta entrando aqui!!!!
			// var err = new Error('Correo ya existente');
			// err.status = 401;
			// next(err);
			res.render('login', {message:('Correo ya existente')});
		}
		else if(adm_usuario){
			// var err = new Error('Correo ya existente');
			// err.status = 401;
			// next(err);
			res.render('login', {message:('Correo ya existente')});
		}
		else
			res.render('login',{message:('Registro Completado')});
	  });
});

//Cerrar sesion Cliente
router.get("/logout", function (req, res, next) {
	if(req.session){
		 req.session.destroy();
	}
	 res.redirect('/');
 });

 //Ver Depositos
router.post('/depositos',function(req, res, next){
	if(req.session.user){
		producto.findById(req.body.id_art,function(error,producto){
			console.log(producto);
			if(error)
				next(error);
			else
				res.render('depositos',{miproducto:producto, username:req.session.user.username,msj_disp:('false')});
		}); 
	}
	else{
		res.redirect('/login');
	}
});





//Pantalla FACTURA
router.post('/factura/verificar', (req, res) => {
	let monto;
	let name;
	let id;
	
    req.session.factura.forEach(item => {
        name = item.Descripcion,
		monto = parseFloat(item.Total),
		id = item.Producto
    });
    let precio = monto;
	console.log(precio);
	console.log(name);	
	
	const create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/factura/success",
			"cancel_url": "http://localhost:3000/reservar"
		},
		"transactions": [{
			"item_list": {
				"items": [{
					"name": name,
					"sku": id,
					"price": precio,
					"currency": "USD",
					"quantity": 1
				}]
			},
			"amount": {
				"currency": "USD",
				"total": precio
			},
			"description": "Total a pagar para el Depósito."
		}]
	};
	
	paypal.payment.create(create_payment_json, function (error, payment) {
	if (error) {
		throw error;
	} else {
		for(let i = 0;i < payment.links.length;i++){
			if(payment.links[i].rel === 'approval_url'){
			res.redirect(payment.links[i].href);
			}
		}
	}
	});
	
});
//Guarda Reservaciones en la Base de Datos
router.get('/factura/success', function(req, res){
	if(req.session.user){
		let id_depo;
		let id_cli = req.session.user._id;
		let fei;
		let fef;
		let tot;
		let numPro;
		let description;

		req.session.factura.forEach(item => {
			id_depo= item.IDDepo,
			fei = item.Fecha_i,
			fef= item.Fecha_f
			tot= item.Total;
			numPro=item.Producto;
			description=item.Descripcion;
		});
		
		reservacion.findOne({fei:fei},'fecha_ini',function(err,user){
			console.log('Id_Cliente es',id_cli);
			console.log('Id_Deposito es',id_depo);
			console.log('FechaInicialGuardada',fei);
			console.log('FechaFinalGuardada',fef);
			if(err){
				return res.status(500).send({message:'Error en la consulta'})
			}
			else if(user){
				return res.status(500).send({message:'Error fecha no disponible'})
			}
			else{
				var data={
					_idCliente:id_cli,
					_idDeposito:id_depo,
					NumDepo:numPro,
    				DescripcionDepo: description,
					fecha_ini:fei,
					fecha_fin:fef,
					MontoPagado:tot,
				};
				reservacion.create(data,function(err){
					if(err)
						return res.status(500).send({message:'Error guradar los datos'})
				});
				res.redirect('/reservaciones');
				//res.send('exito');
			}
		});
	
	}
	else{
		res.redirect('/login');
	}
});
//Actualizar Perfil
//ACTUALIZAR cliente
router.post('/actualizarP', function(req, res, next){
	adm_cliente.updatePerfil(req.body.username,req.body.nombre,req.body.apellido,req.session.user.correo,req.body.telefono,req.body.password, function(error,msg){
		console.log(req.body.username);
		if(error)
			next(error);
		if(!msg){
			var err = new Error('Correo ya existente');
			err.status = 401;
			next (err);
			//res.redirect('administracion', {message:('Usuario no existe')});
		}
		if(msg){
			res.redirect('/perfil');
		}
		
	  });
});
// 	router.get('/factura/success', (req, res) => {
// 	// 
// 	res.send('exito');
// });
	
// router.get('/cancel', (req, res) => res.send('Cancelled'));

router.use(function(re, res){
	res.status(404).render('404Page');
});
module.exports = router;