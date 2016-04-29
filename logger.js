/**
 * Created by tavete on 4/15/16.
 */

var winston = require('winston');

var logger =  new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            json: false,
            timestamp: function(){
                var d = new Date(Date.now());
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = d.getDate().toString();
                var yyyymmdd = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
                return yyyymmdd + " " + d.toLocaleTimeString();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' | '+ options.level.toUpperCase() +': '+ (undefined !== options.message ? options.message : '');
            }
        }),
        new winston.transports.File({
            filename: __dirname + '/api.log',
            json: false,
            timestamp: function(){
                var d = new Date(Date.now());
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = d.getDate().toString();
                var yyyymmdd = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
                return yyyymmdd + " " + d.toLocaleTimeString();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' | '+ options.level.toUpperCase() +': '+ (undefined !== options.message ? options.message : '');
            }
        })
    ],
    exceptionHandlers: [
        new (winston.transports.Console)({
            json: false,
            timestamp: function(){
                var d = new Date(Date.now());
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = d.getDate().toString();
                var yyyymmdd = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
                return yyyymmdd + " " + d.toLocaleTimeString();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' | '+ options.level.toUpperCase() +': '+ (undefined !== options.message ? options.message : '');
            }
        }),
        new winston.transports.File({
            filename: __dirname + '/api-errors.log',
            json: false,
            timestamp: function(){
                var d = new Date(Date.now());
                var yyyy = d.getFullYear().toString();
                var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                var dd  = d.getDate().toString();
                var yyyymmdd = yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);
                return yyyymmdd + " " + d.toLocaleTimeString();
            },
            formatter: function(options) {
                // Return string will be passed to logger.
                return options.timestamp() +' | '+ options.level.toUpperCase() +': '+ (undefined !== options.message ? options.message : '');
            }
        })
    ],
    exitOnError: false
});

module.exports = logger;