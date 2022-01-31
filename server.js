const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
const { checkAuthenticated, checkNotAuthenticated } = require('./auth');
const Restaurant = require('./models/Restaurant');
const { json } = require('express');
require('./passport')(passport);
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb+srv://nenad:n160800@cluster0.bikfm.mongodb.net/app_res?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log('db connected'))
.catch(err => console.log(err));


app.get('/register',checkNotAuthenticated ,(req,res)=> {
    res.render('register');
});
app.get('/', (req,res)=> {
    res.render('login');
});



app.post('/register',  (req,res)=> {
    const { firstName, lastName, email, password, address, number } = req.body;
    
    console.log(req.body)

    let user = {
        firstName: firstName,
        lastName: lastName,
        email:email,
        password:password,
        address:address,
        number:number
    }
    User.create(user, (err, user) => {
        if (!err) {
            console.log('error')
        }
        res.redirect('/login')
    })
});

app.get('/login', checkNotAuthenticated ,(req, res) => {
    res.render('login');
});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});


app.get('/home',checkAuthenticated, (req,res) => {
    Restaurant.find({}, (err, restaurants) => {
        res.render('home.ejs', {restaurants: restaurants, str_rest: JSON.stringify(restaurants)})
    })
})

app.listen(process.env.PORT || 3000, () => {console.log('app started')})



