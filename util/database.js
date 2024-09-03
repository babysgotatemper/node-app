const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
      'mongodb+srv://ReadWrite:111111Qq@node-app.bw0qh.mongodb.net/?retryWrites=true&w=majority&appName=Node-app',
      { useNewUrlParser: true, useUnifiedTopology: true }
  )
    .then(client => {
      console.log('DB Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
