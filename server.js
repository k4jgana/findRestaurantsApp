const mongoose = require('mongoose');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
const cors = require('cors')
const { checkAuthenticated, checkNotAuthenticated } = require('./auth');
const Restaurant = require('./models/Restaurant');
const { json } = require('express');
require('./passport')(passport);
// const logicHome = require('./home_public/browser-app')
// const styleHome = require('./home_public/styles_home.css')
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
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors())

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true, useUnifiedTopology: true })
.then(console.log('db connected'))
.catch(err => console.log(err));


// nenad ness

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
        //console.log(user)
        res.redirect('/login')
    })
    
    // User.findOne({ email })
    // .then(user => {
    //     if(user) {
    //         res.redirect('/register');
    //     }
    //     const newUser = new User({ firstName, lastName, email, password, preference, address, number });
    //     newUser.save()
    //     .then(res.redirect('/login'))
    //     .catch(err => console.log(err));
    // });
});

// nenad ness

app.get('/login', checkNotAuthenticated ,(req, res) => {
    res.render('login');
});

// app.get('/map',(req, res) => {
//     res.render('map');
// });


app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');//ovde bese dashboard
});

app.get('/dashboard', checkAuthenticated, (req, res) => {
    res.render('dashboard', { name: req.user.firstName });
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

app.listen(3000, () => {console.log('app started')})



