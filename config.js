var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development:{
    db: 'mongodb://localhost:27017/mydb',
    rootPath: rootPath,
    port: process.env.PORT || 3000
  }
}