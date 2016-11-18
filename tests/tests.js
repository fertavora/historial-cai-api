/**
 * Created by tavete on 7/9/16.
 */

'use strict'

var request = require('superagent');
var assert = require('chai').assert;

describe('Historial CAI API - GET methods', function(){
  var url = 'http://localhost:3001/v0';

  var checkStatus200 = function(res){
    assert(res.headers.statusCode = '200', "Response is not 200");
  };

  it.only('/equipos', function(done){
    request
      .get(url+'/equipos')
      .set('Authorization', 'Basic aGlzdG9yaWFsY2FpOmVjck01NHVseE4=')
      .end(function(err, res){
        if(err) done(new Error(err));
        assert(res.body.length > 0, "Response length is not greater than 0");
        checkStatus200(res);
        done();
      });
  });

  it('/api/arbitros', function(done){
    checkStatus200(url+'/api/arbitros', done);
  });

  it('/api/tecnicos', function(done){
    checkStatus200(url+'/api/tecnicos', done);
  });

  it('/api/partidos', function(done){
    checkStatus200(url+'/api/partidos', done);
  });

  it('/api/torneos', function(done){
    checkStatus200(url+'/api/torneos', done);
  });

  it('/api/torneos-instancias', function(done){
    checkStatus200(url+'/api/torneos-instancias', done);
  });

  it('/api/paises', function(done){
    checkStatus200(url+'/api/paises', done);
  });

  it('/api/provincias', function(done){
    checkStatus200(url+'/api/provincias', done);
  });

  it('/api/ciudades', function(done){
    checkStatus200(url+'/api/ciudades', done);
  });

});