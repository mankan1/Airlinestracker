/*
var mongoose = require('./db');

var Schema = new mongoose.Schema({
	email: { type:String, required: false, default:'unknown' },
	phone: { type:String, required: true },
	password: { type:String, required: false, default:'unknown' },
	name: {
		first: { type: String, required: true, default:'unknown' },
		last: { type: String, required: true, default:'unknown' }
	},
	created: { type: Date, default: Date.now, required:true },
	deleted: { type:Boolean, default:false },
	admin: { type:Boolean, default:false },
});

var User = module.exports = mongoose.model('User', Schema);
*/