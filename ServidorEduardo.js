var express = require('express');
var app = express();

var config = require("./config.json");

var mysql      = require('mysql');
var connection1 = mysql.createConnection(config);

connection1.connect();

app.param(function(name, fn){
  if (fn instanceof RegExp) {
    return function(req, res, next, val){
      var captures;
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures;
        next();
      } else {
        next('route');
      }
    }
  }
});

app.param('id', /^\d+$/);

app.get('/diccionario_acepcion/:id', function(req, res, next){
connection1.query('SELECT * FROM diccionario.acepcion where id_acepcion = ?;', 
                   [req.params.id], function(err, rows, fields) {
  if (err) throw err;

  res.send(JSON.stringify(rows[0]));
  next();
});
});

app.get('/hola.txt', function(req, res){
  res.send('Hola Mundo Cruel dos');
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);

});

//  Para cerrar la conexión, parece que no es necesario 
//       connection.end();
