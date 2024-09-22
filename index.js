require('dotenv').config()
const express =require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');
const session = require('cookie-session');
const flash = require('connect-flash');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
// const compression = require('compression');
// const helmet = require('helmet');


const app = express();

const PORT = process.env.PORT || 3000

// ************************  Database Connection  **********************************//
const {connectMonggose} = require('./config/db')
connectMonggose();

app.use(express.json());

// app.use(compression());
//
// app.use(helmet());

//run seeders
const {superAdmin} = require('./seeders/admin');
superAdmin();

// *************************    Assets    ****************************************//
app.use(urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Configure express-flash and express-session
app.use(session({
  secret: 'jwtSecret',
  resave: false,
  saveUninitialized: false,
}));


app.use(flash());

// Middleware to set user token if not present
app.use((req, res, next) => {
  if (!req.cookies.userToken) {
    res.cookie('userToken', new mongoose.Types.ObjectId(), { maxAge: 2 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  }
  next();
});

// Middleware for flash messages
app.use(function (req, res, next) {
  res.locals.successMessage = req.flash('success');
  res.locals.welcomeMessage = req.flash('welcome');
  res.locals.errorMessage = req.flash('error');
  res.locals.logoutMessage = req.flash('logout');
  res.locals.warningMessage = req.flash('warning');
  next();
});

// ***********************************Routes ********************************//
app.use(require("./routes/index"))
app.use(require("./routes/users"))
app.use(require("./routes/admin"))
app.use(require("./routes/blogpost"))
app.use(require("./routes/account"))
app.use(require("./routes/reviews"))



app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    const sitemap = new SitemapStream({ hostname: 'https://www.junubclassic.com/' });
    const pipeline = sitemap.pipe(createGzip());

    sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
    sitemap.end();

    streamToPromise(pipeline).then(sm => res.send(sm)).catch((err) => {
        console.error(err);
        res.status(500).end();
    });
});


app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.sendFile(path.join(__dirname, 'public/robots.txt'));
});

// ************************* PORT ***********************************//

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
