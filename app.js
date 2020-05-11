const express = require('express');
let sequelize = require('./models').sequelize;

const routes = require('./routes/index');
const books = require('./routes/books');

const app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);
app.use('/books', books);

// render error page in case of 404
app.use(function (req,res){
	res.render('page-not-found');
});

// start the server only after the database has been synced
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
});

