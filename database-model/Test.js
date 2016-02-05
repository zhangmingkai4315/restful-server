var mongoose=require('mongoose');
var testSchema=mongoose.Schema({
	name:String,
	email:String,
});
console.log('Loading Test model...');
var Test=mongoose.model('Test',testSchema);

module.exports=Test;
