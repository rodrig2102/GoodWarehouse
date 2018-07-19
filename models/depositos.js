"use strict";
const mongoose = require('mongoose');

 var productoSchema = new mongoose.Schema({
    id_art : String,
    nombre : String,
    imagePath : String,
    descripcion1: String,
    descripcion2: String,
    descripcion3: String,
    descripcion4: String,
    precio: String
},{collection:'productos'});

//Prueba Manu

productoSchema.statics.findById = function(id_art,callback){
    Producto.find({id_art:id_art},function(err,producto) {
        if(err)
            return callback(err);
        else if(!producto)
            return callback();
        return callback(null,producto);
    })
}
//final prueba manu

let Producto = mongoose.model('Producto',productoSchema);

module.exports = Producto;