"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var usuariosappSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true, trim: true },
    username: { type: String, unique: false, required: true, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
},{collection:'usuarios'});



usuariosappSchema.statics.authenticate = function(email,password,callback){
    Usuarios.findOne({email:email},'username password',function(err,user){
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

let Usuarios = mongoose.model('Usuarios',usuariosappSchema);
module.exports = Usuarios;


