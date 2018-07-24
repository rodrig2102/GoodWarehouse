"use strict";
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//var email_mach = [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Coloca un correo válido"];

 var adm_clienteSchema = new mongoose.Schema({
    username: { type: String, unique: false, required: true, trim: true },
    nombre:{ type: String, unique: false, required: true, trim: true },
    apellido:{ type: String, unique: false, required: true, trim: true },
    telefono: { type: Number, unique: false, required: true, trim: true },
    correo: { type: String, unique: false, required: false, trim: true },
    password: { type: String, unique: false, required: true, trim: true, minlength:[8,"La contraseña es muy corta"] }  
},{collection:'cliente'});

adm_clienteSchema.statics.findAll = function(callback){
    Adm_Cliente.find({},function(err,users) {
        if(err)
            return callback(err);
        else if(!users)
            return callback();
        return callback(null,users);
    });
};

adm_clienteSchema.statics.insert =  function(username,nombre,apellido,correo,telefono,password,callback){
    Adm_Cliente.findOne({correo:correo},'correo',function(err,user){
        if(err){
            return callback(err);
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
                password: bcrypt.hashSync(password, saltRounds),
            };
            Adm_Cliente.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            });}
    });   
};
adm_clienteSchema.statics.update = function(username,nombre,apellido,correo,telefono,callback){
    Adm_Cliente.findOne({username:username},'username nombre apellido correo telefono',function(err,user){
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
    });   
};

adm_clienteSchema.statics.delete = function(username,callback){
    Adm_Cliente.findOne({username:username},'username',function(err,users){
        if(err)
            return callback(err);
        else if(!users)
            return callback(null,'usuario no existe');
        Adm_Cliente.deleteOne({username:username}, function(err){
                if(err)
                    return callback(err);
                return callback();//Success
            });
    });   
};


adm_clienteSchema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(password){
    this.p_c = password;
});

let Adm_Cliente = mongoose.model('Adm_Cliente',adm_clienteSchema);

module.exports = Adm_Cliente;

