const express = require('express');
const app = express();
const path = require('path');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))

var username = "riya";
var password = 123;

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  store: new FileStore({ path: './session-data' })
}));

app.post('/validate', (req, res) => {
  var uname = req.body.username;
  var pass = req.body.password;
  if (uname && pass) {
    if (uname == username && pass == password) {
      req.session.loggedIn = true;
      req.session.username = uname;
      req.session.password = pass;
      res.redirect('/home');
    }
    else {
      res.send("Incorrect username or password!!!");
    }
  }
  else {
    res.send("Please enter username and password!!!");
  }
});

app.get('/home', (req, res) => {
  if (req.session.loggedIn) {
    res.send("Welcome " +
			req.session.username +
			"<br>" + req.session.id
			+ "!!!" +	"<br><a href='./logout'>Logout</a>" );
  }
  else {
    res.redirect('/login.html');
  }
});

app.get('/logout', (req, res) => {
  if (req.session.loggedIn) {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          res.send(err);
        }
        else {
          res.clearCookie("connect.sid");
          res.redirect('/login.html');
        }
      })
    }
  }
  else {
    res.redirect('/login.html');
  }
})

app.listen(8000);
console.log("App is listening on port 8000");