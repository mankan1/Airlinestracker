window.Airlines = Backbone.Model.extend({

    urlRoot: "/airlines",

    idAttribute: "_id",
    
    url: function() {
        return '/airlines/' + this.id + '/' + this.city;
      },

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.city = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a grape variety"};
        };

        this.validators.country = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a country"};
        };
     
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        city: "",
        country: "USA",
        region: "California",
        year: "",
        description: "",
        picture: null
    }
});

window.AirlinesCollection = Backbone.Collection.extend({

    model: Airlines,

    url: "/airlines",
    
    byCty: function(cty) {
        filtered = this.filter(function(airlines) {
          return airlines.get("country") === cty;
          });
        return new Airlines(filtered);
      }

    	
 });

window.User = Backbone.Model.extend({

    urlRoot: "/useragreement", 
    	//+ '/' + this.get("dbId") + '/' + this.get("username") + '/' + this.get("email") + '/' + this.get("name") + '/' + this.get("admin"),

    idAttribute: "_id",

    /*url: function() {
        return '/useragreement/' + this.id + '/' + this.city   ;
      },*/
      
    initialize: function () {
        this.validators = {};

        this.validators.dbId = function (value) {
        	console.log('dbId', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have the users dbId"};
        };

        this.validators.username = function (value) {
        	console.log('username', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have phone number as username"};
        };

        this.validators.email = function (value) {
        	console.log('email', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have email for user"};
        };
        
        this.validators.name = function (value) {
        	console.log('name', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have name for the user"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        dbId: "000998",
        username: "9875400123",
        email: "huh@gmail.com",
        name: "Dont Know",
        userType: "a",
        airlinesId: 00000,
        city: "pune"
    }
});

window.UserCollection = Backbone.Collection.extend({

    model: User,

    url: "/useragreement"
    	
 });

window.passUserCollection = Backbone.Collection.extend({

    model: User,

	initialize: function(models, options) {
		console.log('this', this);
	    this.id = options.id;
	  },
	  
	unique: true,
	  
    
    url: function() {
        return '/passengername/' + this.id;
      },
              	
 });

window.UserAsPass = Backbone.Model.extend({

    urlRoot: "/useragreement", 
    	//+ '/' + this.get("dbId") + '/' + this.get("username") + '/' + this.get("email") + '/' + this.get("name") + '/' + this.get("admin"),

    idAttribute: "_id",

    /*url: function() {
        return '/useragreement/' + this.id + '/' + this.city   ;
      },*/
      
    initialize: function () {
        this.validators = {};

        this.validators.dbId = function (value) {
        	console.log('dbId', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have the users dbId"};
        };

        this.validators.username = function (value) {
        	console.log('username', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have phone number as username"};
        };

        this.validators.email = function (value) {
        	console.log('email', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have email for user"};
        };
        
        this.validators.name = function (value) {
        	console.log('name', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have name for the user"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        dbId: "000998",
        username: "9875400123",
        email: "huh@gmail.com",
        name: "Dont Know",
        isAirlines: "a",
        airlinesId: 00000,
        city: "mumbai"        	
    }
});

window.UserAsPassCollection = Backbone.Collection.extend({

    model: User,

    url: "/useragreement"
    	
 });

/******** */

window.AirlinesCities = Backbone.Model.extend({

    urlRoot: "/airlinescities", 

    idAttribute: "airlinesId",
    
    initialize: function () {
        this.validators = {};

        this.validators.airlinesId = function (value) {
        	console.log('airlinesId', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a airlinesId"};
        };

        this.validators.city = function (value) {
        	console.log('city', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a city"};
        };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        airlinesId: "000000",
        city: "Hyderabad"  	
    }
});

window.AirlinesCitiesCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.id = options.id;
	  },
	  
	unique: true,
	  
    model: AirlinesCities,
    
    url: function() {
        return '/airlinescities/' + this.id;
      },
      
    comparator: function(item) {
        // make sure this returns a string!
        return item.get("city");
      }	  
 });

window.AirlinesByCitiesCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
	    this.city = options.city;
	    this.id = options.id;
	  },
	  
	unique: true,
	  
    model: AirlinesCities,
    
    url: function() {
        return '/airlinesbycities/' + this.city + '/' + this.id;
      }		
 });

/********** 2 */

window.Airs = Backbone.Model.extend({

    urlRoot: "http://www.flightradar24.com/zones/full_all.json",
    //urlRoot: "http://localhost/tickets/json/api_airport.json",

    idAttribute: "airsId",
    
    initialize: function () {
        this.validators = {};

        this.validators.airlinesId = function (value) {
        	console.log('airsId', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a airsId"};
        };

        this.validators.city = function (value) {
        	console.log('dest', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a dest"};
        };

    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
	        options.crossDomain ={
	          crossDomain: true
	        };
	        options.xhrFields = {
	          withCredentials: true
	        };
	      });
    },
	      
    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        airsId: "DL005",
        dest: "CMH"  	
    }
});

window.AirsCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.id = options.id;
	  },
	  
	unique: true,
	  
    model: Airs,
    
    url: function() {
        return 'http://www.flightradar24.com/zones/full_all.json';
    	//return 'http://localhost/tickets/json/api_airport.json';
      },
      
    comparator: function(item) {
        // make sure this returns a string!
        return item.get("dest");
      }	  
 });

/******** */

window.PassengerCities = Backbone.Model.extend({

    urlRoot: "/showcities", 

    idAttribute: "_Id",
        
    initialize: function () {
        this.validators = {};


        this.validators.cityname = function (value) {
        	console.log('cityname', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a passenger city name"};
        };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        passengerId: 000000,
        countryname: "NZ-New Zealand", 
        cityname: "AKL-Auckland"  	
    }
});

window.ShowCitiesCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.id = options.id;
	    this.country = options.country;
	  },
	  
	//unique: true,
	  
    model: PassengerCities,
    
    url: function() {
        return '/showcities/' + this.id +'/' + this.country;
      },
    	
    comparator: function(item) {
        // make sure this returns a string!
        return item.get("cityname");
      }	  
 });

window.ShowCitiesCodeCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.city = options.city;
	  },
	  
    model: PassengerCities,
    
    url: function() {
        return '/passAirlinesbyCity/' + this.city ;
      },
    	
 });

window.SaveCitiesCodeCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.city = options.city;
	  },
	  
    model: PassengerCities,
    
    url: function() {
        return '/passAirlinesbyCity' ;
      },
    	
 });

/******** */

window.PassengerCountries = Backbone.Model.extend({

    urlRoot: "/showcountries", 

    idAttribute: "countryname",
        
    initialize: function () {
        this.validators = {};


        this.validators.countryname = function (value) {
        	console.log('countryname', value);
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a passenger country name"};
        };

    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },
    
    defaults: {
        _id: null,
        countryname: "Australia"  	
    }
});

window.ShowCountriesCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.id = options.id;
	  },
	  
	//unique: true,
	  
    model: PassengerCountries,
    
    url: function() {
        return '/showcountries/' + this.id;
      },
    	
    comparator: function(item) {
        // make sure this returns a string!
        return -item.get("countryname") ;
      }	  
 });

/********* */

window.UserLocation = Backbone.Model.extend({

urlRoot: "/userlocation", 

idAttribute: "_Id",
    
initialize: function () {
    this.validators = {};


    this.validators.lat = function (value) {
    	console.log('lat', value);
        return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a location name"};
    };

},

validateItem: function (key) {
    return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
},

// TODO: Implement Backbone's standard validate() method instead.
validateAll: function () {

    var messages = {};

    for (var key in this.validators) {
        if(this.validators.hasOwnProperty(key)) {
            var check = this.validators[key](this.get(key));
            if (check.isValid === false) {
                messages[key] = check.message;
            }
        }
    }

    return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
},

defaults: {
    _id: null,
    departureAirportFsCode: 'AAA',
    arrivalAirportFsCode: 'BBB', 
    departureTime: 'd',//new Date,
    arrivalTime: 'a',
    arrivalTerminal: 'Z',
    carrierFsCode: 'BBB',   	
    flightNumber: 1234,
    currentDate: 'c', 
    lat: 41.1392974,
	long: -81.9973236,
	passengerId: 112233
}
});


/********* */

window.AirlinesLocation = Backbone.Model.extend({

urlRoot: "/airlineslocation", 

idAttribute: "_Id",
    
initialize: function () {
    this.validators = {};


    this.validators.lat = function (value) {
    	console.log('lat', value);
        return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a airlines location name"};
    };

},

validateItem: function (key) {
    return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
},

// TODO: Implement Backbone's standard validate() method instead.
validateAll: function () {

    var messages = {};

    for (var key in this.validators) {
        if(this.validators.hasOwnProperty(key)) {
            var check = this.validators[key](this.get(key));
            if (check.isValid === false) {
                messages[key] = check.message;
            }
        }
    }

    return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
},

defaults: {
    _id: null,
    departureAirportFsCode: 'AIRCODE',
    arrivalAirportFsCode: 'AIRARRCD', 
    departureTime: 'e',//new Date,
    arrivalTime: 'b',
    arrivalTerminal: 'Y',
    carrierFsCode: 'CCC',   	
    flightNumber: 5678,
    currentDate: 'g', 
    lat: 20.1392974,
	long: -40.9973236  	        	
}
});

/********* */

window.UserLocationCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
		this.carrierFsCode = options.carrierFsCode;
		this.flightNumber = options.flightNumber;
		
	  },

	unique: true,
	  
    model: UserLocation,
    
    url: function() {
        return '/loggedinairlineslocation/' + this.carrierFsCode + '/' + this.flightNumber;
      },
      
    comparator: function(item) {
        // make sure this returns a string!
        return item.get("currentDate") ;
      }	  
 });

window.UserlocsCollection = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
		
	  },

	unique: true,
	  
    model: UserLocation,
    
 /*   url: function() {
        return '/loggedinairlineslocation/' + this.carrierFsCode + '/' + this.flightNumber;
      },*/
      
    comparator: function(item) {
        // make sure this returns a string!
        //return item.get("currentDate") ;
    	return item.get("departureAirportFsCode") ;
      }	  
 });

/********* */

window.TempUserLocation = Backbone.Model.extend({

urlRoot: "/tempuserlocation", 

idAttribute: "_Id",
    
initialize: function () {
    this.validators = {};


    this.validators.lat = function (value) {
    	console.log('lat', value);
        return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must have a location name"};
    };

},

validateItem: function (key) {
    return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
},

// TODO: Implement Backbone's standard validate() method instead.
validateAll: function () {

    var messages = {};

    for (var key in this.validators) {
        if(this.validators.hasOwnProperty(key)) {
            var check = this.validators[key](this.get(key));
            if (check.isValid === false) {
                messages[key] = check.message;
            }
        }
    }

    return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
},

defaults: {
    _id: null,
    departureAirportFsCode: 'TTT',
    arrivalAirportFsCode: 'SSS', 
    departureTime: 'j',//new Date,
    arrivalTime: 'k',
    arrivalTerminal: 'D',
    carrierFsCode: 'NNN',   	
    flightNumber: 7654,
    currentDate: 'e', 
    lats: 37.1366974,
	longs: -76.0073236,
	passengerId: 445500
}
});
/********* */

window.NewUserLocation = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.passengerId = options.passengerId;
	  },
	  
    model: UserLocation,
    
    url: function() {
        return '/checkuserlocation/' + this.passengerId ;
      },
    	
 });

window.NewUserAgainLocation = Backbone.Collection.extend({

	initialize: function(models, options) {
		console.log('this', this);
	    this.passengerId = options.passengerId;
	  },
	  
    model: UserLocation,
    
    url: function() {
        return '/checkuserlocation/' + this.passengerId ;
      },
    	
 });
