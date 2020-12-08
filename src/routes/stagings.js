const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../helpers/auth'); //este es un middleware

const Staging = require('../models/Staging');
const Theater = require('../models/Theater');

router.get('/stagings/add', isAuthenticated, (req, res) => {
    res.render('./stagings/new-staging');
});

router.post('/stagings/new-staging', isAuthenticated, async (req, res) => {
    //console.log(req.body);
    //Usamos destructuring de JS
    const { name, hour, theater } = req.body;
    const errors = [];
        if (!name) {
            errors.push({text: 'Please write a Name'})
        }
        if (!hour) {
            errors.push({text: 'Please write the Hour'})
        }
        if (!theater) {
            errors.push({text: 'Please write the Hour'})
        }
        if (errors.length > 0) {
            res.render('stagings/new-staging', {
                errors,
                name,
                hour,
                theater
            });
        } else {
            //Como Note es una clase la tenemos que instanciar
            const newStaging = new Staging({
                name, hour, theater
            });
            //al momento de login, passport guarda al usuario en req.user.id, req.user es variable global
            newStaging.user = req.user.id;
            await newStaging.save()
            .then((result) => {
                Theater.findOne({ theater: req.body.theater }, (err, theath) => {
                    if (theath) {
                        // The below two lines will add the newly saved review's 
                        // ObjectID to the the User's reviews array field
                        user.reviews.push(review);
                        user.save();
                        res.json({ message: 'Review created!' });
                    }
                });
              })
              .catch((error) => {
                res.status(500).json({ error });
              });
            req.flash('success_msg', 'Staging Added Succesfully');
            res.redirect('/stagings');
        }
});

/*router.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.render('notes/all-notes', { notes });
});*/

//Para mostrar registros
router.get('/stagings', isAuthenticated, async (req, res) => {
    await Staging.find({user: req.user.id}).sort({date: 'desc'})
      .then(documentos => {
        const contexto = {
            stagings: documentos.map(documento => {
            return {
                id: documento.id,
                name: documento.name,
                hour: documento.hour,
                theater: documento.theater,
                date: documento.date
            }
          })
        }
        if(req.user.name === 'admin') {
            res.render('stagings/all-stagings', { stagings: contexto.stagings });
        }
      })
});

//Para actualizar registros, este es el que agarra el que vas a editar y te pasa los datos para llenar los campos
router.get('/stagings/edit/:id', isAuthenticated, async (req, res) => {
    const staging = await Staging.findById(req.params.id)
    .then(data =>{
        return {
            id: data.id,
            name: data.name,
            hour: data.hour,
            theater: data.theater,
            date: data.date
        }
    })
    res.render('stagings/edit-staging', { staging })
});

router.put('/stagings/edit-staging/:id', isAuthenticated, async (req, res) => {
     const { name, hour } = req.body;
     await Staging.findByIdAndUpdate(req.params.id, {name, hour});
     req.flash('success_msg', 'Staging Updated Successfully');
     res.redirect('/stagings');
});

router.delete('/stagings/delete/:id', isAuthenticated, async (req, res) => {
    await Staging.findOneAndDelete(req.param.id);
    req.flash('success_msg', 'Staging Deleted Successfully');
    res.redirect('/stagings');
});

module.exports = router;