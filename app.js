const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const app = express()
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const  passwordReset = require('./routes/passwordReset');
//dotenv
dotenv.config({ path: 'config.env' })

//view engine
app.set('view engine', 'ejs')

//miidleware
app.use(express.static('public'))
app.use(express.json());
app.use(cookieParser())

//database connection
const dbURI = process.env.MONGOURI
mongoose.connect(dbURI)
    .then(() => {
        app.listen(process.env.PORT)
        console.log(`DB connected listening on http://localhost:${process.env.PORT}`)
    })
    .catch(err => console.log(err))

//route
//apply '*' to every get request
app.get('*',checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/pds', requireAuth, (req, res) => res.render('products'));
app.use('/pass', passwordReset);
app.use(authRoutes)