const bluebird = require('bluebird');
const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const passport = require('passport');
const pgp = require('pg-promise');
const socket = require('socket.io');

const dbConfig = require('./server/database');
const expressConfig = require('./server/express');
const passportConfig = require('./server/passport');

(async () => {
    dotenv.config();

    const serverPort = process.env.SERVER_PORT;

    const db = dbConfig(bluebird, pgp);
    passportConfig(passport, db);

    const app = express();
    const httpApp = http.Server(app);

    httpApp.listen(serverPort, console.log(`Server running on port ${serverPort}`));

    const io = socket(httpApp);

    await expressConfig(express, app, db, io, passport);
})().catch(console.error);
