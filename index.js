import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes/api';
import path from 'path';
import helmet from 'helmet';
import session from 'express-session';

const app = express();

require('dotenv').config();

const port = process.env.PORT || 5000;

//connect to the database
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log(`Database connected successfully`)
  })
  .catch(err => console.log(err));

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(helmet())
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  maxAge: 5 * 60 * 60 * 1000, // 8 hours
}))
app.use('/api', routes);

//app.use(express.static(path.join(__dirname, 'build')));

app.use(express.static("client/build"));
  
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.use((err, req, res, next) => {
  console.log(err); 
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
