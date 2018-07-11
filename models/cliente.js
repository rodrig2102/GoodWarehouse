"use strict";
const mongoose = require('mongoose');


 var clienteSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true, trim: true },
    nombre:{ type: String, unique: false, required: true, trim: true },
    apellido:{ type: String, unique: false, required: true, trim: true },
    telefono: { type: Number, unique: false, required: true, trim: true },
    correo: { type: String, unique: false, required: false, trim: true },
    password: { type: String, unique: false, required: true, trim: true },
    passConfirm: { type: String, unique: false, required: true, trim: true },
    
    
},{collection:'cliente'});


clienteSchema.statics.findAll = function(callback){
    Cliente.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    })
}

clienteSchema.statics.insert = function(username,nombre,apellido,correo,telefono,password,passConfirm,callback){
    Cliente.findOne({username:username},'username',function(err,user){
        if(err){
            return callback(err)
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                username:username,
                nombre:nombre,
                apellido:apellido,
                correo:correo,
                telefono:telefono,
                password:password,
                passConfirm:passConfirm};
            Cliente.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            })}
    })   
}
clienteSchema.statics.update = function(username,nombre,apellido,correo,telefono,callback){
    Cliente.findOne({username:username},'username nombre apellido correo telefono',function(err,user){
        if(err)
            return callback(err);
        else if(!user){
            console.log(user);
            return callback();
        }
        else{
                if(username)
                    user.username = username;
                if(nombre)
                    user.nombre=nombre;
                if(apellido)
                    user.apellido = apellido;               
                if(correo)
                    user.correo = correo;
                if(telefono)
                    user.telefono = telefono;
                user.save(function(err){
                    if(err)
                        return callback(err);
                    return callback(null,true);
                });
            }
    })   
}

clienteSchema.statics.delete = function(username,callback){
    Cliente.findOne({username:username},'username',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'usuario no existe');
        Cliente.deleteOne({username:username}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    })   
}

let Cliente = mongoose.model('Cliente',clienteSchema);

module.exports = Cliente;

