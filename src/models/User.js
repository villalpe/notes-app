const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: 'true'},
    email: { type: String, required: 'true', unique: 'true'},
    password: { type: String, required: 'true'},
    type: { type: Boolean, required: 'true', default: false},
    date: { type: Date, default: Date.now }
});

//Para cifrar la contraseña usamos metodos del Schema
//Para cifrar utilizamos el paquete que intalamos bcrypt.js
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt); //aqui obtenemos la contraseña cifrada
    return hash;
};
//Debemos hacer algo ya que al momento en que se guarda la contraseña, se guarda cifrada y no se va a poder
//comparar.
//Aqui no utlizamos el arrow function ya que queremos accesar directamente al campo password del Schema
//y poder comparar la contraseña que pone el usuario en la forma (password) con la contraseña de la BD (this.password)
//Se puede usar async/await con las funciones viejas, en este caso.
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);