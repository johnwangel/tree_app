/*jshint esversion: 6 */
const PORT = process.env.PORT || 3000;

const express = require('express');

const expHbs = require('express-handlebars');
const bodyParser = require('Body-Parser');

const app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

const tree = require('./routes/trees');
app.use('/trees', tree);

const hbs = expHbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

module.exports = app;
