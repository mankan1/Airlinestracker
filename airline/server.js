var express = require('express')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash')
  , util = require('util')
  , GoogleStrategy = require('passport-google').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , LocalStrategy = require('passport-local').Strategy  
  , http = require('http')  
  , everyauth = require('./lib/models/auth') //has our every auth configuration
//  , mongoose = require('./lib/models/db') //mongoose is like an ORM
  , airlines = require('./routes/airlines')
  , mongodb = require('mongodb')
  , mongoose = require('mongoose')
  , bcrypt = require('bcryptjs')
  , SALT_WORK_FACTOR = 10;

var app = express();
var user;
app.configure(function () {
	  app.set('port', process.env.PORT || 8080);
	  app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
	  app.use(express.bodyParser()),	  
	  app.set('views', __dirname + '/views');
	  //app.set('view engine', 'ejs');
	  //app.engine('ejs', require('ejs-locals'));
	  app.use(express.cookieParser());
	  app.use(express.methodOverride());

	  app.use(express.session({ secret: 'keyboard cat' }));
	  // Remember Me middleware
	  app.use( function (req, res, next) {
	    if ( req.method == 'POST' && req.url == '/login' ) {
	      if ( req.body.rememberme ) {
	        req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
	      } else {
	        req.session.cookie.expires = false;
	      }
	    }
	    next();
	  });	  
	  app.use(flash());	  
	  app.use(passport.initialize());
	  app.use(passport.session());
	  app.use(app.router);
	  app.use(express.static(path.join(__dirname, 'public')));
});

  mongoose.connect('192.168.0.104', 'test');
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback() {
    console.log('Connected to DB');
  });

//User Schema
  var userSchema = mongoose.Schema({
	username: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    name: { type: String},
    userType: { type: String, required: true },
    airlinesId: { type: String, required: true },
    accessToken: { type: String } // Used for Remember Me
  });

//Bcrypt middleware
  userSchema.pre('save', function(next) {
  	var user = this;

  	if(!user.isModified('password')) return next();

  	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
  		if(err) return next(err);

  		bcrypt.hash(user.password, salt, function(err, hash) {
  			if(err) return next(err);
  			user.password = hash;
  			next();
  		});
  	});
  });

  // Password verification
  userSchema.methods.comparePassword = function(candidatePassword, cb) {
  	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
  		if(err) return cb(err);
  		cb(null, isMatch);
  	});
  };

//Remember Me implementation helper method
userSchema.methods.generateRandomToken = function () {
 var user = this,
     chars = "_!abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
     token = new Date().getTime() + '_';
 for ( var x = 0; x < 16; x++ ) {
   var i = Math.floor( Math.random() * 62 );
   token += chars.charAt( i );
 }
 return token;
};

//Seed a user
  var User = mongoose.model('User', userSchema);
  var user = new User({ username: '8129270125', email: 'bob@example.com', password: 'secret', name: 'Bob', userType: 'a', airlinesId : 000000 });
  user.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('user: ' + user.username + " saved.");
    }
  });

//Both serializer and deserializer edited for Remember Me functionality
  passport.serializeUser(function(user, done) {
    var createAccessToken = function () {
      var token = user.generateRandomToken();
      User.findOne( { accessToken: token }, function (err, existingUser) {
        if (err) { return done( err ); }
        if (existingUser) {
          createAccessToken(); // Run the function again - the token has to be unique!
        } else {
          user.set('accessToken', token);
          user.save( function (err) {
            if (err) return done(err);
            return done(null, user.get('accessToken'));
          })
        }
      });
    };

    if ( user._id ) {
      createAccessToken();
    }
  });

  passport.deserializeUser(function(token, done) {
    User.findOne( {accessToken: token } , function (err, user) {
      done(err, user);
    });
  });


//Use the LocalStrategy within Passport.
//Strategies in passport require a `verify` function, which accept
//credentials (in this case, a username and password), and invoke a callback
//with a user object.  In the real world, this would query a database;
//however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));
  
/*
var GOOGLE_CLIENT_ID = "98579425584.apps.googleusercontent.com";
  var GOOGLE_CLIENT_SECRET = "XHz3Tf4TY5O6BmJ1Lls-FdNF";
*/	
  
var FACEBOOK_APP_ID = "516522428437444"
	var FACEBOOK_APP_SECRET = "f0a68dc5c46f26938ae4691efe80ab10";

var TWITTER_CONSUMER_KEY = "ddzH9YQJe1zFRQGTqsRw";
var TWITTER_CONSUMER_SECRET = "nKMDArzojO5lqkleyqym9glZW95s9EcvOWpRfh04I";

passport.use(new GoogleStrategy({
	    returnURL: 'http://localhost:3000/auth/google/return',
	    realm: 'http://localhost:3000/'
	  },
	  function(identifier, profile, done) {
	    // asynchronous verification, for effect...
	    process.nextTick(function () {
	      
	      profile.identifier = identifier;
	      return done(null, profile);
	    });
	  }
	));

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      return done(null, profile);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      return done(null, profile);
    });
  }
));

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/passengerlogin/:id', function(req, res){
	  res.render('login', { user: req.user, message: req.flash('error') });
	});


//POST /login
//This is an alternative implementation that uses a custom callback to
//acheive the same functionality.


//app.post('/passengerlogin/:id/:city', function(req, res, next) {
app.post('/passengerlogin', function(req, res, next) {
	console.log('username', req.body.username);
	console.log('password', req.body.password);

	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.session.messages =  [info.message];
	      console.log('authenticate');
	      return res.redirect('/#passengerLoginError')
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log('userType : ', user.userType);
	      console.log('airlinesId : ', user.airlinesId);
	      console.log('airlinesId : ', req.params.id);
	      if(user.userType == 'p')
	      {
	    	  console.log('passengerlogin');
	    	  return res.redirect('#useragreement/' + user._id + '/' + user.username + '/' +  user.email + '/' +  user.name + '/' +  user.userType + '/' +  user.airlinesId );
	      }
	      else
    	  {
	    	  console.log('passengerLoginError');
	    	  return res.redirect('/#passengerLoginError');
    	  }	      
	      console.log('passengerlogin');
	      return res.redirect('#useragreement/' + user._id + '/' + user.username + '/' +  user.email + '/' +  user.name + '/' +  user.userType + '/' + user.airlinesId );
	      //return res.redirect('#useragreement');
	    });
	  })(req, res, next);
	});

app.post('/airlinesLogin/:id/:city', function(req, res, next) {
	console.log('username', req.body.username);
	console.log('password', req.body.password);

	passport.authenticate('local', function(err, user, info) {
	    if (err) { return next(err) }
	    if (!user) {
	      req.session.messages =  [info.message];
	      console.log('authenticate');
	      return res.redirect('/#airlinesLoginError/' + req.params.id)
	    }
	    req.logIn(user, function(err) {
	      if (err) { return next(err); }
	      console.log('userType : ', user.userType);
	      console.log('airlinesId : ', user.airlinesId);
	      console.log('airlinesId : ', req.params.id);
	      if(user.userType == 'a' && user.airlinesId === req.params.id)
	      {
	    	  console.log('airlinesLogin');
	    	  return res.redirect('#useragreement/' + user._id + '/' + user.username + '/' +  user.email + '/' +  user.name + '/' +  user.userType + '/' +  user.airlinesId + '/' + req.params.city);
	      }
	      else
    	  {
	    	  if(user.userType == 'p')
	    	  {
		    	  console.log('airlinesLoginNotAirlineError/' + req.params.id);
		    	  return res.redirect('/#airlinesLoginNotAirlineError/' + req.params.id);	    		  
	    	  }
	    	  else
	    	  {
		    	  console.log('airlinesLoginNotSameAirlineError/' + req.params.id);
		    	  return res.redirect('/#airlinesLoginNotSameAirlineError/' + req.params.id);	    		  
	    	  }
    	  }
	      //return res.redirect('#useragreement');
	    });
	  })(req, res, next);
	});

app.post('/passengerRegister/:id/:city', function(req, res, next) {
	console.log('Look for Request object', req);
	console.log('username', req.body.username);
	console.log('email', req.body.email);
	console.log('password', req.body.password);
	console.log('retypepassword', req.body.retypepassword);
	console.log('name', req.body.name);

	  user = new User({ username: req.body.username, email: req.body.email, password: req.body.password, name: req.body.name, userType: req.body.userType, airlinesId : req.body.airlinesId  });
	  user.save(function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log('user: ' + user.username + " saved.");
	    }
	  });
	  return res.redirect('#passengerregistration/' + user._id + '/' + req.body.username + '/' +  req.body.email + '/' +  req.body.name + '/' +  req.body.userType + '/' +  req.body.airlinesId + '/' + req.params.city);
	  //return res.redirect('#useragreement/' + user._id + user.username + user.email + user.password + user.name);
	  //return res.redirect('#useragreement');
    
	});

// Not used anymore
app.post('/airlinesRegister/:id/:city', function(req, res, next) {
	console.log('Reques object', req);
	console.log('username', req.body.username);
	console.log('email', req.body.email);
	console.log('password', req.body.password);
	console.log('retypepassword', req.body.retypepassword);
	console.log('name', req.body.name);
	console.log('name', req.body.airlinesId);

	  user = new User({ username: req.body.username, email: req.body.email, password: req.body.password, name: req.body.name, userType: req.body.userType, airlinesId : req.body.airlinesId });
	  user.save(function(err) {
	    if(err) {
	      console.log(err);
	    } else {
	      console.log('user: ' + user.username + " saved.");
	    }
	  });
	  return res.redirect('#passengerregistration/' + user._id + '/' + req.body.username + '/' +  req.body.email + '/' +  req.body.name + '/' +  req.body.userType + '/' +  req.body.airlinesId + '/' + req.params.city + '/' + req.params.city);
	  //return res.redirect('#useragreement/' + user._id + user.username + user.email + user.password + user.name);
	  //return res.redirect('#useragreement');
    
	});


app.get('/auth/google', 
		  passport.authenticate('google', { failureRedirect: '/login' }),
		  function(req, res) {
			res.redirect('#useragreement');
		  });

app.get('/auth/google/return', 
		  passport.authenticate('google', { failureRedirect: '/login' }),
		  function(req, res) {
			res.redirect('#useragreement');
		  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('#useragreement');
});

app.get('/auth/facebook',
		  passport.authenticate('facebook'),
		  function(req, res){
			res.redirect('#useragreement');
		  });

		// GET /auth/facebook/callback
		app.get('/auth/facebook/callback', 
		  passport.authenticate('facebook', { failureRedirect: '/login' }),
		  function(req, res) {
			res.redirect('#useragreement');
		  });

app.get('/auth/twitter',
		  passport.authenticate('twitter'),
		  function(req, res){
			res.redirect('#useragreement');	
		  });

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
	res.redirect('#useragreement');
  });

//app.post('/useragreement/:dbId/:city', airlines.addUsers);

app.post('/userlocation', airlines.addUserLoc);
app.post('/tempuserlocation', airlines.addtempUserLoc);
app.post('/airlineslocation', airlines.addAirlinesLoc);
app.post('/useragreement', airlines.addUsers);
app.get('/passengername/:id', airlines.findpassengername );

app.get('/checkuserlocation/:id', airlines.getuserlocation);

app.get('/passAirlinesbyCity/:city', airlines.updatepasscity);
app.get('/useragreement/:id', airlines.findUser);

app.get('/loggedinairlineslocation/:carrierFsCode/:flightNumber', airlines.findUserQueue);

app.post('/aboutAsPass/:id/:city', airlines.addUsers);
app.get('/pickflight/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long', 
		function(req, res){
	req.params.id
	  return res.redirect('#pickflight/' + req.params.departureAirportFsCode + '/'
			  + req.params.arrivalAirportFsCode + '/' 
			  +  req.params.departureTime + '/'
			  +  req.params.arrivalTime + '/' 
			  +  req.params.arrivalTerminal + '/'
			  +  req.params.carrierFsCode + '/'
			  +  req.params.flightNumber + '/'
			  +  req.params.date + '/'
			  +  req.params.lat + '/'
			  +  req.params.long);
	});

app.get('/passqueue/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long', 
		function(req, res){
	req.params.id
	  return res.redirect('#passqueue/' + req.params.departureAirportFsCode + '/'
			  + req.params.arrivalAirportFsCode + '/' 
			  +  req.params.departureTime + '/'
			  +  req.params.arrivalTime + '/' 
			  +  req.params.arrivalTerminal + '/'
			  +  req.params.carrierFsCode + '/'
			  +  req.params.flightNumber + '/'
			  +  req.params.date + '/'
			  +  req.params.lat + '/'
			  +  req.params.long);
	});

app.get('/newuserlocation/:id', 
		function(req, res){
	  return res.redirect('#newuserlocation/' +  req.params.id);
	});

//app.post('/passqueuesearch', airlines.addtempUserLoc);
app.post('/passqueuesearch', airlines.findUsersfromQueue);

/*
 * <form method="POST" action="/passqueuesearch/<%= departureAirportFsCode %>/<%= arrivalAirportFsCode %>/<%= departureTime %>/<%= arrivalTime %>/<%= arrivalTerminal %>/<%= carrierFsCode %>/<%= flightNumber %>/<%= currentDate %>/<%= lat %>/<%= long %>" class="form-horizontal" id="passqueuesearch_form" data-ajax="false">
app.post('/passqueuesearch/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long', function(req, res, next) {
	//console.log('Look for Pass Queue search Request object', req);
	console.log('Look for Pass Queue search Request object');
	console.log('Latitude : ', req.body.airlineslat);
	console.log('Longitude : ', req.body.airlineslong);
	console.log('Miles : ', req.body.miles);

	console.log('Pass Queue search departureAirportFsCode : ', req.params.departureAirportFsCode);
	console.log('arrivalAirportFsCode : ', req.params.arrivalAirportFsCode);
	console.log('departureTime : ', req.params.departureTime);
	console.log('arrivalTime : ', req.params.arrivalTime);
	console.log('arrivalTerminal : ', req.params.arrivalTerminal);
	console.log('carrierFsCode : ', req.params.carrierFsCode);	
	console.log('flightNumber : ', req.params.flightNumber);
	console.log('date : ', req.params.date);
	console.log('lat : ', req.params.lat);
	console.log('long : ', req.params.long);	
	
	return res.redirect('#passqueuesearch/' + req.body.airlineslat + '/' + req.body.airlineslong + '/' +  req.body.miles + '/' + req.params.departureAirportFsCode + '/' + req.params.arrivalAirportFsCode + '/' + req.params.departureTime + req.params.arrivalTime + '/' + req.params.arrivalTerminal + '/' + req.params.carrierFsCode+ '/' + req.params.flightNumber+ '/' + req.params.date+ '/' + req.params.lat + '/' + req.params.long);
    
	});
*/
app.get('/airlinescities/:id', airlines.findAirlinesCities);
app.get('/showcities/:id/:country', airlines.findPassengerCities);
app.get('/showcountries/:id', airlines.findPassengerCountries);

app.get('/airlinesbycities/:city/:id', airlines.findAirlinesNotByCities);
//app.get('/pickflight/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long', airlines.grabuserlocation);

app.get('/airlines', airlines.findAll);
app.get('/airlines/:id/:city', airlines.findById);
app.post('/airlines', airlines.addAirlines);
app.put('/airlines/:id', airlines.updateAirlines);
app.delete('/airlines/:id', airlines.deleteAirlines);
app.get('/airports/:country', airlines.findByCountry);
app.get('airports/:country/page/:page', airlines.findByCountry);

//app.post('/user/location', routes.user.position);
app.post('/ajaxcall', airlines.updateUserLoc);
/*app.post('/ajaxcall', 
		function(req, res){
		console.log('departureAirportFsCode: ', req.body.departureAirportFsCode);
		console.log('arrivalAirportFsCode: ', req.body.arrivalAirportFsCode);
		
		console.log('departureTime: ', req.body.departureTime);
		console.log('arrivalTime: ', req.body.arrivalTime);
		
		console.log('arrivalTerminal: ', req.body.arrivalTerminal);
		console.log('carrierFsCode', req.body.carrierFsCode);
		
		console.log('flightNumber: ', req.body.flightNumber);		
		console.log('currentDate: ', req.body.currentDate);

		console.log('lat: ', req.body.lat);		
		console.log('long: ', req.body.long);

		console.log('passengerId: ', req.body.passengerId);		
		
		return res.redirect('#passengerregistration/'
				//+ user._id + '/' + req.body.username + '/' +  req.body.email + '/' +  req.body.name + '/' +  req.body.userType + '/' +  req.body.airlinesId + '/' + req.params.city + '/' + req.params.city);		
		return res.redirect('#pickflights' ) ;		
	  /*return res.redirect('#pickflight/' + req.body.departureAirportFsCode + '/'
			  + req.body.arrivalAirportFsCode + req.body.departureTime + req.body.arrivalTime
			  + req.body.arrivalTerminal + req.body.carrierFsCode + req.body.flightNumber
			  + req.body.currentDate + req.body.lat + req.body.long + req.body.passengerId) ;*/ 
	  
			  /*+  req.params.departureTime + '/'
			  +  req.params.arrivalTime + '/' 
			  +  req.params.arrivalTerminal + '/'
			  +  req.params.carrierFsCode + '/'
			  +  req.params.flightNumber + '/'
			  +  req.params.date + '/'
			  +  req.params.lat + '/'
			  +  req.params.long);*/
	//});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  console.log('ensureAuthenticated');
	  res.redirect('/#passengerLoginError')
	}

module.exports = passport;
module.exports = app;
module.exports = User;

