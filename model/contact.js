const mongoose = require('mongoose')

//create schema
const Contact = mongoose.model('Contact', {
    nama: {
        type: String,
        require: true
    },
    noHp: {
        type: String,
        require: true
    },
    email: {
        type: String,
    }
})

module.exports = Contact