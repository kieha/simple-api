/* eslint-disable no-console */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jsend from 'jsend';
import routes from './server/routes';

const app = express();
const apiRouter = express.Router();

const env = process.env.NODE_ENV;
let port = 8000;
let db = 'mongodb://localhost:27017/journalApp';

if (env === 'test') {
  port = 5000;
  db = 'mongodb://localhost:27017/journalApp-test';
}

mongoose.Promise = global.Promise;

// app middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(jsend.middleware);
app.use('/api', routes(apiRouter));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const mongoConnection = mongoose.connect(db, {
  useMongoClient: true,
});

mongoConnection.then(() => {
  console.log('Database connection successful');
}, (err) => {
  console.log('An error occured while connecting to the database:', err.message);
});

app.listen(port, (err) => {
  if (err) {
    console.log('An error occured while connecting:', err);
  }
  console.log(`App listening 👂🏽 on port ${port}`);
});

module.exports = app;
