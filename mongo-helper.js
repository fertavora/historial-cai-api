/**
 * Created by tavete on 17/11/16.
 */

module.exports = {
    findToArray: function(connection, collection, query){
        return new Promise(function(fulfill, reject) {
            var MongoClient = require('mongodb');
            MongoClient.connect(connection, function (err, db) {
                var col = db.collection(collection);
                col.find(query).toArray(function (err, docs) {
                    if(err){ reject(err); }
                    db.close();
                    fulfill(docs);
                });
            });
        });
    },

    insertOne: function(connection, collection, obj){
        return new Promise(function(fulfill, reject) {
            var MongoClient = require('mongodb');
            MongoClient.connect(connection, function (err, db) {
                if(err){ reject(err); }
                var col = db.collection(collection);
                col.insertOne(obj, function (err, r) {
                    if(err){ reject(err); }
                    db.close();
                    fulfill(r);
                });
            });
        });
    }
};