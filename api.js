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
var expUserAgent = "Bochini";
var error400Message = "Access is restricted. Email fernando@tavora.com.ar for further information.";

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
    logRows(rows.length);
  }else{
    res.status(500).send(err);
  }
};

var checkHeader = function(req, res, exp){
  if(req.header('User-Agent') !== exp){
    logger.error("Header error: User-Agent is not valid!");
    res.status(400).send(error400Message);
    return false;
  }else{
    return true;
  }
}

var logQuery = function(query){
  logger.info("DB Query: " + query);
}

var logRows = function(rows){
  logger.info("DB Rows: " + rows);
}

app.use(bodyParser.json()); // for parsing application/json
databaseConnect();

app.get('/api/arbitros', function(req, res){
  if(checkHeader(req, res, expUserAgent)){
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
  }
});

app.get('/api/tecnicos', function(req, res){
  if(checkHeader(req, res, expUserAgent)) {
    if (req.query.id) {
      var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id WHERE p.personas_id = ? ORDER BY p.personas_apellido ASC;";
      connection.query(query, [req.query.id], function (err, rows) {
        logQuery(query);
        apiCallback(err, rows, res);
      });
    } else {
      var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id ORDER BY p.personas_apellido ASC;";
      connection.query(query, function (err, rows) {
        logQuery(query);
        apiCallback(err, rows, res);
      });
    }
  }
});

app.post('', function(req, res){
//  todo hacer /api/partidos por post
});

app.get('/api/partidos', function(req, res){
  if(checkHeader(req, res, expUserAgent)) {
    var query = "SELECT * FROM partidos_detalle";
    if (Object.getOwnPropertyNames(req.query).length > 0) {

      var params = Object.getOwnPropertyNames(req.query).length;
      var count = 0;
      var limit = 0;
      for (var propName in req.query) {
        if (typeof req.query[propName] == "string") {
          if (propName !== "limit") {
            switch (true) {
              case (query.indexOf("WHERE") == -1 && params == 1):
                query = query + " WHERE " + propName + "=" + req.query[propName];
                break;
              case (query.indexOf("WHERE") == -1 && params > 1):
                query = query + " WHERE " + propName + "=" + req.query[propName] + " AND ";
                break;
              case (count == params - 1 && query.indexOf("AND") !== -1):
                query = query + propName + "=" + req.query[propName];
                break;
              case (count > 0 && count <= params - 1 && query.indexOf("AND") == -1):
                query = query + " AND " + propName + "=" + req.query[propName];
                break;
              case (count > 0 && count <= params - 1 && query.indexOf("AND") !== -1):
                query = query + propName + "=" + req.query[propName];
                break;
            }
          } else {
            limit = req.query[propName];
          }
          count++;
        } else {
          res.status(400).send("there is more than one " + propName + " param!");
          return;
        }
      }
      if (limit > 0) {
        query = query + " LIMIT " + limit;
      }
      query = query + ";";
    } else {
      query = query + ";";
    }
    connection.query(query, function (err, rows) {
      logQuery(query);
      apiCallback(err, rows, res);
    });
  }
});

app.get('/', function(req, res){
  res.status(200).send(error400Message);
});

var server = app.listen(process.env.PORT || app_port); //process.env.PORT is to have the app working on heroku
