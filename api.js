/**
 * Created by tavete on 4/28/16.
 */

var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var logger = require('./logger');
var app = express();
var connection;
var app_port = 3001;

var dbProd = {
  host     : 'historicocai.db.8518296.hostedresource.com',
  user     : 'historicocai',
  password : 'HistoCai!666',
  database : 'historicocai'
};

var databaseConnect = function(){
  connection = mysql.createConnection(dbProd);

  connection.connect(function(err) {
    if(err) {
      logger.error('Error when connecting to database:', err);
      setTimeout(databaseConnect, 2000);
    }else{
      logger.info('Database connected to '+dbProd.host);
    }
  });

  connection.on('error', function(err) {
    logger.error('Database error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.info('Reconnecting to database...');
      databaseConnect();
    } else {
      throw err;
    }
  });
};

var apiCallback = function (err, rows, res) {
  if (!err){
    res.status(200).send(rows);
  }else{
    res.status(500).send(err);
  }
};

var logQuery = function(query){
  logger.info("DB Query: " + query);
}

app.use(bodyParser.json()); // for parsing application/json
databaseConnect();



app.get('/api/arbitros', function(req, res){

  if(req.query.id){
    var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN arbitros on p.personas_id = arbitros.personas_id WHERE p.personas_id = ? ORDER BY p.personas_apellido ASC;";
    connection.query(query, [req.query.id], function(err, rows){
      logQuery(query);
      apiCallback(err, rows, res);
    });
  }else{
    var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN arbitros on p.personas_id = arbitros.personas_id ORDER BY p.personas_apellido ASC;";
    connection.query(query, function(err, rows) {
      logQuery(query);
      apiCallback(err, rows, res);
    });
  }
});

app.get('/api/tecnicos', function(req, res){

  if(req.query.id){
    var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id WHERE p.personas_id = ? ORDER BY p.personas_apellido ASC;";
    connection.query(query, [req.query.id], function(err, rows){
      logQuery(query);
      apiCallback(err, rows, res);
    });
  }else{
    var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id ORDER BY p.personas_apellido ASC;";
    connection.query(query, [req.query.id], function(err, rows){
      logQuery(query);
      apiCallback(err, rows, res);
    });
  }
});


var server = app.listen(app_port);
