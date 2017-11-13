/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const errorHandler = require('errorhandler');
const passport = require('passport');

const kakaoPlusController = require('./controllers/kakao/kakaoChat');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

/**
 * Create Express server.
 */
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Connect to PostgreSQL.
 */
const pg = require('pg');
const connectionString = "postgres://" + process.env.POSTGRESQLDB_USER + ":" + process.env.POSTGRESQLDB_PASSWORD + "@" + process.env.POSTGRESQLDB_HOST + ":" + process.env.POSTGRESQLDB_PORT + "/" + process.env.POSTGRESQLDB_DBNAME;

const client = new pg.Client({
    user: process.env.POSTGRESQLDB_USER,
    host: process.env.POSTGRESQLDB_HOST,
    database: process.env.POSTGRESQLDB_DBNAME,
    password: process.env.POSTGRESQLDB_PASSWORD,
    port: process.env.POSTGRESQLDB_PORT,
});
client.connect();
// const text = 'INSERT INTO tb_user(user_name, email) VALUES($1, $2) RETURNING *'
// const values = ['hoang', 'hoangdktd@gmail.com']
// client.query(text, values, (err, res) => {
//   if (err) {
//     console.log(err.stack)
//   } else {
//     console.log(res.rows[0])
//     // { name: 'hoang', email: 'hoangdktd@gmail.com' }
//   }
// })

// const pool = new pg.Client();
// pool.connect(connectionString,function(err,client,done) {
//     if(err){
//       console.log("not able to get connection "+ err);
//     } 
//     client.query('SELECT * FROM student where id = $1', [1],function(err,result) {
//       done(); // closing the connection;
//       if(err){
//         console.log(err);
//       }
//       console.log(result.rows);
//     });
// });

// Require our routes into the application.
require('./routes')(app);

app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to the beginning of nothingness.',
}));

app.listen((process.env.PORT || 8000), function () {
    console.log("Server up and listening");
});

exports.keyboard = kakaoPlusController.getKeyBoard;
exports.message = kakaoPlusController.postMessage;
