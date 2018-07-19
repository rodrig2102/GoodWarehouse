"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var clienteappSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true, trim: true },
    nombre:{ type: String, unique: false, required: true, trim: true },
    apellido:{ type: String, unique: false, required: true, trim: true },
    telefono: { type: Number, unique: false, required: true, trim: true },
    correo: { type: String, unique: false, required: false, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
},{collection:'cliente'});



clienteappSchema.statics.authenticate = function(correo,password,callback){
    Clientes.findOne({correo:correo},'nombre password',function(err,cliente){
        if(err)
            return callback(err);
        else if(!cliente)
            return callback();
        var hash = cliente.password;
        if(bcrypt.compareSync(password, hash))
            return callback(null,cliente)
        else
            return callback();
    }) 
}

let Clientes = mongoose.model('Clientes',clienteappSchema);
module.exports = Clientes;


