var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var config=require('config');
var model=require('../database-model');
var db=model.db;
var maxDocs=config.get('api-server.max-return-docs');

router.param('collectionName',function(req,res,next,collectionName){
  // console.log('this is only call once:'+db.collection);
  req.collection=db.collection(collectionName);
  return next();
});
router.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body,{},function(err,result){
  	if(err){ 
  		console.log(err);
  		return next(err);
  	}
  	res.send(result.insertedIds);
  })
});


router.get('/collections/:collectionName', function(req, res, next) {
  var id=mongoose.Types.ObjectId(req.params.id);
  var skiped=maxDocs*(req.query.pageNumer||0);
  req.collection.find({}).skip(skiped).limit(10).toArray(function(err,result){
    if(err){
      return next(err);
    }
    else{
      res.send(result)
    }
  });
});

router.get('/collections/:collectionName/:id', function(req, res, next) {
  var id=mongoose.Types.ObjectId(req.params.id)
  req.collection.findOne({
  	_id:id
  },function(err,result){
  	if(err){
  		console.log(err);
  		return next(err);
  	}
  	else{
  		res.send(result)

  	}
  });
});

router.put('/collections/:collectionName/:id', function(req, res, next) {
  var id=mongoose.Types.ObjectId(req.params.id)
  req.collection.updateOne({
    _id:id
  },{$set:req.body},{},function(err,result){
    if(err){
      res.send({msg:'error',result:err})
    }
    else{
        if(result.result.ok===1&&result.result.nModified===1)
          {res.send({msg:'success'});}
        else{
          res.send({msg:'error',info:'Unknown error'});
        }
    }
  });
});

router.delete('/collections/:collectionName/:id', function(req, res, next) {
  var id=mongoose.Types.ObjectId(req.params.id)
  req.collection.remove({
    _id:id
  },function(err,result){
    if(err){
      res.send({msg:'error',result:err})
    }
    else{
        if(result.result.ok==1&&result.result.n==1)
          {res.send({msg:'success'});}
        else{
          res.send({msg:'error',info:'Unknown item'});
        }
    }
  });
});


module.exports = router;
