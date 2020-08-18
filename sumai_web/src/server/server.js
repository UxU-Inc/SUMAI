const express = require('express');
const session = require('express-session')
const dbconfig   = require('./security/database');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require("body-parser");
const api = require('./routes/index');

const app = express();
// const cors = require('cors');
const PORT = process.env.PORT || 3306;

const sessionStore = new MySQLStore(dbconfig);

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true, 
//   };
// app.use(cors(corsOptions));
// app.use(cors());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: sessionStore 
}))

app.use('/api', api);

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})