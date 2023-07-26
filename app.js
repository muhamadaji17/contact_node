const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const Contact = require('./model/contact')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

require('./utils/db')

const app = express()
const port = 3000

//config flash
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//ejs
app.set('view engine', 'ejs')
//buildin middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
//third party middleware
app.use(expressLayouts)
app.use(methodOverride('_method'))


//halaman home
app.get('/', (req, res) => {

    const mahasiswa = [
        {
            nama: 'aji',
            umur: 11
        },
        {
            nama: 'oji',
            umur: 21
        },
        {
            nama: 'ojan',
            umur: 12
        },
    ]

    res.render('index', {
        nama: 'aji',
        title: 'Halaman Home',
        mahasiswa,
        layout: 'layouts/main-layout'

    })
})

//about
app.get('/about', (req, res) => {
    res.render('about', {
        nama: 'aji',
        title: 'Halaman About',
        layout: 'layouts/main-layout'
    })
})

//contact
app.get('/contact', async (req, res) => {

    const contacts = await Contact.find()

    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contacts,
        msg: req.flash('msg')
    })
})

//tambah data
app.get('/contact/add', (req, res) => {
    res.render('addContact', {
        title: 'Form Add Contact',
        layout: 'layouts/main-layout'
    })
})

// insert data
app.post('/contact', [
    check('email', 'E-Mail Tidak Valid').isEmail(),
    check('noHp', 'Nomor Handphone Tidak Valid').isMobilePhone('id-ID'),
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (duplikat) {
            throw new Error('Gunakan nama lain')
        }
        return true
    })
]
    , (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('addContact', {
                title: 'Form add Contact',
                layout: 'layouts/main-layout',
                errors: errors.array()
            })
            // return res.status(400).json({ errors: errors.array() })
        } else {
            Contact.insertMany(req.body, (error, result) => {
                req.flash('msg', 'Berhsil di tambah')
                res.redirect('/contact')
            })
        }
    })

//Delete Contact
// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.findOne({ nama: req.params.nama })
//     if (!contact) {
//         res.status(404)
//         res.send('<h1>404</h1>')
//     } else {
//         Contact.deleteOne({ _id: contact._id }).then((result) => {

//             req.flash('msg', 'Berhsil di hapus')
//             res.redirect('/contact')
//         })

//     }
// })
app.delete('/contact/', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }).then((result) => {

        req.flash('msg', 'Berhsil di hapus')
        res.redirect('/contact')
    })

})

//edit Contact
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama })
    res.render('editContact', {
        title: 'Form edit Contact',
        layout: 'layouts/main-layout',
        contact
    })
})

//update contact
// app.post('/contact/update/:nama', [
//     check('email', 'E-Mail Tidak Valid').isEmail(),
//     check('noHp', 'Nomor Handphone Tidak Valid').isMobilePhone('id-ID'),
//     body('nama').custom((value, { req }) => {
//         const duplikat = cekDuplikat(value)
//         if (value !== req.body.oldNama && duplikat) {
//             throw new Error('Gunakan nama lain')
//         }
//         return true
//     })
// ]
//     , (req, res) => {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             res.render('editContact', {
//                 title: 'Form Edit Contact',
//                 layout: 'layouts/main-layout',
//                 errors: errors.array(),
//                 contact: req.body
//             })
//             // return res.status(400).json({ errors: errors.array() })
//         }
//         else {
//             updateContact(req.body)
//             req.flash('msg', 'Berhsil di Update')
//             res.redirect('/contact')
//         }
//     })

app.put('/contact', [
    check('email', 'E-Mail Tidak Valid').isEmail(),
    check('noHp', 'Nomor Handphone Tidak Valid').isMobilePhone('id-ID'),
    body('nama').custom(async (value, { req }) => {
        const duplikat = await Contact.findOne({ nama: value })
        if (value !== req.body.oldNama && duplikat) {
            throw new Error('Gunakan nama lain')
        }
        return true
    })
]
    , (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render('editContact', {
                title: 'Form Edit Contact',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                contact: req.body
            })
            // return res.status(400).json({ errors: errors.array() })
        }
        else {
            Contact.updateOne({ _id: req.body._id }, {
                $set: {
                    nama: req.body.nama,
                    noHp: req.body.noHp,
                    email: req.body.email
                }
            }).then((result) => {
                req.flash('msg', 'Berhsil di Update')
                res.redirect('/contact')

            })
        }
    })



//detail 
app.get('/contact/:nama', async (req, res) => {
    // const contact = findContact(req.params.nama)
    const contact = await Contact.findOne({ nama: req.params.nama })

    res.render('detailContact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact',
        contact
    })
})







app.listen(port, () => {
    console.log(`This app now listening at http://localhost:${port}`)
})