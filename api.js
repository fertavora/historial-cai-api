/**
 * Created by tavete on 4/28/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('./logger');
var app = express();
var app_port = 3001;
var expected_credentials = [process.env.USERNAME || 'historialcai', process.env.PASSWORD || 'ecrM54ulxN'];

var unauthorizedResponse = function(res){
  res.set({
    'WWW-Authenticate': 'Basic realm="Por favor identifíquese"'
  });
  return res.status(401).send({code: 401, error: "No autorizado"});
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

app.get('/equipos', function(req, res){
  logger.info("GET /equipos");
  if(req.header('authorization')){
    if(authenticateCredentials(req.header('authorization'))){
      //todo mongo query
      res.status(200).send("OK");
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