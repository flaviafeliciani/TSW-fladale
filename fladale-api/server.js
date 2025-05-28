const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const cors = require("cors");
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    credentials: true
}));

const apiRouter = require('./routes/api');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/consigli-page', express.static(path.join(__dirname, '../consigli-page')));
app.use('/home-page', express.static(path.join(__dirname, '../home-page')));
app.use('/giardino-page', express.static(path.join(__dirname, '../giardino-page')));
app.use('/scopri-page', express.static(path.join(__dirname, '../scopri-page')));
app.use('/storia-page', express.static(path.join(__dirname, '../storia-page')));
app.use('/immagini_comuni', express.static(path.join(__dirname, '../immagini_comuni')));
app.use('/log-in-page', express.static(path.join(__dirname, '../log-in-page')));
app.use('/profilo-page',express.static(path.join(__dirname,'../profilo-page')));
app.use('/dettaglio-page',express.static(path.join(__dirname,'../dettaglio-page')));
app.use('/password-dimenticata-page',express.static(path.join(__dirname,'../password-dimenticata-page')));
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});
