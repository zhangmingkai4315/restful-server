var mongoose=require('mongoose');
var userSchema=mongoose.Schema({
	name:String,
	email:String,
});
console.log('Loading User model...');
var User=mongoose.model('User',userSchema);

module.exports=User;
