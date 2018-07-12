import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

import Model from './models/Model';
import Routes from './routes/Routes';

const app = express();
const urlencoded = bodyParser.urlencoded({ extended: false });
const json = bodyParser.json();
const port = parseInt(process.env.PORT, 10) || 8000;

app.set('view engine', 'ejs');

app.use(urlencoded);
app.use(json);
app.use(morgan('combined'));
app.use(cookieParser());
app.use(express.static('views/statics'));

Model();


app.use('/', Routes);
app.use('*', (req, res) => res.render('error'));

app.listen(port);
