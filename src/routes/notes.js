const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth'); //este es un middleware

const Note = require('../models/Note');

router.get('/notes/sendM', isAuthenticated, (req, res) => {
    res.render('./notes/sendMail');
});

router.get('/notes/add', isAuthenticated, (req, res) => {
  res.render('./notes/new-note');
});

//al crear la nota lo ligo a la tabla usuario
router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    //console.log(req.body);
    //Usamos destructuring de JS
    const {snumber, theater, title, price, description } = req.body;
    const errors = [];
        if (!snumber) {
            errors.push({text: 'Please write a Serial Number'})
        }
        if (!theater) {
            errors.push({text: 'Please select a Theater'})
        }
        if(!title) {
            errors.push({text: 'Please write a Title'});
        }
        if(!price) {
            errors.push({text: 'Please write a price'});
        }
        if (!description) {
            errors.push({text: 'Please insert a Description'});
        }
        if (errors.length > 0) {
            res.render('notes/new-note', {
                errors,
                snumber,
                theater,
                title,
                price,
                description
            });
        } else {
            //Como Note es una clase la tenemos que instanciar
            const newNote = new Note({
                snumber, theater, title, price, description
            });
            //al momento de login, passport guarda al usuario en req.user.id, req.user es variable global
            newNote.user = req.user.id;
            await newNote.save();
            req.flash('success_msg', 'Ticket Added Succesfully');
            res.redirect('/notes');
        }
});

/*router.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.render('notes/all-notes', { notes });
});*/

router.get('/sumas', isAuthenticated, async (req, res) => {
     await Note.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                price: documento.price
            } //return
          }) //map
        } //const contexto
        let suma = 0;
        for(let i = 0; i < contexto.notes.length; i++) {
          suma += contexto.notes[i].price;
        }
        //console.log(suma);
        //console.log(contexto.notes);
        res.render('notes/suma', {sumaf: suma});
      })//then
}); //router.get  

//Para mostrar registros
router.get('/notes', isAuthenticated, async (req, res) => {
    await Note.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                id: documento.id,
                snumber: documento.snumber,
                theater: documento.theater,
                title: documento.title,
                price: documento.price,
                description: documento.description,
                date: documento.date
            } //return
          }) //map
        } //const contexto
        if (req.user.name === 'admin') {
            res.render('theaters/all-theaters');
        }else{
          res.render('notes/all-notes', { notes: contexto.notes });
        }
      })//then
}); //router.get

/*router.get('/notes', isAuthenticated, async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" }).aggregate(
      [
        {
          $group: {
            _id: "$user",
            total: {
              $sum: "$price"
            }
          }
        }
      ],
    res.render("notes/all-notes", { notes }));
  });*/

//Para actualizar registros, este es el que agarra el que vas a editar y te pasa los datos para llenar los campos
router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id)
    .then(data =>{
        return {
            id: data.id,
            snumber: data.snumber,
            theater: data.theater,
            title: data.title,
            price: data.price,
            description: data.description,
            date: data.date
        }
    })
    res.render('notes/edit-note', { note })
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
     const { snumber, theater, title, price, description } = req.body;
     await Note.findByIdAndUpdate(req.params.id, {snumber, theater, title, price, description});
     req.flash('success_msg', 'Ticket Updated Successfully');
     res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findOneAndDelete(req.param.id);
    req.flash('success_msg', 'Ticket Deleted Successfully');
    res.redirect('/notes');
});

module.exports = router;