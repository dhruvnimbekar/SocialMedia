const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8000;
const expressLayout = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require("express-session");
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const { pass } = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


app.use(sassMiddleware({
    src: "./assets/scss",
    dest: "./assets/css",
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'

}));
app.use(express.urlencoded());

app.use(cookieParser());
app.use(express.static('./assets'));
app.use('/users/profile/uploads',express.static(__dirname + '/uploads'));//make the uploads pathe available to browser
app.use(expressLayout);

// extract styles and scripts from the subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
//set up the view engine
app.set("view engine", "ejs");
app.set('views', './views');
//mongo store is used to store session cookie in the db
app.use(session({
    name: 'codeial',
    //todo
    secret: 'something',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            // mongooseConnection: db,
            // autoRemove: 'disabled'
            mongoUrl: 'mongodb://localhost/codeial_development'
        }
    )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash()); // after passport.session at it is stored in session cokie
app.use(customMware.setFlash);
//mapping
app.use('/', require('./routes'));
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
