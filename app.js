const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'list_app',
  password: 'list_app',  
  database: 'list_app'
});

// confirm connection to mysql
// using mysql8, an error occurred on 14 nov 2020, see below.
// https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server/50961428:embed:cite
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('The connection to the db was successful.');
});

// test connecting to db.
app.get('/hello', (req, res) => {
  connection.query(
    'SELECT * FROM items;',
    (error, results) => {
      console.log(results);
      res.render('hello.ejs');
    }
  )
});


// routing
// page top
app.get('/', (req, res) => {
  res.render('top.ejs');
});

// page index
app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items;',
    (error, results) => {
      // console.log(results);
      res.render('index.ejs', {items: results});
    }
  )
});

// page new
app.get('/new', (req, res) => {
  res.render('new.ejs');
});

// action create
app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) values (?);', [req.body.itemName],
    (error, results) => {
      res.redirect('/index')
    }
  );
});

// action delete
app.post('/delete/:id', (req, res) => {
  // console.log(req.params.id);
  connection.query(
    'DELETE FROM items where id=?', [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

// page edit
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items where id=?', [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

// action update
app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name=? WHERE id=?', [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.listen(3000);