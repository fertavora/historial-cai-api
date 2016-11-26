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
var expAuth = "Basic 7809caf6b7a050635bba9e72453bad47";
var dbProd = {
  //base de godaddy
  host     : 'historicocai.db.8518296.hostedresource.com',
  user     : 'historicocai',
  password : 'HistoCai!666',
  database : 'historicocai'

  //base localhost
  // OJO CON DEPLOYAR A HEROKU!!! ******************
  // host     : 'localhost',
  // user     : 'root',
  // password : 'Joaquin!01',
  // database : 'historicocai'

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
    //res.set('Content-Type', 'application/json');
    res.status(200).send(rows);
    logRows(rows.length);
  }else{
    res.status(500).send(err);
  }
};

var checkHeader = function(req, res, exp){
  logger.info("Header Security-Pass: " + req.header('Security-Pass'));
  if(req.header('Security-Pass') !== exp){
    logger.error("Header error: Security-Pass is not valid!");
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

var buildQuery = function(req, res, connection, table_name){
  var query = "SELECT * FROM "+table_name;
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
    query = query + ";"; //Si decidimos poner un limit por default, va acá -> query = query + " LIMIT 100;"
  }
  connection.query(query, function (err, rows) {
    logQuery(query);
    apiCallback(err, rows, res);
  });
}

app.use(bodyParser.json()); // for parsing application/json

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Security-Pass');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      console.log("OPTIONS "+req.get('Access-Control-Request-Headers'));
      res.set('Allow', 'GET,PUT,POST,DELETE,OPTIONS');
      res.status(200).send("OK");
    }
    else {
      next();
    }
};

app.use(allowCrossDomain);

databaseConnect();

app.post('/api/arbitros', function(req, res) {
  connection.query("SELECT MAX(personas_id) as id FROM personas;", function(err, rows){
    if(!err){
        var toSave = {
          personas_id: rows[0].id+1,
          personas_nombre: req.body.nombre,
          personas_apellido: req.body.apellido,
          paises_id: req.body.pais.paises_id,
          personas_fecha_nac: req.body.fecha_nac
        }

        connection.query("INSERT INTO personas SET ? ", toSave, function(err){
          if(!err){
            var toSave = {personas_id: rows[0].id+1}
            connection.query("INSERT INTO arbitros SET ? ", toSave, function(err){
              if(!err){
                res.json("{'status': 'ok'}");
              }else{
                res.status(500).send(err);
              }
            });
          }else{
            res.status(500).send(err);
          }
        });
      }else{
        res.status(500).send(err);
      }
  });
});

app.get('/api/arbitros', function(req, res){
  // if(checkHeader(req, res, expUserAgent)){
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
  // }
});

app.post('/api/tecnicos', function(req, res){
  connection.query("select max(personas_id) as id from personas;", function(err, rows){
    if(!err){
      var toSave = {
        personas_id: rows[0].id+1,
        personas_nombre: req.body.nombre,
        personas_apellido: req.body.apellido,
        paises_id: req.body.pais.paises_id,
        personas_fecha_nac: req.body.fecha_nac
      }

      connection.query("INSERT INTO personas SET ? ", toSave, function(err){
        if(!err){
          //reset all tecnicos
          if(req.body.activo==1){
            connection.query("UPDATE tecnicos SET tecnicos_activo = 0;", function(err){
              if(err){
                res.status(500).send(err);
              }
            });
          }

          var toSave = {personas_id: rows[0].id+1,
                        tecnicos_activo: req.body.activo}
          connection.query("INSERT INTO tecnicos SET ? ", toSave, function(err){
            if(!err){
              res.json("{'status': 'ok'}");
            }else{
              res.status(500).send(err);
            }
          });
        }else{
          res.status(500).send(err);
        }
      });
    }else{
      res.status(500).send(err);
    }
  });
});

app.get('/api/tecnicos', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    if (req.query.id) {
      var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido, tecnicos.tecnicos_activo FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id WHERE p.personas_id = ? ORDER BY p.personas_apellido ASC;";
      connection.query(query, [req.query.id], function (err, rows) {
        logQuery(query);
        apiCallback(err, rows, res);
      });
    } else {
      var query = "SELECT p.personas_id, p.personas_nombre, p.personas_apellido, tecnicos.tecnicos_activo FROM personas as p INNER JOIN tecnicos on p.personas_id = tecnicos.personas_id ORDER BY p.personas_apellido ASC;";
      connection.query(query, function (err, rows) {
        logQuery(query);
        apiCallback(err, rows, res);
      });
    }
  // }
});

app.post('/api/partidos', function(req, res){
  //get max parditos id
  connection.query("SELECT MAX(partidos_id) as id FROM partidos;", function(err, rows){
    if(!err){
      var toSave = {
        partidos_id: rows[0].id+1,
        equipos_id: req.body.equipo.equipos_id,
        torneos_instancias_id: req.body.torneo.torneos_instancias_id,
        personas_id: req.body.tecnico.personas_id,
        partidos_dia: req.body.dia,
        partidos_instancia: req.body.instancia,
        partidos_condicion: req.body.condicion,
        partidos_goles_cai: req.body.golescai,
        partidos_goles_rival: req.body.golesrival,
        partidos_penales: null,
        partidos_observaciones: null,
        arbitros_id: req .body.arbitro.personas_id
      }

      connection.query("INSERT INTO partidos SET ? ", toSave, function(err, result){
        if(!err){
          res.json("{'status': 'ok'}");
        }else{
          res.status(500).send(err);
        }
      });
    }else{
      res.status(500).send(err);
    }
  });
});

app.get('/api/partidos', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "partidos_detalle");
  // }
});

app.post('/api/equipos', function(req, res){
  connection.query("SELECT MAX(equipos_id) as id FROM equipos;", function(err, rows){
    if(!err){
      var toSave = {
        equipos_id: rows[0].id+1,
        equipos_nombre: req.body.nombre,
        equipos_fecha: req.body.fecha,
        equipos_estadio: req.body.estadio,
        equipos_escudo: req.body.escudo,
        ciudades_id: req.body.ciudad.ciudades_id,
        provincia_id: req.body.provincia.provincia_id,
        paises_id: req.body.pais.paises_id
      }
      
      connection.query("INSERT INTO equipos SET ?", toSave, function(err){
        if(!err) {
          res.json("{'status': 'ok'}");
        }else{
          res.status(500).send(err);
        }
      })
    }else{
      res.status(500).send(err);
    }
  });
})

app.get('/api/equipos', function(req, res){
  //if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "equipos");
 // }
});

app.post('/api/torneos', function(req, res){
  connection.query("SELECT MAX(torneos_id) as id FROM torneos;", function(err, rows){
    if(!err){
      var toSave = {
        torneos_id: rows[0].id + 1,
        torneos_nombre: req.body.nombre,
        torneos_tipo: req.body.tipo
      }

      connection.query("INSERT INTO torneos SET ? ", toSave, function(err){
        if(!err){
          res.json("{'status': 'ok'}");
        }else{
          res.status(500).send(err);
        }
      });

    }else{
      res.status(500).send(err);
    }
  })
});

app.get('/api/torneos', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "torneos");
  // }
});

app.post('/api/torneos-instancias', function(req, res){
  connection.query("SELECT MAX(torneos_instancias_id) as id FROM torneos_instancias;", function(err, rows){
    if(!err){
      var toSave = {
        torneos_instancias_id: rows[0].id+1,
        torneos_instancias_nombre: req.body.nombre,
        torneos_id: req.body.torneo.torneos_id,
        torneos_instancias_anio: req.body.anio,
        torneos_instancias_ubicacion: null
      }

      connection.query("INSERT INTO torneos_instancias SET ? ", toSave, function(err){
        if(!err){
          res.json("{'status': 'ok'}");
        }else{
          res.status(500).send(err);
        }
      });

    }else{
      res.status(500).send(err);
    }
  });
});

app.get('/api/torneos-instancias', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "torneos_instancias");
  // }
});

app.get('/api/paises', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "paises");
  // }
});

app.get('/api/provincias', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "provincias");
  // }
});

app.get('/api/ciudades', function(req, res){
  // if(checkHeader(req, res, expUserAgent)) {
    buildQuery(req, res, connection, "ciudades");
  // }
});

var server = app.listen(process.env.PORT || app_port); //process.env.PORT is to have the app working on heroku