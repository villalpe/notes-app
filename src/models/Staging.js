const mongoose = require('mongoose');
const { Schema } = mongoose;

const StagingSchema = new Schema({
    name: { type: String, required: 'true'},
    hour: { type: String, required: 'true'},
    date: { type: Date, default: Date.now },
    user: { type: String }
})
//Cada vez que se crea una nota nueva se agrega el usuario, user
//Con default en Date nos guarda automaticamente la fecha del dia de hoy

module.exports = mongoose.model('Staging', StagingSchema);