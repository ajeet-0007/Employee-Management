const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json());


const userRoutes = require('./routes/userRoutes');


app.use('/user', userRoutes);

app.listen(8080);