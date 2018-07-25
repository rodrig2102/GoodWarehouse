"use strict";
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
let Clientes = require('./cliente');
let Depositos = require('./depositos');

var reservacionSchema = new mongoose.Schema({
    _idCliente: {type:Schema.Types.ObjectId,refs:Clientes},
    _idDeposito: {type:Schema.Types.ObjectId,refs:Depositos},
    NumDepo: String,
    DescripcionDepo: String,
    fecha_ini: String,
    fecha_fin: String,
    MontoPagado:String
},{collection:'reservacion'});

reservacionSchema.statics.check = function(fecha_ini,fecha_fin,callback){
    Reservacion.find({fecha_ini:fecha_ini,fecha_fin:fecha_fin},'fecha_ini fecha_fin',function(err,doc){
        if(err){
            return callback(err);
        }
        else if(doc){
            return callback(doc);
        }
    });   
};



let Reservacion = mongoose.model('Reservacion',reservacionSchema);
module.exports = Reservacion;
