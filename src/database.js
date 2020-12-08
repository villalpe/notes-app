const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/notes-db-app', {
   useCreateIndex: true,
   useNewUrlParser: true,
   useFindAndModify: false,
   useUnifiedTopology: true
})
    .then(db => console.log('Db is connected!'))
    .catch(err => console.log(err));