require('dotenv-flow').config();

const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

const privateKey  = fs.readFileSync('/etc/letsencrypt/live/andrgladkikh.online/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/andrgladkikh.online/fullchain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const url = process.env.HTTP_URL
const port = process.env.HTTP_PORT

const env = process.env.NODE_ENV || 'development';

app.get('/', function (req, res) {
    res.send('Server bot is started.')
});

app.use(express.static('public'));

// app.listen(port, () => {
//     console.log(`App listening at port ${port}`)
// });


const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);

