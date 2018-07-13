"use strict";
const mongoose = require('mongoose');


 var articulosSchema = new mongoose.Schema({
    id_art: { type: String},
    img:{ type: String},
    
},{collection:'articulos'});

let Articulo = mongoose.model('Articulo',articulosSchema);
module.exports = Articulo;