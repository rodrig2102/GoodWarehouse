"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var clienteSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true, trim: true },
    nombre:{ type: String, unique: false, required: true, trim: true },
    apellido:{ type: String, unique: false, required: true, trim: true },
    telefono: { type: Number, unique: false, required: true, trim: true },
    correo: { type: String, unique: false, required: false, trim: true },
    password: { type: String, unique: false, required: true, trim: true
    
        // validate:{
    //     validator:function(p){
    //         return this.password_confirmation == p;
    //     },
    //     message:"las Contraseñas no son inguales"
    //     } 
    },
},{collection:'cliente'});

// Login 
clienteSchema.statics.login = function(correo,password,callback){
    Clientes.findOne({correo:correo},'correo password username',function(err,user){
        if(err)
            return callback(err);
        else if(!user)
            return callback();
        var hash = user.password;
        if(bcrypt.compareSync(password, hash))
            return callback(null,user)
        else
            return callback();
    })
}



let Clientes = mongoose.model('Clientes',clienteSchema);
module.exports = Clientes;


