var superagent=require('superagent');
var expect=require('expect.js');
var mongoose =require ('mongoose')
var config=require('config')
var dbConfig=config.get('test.dbConfig');
var Test=require('../database-model/Test');

describe('A Restful API Server: Testing CUDR Ops in mongodb/test database',function(){
	var id; // database id
	var db; //database handler
	//clear test database
	before(function(done) {
      mongoose.connect("mongodb://"+dbConfig.host+":"+dbConfig.port+"/"+dbConfig.dbName);
      db = mongoose.connection;
      db.on('error', console.error.bind(console, 'test database connection error:'));
	  db.once('open', function () {
	  	Test.remove(function(){
	  		done();
	  	});
	  });
    });


	it('post object',function(done){
		superagent.post('http://localhost:3000/api/collections/test')
				  .send({name:'mike',email:'mike@gmail.com'})
				  .end(function(err,res){			  	
				  	expect(err).to.eql(null);
				  	expect(res.body.length).to.eql(1);
				  	id=res.body[0]
				  	expect(id.length).to.eql(24)
				  	done()
				  });
	});

	it('get object',function(done){
		superagent.get('http://localhost:3000/api/collections/test/'+id)
				  .end(function(err,res){
				  	expect(err).to.eql(null);
				  	expect(typeof res.body).to.eql('object');
				  	expect(res.body._id.length).to.eql(24);
				  	expect(res.body._id).to.eql(id);
				  	done();
				  });
	});

	it('get collection objects',function(done){
		superagent.get('http://localhost:3000/api/collections/test/')
				  .end(function(err,res){
				  	expect(err).to.eql(null);
				  	expect(res.body.length).to.be.above(0);
				  	expect(res.body.map(function(item){
				  		return item._id
				  	})).to.contain(id);
				  	done();
				  });
	});


	it('updates an object',function(done){
		superagent.put("http://localhost:3000/api/collections/test/"+id)
				  .send({name:'Alice',email:"Alice@gmail.com"})
				  .end(function(err,res){
				  	expect(err).to.eql(null);
				  	expect(typeof res.body).to.eql('object');
				  	expect(res.body.msg).to.eql('success');
				  	done();
				  });	
	});

	it('check updated object',function(done){
		superagent.get('http://localhost:3000/api/collections/test/'+id)
				  .end(function(err,res){
				  	expect(err).to.eql(null);
				  	expect(typeof res.body).to.eql('object');
				  	expect(res.body._id.length).to.eql(24);
				  	expect(res.body.name).to.eql('Alice');
				  	done();
				  });
	});

	it('remove an object',function(done){
		superagent.del("http://localhost:3000/api/collections/test/"+id)
				  .end(function(err,res){
				  	expect(err).to.eql(null);
				  	expect(typeof res.body).to.eql('object');
				  	expect(res.body.msg).to.eql('success');
				  	done();
				  });	
	});

	after(function(){
		db.close();
	})


});
