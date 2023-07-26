const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});



//tambah 1 data
// const contact1 = new Contact({
//     nama: 'oji',
//     noHp: '08128981298192',
//     email: '0ji@email.com'
// })

// //save colection
// contact1.save().then((contact) => console.log(contact))