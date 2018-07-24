"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Clientes = require('./cliente');
let Depositos = require('./depositos');

var reservacionSchema = new mongoose.Schema({
    // _idCliente: {type:Schema.Types.ObjectId,refs:Clientes},
    // _idDeposito: {type:Schema.Types.ObjectId,refs:Depositos},
    _idCliente: String,
    _idDeposito: String,
    fecha_ini: String,
    fecha_fin: String,
},{collection:'reservacion'});

reservacionSchema.statics.check = function(fecha_ini,fecha_fin,callback){
    Reservacion.find({fecha_ini:fecha_ini,fecha_fin:fecha_fin},'fecha_ini fecha_fin',function(err,doc){
        if(err){
            return callback(err);
        }
        else if(doc){
            return callback(doc);
        }
        //return callback(null,user);
    });   
};

reservacionSchema.statics.insert =  function(_idCliente,_idDeposito,fecha_ini,fecha_fin,callback){
    Reservacion.findOne({fecha_ini:fecha_ini},'fecha_ini',function(err,user){
        if(err){
            return callback(err);
        }
        else if(user){
            return callback(user);
        }
        else{
            var data={
                _idCliente:_idCliente,
                _idDeposito:_idDeposito,
                fecha_ini:fecha_ini,
                fecha_fin:fecha_fin
            };
            Reservacion.create(data,function(err){
                if(err)
                    return callback(err);
                return callback();
            });}
    });   
};

let Reservacion = mongoose.model('Reservacion',reservacionSchema);
module.exports = Reservacion;
