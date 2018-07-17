"use strict";
const mongoose = require('mongoose');

 var productoSchema = new mongoose.Schema({
    nombre : String,
    link : String,
    descripcion: String
},{collection:'productos'});


productoSchema.statics.findId = function(callback){
    Producto.find({},function(err,productos) {
        if(err)
            return callback(err);
        else if(!productos)
            return callback();
        return callback(null,productos);
    })
}
productoSchema.statics.findById = function(_id,callback){
    Producto.find({_id:_id},function(err,producto) {
        if(err)
            return callback(err);
        else if(!producto)
            return callback();
        return callback(null,producto);
    })
}

let Producto = mongoose.model('Producto',productoSchema);

module.exports = Producto;