/**
 * New node file
 */
/**
 * Every Auth Configuration
 */
/*var everyauth = module.exports = require('everyauth')
  , User = require('./user.js');

everyauth.everymodule.userPkey('_id');

everyauth.everymodule.findUserById( function (req, id, callback) {
	User.findById( id, callback );
});

everyauth.everymodule.logoutPath('/logout');

everyauth.everymodule.logoutRedirectPath('/');

everyauth.password
	.getLoginPath('/login')
	.postLoginPath('/login')
	.loginView('login.ejs')
	.authenticate( function (login, password) {
		console.log('login', login, 'password', password);
		var promise = this.Promise();
		User.findOne({phone:login}, function (err, doc) {
			console.log('err', err, 'doc', doc);
			if (err) return promise.fail(err);
			if (!doc) return promise.fail(new Error('User not found!'));
			if (doc.password !== password) return promise.fail(new Error('Incorrect password!'));
			promise.fulfill(doc);
		});
		return promise;
	})
	.loginSuccessRedirect('/r') // this should login to a redirect handler that will look at the RLD and go from there
	.getRegisterPath('/register')
	.postRegisterPath('/register')
	.registerView('register.ejs')
	.extractExtraRegistrationParams( function (req) {
		console.log('req.body', req.body);
		return req.body;
	})
	.validateRegistration( function (newUserAttributes) {
		console.log('newUserAttributes', newUserAttributes);
		var promise = this.Promise();
		var attr = {};
		if (newUserAttributes.email) attr.email = newUserAttributes.email;
		if (newUserAttributes.phone) attr.phone = newUserAttributes.phone;
		User.findOne(attr, function (err, doc) {
			if (err) return promise.fail(err);
			if (doc) return promise.fail(new Error('User already registered with this email'));
			promise.fulfill(true);
		});
		return promise;
	})
	.registerUser( function (newUserAttributes) {
		console.log('newUserAttributes', newUserAttributes);
		var promise = this.Promise();
		var attr = {};
		'email phone'.split(' ').forEach(function(key) {
			if (key in newUserAttributes) attr[key] = newUserAttributes[key];
		});
		User.findOne(attr, function (err, doc) {
			if (err) return promise.fail(err);
			if (doc) return promise.fail(new Error('User already registered with this email'));
			new User(newUserAttributes).save(function(err, doc) {
				if (err) return promise.fail(err);
				promise.fulfill(doc);
			});
		});
		return promise;
	})
	.registerSuccessRedirect('/')
	.loginFormFieldName('phone')
	.passwordFormFieldName('password')
	.loginWith('phone')
	.loginLocals( function (req, res) {
		return {
			req: req
		}
	})
	.registerLocals( function (req, res) {
		return {
			req: req
		}
	})
	.respondToLoginSucceed( function (res, user, data) {
		this.redirect(res, getD(data.req, '/user/'+user.id));
	})
	.respondToRegistrationSucceed( function (res, user, data) {
		this.redirect(res, getD(data.req, '/user/'+user.id));
	})
	;

if (process.env.NODE_ENV=='debug') {
	console.log('everyauth.password.configurable()',everyauth.password.configurable());
}

function getD(req, e) {
	var d = req.param('d');
	if (!d || d == 'undefined') d = e || '/';
	return d;
}
*/