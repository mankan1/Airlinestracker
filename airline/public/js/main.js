/*var http = require('./passport');
var app = require('./app');
var app = require('../User');*/

var AppRouter = Backbone.Router.extend({
	
    routes: {
        ""                  		: "home",
        "airlines"					: "list",
        "airlines/page/:page"		: "list",
        "airlines/add"         		: "addAirlines",
        "airlinesdetails/:id"   	: "airlinesDetails",        
        "airlines/:country/:id"         		: "airportsByCountry",
        "airlines/:country/:id/page/:page"	: "airportsByCountry",
        "airlinecity/:id/:city"         		: "airportsByCity",
        "airlinecity/:id/:city/page/:page"     : "airportsByCity",        
        "airlines/:page"        	: "addairlines",
        "about"             		: "about",
        "test"             			: "test",
        "country"					: "country",
        "airports/:country"				: "airports",
        "airports/:country/page/:page"	: "airports",
        "passengerRegister": 				"passengerRegister",
        "airlinesRegister/:id/:city":					"airlinesRegister",
        "passengerLogin":                   "passengerLogin",
        "airlinesSignIn/:id":                   "airlinesSignIn",
        "airlinesLogin/:id/:city":					"airlinesLogin",
        "passengerLoginError":				"passengerLoginError",
        "airlinesLoginError/:id":				"airlinesLoginError",
        "airlinesLoginNotSameAirlineError/:id":				"airlinesLoginNotSameAirlineError",
        "airlinesLoginNotAirlineError/:id":				"airlinesLoginNotAirlineError",
        "useragreement/:dbid/:username/:email/:name/:userType/:airlinesId/:city"             				: "useragreementView",
        "useragreement/:dbid/:username/:email/:name/:userType/:airlinesId"             				: "useragreementView",        
        "passengerregistration/:dbid/:username/:email/:name/:userType/:airlinesId/:city"            : "passengerregistration",
        "searchview"             				: "searchView",
        //"useragreement/:id"             				: "searchView",
        //"useragreement/:id"        						: "searchView",
        "useragreement/:id"        						: "searchView",
        "showcities/:country/:id"						: "showcities",
        "showcities/:country/:id/page/:page"			: "showcities",
        "showcountries/:id"								: "showcountries",
        "showcountries/:id/page/:page"					: "showcountries",
        //"showcountries/:id/:name/:email"				: "showcountries",
        //"showcountries/:id/:name/:email/page/:page"		: "showcountries",        
        //"ajaxcall"        								: "showmap",
        "newuserlocation/:id"								: "newuserlocation",
        "newuseragainlocation/:id"								: "newuseragainlocation",
        "pickflight/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long"        						: "userlocation",
        "passqueue/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/:lat/:long"        						: "passqueue",
        //"passqueuesearch/:items/:airlineslat/:airlineslong/:miles/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date"        						: "passqueuesearch",
        "passqueuesearch/:airlineslat/:airlineslong/:miles/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date"        						: "passqueuesearch",
        "passqueuesearch/:airlineslat/:airlineslong/:miles/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:date/page/:page"        						: "passqueuesearch",
        "passAirlinesbyCity/:id/:cityname"				: "passAirlinesbyCity",
        "showmap/:departureAirportFsCode/:arrivalAirportFsCode/:departureTime/:arrivalTime/:arrivalTerminal/:carrierFsCode/:flightNumber/:currentDate/:lat/:long/:passengerId"				: "showmap"        	
        //"airlineslogin/:id"				: "airlineslogin",
        //"autho/google"					: "authogoogle" 
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var airlinesList = new AirlinesCollection();
        // when we need all the record thats where we need a collection,
        // airlinesList collection will have all records after a fetch
        airlinesList.fetch({success: function(){
         	
            $("#content").html(new AirlinesListView({model: airlinesList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    airlinesDetails: function (id) {
        var airlines = new Airlines({_id: id});
        // when we need only one record, we just need a constructor , airlines will have that record after a fetch 
        airlines.fetch({success: function(){
            $("#content").html(new AirlinesView({model: airlines}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addAirlines: function() {
        var airlines = new Airlines();
        $('#content').html(new AirlinesView({model: airlines}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    newuserlocation: function (id)    {
    	console.log('newuserlocation called : ', id );

    	var newuserlocationColl = new NewUserLocation ([], { passengerId : id});
    	
    		newuserlocationColl.fetch({ success: function() {
	    		console.log('newuserlocationColl - ', newuserlocationColl);
	    		newuserlocationColl.each(function(usrs) {
	    			console.log('usr', usrs);
	    		$("#content").html(new UserLocationView({model: usrs}).el);
	    		
	    		})
    		}});
    	
        this.headerView.selectMenuItem('home-menu');
        
    },
    
    newuseragainlocation: function (id)    {
    	console.log('newuserlocationagain called : ', id );

    	var newuserlocationagainColl = new NewUserAgainLocation ([], { passengerId : id});
    	
    	newuserlocationagainColl.fetch({ success: function() {
	    		console.log('newuserlocationagainColl - ', newuserlocationagainColl);
	    		newuserlocationagainColl.each(function(usrs) {
	    			console.log('usr', usrs);
	    		$("#content").html(new UserLocationAgainView({model: usrs}).el);
	    		
	    		})
    		}});
    	
        this.headerView.selectMenuItem('home-menu');
        
    },
    
    userlocation: function (departureAirportFsCd, arrivalAirportFsCd, departureTm, arrivalTm,
    		arrivalTer, carrierFsCd, flightNum,dat, lats, longs) {
    	console.log('userlocation called : ' );    	
    	console.log('longs : ' , longs);
    	var splitlongs = longs.split(">");
    	var newlongs = splitlongs[0];
    	var passengerId = splitlongs[1];
    	console.log('new longs : ' , newlongs);
    	console.log('passengerId : ' , passengerId);
    	var userloc = new UserLocation({departureAirportFsCode : departureAirportFsCd, arrivalAirportFsCode : arrivalAirportFsCd, 
    		departureTime : departureTm, arrivalTime : arrivalTm, arrivalTerminal : arrivalTer, 
    		carrierFsCode : carrierFsCd, flightNumber : flightNum, currentDate : dat, lat : lats, long : newlongs, passengerId  : passengerId});

    	userloc.save();
    	$("#content").html(new UserLocationView({model: userloc}).el);
    	
        this.headerView.selectMenuItem('home-menu');
    },
    
    showmap: function (departureAirportFsCode, arrivalAirportFsCode, departureTime, arrivalTime,
    		arrivalTerminal, carrierFsCode, flightNumber,currentDate, lats, longs,passengerId) {    	
    	console.log('showmap - longs : ' , longs);
    	
    	var tempuserloc = new TempUserLocation({departureAirportFsCode : departureAirportFsCode,
    		arrivalAirportFsCode : arrivalAirportFsCode, 
    		departureTime : departureTime, arrivalTime : arrivalTime, arrivalTerminal : arrivalTerminal, 
    		carrierFsCode : carrierFsCode, flightNumber : flightNumber, currentDate : currentDate,
    		lats : lats, longs : longs, passengerId  : passengerId});

    	tempuserloc.save();
    	$("#content").html(new TempUserLocationView({model: tempuserloc}).el);
    	
        this.headerView.selectMenuItem('home-menu');
    },
    
    passqueue: function (departureAirportFsCd, arrivalAirportFsCd, departureTm, arrivalTm,
    		arrivalTer, carrierFsCd, flightNum,dat, lats, longs) {
    	
    	var airlinesloc = new AirlinesLocation({departureAirportFsCode : departureAirportFsCd, arrivalAirportFsCode : arrivalAirportFsCd, 
    		departureTime : departureTm, arrivalTime : arrivalTm, arrivalTerminal : arrivalTer, 
    		carrierFsCode : carrierFsCd, flightNumber : flightNum, currentDate : dat, lat : lats, long : longs});

    	airlinesloc.save();
    	
    	$("#content").html(new PassQueueView({model: airlinesloc}).el);
    	
        this.headerView.selectMenuItem('home-menu');
    },

    passqueuesearch: function (airlineslat, airlineslong, miles, departureAirportFsCd, arrivalAirportFsCd, departureTm, arrivalTm,
    		arrivalTer, carrierFsCd, flightNum,currentDate, page) {
    	var i = 0;
        var p = page ? parseInt(page, 10) : 1;
        console.log('page - ', p);
        
    	console.log('passqueuesearch', airlineslat, airlineslong, miles, departureAirportFsCd, 
    			arrivalAirportFsCd, departureTm, arrivalTm,
        		arrivalTer, carrierFsCd, flightNum,currentDate);
    	
    	var userlocationListColl = new UserLocationCollection ([], { carrierFsCode : carrierFsCd, flightNumber : flightNum });
    	userlocationListColl.fetch({ success: function() {
    		console.log('userlocationListColl - ', userlocationListColl);
    		userlocationListColl.each(function(usrs) {
        		  console.log('Lat : ' ,  usrs.get("lat") ,  'Long : ' ,  usrs.get("long"),  'passengerId : ' ,  usrs.get("passengerId"));
        		});

        	userlocationListColl.each(function(passengers) {
        		// Kanoj
        		console.log('pass: ', passengers.get("passengerId"));
        		var usr = new passUserCollection([], { id: passengers.get("passengerId") });
        		usr.fetch({ success: function() {
        			usr.each(function(usrs) {
                		  	i++;
            				console.log('usr : ', usrs);
                    		passengers.set("departureAirportFsCode", usrs.attributes.name);
                    		passengers.set("carrierFsCode", usrs.attributes.username);
                    		passengers.set("flightNumber", usrs.attributes.email);
                		});
        			}});
 
        		//passengers.attributes.departureAirportFsCode = usr.name;
        		//passengers.save();
            	
        		});        		

        	userlocationListColl.each(function(usrs) {
      		  console.log('departureAirportFsCode : ' ,  userlocationListColl);
      		});

    		userlocationListColl.sort(true);
        	
        	$("#content").html(new PassQueueSearch({model: userlocationListColl, page: p}).el);
		        	
    	}});
    	
        this.headerView.selectMenuItem('home-menu');
        
    },
    	
    test: function () {
        if (!this.testView) {
            this.testView = new TestView();
        }
        $('#content').html(this.testView.el);
        this.headerView.selectMenuItem('test-menu');
    },
    
    country: function () {
        if (!this.countryView) {
            this.countryView = new CountryView();
        }
        $('#content').html(this.countryView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var airlinesList = new AirlinesCollection();
        airlinesList.fetch({success: function(){
            $("#content").html(new AirlinesListView({model: airlinesList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
    
    airports: function (country, page) {
    	console.log('page : ', page, 'country : ', country);
    	
    	var p = page ? parseInt(page, 10) : 1;
    	
    	var i = 0;
        // airlinesListColl is a collection will have all the records after fetch
    	var airlinesListColl = new AirlinesCollection();
    	
    	//airlinesModelCountry is variable that will have a data filtered by country
        var airlinesModelCountry;
        
        // airlinesList will have all the records after fetch
        airlinesListColl.fetch({ success: function() {

        	// airlinesModelCountry is variable that will have a data filtered by country from collection
        	airlinesModelCountry = airlinesListColl.filter(function(airlines) {
                return airlines.get("country") === country;
                });
        	
        	airlinesListColl.each(function(airline) {
            	i++;
            	console.log("airports : ", i);
        		  console.log('Name : ' ,  airline.get("name") ,  'ID : ' ,  airline.get("_id"));
        		});
        	
        	// airlinesListCtyColl is a new collection
        	// airlinesModelCountry data variable is used to create a new collection
        	var airlinesListCtyColl = new AirlinesCollection(airlinesModelCountry);
        	console.log('airlinesListCty : ', page, 'country', country);
        	
        	// Need to pass collection to the view - airlinesListCty is a collection
        	$("#content").html(new AirlinesListView({model: airlinesListCtyColl , country: country, page: p}).el);
        	
        }});
        
        this.headerView.selectMenuItem('home-menu');
    },
    airportsByCountry: function(country, id, page) {
    	console.log('airportsByCountry',country, id,page);
    	var i = 0;
    	var city;
    	var airlinesId;
        var p = page ? parseInt(page, 10) : 1;
        console.log('page - ', p);
        var uniqId;
        var citiesList = new AirlinesCitiesCollection([], { id: id });
        citiesList.fetch({success: function(){
        	console.log("airport cities : ", citiesList);
        	citiesList.each(function(airline) {
            	i++;
        		  console.log('Name : ' ,  airline.get("city") ,  ', ID : ' ,  airline.get("airlinesId"), ', _ID : ' ,  airline.get("_id"));

        		  city = airline.get("city");
        		  airlinesId = airline.get("airlinesId");
        		});  		  
        	var splitcity = city.split(">");
        	var airlinesListCtyColl = new AirlinesCitiesCollection([], { id: id });
        	for (var i = 0; i < splitcity.length; i++) {
        		console.log('airlinesId, splitcity[]',airlinesId, splitcity[i]);
        		uniqId = id + '-' + i;
        		console.log('uniqId', uniqId);
        		var AirlinesTempCities = new AirlinesCities({ airlinesId: uniqId, city: splitcity[i] });
        		airlinesListCtyColl.push(AirlinesTempCities);
        	    //Do something
        	}
        	airlinesListCtyColl.sort(true);
        	airlinesListCtyColl.each(function(airline) {
        		  console.log('Name : ' ,  airline.get("city") ,  ', ID : ' ,  airline.get("airlinesId"));
        		  city = airline.get("city");
        		  airlinesId = airline.get("airlinesId");
        		});        	
        	$("#content").html(new AirListView({model: airlinesListCtyColl, country: country, page: p}).el);

        }});
        this.headerView.selectMenuItem('home-menu');
    },

    airportsByCity: function (id, city, page) {
    	console.log('airportsByCity', id, city, page);
    	var airId = id.split("-");
    	
    	console.log('airId', airId[0] );
        var airlines = new Airlines({_id: airId[0]});
        airlines.city = city;
        airlines.fetch({success: function(){
        	console.log('airports by city ', airlines);
            $('#content').html(new AirportsByCity({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    passAirlinesbyCity: function (id, city) {
    	var i = 0;
    	console.log('passAirlinesbyCity', id, city);
        var CitiesCodeColl = new ShowCitiesCodeCollection([], { city: city});        
        CitiesCodeColl.fetch({success: function(){
        	CitiesCodeColl.each(function(passcity) {
            	i++;
            	passcity.attributes.passengerId = id;
            	//passcity.save();
            	console.log("city : , passcity", i, passcity);
        		  console.log('City Name : ' ,  passcity.get("cityname") ,  'Country Name : ' ,  passcity.get("countryname"));
                  $('#content').html(new PassSearchView({model: passcity}).el);
        		});        	
        }});
        
        this.headerView.selectMenuItem('home-menu');
    },
    
    passengerLogin: function () {
        if (!this.passengerlogin) {
            this.passengerlogin = new PassengerLogin();
        }
        $('#content').html(this.passengerlogin.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    airlinesSignIn: function (id) {
        var airlines = new Airlines({_id: id});
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesSignIn({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    airlinesLogin: function (id, city) {
        var airlines = new Airlines({_id: id});
        airlines.city = city;        
        
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesLogin({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
  
    passengerRegister: function () {
        if (!this.passengerregister) {
            this.passengerregister = new PassengerRegister();
        }
        $('#content').html(this.passengerregister.el);
        this.headerView.selectMenuItem('about-menu');
    },
    
    airlinesRegister: function (id, city) {
        var airlines = new Airlines({_id: id});
        airlines.city = city;        
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesRegister({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
    passengerLoginError: function (id) {
        if (!this.Passengerloginerror) {
            this.Passengerloginerror = new PassengerLoginError();
        }
        $('#content').html(this.Passengerloginerror.el);
        this.headerView.selectMenuItem('home-menu');
    },
    airlinesLoginError: function (id) {
        var airlines = new Airlines({_id: id});
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesLoginError({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
    airlinesLoginNotSameAirlineError: function (id) {
        var airlines = new Airlines({_id: id});
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesLoginNotSameAirlineError({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
    airlinesLoginNotAirlineError: function (id) {
        var airlines = new Airlines({_id: id});
        airlines.fetch({success: function(){
            $('#content').html(new AirlinesLoginNotAirlineError({model: airlines}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
    
    useragreementView: function (dbid, username, email, name,userType, airlinesId, city) {
        var c = city ? city : "none";

    	console.log('useragreementView');
    	console.log('DB Id: ', dbid);
    	console.log('Phone Number: ', username);
    	console.log('Email: ', email);
    	console.log('Name: ', name);
    	console.log('userType: ', userType);    	
    	console.log('city: ', city);

    	var user = new User({dbId : dbid, username : username, email : email, name : name, userType : userType, airlinesId : airlinesId, city : city});
    	console.log('user DB Id: ', user.dbid);
    	console.log('user Phone Number: ', user.username);
    	console.log('user Email: ', user.email);
    	console.log('user Name: ', user.name);
    	console.log('user Name: ', user.userType);
    	
        $('#content').html(new UserAgreementView({model: user}).el);
    	//$('#content').html(new UserAgreementView({model: user}).el);
        
        this.headerView.selectMenuItem('home-menu');
    },
    
    passengerregistration: function (dbid, username, email, name,userType, airlinesId, city) {
    	console.log('passengerregistration');
    	console.log('DB Id: ', dbid);
    	console.log('Phone Number: ', username);
    	console.log('Email: ', email);
    	console.log('Name: ', name);
    	console.log('userType: ', userType);
    	console.log('city: ', city);
    	
    	//var user = new UserAsPass({dbId : dbid, username : username, email : email, name : name, userType : userType, airlinesId : airlinesId});
    	var user = new UserAsPass({dbId : dbid, username : username, email : email, name : name, userType : userType, airlinesId : airlinesId, city : city});    	
    	console.log('user DB Id: ', user.dbid);
    	console.log('user Phone Number: ', user.username);
    	console.log('user Email: ', user.email);
    	console.log('user Name: ', user.name);
    	console.log('user Name: ', user.userType);
    	console.log('user city: ', user.city);    	
    	
        $('#content').html(new PassengerRegistrationView({model: user}).el);
        
        this.headerView.selectMenuItem('home-menu');
    },
    
    searchView: function (id) {
    	console.log('searchView1 ');
        var user = new User({_id: id});
        user.fetch({success: function(){
        	console.log('searchView2 ', user);
            $('#content').html(new SearchView({model: user}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },
	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var airlinesList = new AirlinesCollection();
        airlinesList.fetch({success: function(){
            $("#content").html(new AirlinesListView({model: airlinesList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    showcities: function( country, id, page) {
    	console.log('showcities : ', country, id);
    	var i = 0;
        var p = page ? parseInt(page, 10) : 1;
        console.log('page - ', p);

        // citiesListColl is a collection will have all the records after fetch
    	var citiesListColl = new ShowCitiesCollection([], { id: id, country: country });
        // citiesListColl will have all the records after fetch
    	citiesListColl.fetch({ success: function() {
    		console.log('citiesListColl - ', citiesListColl);
    		citiesListColl.each(function(cities) {
            	i++;
            	console.log("cities : ", i);
        		  console.log('Name : ' ,  cities.get("cityname") ,  'ID : ' ,  cities.get("_id"));
        		});

    		citiesListColl.sort(true);
    		// airlinesModelCities is variable that will have a data filtered by country from collection
        	airlinesModelCities = citiesListColl.filter(function(airlines) {
        		console.log('airlines.get("countryname"), airlines.get("cityname") , country', airlines.get("countryname"), airlines.get("cityname"), country);
                return airlines.get("countryname") === country;
                });
    		
        	var mycitiesListColl = new AirlinesCollection(airlinesModelCities);

        	mycitiesListColl.each(function(cities) {
            	i++;
            	console.log("cities : ", i);
        		  console.log('Name : ' ,  cities.get("cityname") ,  'ID : ' ,  cities.get("_id"));
        		});
        	
			// Need to pass collection to the view - airlinesListCty is a collection
			$("#content").html(new ShowCitiesListView({model: mycitiesListColl , id: id, country: country, page: p}).el);
		        	
    	}});        
    },
    //showcountries: function( id, name, email, page) {
    showcountries: function( id, page) {
    	console.log('showcountries : ', id);
    	var i = 0;
        var p = page ? parseInt(page, 10) : 1;
        console.log('page - ', p);

        // citiesListColl is a collection will have all the records after fetch
    	var countriesListColl = new ShowCountriesCollection([], { id: id });
        // citiesListColl will have all the records after fetch
    	countriesListColl.fetch({ success: function() {
    		console.log('countriesListColl - ', countriesListColl);
    		countriesListColl.each(function(countries) {
            	i++;
            	console.log("countries : ", i);
        		  console.log('Name : ' ,  countries.get("countryname") ,  'ID : ' ,  countries.get("_id"));
        		});
    		
    		countriesListColl.sort(true);
	
			// Need to pass collection to the view - airlinesListCty is a collection
			$("#content").html(new ShowCountriesListView({model: countriesListColl , id: id, page: p}).el);
		        	
    	}});        
    },

    searchAirlinesView: function (id) {
    	
    	console.log('searchAirlinesView',id);
/*    	var i = 0;
    	var dest;
    	var airsId;
        var p = page ? parseInt(page, 10) : 1;
        console.log('page - ', p);*/
        var uniqId;
        var airsList = new AirsCollection([], { id: id });
    	console.log('searchAirlinesView1');
        airsList.fetch({success: function(){
        	console.log('searchAirlinesView2');
        	console.log("airport details : ", airsList);
        	airsList.each(function(airline) {
            	  i++;
        		  console.log('Name : ' ,  airline.get("dest") ,  ', ID : ' ,  airline.get("airsId"), ', _ID : ' ,  airline.get("_id"));

        		  dest = airline.get("dest");
        		  airlinesId = airline.get("airsId");
        		});  		  
        	var splitairsDtls = city.split(",");
        	var airsColl = new AirsCollection([], { id: id });
        	for (var i = 0; i < splitairsDtls.length; i++) {
        		console.log('airsId, splitairsDtls[]',airsId, splitairsDtls[i]);
        		uniqId = id + '-' + i;
        		console.log('uniqId', uniqId);
        		var AirsTemp = new Airs({ airlinesId: uniqId, dest: splitairsDtls[i] });
        		airsColl.push(AirsTemp);
        	    //Do something
        	}
        	airsColl.sort(true);
        	airsColl.each(function(airline) {
        		  console.log('Dest : ' ,  airline.get("dest") ,  ', ID : ' ,  airline.get("airsId"));
        		  city = airline.get("dest");
        		  airlinesId = airline.get("airsId");
        		});        	
        	$("#content").html(new SearchAirlinesView({model: airsColl, airsId: airsId}).el);

        }});
        console.log('searchAirlinesView3');
    },
    
});

utils.loadTemplate(['HomeView', 'HeaderView', 'AirlinesByCountriesListItemView', 'AirlinesView', 'AirlinesSignIn', 'AirlinesListItemView', 'AboutView', 'UserLocationView', 'UserLocationAgainView','TempUserLocationView', 'TestView', 'CountryView', 'PassengerRegister', 'AirlinesRegister', 'AirlinesLoginNotAirlineError', 'AirlinesLoginNotSameAirlineError','PassengerLogin', 'AirportsByCity', 'PassengerLoginError', 'AirlinesLogin', 'AirlinesLoginError', 'UserAgreementView', 'PassengerRegistrationView', 'SearchView', 'PassQueueSearchItemView', 'ShowCitiesListItemView', 'PassQueueView', 'ShowCountriesListItemView', 'ShowPassengersListView', 'PassSearchView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});