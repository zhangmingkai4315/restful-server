var mongoose=require('mongoose');
var config=require('config');
var dbConfig=config.get('api-server.dbConfig');
mongoose.connect("mongodb://"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.dbName);
var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Database connection error:'));
    db.once('open', function () {
      console.log("Connect database success");
});


module.exports={
	"User":require('./User'),
	"Test":require('./Test'),
	"db":db
};

