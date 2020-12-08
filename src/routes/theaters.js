const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth'); //este es un middleware

const Theater = require('../models/Theater');
const Staging = require('../models/Staging');

router.get('/theaters/add', isAuthenticated, (req, res) => {
    res.render('./theaters/new-theater');
});

//al crear la nota lo ligo a la tabla usuario
router.post('/theaters/new-theater', isAuthenticated, async (req, res) => {
    //console.log(req.body);
    //Usamos destructuring de JS
    const { name, address, phone } = req.body;
    const errors = [];
        if (!name) {
            errors.push({text: 'Please write a Name'})
        }
        if (!address) {
            errors.push({text: 'Please write the Address'})
        }
        if(!phone) {
            errors.push({text: 'Please type a phone'});
        }
        if (errors.length > 0) {
            res.render('theaters/new-theater', {
                errors,
                name,
                address,
                phone
            });
        } else {
            //Como Note es una clase la tenemos que instanciar
            const newTheater = new Theater({
                name, address, phone
            });
            //al momento de login, passport guarda al usuario en req.user.id, req.user es variable global
            newTheater.user = req.user.id;
            await newTheater.save();
            req.flash('success_msg', 'Theater Added Succesfully');
            res.redirect('/theaters');
        }
});

/*router.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.render('notes/all-notes', { notes });
});*/

//Para mostrar stagings de acuerdo al nombre del Teatro
router.get('/stageth', isAuthenticated, async (req, res) => {
    await Staging.find({name: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            theaters: documentos.map(documento => {
            return {
                id: documento.id,
                name: documento.name,
                address: documento.address,
                phone: documento.phone,
                staging: documento.staging,
                date: documento.date
            }
          })
        }
        if(req.user.name === 'admin') {
            res.render('theaters/all-theaters', { theaters: contexto.theaters });
        }
      })
});

//Para mostrar registros
router.get('/theaters', isAuthenticated, async (req, res) => {
    await Theater.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            theaters: documentos.map(documento => {
            return {
                id: documento.id,
                name: documento.name,
                address: documento.address,
                phone: documento.phone,
                staging: documento.staging,
                date: documento.date
            }
          })
        }
        if(req.user.name === 'admin') {
            res.render('theaters/all-theaters', { theaters: contexto.theaters });
        }
      })
});

//Para actualizar registros, este es el que agarra el que vas a editar y te pasa los datos para llenar los campos
router.get('/theaters/edit/:id', isAuthenticated, async (req, res) => {
    const theater = await Theater.findById(req.params.id)
    .then(data =>{
        return {
            id: data.id,
            name: data.name,
            address: data.address,
            phone: data.phone,
            staging: data.staging,
            date: data.date
        }
    })
    res.render('theaters/edit-theater', { theater })
});

router.put('/theaters/edit-theater/:id', isAuthenticated, async (req, res) => {
     const { name, address, phone, staging } = req.body;
     await Theater.findByIdAndUpdate(req.params.id, {name, address, phone, staging});
     req.flash('success_msg', 'Theater Updated Successfully');
     res.redirect('/theaters');
});

router.delete('/theaters/delete/:id', isAuthenticated, async (req, res) => {
    await Theater.findOneAndDelete(req.param.id);
    req.flash('success_msg', 'Theater Deleted Successfully');
    res.redirect('/theaters');
});

module.exports = router;