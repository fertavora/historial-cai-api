/**
 * Created by tavete on 4/28/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./logger');
var app = express();
var app_port = 3001;
var expected_credentials = [process.env.USERNAME || 'historialcai', process.env.PASSWORD || 'ecrM54ulxN'];
var ResponseMessage = require('./response_message');

var unauthorizedResponse = function(res){
  res.set({
    'WWW-Authenticate': 'Basic realm="Por favor identifíquese"'
  });
  var rm = new ResponseMessage("401", "Not authorized");
  // return res.status(401).send({code: 401, error: "No autorizado"});
  res.status(rm.getStatus()).send(rm.toString());
};

var authenticateCredentials = function(c){
  var auth_string = c.split(' ')[1];
  var decoded = new Buffer(auth_string, 'base64').toString('ascii');
  var credentials = decoded.split(':');
  return (credentials[0] == expected_credentials[0] && credentials[1] == expected_credentials[1]);
};

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

app.get('/v0/equipo', function(req, res){
  logger.info("GET /equipo");
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //todo mongo query
      var rm = new ResponseMessage("200", "Falta consultar a Mongo");
      res.status(rm.getStatus()).send(rm.toString());
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.post('/v0/equipo', function(req, res){
  logger.info('POST /equipo');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //verificar schema de req.body
      var expectedSchema = require('./schemas/equipo');
      var JaySchema = require('jayschema');
      var js = new JaySchema();
      js.validate(req.body, expectedSchema, function(errs){
        if(errs){
          logger.error(errs[0].kind, errs[0].desc);
          var rm = new ResponseMessage("400", "Bad Request");
          res.status(rm.getStatus()).send(rm.toString());
        }else{
          //todo guardar en mongo
          var rm = new ResponseMessage("200", "Falta guardar en Mongo");
          res.status(rm.getStatus()).send(rm.toString());
        }
      })
      
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.get('/v0/torneo', function(req, res){
  logger.info('GET /torneo');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //todo mongo query
      var rm = new ResponseMessage("200", "Falta consultar a Mongo");
      res.status(rm.getStatus()).send(rm.toString());
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.post('/v0/torneo', function(req, res){
  logger.info('POST /torneo');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //verificar schema de req.body
      var expectedSchema = require('./schemas/torneo');
      var JaySchema = require('jayschema');
      var js = new JaySchema();
      js.validate(req.body, expectedSchema, function(errs){
        if(errs){
          logger.error(errs[0].kind, errs[0].desc);
          var rm = new ResponseMessage("400", "Bad Request");
          res.status(rm.getStatus()).send(rm.toString());
        }else{
          //todo guardar en mongo
          var rm = new ResponseMessage("200", "Falta guardar en Mongo");
          res.status(rm.getStatus()).send(rm.toString());
        }
      })
      
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.get('/v0/ediciontorneo', function(req, res){
  logger.info('GET /ediciontorneo');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //todo mongo query
      var rm = new ResponseMessage("200", "Falta consultar a Mongo");
      res.status(rm.getStatus()).send(rm.toString());
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.post('/v0/ediciontorneo', function(req, res){
  logger.info('POST /ediciontorneo');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //verificar schema de req.body
      var expectedSchema = require('./schemas/ediciontorneo');
      var JaySchema = require('jayschema');
      var js = new JaySchema();
      js.validate(req.body, expectedSchema, function(errs){
        if(errs){
          logger.error(errs[0].kind, errs[0].desc);
          var rm = new ResponseMessage("400", "Bad Request");
          res.status(rm.getStatus()).send(rm.toString());
        }else{
          //todo guardar en mongo
          var rm = new ResponseMessage("200", "Falta guardar en Mongo");
          res.status(rm.getStatus()).send(rm.toString());
        }
      })
      
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.get('/v0/arbitro', function(req, res){
  logger.info('GET /arbitro');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //todo mongo query
      var rm = new ResponseMessage("200", "Falta consultar a Mongo");
      res.status(rm.getStatus()).send(rm.toString());
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.post('/v0/arbitro', function(req, res){
  logger.info('POST /arbitro');
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //verificar schema de req.body
      var expectedSchema = require('./schemas/arbitro');
      var JaySchema = require('jayschema');
      var js = new JaySchema();
      js.validate(req.body, expectedSchema, function(errs){
        if(errs){
          logger.error(errs[0].kind, errs[0].desc);
          var rm = new ResponseMessage("400", "Bad Request");
          res.status(rm.getStatus()).send(rm.toString());
        }else{
          //todo guardar en mongo
          var rm = new ResponseMessage("200", "Falta guardar en Mongo");
          res.status(rm.getStatus()).send(rm.toString());
        }
      })
      
    }else{
      logger.info('Unauthorized');
      unauthorizedResponse(res);
    }
  }else{
    logger.info('Unauthorized');
    unauthorizedResponse(res);
  }
});

app.listen(process.env.PORT || app_port); //process.env.PORT is to have the app working on heroku