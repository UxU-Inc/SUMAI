const express = require('express');
const session = require('express-session')
const dbconfig   = require('./security/database');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const rateLimit = require ('express-rate-limit'); 
const api = require('./routes/index');

const app = express();
// const cors = require('cors');
const PORT = process.env.PORT || 3306;

const sessionStore = new MySQLStore(dbconfig);

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {error: 'Too many requests, please try again later.', code: 429},
    onLimitReached: (req) => console.log(req.ip),
});

//  apply to all requests
app.use(limiter);

const loginlimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {error: 'Too many requests, please try again later.', code: 429},
    onLimitReached: (req) => console.log(req.ip),
    skipSuccessfulRequests: true,
});

app.use("/api/account/login", loginlimiter);

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true, 
//   };
// app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: sessionStore 
}))

app.use(passport.initialize());
app.use(passport.session());


app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})