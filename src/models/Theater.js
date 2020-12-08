const mongoose = require('mongoose');
const { Schema } = mongoose;

const TheaterSchema = new Schema({
    name: { type: String, required: 'true'},
    address: { type: String, required: 'true'},
    phone: { type: Number, required: 'true'},
    staging: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staging',
        required: 'true'
    }],
    date: { type: Date, default: Date.now },
    user: { type: String }
})
//Cada vez que se crea una nota nueva se agrega el usuario, user
//Con default en Date nos guarda automaticamente la fecha del dia de hoy

module.exports = mongoose.model('Theater', TheaterSchema);