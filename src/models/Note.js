const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    snumber: { type: String, required: 'true'},
    theater: { type: String, required: 'true'},
    title: { type: String, required: 'true'},
    description: { type: String, required: 'true'},
    price: {type: Number, required: 'true'},
    date: { type: Date, default: Date.now },
    user: { type: String }
})
//Cada vez que se crea una nota nueva se agrega el usuario, user
//Con default en Date nos guarda automaticamente la fecha del dia de hoy

module.exports = mongoose.model('Note', NoteSchema);


