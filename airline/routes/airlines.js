var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('192.168.0.104', 27017, {auto_reconnect: true});
db = new Db('airlinesdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'airlinesdb' database");
        db.collection('airlines', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'airlines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
         db.collection('user', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'user' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
         db.collection('airlinescities', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'airlinescities' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });
         db.collection('passengercountrycities', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'passengercountrycities' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });
         db.collection('passengercountries', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'passengercountries' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });
         db.collection('userlocation', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'userlocation' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });
         db.collection('tempuserlocation', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'tempuserlocation' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });         
         db.collection('airlineslocation', {safe:true}, function(err, collection) {
             if (err) {
                 console.log("The 'userlocation' collection doesn't exist. Creating it with sample data...");
                 populateDB();
             }
         });      
         
    }
});

exports.aboutAsPass = function(req, res) {
	var itemExists = false;
	console.log('aboutAsPass', req.user);
    var id = req.user._id;
    var username = req.user.username;
    var email = req.user.email;
    var name = req.user.name;
    var userType = req.user.userType;
    var airlinesId = req.user.airlinesId;
    console.log('Adding Users: ' + id + ' ' + username + ' ' + email + ' ' + name + ' ' + userType + ' ' + airlinesId );
	var curuser = [
	        	{
	        		dbId: id,
	            	username: username,
	                email: email,
	                name: name,
	                userType: userType,
	                airlinesId : airlinesId 
	            }];    
	
    var dbusername = req.user.username;
    console.log('Retrieving user: ' + dbusername);
    db.collection('user', function(err, collection) {
/*        collection.findOne({'username':dbusername}, function(err, item) {
            if(item)
        	{
            	console.log('User already exists: ' + JSON.stringify(item));
            	itemExists = true;
        	}
            else
        	{
            	console.log('User does not exists in database: ');
            	itemExists = false;
        	}
            if(!itemExists)
            {
*/                db.collection('user', function(err, collection) {
                    collection.insert(curuser, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('Success adding: ' + JSON.stringify(result[0]));
                            res.send(result[0]);
                        }
                    });
                });    	
//        	}            
//        });
    });
}

exports.findUser = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving User id: ', id)
    db.collection('user', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        	console.log("item", item);
            var currcity =item.city;
        	var citysplit =currcity.split("-");
        	var citycode = citysplit[0];
        	
        	item.city = citycode;
        	// for a passenger login we will not update the city
            console.log('Updating user: ' + item.username);                
            console.log(JSON.stringify(item));
            db.collection('user', function(err, collection) {
            	
                collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
                    if (err) {
                        console.log('Error updating airlines: ' + err);
                        	res.send({'error':'An error has occurred'});
                    } else {
                        console.log('' + result + ' document(s) updated');
                        	res.send(item);
                    }
                });
                
            });            
        });
    });
    
}

exports.addUsers = function(req, res) {
	var itemExists = false;
	console.log('addUsers');
	var dbId = req.body.dbId;
    var username = req.body.username;
    var email = req.body.email;
    var name = req.body.name;
    var userType = req.body.userType;
    var airlinesId = req.body.airlinesId;
    var city = req.body.city;
    
    console.log('Adding Airline Users: ' + dbId + ' ' + username + ' ' + email + ' ' + name + ' ' + userType + ' ' + airlinesId + ' ' + city);
	var curuser = [
	        	{
	        		dbId: dbId,
	            	username: username,
	                email: email,
	                name: name,
	                userType: userType,
	                airlinesId : airlinesId,
	                city : city
	            }];    
	
    var dbusername = req.body.username;
    console.log('Retrieving user: ' + dbusername);
    db.collection('user', function(err, collection) {
        collection.findOne({'username':dbusername}, function(err, item) {
            if(item)
        	{
            	console.log('User already exists: ' + JSON.stringify(item));
            	item.city = city;
                //delete item._id;
                console.log('Updating user: ' + item.username);                
                console.log(JSON.stringify(item));
                db.collection('user', function(err, collection) {
                	
                    collection.update({'username':item.username}, item, {safe:true}, function(err, result) {
                        if (err) {
                            console.log('Error updating airlines: ' + err);
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('' + result + ' document(s) updated');
                            res.send(item);
                        }
                    });
                    
                   // collection.update({'username': item.username}, item, {safe:true}, function(err, result) {                	
                   /* collection.update({'username': item.username}, { $set: { "city": city } }, function(err, result) {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('Success updating: ' + JSON.stringify(result));
                            res.send(result);
                        }
                    });*/
                   });
                
            	itemExists = true;        	
        	}
            else
        	{
            	console.log('User does not exists in database: ');
            	itemExists = false;
        	}
            if(!itemExists)
            {
                db.collection('user', function(err, collection) {
                    collection.insert(curuser, {safe:true}, function(err, result) {
                        if (err) {
                            res.send({'error':'An error has occurred'});
                        } else {
                            console.log('Success adding: ' + JSON.stringify(result[0]));
                            res.send(result[0]);
                        }
                    });
                });    	
        	}
            
        });
    });
}

exports.findByCountry= function(req, res) {
    console.log('Retrieving airlines: ' + id);
    var country = req.params.country;
    db.collection('airlines', function(err, collection) {
        collection.find({country: "Spain"}, function(err, item) {
            res.send(item);
        });
    });
        
};

exports.findpassengername= function(req, res) {
    var id = req.params.id;
    console.log('Retrieving passenger: ' + id);
    db.collection('user', function(err, collection) {
    	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    }); 
};

exports.grabuserlocation= function(req, res) {
    console.log('grabuserlocation: ' + id);
	res.render('tpl/loadmap.ejs',{req:req });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    var city = req.params.city;
    console.log('Retrieving airlines: ' + id);

    db.collection('airlines', function(err, collection) {        		       
     collection.update({'_id':new BSON.ObjectID(id)}, { $set: { "city": city } } );
    });    	                
    
    db.collection('airlines', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        	
        	console.log("item", item);
        	//db.airlines.update( {'_id':new BSON.ObjectID(id)}, { $set: { "city": city } } );
        	
        	var tempairlinescities = [
        		        	{
        		        		airlinesId: id,
        		            	city: 'Los Angeles' 
        		            }];    
        	   /*db.collection('airlinescities', function(err, collection) {        		       
                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0]);
                    }
                });
               });*/    	                
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('airlines', function(err, collection) {
        collection.find().toArray(function(err, items) {
        	//console.log('items', items)
            res.send(items);
        });
    });
};

exports.findAirlinesCities = function(req, res) {
    var id = req.params.id;
	console.log('airlinescities called : ', id);
	
    db.collection('airlinescities', function(err, collection) {
    	collection.find({'airlinesId' : id}).toArray(function(err, items) {
        	console.log('Item records', items);
        	var tempairlinescities = [
        	        		        	{
        	        		        		airlinesId: id,
								//city: 'ANC-Ted Stevens Anchorage International Airport>FAI-Fairbanks International Airport>PHX-Phoenix Sky Harbor International Airport>TUS-Tucson International Airport>BUR-Bob Hope Airport>LAX-Los Angeles International Airport>OAK-Oakland International Airport>ONT-Ontario International Airport>PSP-Palm Springs International Airport>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-San Jose International Airport>SNA-John Wayne Airport>COS-Colorado Springs Airport>DEN-Denver International Airport>MTJ-Montrose Regional Airport>EGE-Eagle County Airport>BDL-Bradley International Airport>FLL-Fort Lauderdale Hollywood International Airport>RSW-Southwest Florida International Airport>JAX-Jacksonville International Airport>MIA-Miami International Airport>MCO-Orlando International Airport>ECP-Northwest Florida Beaches International Airport>SRQ-Sarasota Bradenton International Airport>TPA-Tampa International Airport>PBI-Palm Beach International Airport>ATL-Hartsfield Jackson Atlanta International Airport>ITO-Hilo International Airport>HNL-Honolulu International Airport>OGG-Kahului Airport>KOA-Kona International Airport>LIH-Lihue Airport>BOI-Boise Airport>MDW-Chicago Midway International Airport>ORD-OHare International Airport>IND-Indianapolis International Airport>DSM-Des Moines International Airport>ICT-Wichita Mid-Continent Airport>SDF-Louisville International Airport>MSY-Louis Armstrong New Orleans International Airport>BWI-Baltimore Washington International Airport>BOS-Logan International Airport>DTW-Detroit Metropolitan Wayne County Airport>GRR-Gerald R. Ford International Airport>MSP-Minneapolis Saint Paul International Airport>MCI-Kansas City International Airport>STL-Lambert Saint Louis International Airport>BIL-Billings Logan International Airport>BZN-Gallatin Field Airport>OMA-Eppley Airfield>LAS-McCarran International Airport>RNP-Reno Tahoe International Airport>MHT-Manchester Boston Regional Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque International Sunport>ALB-Albany International Airport>BUF-Buffalo Niagara International Airport>JFK-John F. Kennedy International Airport>LGA-La Guardia Airport>ROC-Greater Rochester International Airport>SYR-Syracuse Hancock International Airport>CLT-Charlotte/Douglas International Airport>GSO-Piedmont Triad International Airport>RDU-Raleigh-Durham International Airport>CVG-Cincinnati/Northern Kentucky International Airport>CLE-Cleveland Hopkins International Airport>CMH-Port Columbus International Airport>DAY-Dayton International Airport>OKC-Will Rogers World Airport>TUL-Tulsa International Airport>EUG-Eugene Airport>PDX-Portland International Airport>MDT-Harrisburg International Airport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>FSD-Sioux Falls Regional Airport>TYS-McGhee Tyson Airport>MEM-Memphis International Airport>BNA-Nashville International Airport>AUS-Austin Bergstrom Internation'
								//city: 'JAC-Jackson Hole Airport>CWA-Central Wisconsin Airport>MKE-General Mitchell International Airport>MSN-Dane County Regional Airport>LSE-La Crosse Regional Airport>GRB-Austin Straubel International Airport>CRW-Yeager Airport>GEG-Spokane International Airport>SEA-Seattle Tacoma International Airport>IAD-Washington Dulles International Airport>DCA-Ronald Reagan Washington National Airport>ROA-Roanoke Regional Airport>RIC-Richmond International Airport>ORF-Norfolk International Airport>PHF-Newport News/Williamsburg International Airport>SLC-Salt Lake City International Airport>SAT-San Antonio International Airport>HOU-William P. Hobby Airport>IAH-George Bush Intercontinental Airport>ELP-El Paso International Airport>DFW-Dallas/Fort Worth International Airport>DAL-Dallas Love Field>CRP-Corpus Christi International Airport>AUS-Austin Bergstrom International Airport>BNA-Nashville International Airport>MEM-Memphis International Airport>TYS-McGhee Tyson Airport>CHA-Chattanooga Metropolitan Airport>FSD-Sioux Falls Regional Airport>RAP-Rapid City Regional Airport>YR-Myrtle Beach International Airport>GSP-Greenville Spartanburg International Airport>CAE-Columbia Metropolitan Airport>CHS-Charleston International Airport>PVD-T. F. Green Airport>PIT-Pittsburgh International Airport>PHL-Philadelphia International Airport>MDT-Harrisburg International Airport>ABE-Lehigh Valley International Airport>PDX-Portland International Airport>TUL-Tulsa International Airport>OKC-Will Rogers World Airport>DAY-Dayton International Airport>CMH-Port Columbus International Airport>CLE-Cleveland Hopkins International Airport>CVG-Cincinnati Northern Kentucky International Airport>CAK-Akron Canton Regional Airport>MOT-Minot International Airport>FAR-Hector International Airport>BIS-Bismarck Municipal Airport>RDU-Raleigh-Durham International Airport>GSO-Piedmont Triad International Airport>FAY-Fayetteville Regional Airport>CLT-Charlotte/Douglas International Airport>AVL-Asheville Regional Airport>HPN-Westchester County Airport>SYR-Syracuse Hancock International Airport>ROC-Greater Rochester International Airport>LGA-La Guardia Airport>JFK-John F. Kennedy International Airport>BUF-Buffalo Niagara International Airport>ALB-Albany International Airport>ELP-El Paso International Airport>ABQ-Albuquerque International Sunport>EWR-Newark Liberty International Airport>MHT-Manchester Boston Regional Airport>RNO-Reno Tahoe International Airport>LAS-McCarran International Airport>OMA-Eppley Airfield>FCA-Glacier Park International Airport>BZN-Gallatin Field Airport>BIL-Billings Logan International Airport>STL-Lambert Saint Louis International Airport>MCI-Kansas City International Airport>MEI-Meridian Regional Airport>JAN-Jackson International Airport>GPT-Gulfport Biloxi International Airport>MSP-Minneapolis Saint Paul International Airport>TVC-Cherry Capital Airport>GRR-Gerald R. Ford International Airport>FNT-Bishop International Airport>DTW-Detroit Metropolitan Wayne County Airport>BOS-Logan International Airport>BWI-Baltimore Washington International Airport>PWM-Portland International Jetport>MSY-Louis Armstrong New Orleans International Airport>SDF-Louisville International Airport>LEX-Blue Grass Airport>ICT-Wichita Mid Continent Airport>DSM-Des Moines International Airport>IND-Indianapolis International Airport>ORD-O Hare International Airport>MDW-Chicago Midway International Airport>BOI-Boise Airport>LIH-Lihue Airport>KOA-Kona International Airport>OGG-Kahului Airport>HNL-Honolulu International Airport>SAV-Savannah International Airport>AGS-Augusta Regional Airport>ATL-Hartsfield Jackson Atlanta International Airport>PBI-Palm Beach International Airport>TPA-Tampa International Airport>TLH-Tallahassee Regional Airport>SRQ-Sarasota Bradenton International Airport>PNS-Pensacola International Airport>ECP-Northwest Florida Beaches International Airport>MCO-Orlando International Airport>MIA-Miami International Airport>MLB-Melbourne International Airport>EYW-Key West International Airport>JAX-Jacksonville International Airport>VPS-Northwest Florida Regional Airport>RSW-Southwest Florida International Airport>FLL-Fort Lauderdale-Hollywood International Airport>DAB-Daytona Beach International Airport>BDL-Bradley International Airport>EGE-Eagle County Airport>MTJ-Montrose Regional Airport>HDN-Yampa Valley Airport>DEN-Denver International Airport>COS-Colorado Springs Airport>SNA-John Wayne Airport>SJC-San Jose International Airport>SFO-SAN FRANCISCO CA>SAN-San Diego International Airport>SMF-Sacramento International Airport>PSP-Palm Springs International Airport>ONT-Ontario International Airport>OAK-Oakland International Airport>LAX-Los Angeles International Airport>LGB-Long Beach Airport>BHM-BIRMINGHAM>HSV-Huntsville International Airport>MOB-Mobile Regional Airport>ANC-Ted Stevens Anchorage International Airport>FAI-Fairbanks International Airport>KTN-Ketchikan International Airport>PHX-Phoenix Sky Harbor International Airport>TUS-Tucson International Airport>LIT-Little Rock National Airport>BUR-Bob Hope Airport'
								//city: 'EIS-Tortola/Beef Island, Virgin Islands (British) Beef Island>HOG-Frank País Airport>HAV-José Martí International Airport>PTP-Pointe à Pitre International Airport>GND-Maurice Bishop International Airport>FDF-Fort De France, Martinique Fort De France>SKB-Robert L. Bradshaw International Airport>STX-Henry E. Rohlsen Airport>STT-Cyril E. King Airport>CYOW-Ottawa Macdonald Cartier International Airport	Ottawa, Ontario, Canada>YYZ-Toronto Pearson International Airport Hub>YUL-Pierre Elliott Trudeau Airport Hub>MMAS-Lic. Jesús Terán Peredo International Airport	Aguascalientes, Aguascalientes, Mexico>MMCU-General Roberto Fierro Villalobos International Airport	Chihuahua, Chihuahua, Mexico>MMTC-Francisco Sarabia International Airport	Torreón, Coahuila, Mexico>MMLO-Del Bajío International Airport	León, Guanajuato, Mexico>MMGL-Miguel Hidalgo y Costilla International Airport	Guadalajara, Jalisco, Mexico>MMMM-General Francisco J. Mujica International Airport	Morelia, Michoacán, Mexico>MMSP-Ponciano Arriaga International Airport	San Luis Potosí, San Luis Potosí, Mexico>MZT-Mazatlan, Sinaloa, Mexico Buelna>MMVR-General Heriberto Jara International Airport	Veracruz, Veracruz, Mexico>BHM-Birmingham Shuttlesworth International Airport	Birmingham, Alabama>HSV-Huntsville International Airport	Huntsville, Alabama>MOB-Mobile Regional Airport	Mobile, Alabama>MGM-Montgomery Regional Airport	Montgomery, Alabama>PHX-Phoenix Sky Harbor International Airport>TUS-Tucson International Airport>FAY-Fayetteville Regional Airport	Fayetteville, North Carolina>FSM-Fort Smith Regional Airport	Fort Smith, Arkansas>LIT-Little Rock, AR, USA Little Rock Regional Airport>TXK-Texarkana Regional Airport>FAT-Fresno Yosemite International Airport>LAX-Los Angeles International Airport>MRY-Monterey Regional Airport	Monterey, California>SMF-Sacramento International Airport>SAN-San Diego International Airport>SJC-San Jose International Airport>SBA-Santa Barbara Municipal Airport (Santa Barbara Airport)>ASE-Aspen Pitkin County Airport	Aspen, Colorado>DEN-Denver International Airport>DRO-Durango La Plata County Airport>MTJ-Montrose Regional Airport>GJT-Grand Junction Regional Airport	Grand Junction, Colorado>GUC-Gunnison Crested Butte Regional Airport	Gunnison, Colorado>BDL-Hartford, CT, USA Bradley International Airport>RSW-Fort Myers, FL, USA Regional Southwest Airport>ECP-Northwest Florida Beaches International Airport>GNV-Gainesville Regional Airport	Gainesville, Florida>ATL-Hartsfield Jackson Atlanta International Airport	Jacksonville, Florida>KEY-Key West International Airport	Key West, Florida>MIA-Miami International Airport>PNS-Pensacola International Airport (Pensacola Gulf Coast Regional Airport)>TLH-Tallahassee Regional Airport	Tallahassee, Florida>TPA-Tampa International Airport>SAV-Savannah/Hilton Head International Airport>BMI-Central Illinois Regional Airport	Bloomington, Illinois>CMI-University of Illinois Willard Airport>ORD-OHare International Airport>MLI-Quad City International Airport	Moline, Illinois>PIA-General Wayne A. Downing Peoria International Airport	Peoria, Illinois>SPI-Abraham Lincoln Capital Airport	Springfield, Illinois>EVV-Evansville Regional Airport	Evansville, Indiana>FWA-Fort Wayne International Airport	Fort Wayne, Indiana>IND-Indianapolis International Airport>CID-The Eastern Iowa Airport	Cedar Rapids, Iowa>DSM-Des Moines International Airport>DBQ-Dubuque Regional Airport>GCK-Garden City Regional Airport>MHK-Manhattan Regional Airport>ICT-Wichita Mid Continent Airport	Wichita, Kansas>CVG-Cincinnati/Northern Kentucky International Airport>SDF-Louisville International Airport (Standiford Field)>LEX-Blue Grass Airport	Lexington, Kentucky>AEX-Alexandria Airport	Alexandria, Louisiana>BTR-Baton Rouge Metropolitan Airport	Baton Rouge, Louisiana>LAF-Lafayette Regional Airport	Lafayette, Louisiana>LCH-Lake Charles Regional Airport	Lake Charles, Louisiana>MLU-Monroe Regional Airport	Monroe, Louisiana>MSY-Louis Armstrong New Orleans International Airport>SHV-Shreveport Regional Airport	Shreveport, Louisiana>BWI-Baltimore, MD, USA BaltimoreWashington International>DTW-Detroit Metropolitan Wayne County Airport>GRR-Gerald R. Ford International Airport	Grand Rapids, Michigan>GND-Maurice Bishop International Airport>AZO-Kalamazoo/Battle Creek International Airport>SAW-Sawyer International Airport>TVC-Cherry Capital Airport	Traverse City, Michigan>MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)>RST-Rochester International Airport>JAN-Jackson Evers International Airport>GPT-Gulfport Biloxi International Airport	Gulfport, Mississippi>MCI-Kansas City, MO, USA Kansas City International Airport>STL-Lambert St. Louis International Airport>SGF-Springfield Branson National Airport	Springfield, Missouri>GRI-Central Nebraska Regional Airport>OMA-Eppley Airfield>RNO-Tahoe/Reno, NV, USA Reno Tahoe International Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque International Sunport>SAF-Santa Fe Municipal Airport (scheduled passenger service resumed 2009)>ROW-Roswell International Air Center>BUF-Buffalo Niagara International Airport>JFK-John F. Kennedy International Airport>ROC-Greater Rochester International Airport>SYR-Syracuse Hancock International Airport>HPN-Westchester County Airport>AVL-Asheville Regional Airport	Asheville, North Carolina>CLT-Charlotte/Douglas International Airport>GSO-Piedmont Triad International Airport	Greensboro, North Carolina>RDU-Raleigh Durham International Airport>FAR-Hector International Airport>CLE-Cleveland, OH, USA Hopkins International Airport>CMH-Port Columbus International Airport>DAY-James M. Cox Dayton International Airport>TOL-Toledo Express Airport>LAW-Lawton Fort Sill Regional Airport>OKC-Will Rogers World Airport>TUL-Tulsa International Airport>MDT-Harrisburg International Airport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>AVP-Wilkes Barre/Scranton International Airport	Scranton, Pennsylvania>CHS-Charleston International Airport / Charleston>CAE-Columbia Metropolitan Airport>GSP-Greenville Spartanburg International Airport (Roger Milliken Field)>MYR-Myrtle Beach International Airport>RAP-Rapid City Regional Airport>FSD-Sioux Falls Regional Airport (Joe Foss Field)>CHA-Chattanooga Metropolitan Airport	Chattanooga, Tennessee>TYS-McGhee Tyson Airport>MEM-Memphis International Airport>BNA-Nashville International Airport (Berry Field)>ABI-Abilene Regional Airport>AMA-Rick Husband Amarillo International Airport>AUS-Austin Bergstrom International Airport>BRO-Brownsville/South Padre Island International Airport>CLL-Easterwood Airport (Easterwood Field)>CRP-Corpus Christi International Airport>DFW-Dallas/Fort Worth International Airport>ELP-El Paso International Airport>IAH-George Bush Intercontinental Airport>HOU-William P. Hobby Airport>GRK-Killeen Fort Hood Regional Airport	Killeen, Texas>LRD-Laredo International Airport>GGG-East Texas Regional Airport>LBB-Lubbock Preston Smith International Airport>MAF-Midland International Airport>SJT-San Angelo Regional Airport (Mathis Field)>TYR-Tyler Pounds Regional Airport>ACT-Waco Regional Airport>SPS-Wichita Falls Municipal Airport / Sheppard Air Force Base>SLC-Salt Lake City International Airport>ORF-Norfolk International Airport>RIC-Richmond International Airport (Byrd Field)>DCA-Ronald Reagan Washington National Airport>CRW-Yeager Airport>GRB-Austin Straubel International AirportLSE-La Crosse Regional Airport>MSN-Dane County Regional Airport (Truax Field)>MKE-General Mitchell International Airport>CWA-Central Wisconsin Airport>MYEG-George Town Airport	George Town, Great Exuma, Bahamas>FPO-Grand Bahama International Airport>MYNN-Lynden Pindling International Airport	Nassua, New Providence, Bahamas>NAS-Nassau, Bahamas Nassau International Airport'
								//city: 'AUA-Queen Beatrix International Airport>NAS-Lynden Pindling International Airport>PUJ-Punta Cana, Dominican Republic>MBJ-Sangster International Airport>SJD-San Jose Del Cabo, Baja California Sur, Mexico Los Cabos Intl Airport>MEX-Mexico City International Airport>CUN-Cancún International Airport>SJU-San Juan, PR, USA Luis Munoz Marin International>LAX-Los Angeles International Airport>SFO-San Francisco International Airport>SNA-Santa Ana, CA, USA John Wayne Airport>DEN-Denver International Airport>BDL-Hartford, CT, USA Bradley International Airport>FLL-Fort Lauderdale Hollywood International Airport>RSW-Fort Myers, FL, USA Regional Southwest Airport>JAX-Jacksonville International Airport>MCO-Orlando International Airport>PBI-Palm Beach International Airport>PNS-Pensacola International Airport (Pensacola Gulf Coast Regional Airport)>TPA-Tampa International Airport>ATL-Hartsfield Jackson Atlanta International Airport	Jacksonville, Florida>MDW-Chicago Midway International Airport>IND-Indianapolis International Airport>SDF-Louisville International Airport (Standiford Field)>MSY-Louis Armstrong New Orleans International Airport>BWI-Baltimore/Washington International Thurgood Marshall Airport>BOS-Gen. Edward Lawrence Logan International Airport>DTW-Detroit Metropolitan Wayne County Airport>MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)>MCI-Kansas City International Airport>STL-Lambert St. Louis International Airport>LAS-McCarran International Airport>BUF-Buffalo Niagara International Airport>LGA-LaGuardia Airport (and Marine Air Terminal)>RDU-Raleigh Durham International Airport>CAK-Akron Canton Regional Airport>CMH-Port Columbus International Airport>DAB-Daytona Beach International Airport>OKC-Oklahoma City, OK, USA Will Rogers World Airport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>MEM-Memphis International Airport>AUS-Austin Bergstrom International Airport>HOU-William P. Hobby Airport>SAT-San Antonio International Airport>ORF-Norfolk International Airport>RIC-Richmond International Airport (Byrd Field)>DCA-Ronald Reagan Washington National Airport>MKE-Milwaukee, WI, USA General Mitchell Field'
								//city: 'ANC-Ted Stevens International Airport>BOS-Logan International Airport>CHS-Charleston International Airport>CLT-Charlotte Douglas International Airport>ORD-OHare International Airport>CAE-Columbia Metropolitan Airport>DFW-Dallas/Fort Worth International Airport>DEN-Denver International Airport>FLL-Hollywood International Airport>RSW-Southwest Florida International Airport>HNL-Honolulu International Airport>IAH-George Bush Intercontinental Airport>JAX-Jacksonville International Airport>OGG-Kahului Airport>KOA-Kona International Airport>LAS-McCarran International Airport>LAX-Los Angeles International Airport>MEM-Memphis International Airport>MIA-Miami International Airport>MYR-Myrtle Beach International Airport>EWR-Newark Liberty International Airport>JFK-John F. Kennedy International Airport>LGA-La Guardia Airport>ONT-LA/Ontario International Airport>SNA-John Wayne Airport>MCO-Orlando International Airport>PHL-Philadelphia International Airport>PHX-Sky Harbor International Airport>PDX-Portland International Airport>RIC-Richmond International Airport>SLC-Salt Lake City International Airport>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-San Jose International Airport>SRQ-Sarasota Bradenton International Airport>SEA-Seattle Tacoma International Airport>TPA-Tampa International Airport>DCA-Ronald Reagan National Airport>PBI-Palm Beach International Airport>ANU-VC Bird International Airport>EZE-Ministro Pistarini International Airport>AUA-Queen Beatrix International Airport>MEL-Melbourne Airport>SYD-Sydney Airport>VIE-Vienna International Airport>GGT-Exuma International Airport>FPO-Grand Bahama International Airport>NAS-Lynden Pindling International Airport>BGI-Grantley Adams International Airport>BRU-Brussels Airport>BDA-Bermuda International Airport>GRU-São Paulo Guarulhos International Airport>YXX-Abbotsford International Airport>YYC-Calgary International Airport Hub>YQQ-Comox Airport>YDF-Deer Lake Airport>YEG-Edmonton International Airport>YMM-Fort McMurray Airport>YHZ-Halifax International Airport>YHM-John C. Munro International Airport>YLW-Kelowna International Airport>YXU-London International Airport>YUL-Pierre Elliott Trudeau Airport Hub>YOW-Macdonald Cartier International Airport>YQB-Québec/Jean Lesage International Airport>YQR-Regina International Airport>YXE-John G. Diefenbaker International Airport>YYT-St. Johns International Airport>YYZ-Toronto Pearson International Airport Hub>YVR-Vancouver International Airport Hub>YYJ-Victoria International Airport>YXY-Erik Nielsen International Airport>YWG-James Armstrong Richardson International Airport>GCM-Owen Roberts International Airport>SCL-Comodoro Arturo Merino Benitez Airport>PEK-Beijing Capital International Airport>PVG-Shanghai Pudong International Airport>BOG-El Dorado International Airport>LIR-Daniel Oduber International Airport>SJO-Juan Santamaría International Airport>ZAG-Zagreb Airport>CCC-Jardines del Rey Airport>CYO-Vilo Acuña Airport>HAV-José Martí International Airport>HOG-Frank País Airport>SNU-Abel Santa María Airport>VRA-Juan Gualberto Gómez Airport>CUR-Hato International Airport>PRG-Prague Ruzyne Airport>CPH-Copenhagen Airport>LRM-La Romana International Airport>POP-Gregorio Luperón International Airport>PUJ-Punta Cana International Airport>AZS-Samaná El Catey International Airport>SDQ-Las Américas International Airport>CAE-Lyon Saint Exupéry Airport>NCE-Nice Côte dAzur Airport>CDG-Paris Charles de Gaulle Airport>TXL-Tegel Airport>DUS-Dusseldorf International Airport>FRA-Frankfurt Airport>MUC-Munich Airport>ATH-Athens International Airport>GND-Maurice Bishop International Airport>PTP-Pointe à Pitre International Airport>PAP-Toussaint Louverture International Airport>HKG-Hong Kong International Airport>DEL-Indira Gandhi International Airport>BOM-Chatrapati Shivaji International>DUB-Dublin Airport>SNN-Shannon Airport>TLV-Ben Gurion International Airport>MXP-Milan Malpensa>FCO-Leonardo da Vinci Fiumicino Airport>VCE-Venice Marco Polo Airport>KIN-Norman Manley International Airport>MBJ-Sangster International Airport>NGO-Chubu Centrair International Airport>KIX-Kansai International Airport>NRT-Narita International Airport>FDF-Aimé Césaire International Airport>ACA-General Juan N. Álvarez International Airport>HUX-Bahías de Huatulco International Airport>CUN-Cancún International Airport>CZM-Cozumel International Airport>ZIH-Ixtapa Zihuatanejo International Airport>MEX-Mexico City International Airport>PVR-Lic. Gustavo Díaz Ordaz Airport>SJD-Los Cabos International Airport>AMS-Amsterdam Airport Schiphol>LIM-Jorge Chávez International Airport>LIS-Portela International Airport>SJU-Luis Muñoz Marín International Airport>SVO-Sheremetyevo International Airport>SKB-Robert L. Bradshaw International Airport>UVF-Hewanorra International Airport>SIN-Singapore Changi Airport>SXM-Princess Juliana International Airport>ICN-Incheon International Airport>BCN-Barcelona Airport>MAD-Barajas Airport>GVA-Geneva International Airport>ZRH-Zürich Airport>TPE-Taiwan Taoyuan International Airport>POS-Piarco International Airport>IST-Istanbul Atatürk Airport>PLS-Providenciales International Airport>BFS-Belfast International Airport>BHX-Birmingham Airport>EDI-Edinburgh Airport>GLA-Glasgow Airport>LHR-London Heathrow Airport>MAN-Manchester Airport>CCS-Simón Bolívar International Airport>PMV-Del Caribe International Airport'

								//city: 'PUJ-Punta Cana, Dominican Republic>MBJ-Montego Bay, Jamaica Sangster>CUN-Cancun, Mexico>MMCZ-Cozumel International Airport	Cozumel, Quintana Roo, Mexico>ZIH-Ixtapa/Zihuatanejo, Guerrero, Mexico International>PVR-Puerto Vallarta, Jalisco, Mexico Gustavo Diaz Ordaz>SJD-San Jose Del Cabo, Baja California Sur, Mexico Los Cabos Intl Airport>ANC-Ted Stevens Anchorage International Airport>FAI-Fairbanks International Airport>PHX-Phoenix Sky Harbor International Airport>IWA-Phoenix Mesa Gateway Airport>LIT-Little Rock, AR, USA Little Rock Regional Airport>FAT-Fresno Yosemite International Airport>LAX-Los Angeles International Airport>SNA-Santa Ana, CA, USA John Wayne Airport>PSP-Palm Springs International Airport>SAN-San Diego International Airport>SFO-San Francisco, CA, USA San Francisco Intl Airport>SBA-Santa Barbara Municipal Airport (Santa Barbara Airport)>DEN-Denver, CO, USA Denver International>DRO-Durango La Plata County Airport>DCA-Ronald Reagan Washington National Airport>FLL-Fort Lauderdale Hollywood International Airport>MCO-Orlando International Airport>TPA-Tampa International Airport>RSW-Southwest Florida International Airport>ATL-Atlanta, GA, USA Hartsfield International>BMI-Central Illinois Regional Airport at Bloomington Normal>MDW-Chicago Midway International Airport>IND-Indianapolis International Airport>CID-The Eastern Iowa Airport	Cedar Rapids, Iowa>DSM-Des Moines International Airport>MSY-Louis Armstrong New Orleans International Airport>DTW-Detroit Metropolitan Wayne County Airport>MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)>BBG-Branson Airport>MCI-Kansas City, MO, USA Kansas City International Airport>STL-St Louis, MO, USA LambertSt Louis Internatl>BZN-Bozeman Yellowstone International Airport (was Gallatin Field Airport)>GTF-Great Falls International Airport>OMA-Eppley Airfield>LAS-Las Vegas, NV, USA Mccarran International Airport>ABQ-Albuquerque International Sunport>LGA-New York, NY, USA Laguardia>CLT-Charlotte, NC, USA Charlotte/Douglas Intl Airport>GSO-Piedmont Triad International Airport>BIS-Bismarck Municipal Airport>FAR-Hector International Airport>MOT-Minot International Airport>CVG-Cincinnati/Northern Kentucky International Airport>CLE-Cleveland Hopkins International Airport>CMH-Port Columbus International Airport>OKC-Will Rogers World Airport>EUG-Eugene Airport (Mahlon Sweet Field)>PWM-Portland International Jetport>MDT-Harrisburg International Airport>FSD-Sioux Falls Regional Airport (Joe Foss Field)>       TYS-McGhee Tyson Airport>MEM-Memphis International Airport>BNA-Nashville International Airport (Berry Field)>AUS-Austin Bergstrom International Airport>DFW-Dallas/Fort Worth International Airport>IAH-George Bush Intercontinental Airport>SLC-Salt Lake City International Airport>DCA-Ronald Reagan Washington National Airport>PHF-Newport News/Williamsburg International Airport>BLI-Bellingham International Airport>SEA-Seattle Tacoma International Airport	Seattle, Washington>GEG-Spokane International Airport (Geiger Field)>MSN-Dane County Regional Airport (Truax Field)>MKE-General Mitchell International Airport>JAC-Jackson Hole, WY, USA Jackson Hole Airport'
								//city: 'ANU-ANTIGUA>AUA-Queen Beatrix International Airport>NAS-Nassau, Bahamas Nassau International Airport>NAS-Lynden Pindling International Airport>BDA-L.F. Wade International Airport>BON-Flamingo International Airport>GCM-Owen Roberts International Airport>CUR-Hato International Airport>PUJ-Punta Cana, Dominican Republic>SDQ-Santo Domingo, Dominican Republic Las Americas>PAP-Toussaint Louverture International Airport>MBJ-Montego Bay, Jamaica Sangster>BQN-Rafael Hernández International Airport>SJU-San Juan, PR, USA Luis Munoz Marin International>POS-Port Of Spain, Trinidad, Trinidad And Tobago Piarco International Airport>PLS-Caicos, Turks And Caicos Islands Providenciales>STT-St Thomas Island, VI, USA Cyril E King Arpt>BZE-Philip S. W. Goldson International Airport>LIR-Daniel Oduber Quirós International Airport>SJC-San Jose, CA, USA San Jose International Airport>SAL-San Salvador, El Salvador El Salvadore Intl Airport>GUA-Guatemala City, Guatemala La Aurora Intl Airport>RTB-Juan Manuel Gálvez International Airport>SAP-Ramón Villeda Morales International Airport>MGA-Augusto C. Sandino International Airport>PTY-Panama City, Panama Tocumen International Airport>YYC-Calgary International Airport>CYEG-Edmonton International Airport	Edmonton, Alberta, Canada>YVR-Vancouver, British Columbia, Canada Vancouver International>MMAA-General Juan N. Álvarez International Airport	Acapulco, Guerrero, Mexico>CUN-Cancun, Mexico>ELP-El Paso International Airport>MMCZ-Cozumel International Airport	Cozumel, Quintana Roo, Mexico>MMGL-Miguel Hidalgo y Costilla International Airport	Guadalajara, Jalisco, Mexico>MMZA-Ixtapa Zihuatanejo International Airport	Zihuatanejo, Guerrero, Mexico>MMLO-Del Bajío International Airport	León, Guanajuato, Mexico>MZT-General Rafael Buelna International Airport>MEX-Mexico City, Distrito Federal, Mexico Juarez Intl Airport>MMMY-General Mariano Escobedo International Airport	Monterrey, Nuevo León, Mexico>PVR-Puerto Vallarta, Jalisco, Mexico Gustavo Diaz Ordaz>MMSD-Los Cabos International Airport	San José del Cabo, Baja California Sur, Mexico>ANC-Ted Stevens Anchorage International Airport>PHX-Phoenix Sky Harbor International Airport>TUS-Tucson International Airport>LAX-Los Angeles International Airport>ONT-Ontario, CA, USA Ontario International>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-San Jose, CA, USA San Jose International Airport>SNA-Santa Ana, CA, USA John Wayne Airport>DEN-Denver International Airport>MTJ-Montrose Regional Airport>IAD-Washington Dulles International Airport>DCA-Ronald Reagan Washington National Airport>FLL-Fort Lauderdale Hollywood International Airport>RSW-Southwest Florida International Airport>JAX-Jacksonville International Airport>MIA-Miami International Airport>MCO-Orlando International Airport>TPA-Tampa International Airport>PBI-West Palm Beach, FL, USA Palm Beach International Airport>ATL-Hartsfield Jackson Atlanta International Airport>ITO-Hilo International Airport>HNL-Honolulu International Airport / Hickam>ORD-Chicago OHare International Airport>OGG-Kahului Airport>IND-Indianapolis, IN, USA Indianapolis International Airport>MSY-Louis Armstrong New Orleans International Airport>BWI-Baltimore/Washington International Thurgood Marshall Airport>BOS-Gen. Edward Lawrence Logan International Airport>DTW-Detroit Metropolitan Wayne County Airport>MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)>MCI-Kansas City, MO, USA Kansas City International Airport>STL-St Louis, MO, USA LambertSt Louis Internatl>OMA-Eppley Airfield>LAS-McCarran International Airport>RNO-Tahoe/Reno, NV, USA Reno Tahoe International Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque, NM, USA Albuquerque International Airport>LGA-New York, NY, USA Laguardia>CLT-Charlotte, NC, USA Charlotte/Douglas Intl Airport>RDU-Raleigh Durham International Airport>CLE-Cleveland Hopkins International Airport>CMH-Port Columbus International Airport>TUL-Tulsa International Airport>PWM-Portland International Jetport>PHL-Philadelphia, PA, USA Philadelphia International Airport>PIT-Pittsburgh International Airport>AUS-Austin, TX, USA Austin Bergstrom International Airport (ABIA)>DFW-Dallas/Ft Worth, TX, USA Dallas Ft Worth International>ELP-El Paso International Airport>IAH-George Bush Intercontinental Airport>MFE-McAllen Miller International Airport>SAT-San Antonio, TX, USA San Antonio International>SLC-Salt Lake City, UT, USA Salt Lake City International Arpt>SEA-Seattle Tacoma International Airport	Seattle, Washington>RIC-Richmond International Airport (Byrd Field)>EZE-Buenos Aires, Buenos Aires, Argentina Ezeiza Ministro Pistarini International Airport>GIG-Rio De Janeiro, Rio De Janeiro, Brazil International Airport>SJK-Sao Jose Dos Campos, Sao Paulo, Brazil Sao Jose Dos Campos Airport>BOG-El Dorado International Airport>UIO-Mariscal Sucre International Airport>LIM-Lima, Peru Intl Jorge Chavez>CCS-Caracas, Venezuela Simon Bolivar International>PEK-Beijing Capital International>SHA-Shanghai, China Shanghai Intl Hongqiao>HKG-Hong Kong, Hong Kong>DEL-Delhi, India Indira Gandhi International Airport>BOM-Chhatrapati Shivaji International Airport>DUB-Dublin Airport>TLV-Ben Gurion International Airport>FUK-Fukuoka Airport>NGO-Chubu Centrair International Airport>KIX-Kansai International Airport>NRT-Narita International Airport>MNL-Ninoy Aquino International Airport>SIN-Singapore, Singapore Changi International Airport>CPH-Copenhagen, Denmark Copenhagen>CDG-Paris Charles de Gaulle Airport>TXL-Berlin Tegel Airport>FRA-Frankfurt, Germany Frankfurt International>MUC-Munich, Germany Franz Josef Strauss>STR-Stuttgart Airport>DUB-Dublin, Ireland Dublin>SNN-Shannon Airport>MXP-Malpensa Airport>FCO-Leonardo da Vinci Fiumicino Airport>AMS-Amsterdam, Netherlands>LIS-Portela International Airport>BCN-Barcelona, Spain Barcelona>MAD-Madrid, Spain Barajas>ARN-Stockholm Arlanda Airport>GVA-Geneva International Airport>BFS-Belfast International Airport>BHM-Birmingham, AL, USA Seibels/Bryan Airport>EDI-Edinburgh, Scotland, United Kingdom Turnhouse>GGW-Glasgow, MT, USA>LHR-London Heathrow Airport>MHT-Manchester Boston Regional Airport>CNS-Cairns, Queensland, Australia Cairns International Airport>GUM-Antonio B. Won Pat International Airport'
								//city: 'ANC-Ted Stevens Anchorage International Airport>PHX-Phoenix Sky Harbor International Airport>LAX-Los Angeles International Airport>OAK-Oakland International Airport>ANC-Ted Stevens Anchorage International Airport>ONT-Ontario International Airport>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-Norman Y. Mineta San José International Airport>ITO-Hilo International Airport>HNL-Honolulu International Airport / Hickam>MKK-Molokai Airport (Moloka?i Airport)>OGG-Kahului Airport>KOA-Kona International Airport at Keahole>LNY-Lanai Airport (Lana?i Airport)>LIH-Lihue Airport (Lihu?e Airport)>LAS-McCarran International Airport>JFK-John F. Kennedy International Airport>PWM-Portland International Jetport>SEA-Seattle Tacoma International Airport>LGA-LaGuardia Airport	New York City, New York>CDP-Kapalua, Hawaii>JHM-Kapalua Airport>OGG-Kahului Airport>MKK-Molokai Airport (Moloka?i Airport)>HNL-Honolulu International Airport / Hickam>ITO-Hilo International Airport>FAT-Fresno Yosemite International Airport>PDX-Portland International Airport'
							//city: 'ANC-Ted Stevens Anchorage International Airport>PHX-Phoenix Sky Harbor International Airport>BUR-Bob Hope Airport>LGB-Long Beach Airport (Daugherty Field)>LAX-Los Angeles International Airport>OAK-Oakland International Airport>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-San Jose, CA, USA San Jose International Airport>DEN-Denver International Airport>BDL-Bradley International Airport>FLL-Fort Lauderdale Hollywood International Airport>RSW-Southwest Florida International Airport>JAX-Jacksonville International Airport>MCO-Orlando International Airport>SRQ-Sarasota Bradenton International Airport>TPA-Tampa International Airport>PBI-Palm Beach International Airport>ORD-Chicago OHare International Airport>MSY-Louis Armstrong New Orleans International Airport>PWM-Portland International Jetport>BWI-Baltimore/Washington International Thurgood Marshall Airport>BOS-Gen. Edward Lawrence Logan International Airport>MVY-Marthas Vineyard Airport>ACK-Nantucket Memorial Airport>ORH-Worcester Regional Airport>LAS-McCarran International Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque International Sunport>BUF-Buffalo Niagara International Airport>SWF-Stewart International Airport>JFK-John F. Kennedy International Airport>LGA-LaGuardia Airport (and Marine Air Terminal)>ROC-Greater Rochester International Airport>SYR-Syracuse Hancock International Airport>HPN-Westchester County Airport>CLT-Charlotte/Douglas International Airport>RDU-Raleigh Durham International Airport>PWM-Portland International Jetport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>PVD-Theodore Francis Green State Airport>CHS-Charleston International Airport / Charleston>PHL-Philadelphia International Airport>AUS-Austin, TX, USA  Austin Bergstrom International Airport (ABIA)>DFW-Dallas/Fort Worth International Airport>HOU-William P. Hobby Airport>SLC-Salt Lake City International Airport>BTV-Burlington International Airport>RIC-Richmond International Airport (Byrd Field)>DCA-Ronald Reagan Washington National Airport>IAD-Washington Dulles International Airport>SAV-Savannah/Hilton Head International Airport>SEA-Seattle Tacoma International Airport	Seattle, Washington>DTW-Detroit Metropolitan Wayne County Airport>STX-Henry E. Rohlsen Airport>STT-Cyril E. King Airport>BOG-El Dorado International AirportCTG-Cartagena, Colombia Rafael Nunez>MDE-Medellin, Colombia Jose Maria Cordova/Metropolitan Area>LIM-Lima, Peru Intl Jorge Chavez'
							//city: 'BHM-Birmingham, AL, USA Seibels/Bryan Airport>PHX-Phoenix, AZ, USA Sky Harbor International Airport>TUS-Tucson, AZ, USA Tucson International Airport>LIT-Little Rock, AR, USA Little Rock Regional Airport>BUR-Bob Hope Airport>LAX-Los Angeles, CA, USA Los Angeles Intl Airport>OAK-Oakland, CA, USA Metropolitan Oakland Intl Apt>ONT-Ontario, CA, USA Ontario International>SMF-Sacramento, CA, USA Sacramento Metropolitan>SAN-San Diego, CA, USA Lindbergh International Airport>SFO-San Francisco, CA, USA San Francisco Intl Airport>SJC-San Jose, CA, USA San Jose International Airport>SNA-Santa Ana, CA, USA John Wayne Airport>DEN-Denver, CO, USA Denver International>BDL-Hartford, CT, USA Bradley International Airport>FLL-Fort Lauderdale, FL, USA Ft Lauderdale/Hollywood Intl Apt>RSW-Ft Myers, FL, USA Regional Southwest Airport>JAX-Jacksonville, FL, USA Jacksonville International Airport>EYW-Key West, FL, USA>MCO-Orlando, FL, USA Orlando International Airport>PBI-Palm Beach/West Palm Beach, FL, USA Palm Beach International Airport>ECP-Northwest Florida Beaches International Airport>PNS-Pensacola, FL, USA>TPA-Tampa, FL, USA Tampa International>ATL-Atlanta, GA, USA Hartsfield International>BOI-Boise, ID, USA Boise Municipal Arpt (Gowen Field)>MDW-Chicago, IL, USA Midway>IND-Indianapolis, IN, USA Indianapolis International Airport>DSM-Des Moines, IA, USA>ICT-Wichita, KS, USA MidContinent Airport>SDF-Louisville, KY, USA Standiford Field>MSY-New Orleans, LA, USA Louis Armstrong New Orleans International Airport (Moisant International Airport)>PDX-Portland, OR, USA Portland International Airport>BWI-Baltimore, MD, USA Baltimore Washington International>BIL-Billings, MT, USA Billings Logan Intnl Airport>DTW-Detroit, MI, USA Detroit Wayne County Metropolitan Airport>FNT-Flint, MI, USA Bishop Intl Airport>GRR-Grand Rapids, MI, USA Kent County International Airport>MSP-Minneapolis, MN, USA Minneapolis/St Paul Intl Airport>JAN-Jackson, MS, USA Allen C Thompson Field>IRK-Kirksville, Missouri, USA Kirksville Airport>BKG-Branson Airport>MCI-Kansas City, MO, USA Kansas City International Airport>STL-Saint Louis, MO, USA LambertSt Louis Internatl>OMA-Omaha, NE, USA Eppley Airfield>LAS-Las Vegas, NV, USA Mccarran International Airport>RNO-Reno/Tahoe, NV, USA Reno Tahoe International Airport (formerly Reno Cannon International Apt)>MHT-Manchester, NH, USA Manchester>EWR-Newark, NJ, USA Newark International Airport>ABQ-Albuquerque, NM, USA Albuquerque International Airport>YFA-Fort Albany, Canada Fort Albany Airport>BUF-Buffalo, NY, USA Buffalo Niagara International Airport (formerly Greater Buffalo Intl Airport)>ISP-Islip, NY, USA Long IslandMacarthur Airport>LGA-New York, NY, USA Laguardia>ROC-Rochester, NY, USA Monroe County Airport>CLT-Charlotte, NC, USA Charlotte/Douglas Intl Airport>RDU-Raleigh/Durham, NC, USA Raleigh Durham International Arpt>CAK-Akron/Canton, OH, USA AkronCanton Regional Airport>CLE-Cleveland, OH, USA Hopkins International Airport>CMH-Columbus, OH, USA Port Columbus Intl Airport>DAY-Dayton, OH, USA James M Cox Dayton International>OKC-Oklahoma City, OK, USA Will Rogers World Airport>TUL-Tulsa, OK, USA Tulsa International>PDX-Portland, OR, USA Portland International Airport>PHL-Philadelphia, PA, USA Philadelphia International Airport>PIT-Pittsburgh, PA, USA Greater Pit Intnl Airport>CHS-Charleston, SC, USA Charleston International Airport>GDC-Greenville, SC, USA Donaldson Center>MEM-Memphis, TN, USA Memphis International Airport>BNA-Nashville, TN, USA Nashville Metropolitan Airport>AMA-Amarillo, TX, USA Amarillo International Airport>AUS-Austin, TX, USA Austin Bergstrom International Airport (ABIA)>CRP-Corpus Christi, TX, USA Corpus Christi International Airport>DFW-Dallas/Ft Worth, TX, USA Dallas Ft Worth International>ELP-El Paso, TX, USA El Paso International Airport>HRL-Harlingen, TX, USA>HOU-William P. Hobby Airport>LBB-Lubbock, TX, USA Lubbock International Airport>MAF-Midland/Odessa, TX, USA Midland Intl Airport>SAT-San Antonio, TX, USA San Antonio International>SLC-Salt Lake City, UT, USA Salt Lake City International Arpt>ORF-Norfolk, VA, USA Norfolk International Airport>RIC-Richmond, VA, USA Richmond International Airport>DCA-Washington, DC, USA Ronald Reagan National Airport>IAD-Washington Dulles International Airport>SEA-Seattle Tacoma International Airport>GEG-Spokane, WA, USA International/Geiger Field>MKE-Milwaukee, WI, USA General Mitchell Field'
								//city: 'AUA-Queen Beatrix International Airport>NAS-Nassau, Bahamas Nassau International Airport>SAL-San Salvador, El Salvador El Salvadore Intl Airport>PUJ-Punta Cana, Dominican Republic>STI-Cibao International Airport (Spanish Aeropuerto Internacional del Cibao)>SDQ-Santo Domingo, Dominican Republic Las Americas>PAP-Toussaint Louverture International Airport>KIN-Kingston, Jamaica>MBJ-Montego Bay, Jamaica Sangster>BQN-Aguadilla, PR, USA>SJU-Luis Muñoz Marín International Airport>SXM-Saint Maarten, Netherlands Antilles Juliana>STT-St Thomas Island, VI, USA Cyril E King Arpt>SJO-San Jose, Costa Rica Juan Santamaria International>GUA-Guatemala City, Guatemala La Aurora Intl Airport>SAP-San Pedro Sula, Honduras La Mesa>MGA-Managua, Nicaragua>PTY-Panama City, Panama Tocumen International Airport>SAL-San Salvador, El Salvador El Salvadore Intl Airport>SJD-Los Cabos, San Jose Del Cabo, Baja California Sur, Mexico Los Cabos Intl Airport>CZM-Cozumel, Quintana Roo, Mexico Aeropuerto Intl De Cozumel>CUN-Cancun, Mexico>TLC-Toluca, Mexico Toluca Airport>PHX-Phoenix, AZ, USA Sky Harbor International Airport>LAX-Los Angeles, CA, USA Los Angeles Intl Airport>OAK-Oakland, CA, USA Metropolitan Oakland Intl Apt>SAN-San Diego, CA, USA Lindbergh International Airport>DEN-Denver, CO, USA Denver International>FLL-Fort Lauderdale, FL, USA Ft Lauderdale/Hollywood Intl Apt >RSW-Fort Myers, FL, USA Regional Southwest Airport>MCO-Orlando, FL, USA Orlando International Airport>TPA-Tampa, FL, USA Tampa International>PBI-West Palm Beach, FL, USA Palm Beach International Airport>ATL-Atlanta, GA, USA Hartsfield International>ORD-Chicago, IL, USA Ohare International Airport>MSY-New Orleans, LA, USA Louis Armstrong New Orleans International Airport (Moisant International Airport)>BWI-Baltimore, MD, USA BaltimoreWashington International>BOS-Boston, MA, USA Logan International Airport>DTW-Detroit, MI, USA Detroit Wayne County Metropolitan Airport>MSP-Minneapolis, MN, USA Minneapolis/St Paul Intl Airport>LAS-Las Vegas, NV, USA Mccarran International Airport>ACY-Atlantic City /Atlantic Cty, NJ, USA Atlantic City International>LGA-New York, NY, USA Laguardia>BUF-Buffalo, NY, USA Buffalo Niagara International Airport (formerly Greater Buffalo Intl Airport)>PLB-Plattsburgh, NY, USA>PDX-Portland, OR, USA Portland International Airport>LBE-Latrobe, PA, USA Westmoreland County>PHL-Philadelphia, PA, USA Philadelphia International Airport>MYR-Myrtle Beach, SC, USA>DFW-Dallas/Ft Worth, TX, USA Dallas Ft Worth International>IAH-Houston, TX, USA Houston Intercontinental>CHS-Charleston, SC, USA Charleston International Airport>AXM-Armenia, Colombia El Eden Airport>BOG-Bogota, Colombia Eldorado>CTG-Cartagena, Colombia Rafael Nunez>MDE-Medellin, Colombia Jose Maria Cordova/Metropolitan Area>LIM-Lima, Peru Intl Jorge Chavez'
							//city: 'BHM-Birmingham Shuttlesworth International Airport>DHN-Dothan Regional Airport>HSV-Huntsville International Airport>MOB-Mobile Regional Airport>MGM-Montgomery Regional Airport>ANC-Ted Stevens Anchorage International Airport>MRI-Merrill Field>ANI-Aniak Airport>BRW-Wiley Post Will Rogers Memorial Airport>BET-Bethel Airport>CDV-Merle K. (Mudhole) Smith Airport>SCC-Deadhorse Airport (Prudhoe Bay Airport)>DLG-Dillingham Airport>ENM-Emmonak Airport>FAI-Fairbanks International Airport>GAL-Edward G. Pitka Sr. Airport>HOM-Homer Airport>HNH-Hoonah Airport>JNU-Juneau International Airport>ENA-Kenai Municipal Airport>KTN-Ketchikan International Airport>AKN-King Salmon Airport>ADQ-Kodiak Airport>OTZ-Ralph Wien Memorial Airport>MBA-Manokotak Airport>OME-Nome Airport>PSG-Petersburg James A. Johnson Airport>SIT-Sitka Rocky Gutierrez Airport>UNK-Unalakleet Airport>DUT-Unalaska Airport (Tom Madsen Airport)>VDZ-Valdez Airport (Pioneer Field)>WRG-Wrangell Airport>YAK-Yakutat Airport>IFP-Laughlin/Bullhead International Airport>FLG-Flagstaff Pulliam Airport>GCN-Grand Canyon National Park Airport>IWA-Phoenix Mesa Gateway Airport>PGA-Page Municipal Airport>GCW-Grand Canyon West Airport>PHX-Phoenix Sky Harbor International Airport>TUS-Tucson International Airport>NYL-Yuma International Airport / MCAS Yuma>XNA-Northwest Arkansas Regional Airport>FSM-Fort Smith Regional Airport>LIT-Bill and Hillary Clinton National Airport>TXK-Texarkana Regional Airport>ACV-Arcata Airport>BFL-Meadows Field>BUR-Bob Hope Airport>CLD-McClellan Palomar Airport>CIC-Chico Municipal Airport>CEC-Del Norte County Airport>FAT-Fresno Yosemite International Airport>IYK-Inyokern Airport>LGB-Long Beach Airport (Daugherty Field)>LAX-Los Angeles International Airport>MMH-Mammoth Yosemite Airport>MOD-Modesto City County Airport>MRY-Monterey Regional Airport Monterey Peninsula Airport>OAK-Oakland International Airport>ONT-Ontario International Airport>PSP-Palm Springs International Airport>RDD-Redding Municipal Airport	Redding, California>SMF-Sacramento International Airport>SAN-San Diego International Airport>SFO-San Francisco International Airport>SJC-Norman Y. Mineta San José International Airport>SBP-San Luis Obispo County Regional Airport>SNA-John Wayne Airport Orange County>SBA-Santa Barbara Municipal Airport (Santa Barbara Airport)>SMX-Santa Maria Public Airport (Capt G. Allan Hancock Field)>STS-Charles M. Schulz Sonoma County Airport>SCK-Stockton Metropolitan Airport>ASE-Aspen Pitkin County Airport (Sardy Field)>COS-City of Colorado Springs Municipal Airport>DEN-Denver International Airport>DRO-Durango La Plata County Airport>EGE-Eagle County Regional Airport>FNL-Fort Collins Loveland Municipal Airport>GJT-Grand Junction Regional Airport (Walker Field)>GUC-Gunnison Crested Butte Regional Airport>HDN-Yampa Valley Airport (Yampa Valley Regional)>MTJ-Montrose Regional Airport>PUB-Pueblo Memorial Airport>HVN-Tweed New Haven Regional Airport (was Tweed New Haven Airport)>BDL-Bradley International Airport>DAB-Daytona Beach International Airport>FLL-Fort Lauderdale Hollywood International Airport>RSW-Southwest Florida International Airport>GNV-Gainesville Regional Airport>JAX-Jacksonville International Airport>EYW-Key West International Airport>MLB-Melbourne International Airport>MIA-Miami International Airport>MCO-Orlando International Airport>SFB-Orlando Sanford International Airport>ECP-Northwest Florida Beaches International Airport>PNS-Pensacola International Airport (Pensacola Gulf Coast Regional Airport)>PGD-Punta Gorda Airport (was Charlotte County Airport)>SRQ-Sarasota Bradenton International Airport>PIE-St. Petersburg Clearwater International Airport>TLH-Tallahassee Regional Airport>TPA-Tampa International Airport>VPS-Northwest Florida Regional Airport / Eglin Air Force Base>PBI-Palm Beach International Airport>ABY-Southwest Georgia Regional Airport>ATL-Hartsfield Jackson Atlanta International Airport>AGS-Augusta Regional Airport (Bush Field)>BQK-Brunswick Golden Isles Airport>CSG-Columbus Airport (Columbus Metropolitan Airport)>SAV-Savannah/Hilton Head International Airport>VLD-Valdosta Regional Airport>ITO-Hilo International Airport>HNL-Honolulu International Airport / Hickam>OGG-Kahului Airport>KOA-Kona International Airport at Keahole>MKK-Molokai Airport (Moloka?i Airport)>LNY-Lanai Airport (Lanai Airport)>LIH-Lihue Airport (Lihue Airport)>BOI-Boise Airport (Boise Air Terminal) (Gowen Field)>SUN-Friedman Memorial Airport>IDA-Idaho Falls Regional Airport (Fanning Field)>LWS-Lewiston Nez Perce County Airport>PIH-Pocatello Regional Airport>TWF-Magic Valley Regional Airport (Joslin Field)>BMI-Central Illinois Regional Airport at Bloomington Normal>CMI-University of Illinois   Willard Airport>ORD-Chicago OHare International Airport>MDW-Chicago Midway International Airport>MLI-Quad City International Airport>PIA-General Downing Peoria International Airport>RFD-Chicago Rockford International Airport>SPI-Abraham Lincoln Capital Airport>EVV-Evansville Regional Airport>WA-Fort Wayne International Airport>IND-Indianapolis International Airport>SBN-South Bend Airport (was South Bend Regional)>CID-The Eastern Iowa Airport>DSM-Des Moines International Airport>DBQ-Dubuque Regional Airport>FOD-Fort Dodge Regional Airport>MCW-Mason City Municipal Airport>SUX-Sioux Gateway Airport (Col. Bud Day Field)>ALO-Waterloo Regional Airport>GCK-Garden City Regional Airport>MHK-Manhattan Regional Airport>ICT-Wichita Mid Continent Airport>CVG-Cincinnati/Northern Kentucky International Airport>LEX-Blue Grass Airport>SDF-Louisville International Airport (Standiford Field)>OWB-Owensboro Daviess County Regional Airport>PAH-Barkley Regional Airport>AEX-Alexandria International Airport>BTR-Baton Rouge Metropolitan Airport (Ryan Field)>LFT-Lafayette Regional Airport>LCH-Lake Charles Regional Airport>MLU-Monroe Regional Airport>MSY-Louis Armstrong New Orleans International Airport>SHV-Shreveport Regional Airport>BGR-Bangor International Airport>BHB-Hancock County Bar Harbor Airport>PWM-Portland International Jetport>PQI-Northern Maine Regional Airport at Presque Isle>RKD-Knox County Regional Airport>BWI-Baltimore/Washington International Thurgood Marshall Airport>SBY-Salisbury Ocean City Wicomico Regional Airport>HGR-Hagerstown Regional Airport (Richard A. Henson Field)>BOS-Gen. Edward Lawrence Logan International Airport>HYA-Barnstable Municipal Airport (Boardman/Polando Field)>ACK-Nantucket Memorial Airport>EWB-New Bedford Regional Airport>PVC-Provincetown Municipal Airport>MVY-Marthas Vineyard Airport>ORH-Worcester Regional Airport>CVX-Charlevoix Municipal Airport>DTW-Detroit Metropolitan Wayne County Airport>FNT-Bishop International Airport>GRR-Gerald R. Ford International Airport>CMX-Houghton County Memorial Airport>AZO-Kalamazoo/Battle Creek International Airport>LAN-Capital Region International Airport (was Lansing Capital City)>SAW-Sawyer International Airport>MKG-Muskegon County Airport>PLN-Pellston Regional Airport of Emmet County>PTK-Oakland County International Airport>MBS-MBS International Airport>CIU-Chippewa County International Airport>TVC-Cherry Capital Airport>BJI-Bemidji Regional Airport>BRD-Brainerd Lakes Regional Airport>DLH-Duluth International Airport>HIB-Range Regional Airport (was Chisholm Hibbing Airport)>INL-Falls International Airport>MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)>RST-Rochester International Airport>STC-St. Cloud Regional Airport>GTR-Golden Triangle Regional Airport>GPT-Gulfport Biloxi International Airport>PIB-Hattiesburg Laurel Regional Airport>JAN-Jackson Evers International Airport>MEI-Meridian Regional Airport (Key Field)>BBG-Branson Airport>COU-Columbia Regional Airport>MCI-Kansas City International Airport>SGF-Springfield Branson National Airport>STL-Lambert St. Louis International Airport>BIL-Billings Logan International Airport>BZN-Bozeman Yellowstone International Airport (was Gallatin Field Airport)>BTM-Bert Mooney Airport>GTF-Great Falls International Airport>HLN-Helena Regional Airport>GPI-Glacier Park International Airport>MSO-Missoula International Airport>GRI-Central Nebraska Regional Airport>LNK-Lincoln Airport (was Lincoln Municipal)>OMA-Eppley Airfield>BVU-Boulder City Municipal Airport>EKO-Regional Airport (J.C. Harris Field)>LAS-McCarran International Airport>VGT-North Las Vegas Airport>RNO-Reno/Tahoe International Airport>MHT-Manchester Boston Regional Airport>PSM-KPSM Portsmouth International Airport>ACY-Atlantic City International Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque International Sunport>FMN-Four Corners Regional Airport>ROW-Roswell International Air Center>SAF-Santa Fe Municipal Airport (scheduled passenger service resumed 2009)>ALB-Albany International Airport>BGM-Greater Binghamton Airport (Edwin A. Link Field)>BUF-Buffalo Niagara International Airport>ELM-Elmira/Corning Regional Airport>ISP-Long Island MacArthur Airport>ITH-Ithaca Tompkins Regional Airport>JFK-John F. Kennedy International Airport>LGA-LaGuardia Airport (and Marine Air Terminal)>SWF-Stewart International Airport>PBG-Plattsburgh International Airport>ROC-Greater Rochester International Airport>SYR-Syracuse Hancock International Airport>HPN-Westchester County Airport>CLT-Charlotte/Douglas International Airport>AVL-Asheville Regional Airport>FAY-Fayetteville Regional Airport>GSO-Piedmont Triad International Airport>PGV-Pitt Greenville Airport>OAJ-Albert J. Ellis Airport>EWN-Coastal Carolina Regional Airport (was Craven County Regional)>RDU-Raleigh Durham International Airport>ILM-Wilmington International Airport>BIS-Bismarck Municipal Airport>FAR-Hector International Airport>GFK-Grand Forks International Airport>MOT-Minot International Airport>ISN-Sloulin Field International Airport>CAK-Akron Canton Regional Airport>CLE-Cleveland Hopkins International Airport>CMH-Port Columbus International Airport>DAY-James M. Cox Dayton International Airport>TOL-Toledo Express Airport>YNG-Youngstown Warren Regional Airport / Youngstown>LAW-Lawton Fort Sill Regional Airport>OKC-Will Rogers World Airport>TUL-Tulsa International Airport>EUG-Eugene Airport (Mahlon Sweet Field)>LMT-Klamath Falls Airport (Kingsley Field)>MFR-Rogue Valley International Medford Airport>OTH-Southwest Oregon Regional Airport (was North Bend Municipal)>PDX-Portland International Airport>RDM-Redmond Municipal Airport (Roberts Field)>ABE-Lehigh Valley International Airport>ERI-Erie International Airport (Tom Ridge Field)>MDT-Harrisburg International Airport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>UNV-University Park Airport>AVP-Wilkes Barre/Scranton International Airport>IPT-Williamsport Regional Airport>PVD-Theodore Francis Green State Airport>WST-Westerly State Airport>CHS-Charleston International Airport / Charleston>CAE-Columbia Metropolitan Airport>FLO KFLO Florence Regional Airport>GSP-Greenville Spartanburg International Airport (Roger Milliken Field)>HXD-Hilton Head Airport>MYR-Myrtle Beach International Airport>ABR-Aberdeen Regional Airport>PIR-Pierre Regional Airport>RAP-Rapid City Regional Airport>FSD-Sioux Falls Regional Airport (Joe Foss Field)>TRI-Tri Cities Regional Airport (Tri Cities Regional TN/VA)>CHA-Chattanooga Metropolitan Airport (Lovell Field)>TYS-McGhee Tyson Airport>MEM-Memphis International Airport>BNA-Nashville International Airport (Berry Field)>ABI-Abilene Regional Airport>AMA-Rick Husband Amarillo International Airport>AUS-Austin Bergstrom International Airport>BPT-Jack Brooks Regional Airport (was Southeast Texas Regional)>BRO-Brownsville/South Padre Island International Airport>CLL-Easterwood Airport (Easterwood Field)>CRP-Corpus Christi International Airport>DAL-Dallas Love Field>DFW-Dallas/Fort Worth International Airport>DRT-Del Rio International Airport>ELP-El Paso International Airport>GRK-Killeen Fort Hood Regional Airport / Robert Gray Army Airfield>HRL-Valley International Airport>IAH-George Bush Intercontinental Airport>HOU-William P. Hobby Airport>LRD-Laredo International Airport>GGG-East Texas Regional Airport>LBB-Lubbock Preston Smith International Airport>MFE-McAllen Miller International Airport (McAllen Miller International)>MAF-Midland International Airport>SJT-San Angelo Regional Airport (Mathis Field)>SAT-San Antonio International Airport>TYR-Tyler Pounds Regional Airport>ACT-Waco Regional Airport>SPS-Wichita Falls Municipal Airport / Sheppard Air Force Base>PVU-Provo Municipal Airport>SLC-Salt Lake City International Airport>SGU-St. George Municipal Airport (opened 2011)>ENV-Wendover Airport>BTV-Burlington International Airport>CHO-Charlottesville Albemarle Airport>LYH-Lynchburg Regional Airport (Preston Glenn Field)>PHF-Newport News/Williamsburg International Airport>ORF-Norfolk International Airport>RIC-Richmond International Airport (Byrd Field)>ROA-Roanoke Regional Airport (Woodrum Field)>SHD-Shenandoah Valley Regional Airport>DCA-Ronald Reagan Washington National Airport>IAD-Washington Dulles International Airport>BLI-Bellingham International Airport>FHR-Friday Harbor Airport>PSC-Tri Cities Airport>CLM-William R. Fairchild International Airport>PUW-Pullman/Moscow Regional Airport>BFI-King County International Airport (Boeing Field)>SEA-Seattle Tacoma International Airport>GEG-Spokane International Airport (Geiger Field)>ALW-Walla Walla Regional Airport>EAT-Pangborn Memorial Airport>YKM-Yakima Air Terminal (McAllister Field)>CRW-Yeager Airport>CKB-North Central West Virginia Airport (was Harrison Marion Regional)>HTS-Tri State Airport (Milton J. Ferguson Field)>LWB-Greenbrier Valley Airport>MGW-Morgantown Municipal Airport (Walter L. Bill Hart Field)>ATW-Outagamie County Regional Airport>EAU-Chippewa Valley Regional Airport>GRB-Austin Straubel International Airport>LSE-La Crosse Regional Airport>MSN-Dane County Regional Airport (Truax Field)>MKE-General Mitchell International Airport>CWA-Central Wisconsin Airport>RHI-Rhinelander Oneida County Airport>CPR-Casper/Natrona County International Airport>CYS-Cheyenne Regional Airport (Jerry Olson Field)>COD-Yellowstone Regional Airport>GCC-Gillette Campbell County Airport>JAC-Jackson Hole Airport>LAR-Laramie Regional Airport>RIW-Riverton Regional Airport>RKS-Rock Springs Sweetwater County Airport>SHR-Sheridan County Airport>PPG-Pago International Airport>GUM-Antonio B. Won Pat International Airport>GSN-Saipan International Airport (Francisco C. Ada)>GRO-Rota International Airport>TNI-Tinian International Airport (West Tinian)>BQN-Rafael Hernández International Airport>PSE-Mercedita International Airport>SJU-Luis Muñoz Marín International Airport>SIG-Fernando Luis Ribas Dominicci Airport (Isla Grande Airport)>VQS-Antonio Rivera Rodríguez Airport>STT-Cyril E. King Airport>STX-Henry E. Rohlsen Airport>ABQ-Albuquerque International Sunport>ACA-Acapulco, Mexico>AMS-Amsterdam, Netherlands>ANC-Ted Stevens Anchorage International Airport>AXA-Wallblake Airport, Anguilla>FQ-Air Aruba>ASE-Aspen Pitkin County Airport (Sardy Field)>ATH-Athens, Greece>ATL-Hartsfield Jackson Atlanta International Airport>AKL-Auckland International Airport>AUS-Austin Bergstrom International Airport>YBA-Banff Airport>BKK-Suvarnabhumi Airport>BCN-Barcelona, Spain Barcelona>PEK-Beijing Capital International>BZE-Philip S. W. Goldson International Airport>SXF-Berlin Schönefeld International Airport>BDA-Bermuda International Airport>BOG-El Dorado International Airport>BOS-Boston Logan International Airport>BNE-Brisbane Airport>BUD-Budapest, Hungary Ferihegy>EZE-Buenos Aires, Buenos Aires, Argentina Ezeiza Ministro Pistarini International Airport>BUF-Buffalo, NY, USA Buffalo Niagara International Airport (formerly Greater Buffalo Intl Airport)>CNS-Cairns, Queensland, Australia   Cairns International Airport>YYC-Calgary, Alberta, Canada Calgary Intl Airport>CUN-Cancun, Mexico>CCS-Caracas, Venezuela Simon Bolivar International>CLT-Charlotte, NC, USA Charlotte/Douglas Intl Airport>PIE-Saint Petersburg/Clearwater, FL, USA St Petersburg/Clearwater Intl>CLE-Cleveland, OH, USA Hopkins International Airport>COS-Colorado Springs, CO, USA Colorado Springs Municipal>CSG-Columbus, GA, USA Columbus Metropolitan / Fort Benning>CMH-Columbus, OH, USA Port Columbus Intl Airport>CPH-Copenhagen, Denmark Copenhagen>CUR-Willemstad / Curacao Island, Netherlands Antilles Areopuerto Hato>DFW-Dallas/Ft Worth, TX, USA Dallas Ft Worth International>DAB-Daytona Beach, FL, USA Daytona Beach International Airport>DEL-Delhi, India Indira Gandhi International Airport>DEN-Denver, CO, USA Denver International>DSI-Destin, FL, USA>DUB-Dublin, Ireland Dublin>RDU-Raleigh Durham, NC, USA Raleigh Durham International Arpt>EDI-Edinburgh, Scotland, United Kingdom Turnhouse>ELP-El Paso TX, USA El Paso International Airport>FDF-Fort De France, Martinique Fort De France>DFW-Dallas Ft Worth, TX, USA Dallas Ft Worth International>FRA-Frankfurt, Germany Frankfurt International>FPO-Freeport, Bahamas Freeport Intl Airport>FAT-Fresno, CA, USA Fresno Air Terminal>GGW-Glasgow, MT, USA>GND-Saint Georges/Grenada, Grenada Pt Saline>GDL-Guadalajara, Jalisco, Mexico Miguel Hidalgo Intl>GUA-Guatemala City, Guatemala La Aurora Intl Airport>GUC-Gunnison, CO, USA Gunnison County Airport>ITO-Hilo, HI, USA Hilo Hawaii HawaiiInternational Usa>HHH-Hilton Head, SC, USA Municipal>HKG-Hong Kong, Hong Kong>HNL-Honolulu, HI, USA Honolulu International>IAH-Houston, TX, USA>IND-Indianapolis, IN, USA Indianapolis International Airport>IST-Istanbul, Turkey Ataturk>ZIH-Ixtapa/Zihuatanejo, Guerrero, Mexico International>JAC-Jackson Hole, WY, USA Jackson Hole Airport>JAX-Jacksonville, FL, USA Jacksonville International Airport>OGG-Kahului, HI, USA Kahului Airport>MCI-Kansas City, MO, USA Kansas City International Airport>LIH-Lihue, Kauai Island, HI, USA Lihue Municipal Airport>TYS-Knoxville, TN, USA Mcghee Tyson>KOA-Kona, HI, USA Keahole>LRM-La Romana, Dominican Republic   La Romana Casa De Campo Airport>LAS-Las Vegas, NV, USA Mccarran International Airport>LIR-Liberia, Costa Rica Liberia>LIM-Lima, Peru Intl Jorge Chavez>LIS-Lisbon, Portugal Lisboa>STN-London, England, United Kingdom Stansted>LAX-Los Angeles, CA, USA Los Angeles Intl Airport>SDF-Louisville International Airport (Standiford Field)>MAD-Madrid, Spain Barajas>MAN-Manchester, England, United Kingdom International>MRK-Marco Island, FL, USA>MZT-Mazatlan, Sinaloa, Mexico Buelna>EOH-Medellin, Colombia   Enrique Olaya Herrera>MEM-Memphis, TN, USA Memphis International Airport>MEX-Mexico City, Distrito Federal, Mexico Juarez Intl Airport>MIA-Miami, FL, USA Miami International Airport>LIN-Milan, Italy Linate>MSP-Minneapolis, MN, USA Minneapolis/St Paul Intl Airport>MBJ-Montego Bay, Jamaica Sangster>MRY-Monterey / Carmel, CA, USA Monterey Peninsula Airport>MVD-Montevideo, Uruguay Carrasco>YMX-Montreal Mirabel, Quebec, Canada>MUC-Munich, Germany Franz Josef Strauss>APC-Napa County Airport>NAP-Naples, Italy Capodichino>BNA-Nashville, TN, USA Nashville Metropolitan Airport>NAS-Nassau, Bahamas Nassau International Airport>MSY-New Orleans, LA, USA   Louis Armstrong New Orleans International Airport (Moisant International Airport)>JFK-New York, NY, USA John F Kennedy Intl Airport>NCE-Nice, France Cote Dazur>ORF-Norfolk, VA, USA Norfolk International Airport>OKC-Oklahoma City, OK, USA Will Rogers World Airport>MCO-Orlando, FL, USA Orlando International Airport>YOW-Ottawa, Ontario, Canada Ottawa International>PTY-Panama City, Panama Tocumen International Airport>PAR-Paris, France>PNS-Pensacola, FL, USA>PHL-Philadelphia, PA, USA Philadelphia International Airport>PHX-Phoenix, AZ, USA Sky Harbor International Airport>PIT-Pittsburgh, PA, USA Greater Pit Intnl Airport>PDX-Portland, OR, USA Portland International Airport>PRG-Prague, Czech Republic Ruzyne>PVR-Puerto Vallarta, Jalisco, Mexico Gustavo Diaz Ordaz>PUJ-Punta Cana, Dominican Republic>YQC-Quaqtaq, Quebec, Canada Quaqtaq Airport>RDU-Raleigh/Durham, NC, USA Raleigh Durham International Arpt>RAP-Rapid City, SD, USA Rapid City Regional Airport>RNO-Tahoe/Reno, NV, USA Reno Tahoe International Airport>RIC-Richmond, VA, USA Richmond International Airport>GIG-Rio De Janeiro, Rio De Janeiro, Brazil International Airport>CIA-Rome, Italy Ciampino>SMF-Sacramento, CA, USA Sacramento Metropolitan>SLC-Salt Lake City, UT, USA Salt Lake City International Arpt>SAT-San Antonio, TX, USA San Antonio International>SAN-San Diego, CA, USA Lindbergh International Airport>SFO-San Francisco, CA, USA San Francisco Intl Airport>SJD-San Jose Del Cabo, Baja California Sur, Mexico Los Cabos Intl Airport>SIG-San Juan, Puerto Rico Isla Grande Airport>SBA-Santa Barbara, CA, USA Santa Barbara Airport>SAF-Santa Fe, NM, USA Santa Fe Municipal Airport>SCL-Santiago, Chile Aeropuerto Comodoro Arturo Merino Benitez>SDQ-Santo Domingo, Dominican Republic Las Americas>SJK-Sao Jose Dos Campos, Sao Paulo, Brazil Sao Jose Dos Campos Airport>SRQ-Sarasota/Bradenton, FL, USA SarasotaBradentSTX Saint Croix Island, VI, USA>STX-Saint Croix Island, VI, USA>SAV-Savannah, GA, USA Travis Field>SEA-Seattle, WA, USA Seattle Tacoma Intl Airport>SVQ-Sevilla, Spain>SHA-Shanghai, China Shanghai Intl /Hongqiao/>SIN-Singapore, Singapore Changi International Airport>SGF-Springfield, MO, USA Springfield Regional Airport>SKB-St Kitts, Saint Kitts And Nevis Golden Rock>STL-St Louis, MO, USA LambertSt Louis Internatl>STT-St Thomas Island, VI, USA Cyril E King Arpt>HDN-Steamboat Springs Hayden, Colorado, USA Steamboat Springs Hayden/Yampa Valley Regional Airport>SYD-Sydney, New South Wales, Australia Sydney /KingsfordSmith/ Airport>TLH-Tallahassee, FL, USA>TPA-Tampa, FL, USA Tampa International>TLV-Tel Aviv Yafo, Israel BenGurion International>TEX-Telluride, CO, USA Telluride Municipal Airport>NRT-Tokyo, Japan>YYZ-Toronto, Ontario, Canada Lester B Pearson International Airport>EIS-Tortola/Beef Island, Virgin Islands (British) Beef Island>POS-Port Of Spain, Trinidad, Trinidad And Tobago Piarco International Airport>TUS-Tucson, AZ, USA Tucson International Airport>TUL-Tulsa, OK, USA Tulsa International>PLS-Caicos, Turks And Caicos Islands Providenciales>QBF-Vail/Eagle, CO, USA>YVR-Vancouver, British Columbia, Canada Vancouver International>VCE-Venice, Italy Marco Polo>YYJ-Victoria, British Columbia, Canada Victoria International Airport>VIE-Vienna, Austria Schwechat>IAD-Washington, DC, USA Dulles>PBI-West Palm Beach, FL, USA Palm Beach International Airport>YWS-Whistler, Canada Whistler Airport>ZRH-Zurich, Switzerland Zurich'


								//city: 'HDN-Yampa Valley Airport>MTJ-Montrose Regional Airport>EGE-Eagle County Airport>BDL-Bradley International Airport>DAB-Daytona Beach International Airport>FLL-Fort Lauderdale-Hollywood International Airport>RSW-Southwest Florida International Airport>VPS-Northwest Florida Regional Airport>JAX-Jacksonville International Airport>EYW-Key West International Airport>MLB-Melbourne International Airport>MIA-Miami International Airport>MCO-Orlando International Airport>ECP-Northwest Florida Beaches International Airport>PNS-Pensacola International Airport>SRQ-Sarasota Bradenton International Airport>TLH-Tallahassee Regional Airport>TPA-Tampa International Airport>PBI-Palm Beach International Airport>ATL-Hartsfield-Jackson Atlanta International Airport>AGS-Augusta Regional Airport>SAV-Savannah International Airport>HNL-Honolulu International Airport>OGG-Kahului Airport>KOA-Kona International Airport>LIH-Lihue Airport>BOI-Boise Airport>MDW-Chicago Midway International Airport>ORD-O Hare International Airport>IND-Indianapolis International Airport>DSM-Des Moines International Airport>ICT-Wichita Mid-Continent Airport>LEX-Blue Grass Airport>SDF-Louisville International Airport>MSY-Louis Armstrong New Orleans International Airport>PWM-Portland International Jetport>BWI-Baltimore Washington International Airport>BOS-Logan International Airport>DTW-Detroit Metropolitan Wayne County Airport>FNT-Bishop International Airport>GRR-Gerald R. Ford International Airport>TVC-Cherry Capital Airport>MSP-Minneapolis-Saint Paul International Airport>GPT-Gulfport-Biloxi International Airport>JANJackson International Airport>MEI-Meridian Regional Airport>MCI-Kansas City International Airport>STL-Lambert Saint Louis International Airport>BIL-Billings Logan International Airport>BZN-Gallatin Field Airport>FCA-Glacier Park International Airport>OMA-Eppley Airfield>LAS-McCarran International Airport>RNO-Reno Tahoe International Airport>MHT-Manchester Boston Regional Airport>EWR-Newark Liberty International Airport>ABQ-Albuquerque International Sunport>ELP-El Paso International Airport>ALB-Albany International Airport>BUF-Buffalo Niagara International Airport>JFK-John F. Kennedy International Airport>LGA-La Guardia Airport>ROC-Greater Rochester International Airport>SYR-Syracuse Hancock International Airport>HPN-Westchester County Airport>AVL-Asheville Regional Airport>CLT-Charlotte/Douglas International Airport>FAY-Fayetteville Regional Airport>GSO-Piedmont Triad International Airport>RDU-Raleigh-Durham International Airport>BIS-Bismarck Municipal Airport>FAR-Hector International Airport>MOT-Minot International Airport>CAK-Akron Canton Regional Airport>CVG-Cincinnati Northern Kentucky International Airport>CLE-Cleveland Hopkins International Airport>CMH-Port Columbus International Airport>DAY-Dayton International Airport>OKC-Will Rogers World Airport>TUL-Tulsa International Airport>PDX-Portland International Airport>ABE-Lehigh Valley International Airport>MDT-Harr
//isburg International Airport>PHL-Philadelphia International Airport>PIT-Pittsburgh International Airport>PVD-T. F. Green Airport>CHS-Charleston International Airport>CAE-Columbia Metropolitan Airport>GSP-Greenville-Spartanburg International Airport>MYR-Myrtle Beach International Airport>RAP-Rapid City Regional Airport>FSD-Sioux Falls Regional Airport>CHA-Chattanooga Metropolitan Airport>TYS-McGhee Tyson Airport>MEM-Memphis International Airport>BNA-Nashville International Airport>AUS-Austin-Bergstrom International Airport>CRP-Corpus Christi International Airport>DAL-Dallas Love Field>DFW-Dallas/Fort Worth International Airport>ELP-El Paso International Airport>IAH-George Bush Intercontinental Airport>HOU-William P. Hobby Airport>SAT-San Antonio International Airport>SLC-Salt Lake City International Airport>PHF-Newport News/Williamsburg International Airport>ORF-Norfolk International Airport>RIC-Richmond International Airport>ROA-Roanoke Regional Airport>DCA-Ronald Reagan Washington National Airport>IAD-Washington Dulles International Airport>SEA-Seattle Tacoma International Airport>GEG-Spokane International Airport>CRW-Yeager Airport>GRB-Austin Straubel International Airport>LSE-La Crosse Regional Airport>MSN-Dane County Regional Airport>MKE-General Mitchell International Airport>CWA-Central Wisconsin Airport>JAC-Jackson Hole Airport>HSV-Huntsville International Airport>MOB-Mobile Regional Airport>FAI-Fairbanks International Airport>ANC-Ted Stevens Anchorage International Airport>KTN-Ketchikan International Airport>PHX-Phoenix Sky Harbor International Airport>MLW-MONROVIA LIBERIA>NYC-NEW YORK>TUS-Tucson International Airport>BUR-Bob Hope Airport>DTT-DETROIT MI>BOS-BOSTON MA>CHI-CHICAGO IL>LIT-Little Rock National Airport>LGB-Long Beach Airport>YYC-CALGARY CANADA>LAX-Los Angeles International Airport>YMQ-MONTREAL CANADA>BOM-MUMBAI INDIA>OAK-Oakland International Airport>SFO-SAN FRANCISCO CA>SEA-SEATTLE TACOMA WA>YVR-VANCOUVER CANADA>WAS-WASHINGTON DC>ONT-Ontario International Airport>SAN-San Diego International Airport>ACC-ACCRA GHANA>ABY-ALBANY GA>PSP-Palm Springs International Airport>SJC-San Jose International Airport>AEX-ALEXANDRIA LA>AMS-AMSTERDAM NETHERLANDS>SMF-Sacramento International Airport>ANU-ANTIGUA>ATW-APPLETON FOX CITIES WI>AUA-ARUBA>SNA-John Wayne Airport>COS-Colorado Springs Airport>BTR-BATON ROUGE LA>BJS-BEIJING CHINA>BZE-BELIZE CITY BELIZE>DEN-Denver International Airport>BDA-BERMUDA>BHM-BIRMINGHAM AL>BMI-BLOOMINGTON IL>BOG-BOGATA COLUMBIA>BON-BONAIRE NETHERLANDS ANTILLES>ORL-ORLANDO FL>PAR-PARIS FR'
								//city: 'IAH-George Bush Intercontinental>EWR-Liberty Intl>ORD>O Hare Intl>DEN-Denver Intl>IAD-Washington Dulles Intl>SFO-San Francisco Intl>CLE-Hopkins Intl>LAX-Los Angeles Intl>FRA-DE=Frankfurt Intl>GUM-GU=A B Won Pat Intl>MCO-Orlando Intl>FLL-Fort Lauderdale Hollywood Intl>NRT-JP=Narita Intl>BRU-BE=Brussels Airport>BOS-Logan Intl>SEA-Seattle Tacoma Intl>HNL-Honolulu Intl>MIA-Miami Intl>YUL-CA=Pierre Elliott Trudeau Intl>PDX-Portland Intl'
								//city: 'CAK-Akron Canton OH>ALB-Albany NY>ABQ-Albuquerque NM>AMA-Amarillo TX>AUA-Aruba AW>ATL-Atlanta GA>AUS-Austin TX>BWI-Baltimore/Washington MD>BDA-Bermuda BM>BHM-Birmingham AL>BOI-Boise ID>BOS-Boston Logan MA>BKG-Branson MO>BUF-Buffalo/Niagara NY>BUR-Burbank CA>SJD-Cabo Los Cabos = Baja California Sur>CUN-Cancun  Quintana Roo>CHS-Charleston SC>CLT-Charlotte NC>MDW-Chicago Midway IL>CLE-Cleveland OH>CMH-Columbus OH>CRP-Corpus Christi TX>DAL-Dallas Love Field TX>DAY-Dayton OH>DEN-Denver CO>DSM-Des Moines IA>DTW-Detroit MI>ELP-El Paso TX>FNT-Flint MI>FLL-Ft. Lauderdale FL>RSW-Ft Myers FL>GRR-Grand Rapids MI>GSP-Greenville=Spartanburg SC>HRL-Harlingen TX>BDL-Hartford CT>HOU-Houston Hobby TX>IND-Indianapolis IN>JAN-Jackson MS>JAX-Jacksonville FL>MCI-Kansas City MO>EYW-Key West FL>LAS-Las Vegas NV>LIT-Little Rock AR>ISP-Long Island NY>LAX-Los Angeles CA>SDF-Louisville KY>LBB-Lubbock TX>MHT-Manchester NH>MEM-Memphis TN>MEX-Mexico City D F MX>MAF-Midland Odessa TX>MKE-Milwaukee WI>MSP-Minneapolis St Paul MN>MBJ-Montego Bay JM>BNA-Nashville TN>NAS-Nassau Paradise Island BS>EWR-Newark NJ>MSY-New Orleans LA>LGA-New York LaGuardia NY>ORF-Norfolk VA>OAK-Oakland CA>OKC-Oklahoma City OK>OMA-Omaha NE>ONT-Ontario LA CA>SNA-Orange County CA>MCO-Orlando FL>ECP-Panama City Beach FL>PNS-Pensacola FL>PHL-Philadelphia PA>PHX-Phoenix AZ>PIT-Pittsburgh PA>PWM-Portland ME>PDX-Portland OR>PVD-Providence RI>PUJ-Punta Cana DO>RDU-Raleigh Durham NC>RNO-Reno Tahoe NV>RIC-Richmond VA>ROC-Rochester NY>SMF-Sacramento CA>SLC-Salt Lake City UT>SAT-San Antonio TX>SAN-San Diego CA>SFO-San Francisco CA>SJC-San Jose CA>SJU-San Juan PR>SEA-Seattle Tacoma WA>GEG-Spokane WA>STL-St. Louis MO>TPA-Tampa Bay FL>TUS-Tucson AZ>TUL-Tulsa OK>IAD-Washington Dulles DC>DCA-Washington Reagan DC>PBI-West Palm Beach FL>ICT-Wichita KS'

								//city: 'ABE-Lehigh Valley International Airport>ABQ-Albuquerque International Sunport	Albuquerque, New Mexico>ABR-Aberdeen Regional Airport	Aberdeen, South Dakota>ABY-Southwest Georgia Regional Airport	Albany, Georgia>ACV-Arcata Eureka Airport	Arcata, California>AEX-Alexandria Airport	Alexandria, Louisiana>AGS-Augusta Regional Airport	Augusta, Georgia>ALB-Albany International Airport	Albany, New York>AMA-Rick Husband Amarillo International Airport	Amarillo, Texas>APN-Alpena County Regional Airport	Alpena, Michigan>ASE-Aspen Pitkin County Airport	Aspen, Colorado>ATL-Hartsfield Jackson Atlanta International Airport	Jacksonville, Florida>ATW-Outagamie County Regional Airport	Appleton, Wisconsin>AUS-Austin Bergstrom International Airport	Austin, Texas>AVL-Asheville Regional Airport	Asheville, North Carolina>AVP-Wilkes Barre/Scranton International Airport	Scranton, Pennsylvania>BDL-Bradley International Airport	Windsor Locks, Connecticut>BFL-Meadows Field Airport	Bakersfield, California>BGR-Bangor International Airport	Bangor, Maine>BHM-Birmingham–Shuttlesworth International Airport	Birmingham, Alabama>BIL-Billings Logan International Airport	Billings, Montana>BIS-Bismarck Municipal Airport	Bismarck, North Dakota>BJI-Bemidji Regional Airport	Bemidji, Minnesota>BMI-Central Illinois Regional Airport	Bloomington, Illinois>BNA-Nashville International Airport	Nashville, Tennessee>BOI-Boise Airport	Boise, Idaho>BOS-Logan International Airport	Boston, Massachusetts>BPT-Jack Brooks Regional Airport	Beaumont, Texas>BQK-Brunswick Golden Isles Airport	Brunswick, Georgia>BRD-Brainerd Lakes Regional Airport	Brainerd, Minnesota>BRO-Brownsville/South Padre Island International Airport	Brownsville, Texas>BTM-Bert Mooney Airport	Butte, Montana>BTR-Baton Rouge Metropolitan Airport	Baton Rouge, Louisiana>BUF-Buffalo Niagara International Airport	Buffalo, New York>BUR-Bob Hope Airport	Burbank, California>BVT	Burlington International Airport	Burlington, Vermont>BWI	Baltimore Washington International Airport	Baltimore, Maryland>BZN	Bozeman Yellowstone International Airport	Bozeman, Montana>CAE-Columbia Metropolitan Airport	Columbia, South Carolina>CAK-Akron Canton Airport	Canton, Ohio>CEC-Del Norte County Airport	Crescent City, California>CDC-Cedar City Regional Airport	Cedar City, Utah>CHA-Chattanooga Metropolitan Airport	Chattanooga, Tennessee>CHS-Charleston International Airport	Charleston, South Carolina>CIC-Chico Municipal Airport	Chico, California>CID-The Eastern Iowa Airport	Cedar Rapids, Iowa>CLD-McClellan Palomar Airport	Carlsbad, California>CLE-Cleveland Hopkins International Airport	Cleveland, Ohio>CLL-Easterwood Airport	College Station, Texas>CLT-Charlotte/Douglas International Airport	Charlotte, North Carolina>CMH-Port Columbus International Airport	Columbus, Ohio>CMX-Houghton County Memorial Airport	Hancock, Michigan>COD-Yellowstone Regional Airport	Cody, Wyoming>COS-Colorado Springs Airport	Colorado Springs, Colorado>CPR-Casper Natrona County International Airport	Casper, Wyoming>CRP-Corpus Christi International Airport	Corpus Christi, Texas>CRW-Yeager Airport	Charleston, West Virginia>CSG-Columbus Airport	Columbus, Georgia>CVG-Cincinnati/Northern Kentucky International Airport	Cincinnati, Ohio>CWA-Central Wisconsin Airport	Wausau, Wisconsin>DAL-Dallas Love Field	Dallas, Texas>DAY-Dayton International Airport	Dayton, Ohio>DCA-Ronald Reagan Washington National Airport	Washington, D.C.>DEN-Denver International Airport	Denver, Colorado>DFW-Dallas/Fort Worth International Airport	Dallas/Fort Worth, Texas>DHN-Dothan Regional Airport	Dothan, Alabama>DLH-Duluth International Airport	Duluth, Minnesota>DRO-Durango La Plata County Airport	Durango, Colorado>DRT-Del Rio International Airport	Del Rio, Texas>DSM-Des Moines International Airport	Des Moines, Iowa>DTW-Detroit Metropolitan Wayne County Airport	Detroit, Michigan>EAU-Chippewa Valley Regional Airport	Eau Claire, Wisconsin>EKO-Elko Regional Airport	Elko, Nevada>ELM-Elmira Corning Regional Airport	Elmira, New York>ELP-El Paso International Airport	El Paso, Texas>EUG-Eugene Airport	Eugene, Oregon>EVV-Evansville Regional Airport	Evansville, Indiana>EWN-Coastal Carolina Regional Airport	New Bern, North Carolina>EWR-Newark Liberty International Airport	Newark, New Jersey>FAR-Hector International Airport	Fargo, North Dakota>FAT-Fresno Yosemite International Airport	Fresno, California>FAY-Fayetteville Regional Airport	Fayetteville, North Carolina>FCA-Glacier Park International Airport	Kalispell, Montana>FLG-Flagstaff Pulliam Airport	Flagstaff, Arizona>FLL-Fort Lauderdale Hollywood International Airport	Fort Lauderdale, Florida>FNT-Bishop International Airport	Flint, Michigan>FSD-Sioux Falls Regional Airport	Sioux Falls, South Dakota>FSM-Fort Smith Regional Airport	Fort Smith, Arkansas>FWA-Fort Wayne International Airport	Fort Wayne, Indiana>GCC-Gillette Campbell County Airport	Gillette, Wyoming>GEG-Spokane International Airport	Spokane, Washington>GFK-Grand Forks International Airport	Grand Forks, North Dakota>GJT-Grand Junction Regional Airport	Grand Junction, Colorado>GNV-Gainesville Regional Airport	Gainesville, Florida>GPT-Gulfport Biloxi International Airport	Gulfport, Mississippi>GRB-Austin Straubel International Airport	Green Bay, Wisconsin>GRK-Killeen Fort Hood Regional Airport	Killeen, Texas>GRR-Gerald R. Ford International Airport	Grand Rapids, Michigan>GSO-Piedmont Triad International Airport	Greensboro, North Carolina>GSP-Greenville Spartanburg International Airport	Greenville, South Carolina>GTF-Great Falls International Airport	Great Falls, Montana>GUC-Gunnison Crested Butte Regional Airport	Gunnison, Colorado>HDN-Yampa Valley Regional Airport	Hayden, Colorado>HIB-Range Regional Airport	Hibbing, Minnesota>HLN-Helena Regional Airport	Helena, Montana>HOB-Lea County Regional Airport	Hobbs, New Mexico>HOU-William P. Hobby Airport	Houston, Texas>HPN-Westchester County Airport	White Plains, New York>HRL-Valley International Airport	Harlingen, Texas>HSV-Huntsville International Airport	Huntsville, Alabama>IAD-Washington Dulles International Airport	Washington, D.C.>IAH-George Bush Intercontinental Airport	Houston, Texas>ICT-Wichita Mid Continent Airport	Wichita, Kansas>IDA-Idaho Falls Regional Airport	Idaho Falls, Idaho>ILM-Wilmington International Airport	Wilmington, North Carolina>IMT-Ford Airport	Iron Mountain, Michigan>IND-Indianapolis International Airport	Indianapolis, Indiana>INL-Falls International Airport	International Falls, Minnesota>IPL-Imperial County Airport	Imperial, California>ISN-Sloulin Field International Airport	Williston, North Dakota>IYK-Inyokern Airport	Inyokern, California>JAC-Jackson Hole Airport	Jackson, Wyoming>JAN-Jackson Evers International Airport	Jackson, Mississippi>JAX-Jacksonville International Airport	Jacksonville, Florida>JFK-John F. Kennedy International Airport	New York City, New York>KEY-Key West International Airport	Key West, Florida>LAF-Lafayette Regional Airport	Lafayette, Louisiana>LAN-Capital Region International Airport	Lansing, Michigan>LAR-Laramie Regional Airport	Laramie, Wyoming>LAS-McCarran International Airport	Las Vegas, Nevada>LAX-Los Angeles International Airport	Los Angeles, California>LBB-Lubbock International Airport	Lubbock, Texas>LCH-Lake Charles Regional Airport	Lake Charles, Louisiana>LEX-Blue Grass Airport	Lexington, Kentucky>LGA-LaGuardia Airport	New York City, New York>LGB-Long Beach Airport	Long Beach, California>LIT-Clinton National Airport	Little Rock, Arkansas>LMT-Klamath Falls Airport	Klamath Falls, Oregon>LNK-Lincoln Airport	Lincoln, Nebraska>LRD-Laredo International Airport	Laredo, Texas>LSE-La Crosse Regional Airport	La Crosse, Wisconsin>LWS-Lewiston Nez Perce County Airport	Lewiston, Idaho>MAF-Midland International Airport	Midland, Texas>MBS-MBS International Airport	Saginaw, Michigan>MCI-Kansas City International Airport	Kansas City, Missouri>MCO-Orlando International Airport	Orlando, Florida>MDT-Harrisburg International Airport	Harrisburg, Pennsylvania>MEM-Memphis International Airport	Memphis, Tennessee>MFE-McAllen Miller International Airport	McAllen, Texas>MFR-Rogue Valley International Medford Airport	Medford, Oregon>MGM-Montgomery Regional Airport	Montgomery, Alabama>MHT-Manchester Boston Regional Airport	Manchester, New Hampshire>MIA-Miami International Airport	Miami, Florida>MKE-General Mitchell International Airport	Milwaukee, Wisconsin>MKG-Muskegon County Airport	Muskegon, Michigan>MLI-Quad City International Airport	Moline, Illinois>MLU-Monroe Regional Airport	Monroe, Louisiana>MMH-Mammoth Yosemite Airport	Mammoth Lakes, California>MOB-Mobile Regional Airport	Mobile, Alabama>MOD-Modesto City County Airport	Modesto, California>MOT-Minot International Airport	Minot, North Dakota>MRY-Monterey Regional Airport	Monterey, California>MSN-Dane County Regional Airport	Madison, Wisconsin>MSO-Missoula International Airport	Missoula, Montana>MSP-Minneapolis Saint Paul International Airport	Minneapolis, Minnesota>MSY-Louis Armstrong New Orleans International Airport	New Orleans, Louisiana>MTJ-Montrose Regional Airport	Montrose, Colorado>MYR-Myrtle Beach International Airport	Myrtle Beach, South Carolina>OAJ-Albert J. Ellis Airport	Jacksonville, North Carolina>OAK-Oakland International Airport	Oakland, California>OKC-Will Rogers World Airport	Oklahoma City, Oklahoma>OMA-Eppley Airfield	Omaha, Nebraska>ONT-Ontario International Airport	Ontario, California>ORD-OHare International Airport	Chicago, Illinois>ORF-Norfolk International Airport	Norfolk, Virginia>OTH-Southwest Oregon Regional Airport	North Bend, Oregon>PAH-Barkley Regional Airport	Paducah, Kentucky>PBI-Palm Beach International Airport	Palm Beach, Florida>PDX-Portland International Airport	Portland, Oregon>PFN-Panama City Bay County International Airport	Panama City, Florida>PHF-Newport News/Williamsburg International Airport	Newport News, Virginia>PHL-Philadelphia International Airport	Philadelphia, Pennsylvania>PHX-Phoenix Sky Harbor International Airport	Phoenix, Arizona>PIA-General Wayne A. Downing Peoria International Airport	Peoria, Illinois>PIH-Pocatello Regional Airport	Pocatello, Idaho>PIT-Pittsburgh International Airport	Pittsburgh, Pennsylvania>PNS-Pensacola International Airport	Pensacola, Florida>PSC-Tri Cities Airport	Pasco, Washington>PSP-Palm Springs International Airport	Palm Springs, California>PVD-T. F. Green Airport	Providence, Rhode Island>PWM-Portland International Jetport	Portland, Maine>RAP-Rapid City Regional Airport	Rapid City, South Dakota>RDD-Redding Municipal Airport	Redding, California>RDM-Redmond Municipal Airport	Redmond, Oregon>RDU-Raleigh–Durham International Airport	Raleigh, North Carolina>RHI-Rhinelander Oneida County Airport	Rhinelander, Wisconsin>RIC-Richmond International Airport	Richmond, Virginia>RKS-Rock Springs Sweetwater County Airport	Rock Springs, Wyoming>RNO-Reno Tahoe International Airport	Reno, Nevada>ROA-Roanoke Regional Airport	Roanoke, Virginia>ROC-Greater Rochester International Airport	Rochester, New York>RST-Rochester International Airport	Rochester, Minnesota>RSW-Southwest Florida International Airport	Fort Meyers, Florida>SAF-Santa Fe Municipal Airport	Santa Fe, New Mexico>SAN-San Diego International Airport	San Diego, California>SAT-San Antonio International Airport	San Antonio, Texas>SAV-Savannah/Hilton Head International Airport	Savannah, Georgia>SBA-Santa Barbara Municipal Airport	Santa Barbara, California>SBN-South Bend Regional Airport	South Bend, Indiana>SBP-San Luis Obispo County Regional Airport	San Luis Obispo, California>SDF-Louisville International Airport	Louisville, Kentucky>SEA-Seattle Tacoma International Airport	Seattle, Washington>SFO-San Francisco International Airport	San Francisco, California>SGF-Springfield Branson National Airport	Springfield, Missouri>SGU-St. George Municipal Airport	St. George, Utah>SHV-Shreveport Regional Airport	Shreveport, Louisiana>SJC-San Jose International Airport	San Jose, California>SJT-San Angelo Regional Airport	San Angelo, Texas>SLC-Salt Lake City International Airport	Salt Lake City, Utah>SMF-Sacramento International Airport	Sacramento, California>SMX-Santa Maria Public Airport	Santa Maria, California>SNA-John Wayne Airport	Santa Ana, California>SPI-Abraham Lincoln Capital Airport	Springfield, Illinois>STF-George M. Bryan Airport	Starkville, Mississippi>STL-Lambert St. Louis International Airport	St. Louis, Missouri>SUN-Friedman Memorial Airport	Sun Valley, Idaho>SYR-Syracuse Hancock International Airport	Syracuse, New York>TLH-Tallahassee Regional Airport	Tallahassee, Florida>TPA-Tampa International Airport	Tampa, Florida>TRI-Tri Cities Regional Airport	Bristol, Tennessee>TUL-Tulsa International Airport	Tulsa, Oklahoma>TUS-Tucson International Airport	Tucson, Arizona>TVC-Cherry Capital Airport	Traverse City, Michigan>TWF-Magic Valley Regional Airport	Twin Falls, Idaho>TYR-Tyler Pounds Regional Airport	Tyler, Texas>TYS-McGhee Tyson Airport	Knoxville, Tennessee>VLD-Valdosta Regional Airport	Valdosta, Georgia>VPS-Northwest Florida Regional Airport	Valparaiso, Florida>WYS-Yellowstone Airport	West Yellowstone, Montana>XNA-Northwest Arkansas Regional Airport	Fayetteville, Arkansas>YUM-Yuma International Airport	Yuma, Arizona>CYEG-Edmonton International Airport	Edmonton, Alberta, Canada>CYHZ-Halifax Stanfield International Airport	Halifax, Nova Scotia, Canada>CYLW-Kelowna International Airport	Kelowna, British Columbia, Canada>CYOW-Ottawa Macdonald Cartier International Airport	Ottawa, Ontario, Canada>CYQB-Québec City Jean Lesage International Airport	Québec City, Québec, Canada>CYQM-Greater Moncton International Airport	Moncton, New Brunswick, Canada>CYQR-Regina International Airport	Regina, Saskatchewan, Canada>CYQT-Thunder Bay International Airport	Thunder Bay, Ontario, Canada>CYWG-Winnipeg James Armstrong Richardson International Airport	Winnipeg, Manitoba, Canada>CYUL-Montréal Pierre Elliott Trudeau International Airport	Montréal, Québec, Canada>CYVR-Vancouver International Airport	Vancouver, British Columbia, Canada>CYXE-Saskatoon John G. Diefenbaker International Airport	Saskatoon, Saskatchewan, Canada>CYXU-London International Airport	London, Ontario, Canada>CYYC-Calgary International Airport	Calgary, Alberta, Canada>CYYJ-Victoria International Airport	Victoria, British Columbia, Canada>CYYT-St. Johns International Airport	St. Johns, Newfoundland, Canada>CYYZ-Toronto Pearson International Airport	Toronto, Ontario, Canada>MMAA-General Juan N. Álvarez International Airport	Acapulco, Guerrero, Mexico>MMAS-Lic. Jesús Terán Peredo International Airport	Aguascalientes, Aguascalientes, Mexico>MMBT-Bahías de Huatulco International Airport	Huatulco, Oaxaca, Mexico>MMCE-Ciudad del Carmen International Airport	Ciudad del Carmen, Campeche, Mexico>MMCU-General Roberto Fierro Villalobos International Airport	Chihuahua, Chihuahua, Mexico>MMCZ-Cozumel International Airport	Cozumel, Quintana Roo, Mexico>MMDO-General Guadalupe Victoria International Airport	Durango, Durango, Mexico>MMGL-Miguel Hidalgo y Costilla International Airport	Guadalajara, Jalisco, Mexico>MMHO-General Ignacio Pesqueira García International Airport	Hermosillo, Sonora, Mexico>MMIO-Plan de Guadalupe International Airport	Saltillo, Coahuila, Mexico>MMLO-Del Bajío International Airport	León, Guanajuato, Mexico>MMMM-General Francisco J. Mujica International Airport	Morelia, Michoacán, Mexico>MMMX-Benito Juárez International Airport	Mexico City, Federal District, Mexico>MMMY-General Mariano Escobedo International Airport	Monterrey, Nuevo León, Mexico>MMOX-Xoxocotlán International Airport	Oaxaca, Oaxaca, Mexico>MMPB-Hermanos Serdán International Airport	Puebla, Puebla, Mexico>MMPR-Licenciado Gustavo Díaz Ordaz International Airport	Puerto Vallarta, Jalisco, Mexico>MMQT-Querétaro International Airport	El Marqués, Querétaro, Mexico>MMSD-Los Cabos International Airport	San José del Cabo, Baja California Sur, Mexico>MMSP-Ponciano Arriaga International Airport	San Luis Potosí, San Luis Potosí, Mexico>MMTC-Francisco Sarabia International Airport	Torreón, Coahuila, Mexico>MMTG-Francisco Sarabia National Airport	Tuxtla Gutiérrez, Chiapas, Mexico>MMTM-General Francisco Javier Mina International Airport	Tampico, Tamaulipas, Mexico>MMVA-Carlos Rovirosa Pérez International Airport	Villahermosa, Tabasco, Mexico>MMVR-General Heriberto Jara International Airport	Veracruz, Veracruz, Mexico>MMZA-Ixtapa Zihuatanejo International Airport	Zihuatanejo, Guerrero, Mexico>MMZO-Playa de Oro International Airport	Manzanillo, Comila, Mexico>MYEG-George Town Airport	George Town, Great Exuma, Bahamas>MYNN-Lynden Pindling International Airport	Nassua, New Providence, Bahamas'

					}];

        	        	   /*db.collection('airlinescities', function(err, collection) {        		       
        	                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
        	                    if (err) {
        	                        res.send({'error':'An error has occurred'});
        	                    } else {
        	                        console.log('Success: ' + JSON.stringify(result[0]));
        	                        res.send(result[0]);
        	                    }
        	                });
        	               });*/
        	console.log('findAirlinesCities - items', items);
            res.send(items);
        });
    });
}

exports.updatepasscity = function(req, res) {
	var city = req.params.city;
    console.log('updatepasscity : Retrieving Passenger cities', city);
    
    db.collection('passengercountrycities', function(err, collection) {

    	collection.findOne({'cityname': city}, function(err, item) {
        	console.log("item", item);  
        	var citycode = city.split("-");
        	console.log('citycode', citycode[0] );
    		item.cityname = citycode[0];
            console.log('Updating city: ' + item.cityname);                
            console.log(JSON.stringify(item));

            collection.update({'cityname':citycode[0]}, item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating airlines: ' + err);
                    	res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    	res.send(item);
                }
            });
    	});
    });
}

exports.findPassengerCities = function(req, res) {
	var id = req.params.id;
	var country = req.params.country;
    console.log('Retrieving Passenger cities', id, country);
 /*  	var tempairlinescities = [
	        		        	{	        		        		
	        		        		passengerId: id,
	                        		countryname: "Denmark",	        		        		
	        		        		cityname: 'AUS-Austin'
	        		            	//city: 'SFO-San Francisco>CIA-Rome>VCE-Venice>VIE-Vienna>MSQ-Minsk,Belarus>PIT-Pittsburgh'
	        		        		//cityname: 'DCA-WashingtonDC Ronald Reagan National>SFO-San Francisco>IAD-WashingtonDC Dulles Airport
	        		        		//	>TPA-Tampa International>STL-Lambert>SEA-Seattle-Tacoma>SNA-John Wayne>SJC-Mineta San José>SFO-San Francisco>SAN-Lindbergh Field>SAT-San Antonio>SLC-Salt Lake City>SMF-Sacramento>RDU-Raleigh-Durham>PDX-Portland>PIT-Pittsburgh>PHX-Sky Harbor>PHL-Philadelphia>MCO-Orlando>ONT-Ontario'
	        		        		//city: 'CMH-Columbus>JFK-New York>IAH-Houston>DFW-Dallas>AUS-Austin>ORD-Chicago,OHare'
	        		        		//city: 'MCI-Kansas City>IND-Indianapolis>MSP-Minneapolis>DTW-Detroit>CLT-Charlotte>PHL-Philadelphia'
	        		        		//city: 'ATL-Atlanta>MIA-Miami>MCO-Orlando>LAS-Las Vegas>LAX-Los Angeles>PHX-Phoenix'
	        		            }];    
	        	   db.collection('passengercountrycities', function(err, collection) {        		       
	                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
	                    if (err) {
	                        res.send({'error':'An error has occurred'});
	                    } else {
	                        console.log('Success: ' + JSON.stringify(result[0]));
	                        res.send(result[0]);
	                    }
	                });
	               });
*/
    // This is where CA-Canada is updated and shows up
    /*db.collection('passengercountrycities', function(err, collection) {
		collection.update({"_id":{ $exists : true }},{$set:{passengerId: id}});
    */
    db.collection('passengercountrycities', function(err, collection) {
    	collection.find({'passengerId' : id}).toArray(function(err, items) {
        	//console.log('items', items);
        	if(items.length > 0)
    		{
        		console.log('items length', items.length);
                res.send(items);    		
    		}
        	else
    		{
        		var country =
    			{       				
                                country1: 'USA1-United States Of America (A thru E)',
                                country2: 'USA2-United States Of America (F thru L)',
                                country3: 'USA3-United States Of America (M thru R)',
                                country4: 'USA4-United States Of America (S thru Y)',
                                country5: 'UK1-United Kingdom & Surrounding Nations A thru F',
                                country6: 'UK2-United Kingdom & Surrounding Nations G thru O',
                                country7: 'UK3-United Kingdom & Surrounding Nations P thru Z',
                                country8: 'EUE1-East Europe & Scandivanian A thru K',
                                country9: 'EUE2-East Europe & Scandivanian K thru Z',
				country10: 'GER-Germany',
				country11: 'JPNCHI-Japan China S.Korea',
                                country12: 'CA1-Canada cities from A thru C',
                                country13: 'CA2-Canada cities from D thru G',
                                country14: 'CA3-Canada cities from H thru M',
                                country15: 'CA4-Canada cities from N thru P',
                                country16: 'FR1-France Airport codes A thru J',
                                country17: 'FR2-France Airport codes L thru V',
                                country18: 'FR3-France Airport codes X thru Z',
				country19: 'IT-Italy',
				country20: 'AUS-Australia & Surrounding Islands',
				country21: 'SP-Spain',
				country22: 'IND-India',
				country23: 'MEX-Mexico',
				country24: 'CAR-Caribbean',
				country25: 'SA-South America',
				country26: 'SAINTH1-South Asia Indonasia Thailand etc A thru K',
				country27: 'SAINTH2-South Asia Indonasia Thailand etc L thru Z',
				country28: 'AFR1-Central East North South West Africa A thru D',
				country29: 'AFR2-Central East North South West Africa E thru M',
				country30: 'AFR3-Central East North South West Africa N thru Z',
				country31: 'SWASIA-South West Asia incl. Kazak Iran Iraq Isreal etc'
			};
        		for (var ctryname in country) {
    			
			//console.log('country[ctryname]',country[ctryname]);

            		//if(country === 'SP-Spain')
            		if(country[ctryname] === 'SP-Spain')
            		{
				console.log('SP-Spain - country[ctryname]',country[ctryname]);
    	        		var cities =
				{       				
					city1: 'LCG-A Coruña Airport (Alvedro Airport)',
					city2: 'ABC-Albacete Airport (Los Llanos Air Base)',
					city3: 'ALC-Alicante Airport (formerly El Altet Airport)',
					city4: 'LEI-Almería Airport',
					city5: 'OVD-Asturias Airport',
					city6: 'BJZ-Badajoz Airport (Talavera la Real Badajoz Airport)',
					city7: 'BCN-El Prat / Barcelona Airport',
					city8: 'BIO-Bilbao Airport',
					city9: 'RGS-Burgos Airport',
					city10: 'ODB-Córdoba Airport',
					city11: 'GRO-Girona Costa Brava Airport',
					city12: 'GRX-Federico García Lorca Airport',
					city13: 'HSK-Huesca Pirineos Airport',
					city14: 'XRY-Jerez Airport',
					city15: 'LEN-León Airport',
					city16: 'ILD-Lleida Alguaire Airport',
					city17: 'RJL-Logroño Agoncillo Airport',
					city18: 'MAD-Madrid Barajas International Airport',
					city19: 'MCV-Cuatro Vientos Airport',
					city20: 'TOJ-Torrejón de Ardoz Airport',
					city21: 'AGP-Málaga Airport',
					city22: 'MJV-Murcia San Javier Airport',
					city23: 'PNA-Pamplona Nóain Airport',
					city24: 'REU-Reus Airport',
					city25: 'QSA-Sabadell Airport',
					city26: 'SLM-Salamanca Airport (Matacan Air Base)',
					city27: 'EAS-San Sebastián Airport (Fuenterrabia Airport)',
					city28: 'SDR-Santander Airport (Parayas Airport)',
					city29: 'SCQ-Santiago de Compostela Airport (Lavacolla Airport)',
					city30: 'SVQ-Seville Airport (San Pablo Airport)',
					city31: 'VLC-Valencia Airport',
					city32: 'VGO-Vigo Peinador Airport',
					city33: 'VLL-Valladolid Airport (Villanubla Airport)',
					city34: 'VIT-Vitoria Airport (Foronda Airport)',
					city35: 'ZAZ-Zaragoza Airport',
					city36: 'LEN-León Air Base',
					city37: 'OZP-Morón Air Base',
					city38: 'SLM-Matacan Air Base (Matacan Air Base)',
					city39: 'SCQ-Santiago de Compostela Military AIrport',
					city40: 'VLL-Villanubla Air Base',
					city41: 'IBZ-Ibiza Airport',
					city42: 'PMI-Palma de Mallorca Airport (Son Sant Joan Airport)',
					city43: 'MAH-Minorca Airport (Menorca Airport)',
					city44: 'VDE-El Hierro Airport',
					city45: 'FUE-El Matorral Airport',
					city46: 'LPA-Gran Canaria Airport (Las Palmas)',
					city47: 'GMZ-La Gomera Airport',
					city48: 'SPC-La Palma Airport',
					city49: 'ACE-Lanzarote Airport (Arrecife Airport)',
					city50: 'TFN-Tenerife North Airport (Los Rodeos Airport)',
					city51: 'TFS-Tenerife South Airport (Reina Sofía Airport)',
					city52: 'JCU-Ceuta Heliport',
					city53: 'MLN-Melilla Airport'
				};
            		}
			else if(country[ctryname] === 'SWASIA-South West Asia incl. Kazak Iran Iraq Isreal etc')
			{
				console.log('SWASIA-South West Asia incl. Kazak Iran Iraq Isreal etc',country[ctryname]);
				var cities =
				{
					city1: 'SCO-Aktau Airport',
					city2: 'ALA-Almaty International Airport',
					city3: 'TSE-Astana International Airport',
					city4: 'GUW-ATMA Atyrau Airport',
					city5: 'KGF-Sary Arka Airport',
					city6: 'KSN-Kostanay Airport',
					city7: 'CIT-Shymkent International Airport',
					city8: 'URA-Oral Ak Zhol Airport',
					city9: 'FRU -Manas International Airport',
					city10: 'OSS-Osh International Airport',
					city11: 'DYU-Dushanbe International Airport',
					city12: 'LBD-Khudjand International Airport',
					city13: 'ASB-Ashgabat International Airport',
					city14: 'NMA-Namangan Airport',
					city15: 'TAS-Tashkent International Airport',
					city16: 'FNJ-Pyongyang Sunan International Airport',
					city17: 'ULN-Chinggis Khaan International Airport',
					city18: 'KBL-Kabul International Airport',
					city19: 'KDH-Kandahar International Airport',
					city20: 'EVN-Zvartnots International Airport',
					city21: 'LWN-Shirak International Airport',
					city22: 'GYD-Heydar Aliyev International Airport',
					city23: 'KVD-Ganja International Airport',
					city24: 'NAJ-Nakhchivan International Airport',
					city25: 'BAH-Bahrain International Airport',
					city26: 'BUS-Batumi International Airport',
					city27: 'KUT-Kutaisi Airport',
					city28: 'TBS-Tbilisi Airport',
					city29: 'BND-Bandar Abbas International Airport',
					city30: 'XBJ-Birjand Airport',
					city31: 'IFN-Isfahan International Airport',
					city32: 'KIH-Kish International Airport',
					city33: 'MHD-Mashhad International Airport or Shahid Hashemi Nejad Airport',
					city34: 'SYZ-Shiraz International Airport',
					city35: 'TBZ-Tabriz International Airport',
					city36: 'IKA-Tehran Imam Khomeini International Airport',
					city37: 'NJF-Al Najaf International Airport',
					city38: 'BGW-Baghdad International Airport',
					city39: 'BSR-Basrah International Airport',
					city40: 'EBL-Erbil International Airport',
					city41: 'OSM-Mosul International Airport',
					city42: 'ISU-Sulaimaniyah International Airport',
					city43: 'VDA-Ovda Airport',
					city44: 'TLV-Ben Gurion Airport',
					city45: 'HFA-Haifa International Airport',
					city46: 'AQJ-Aqaba Airport',
					city47: 'AMM-Queen Alia International Airport',
					city48: 'ADJ-Amman Civil Airport',
					city49: 'KWI-Kuwait International Airport',
					city50: 'BEY-Beirut Rafic Hariri International Airport',
					city51: 'MCT-Muscat International Airport',
					city52: 'SLL-Salalah Airport',
					city53: 'DOH-Doha International Airport',
					city54: 'DMM-King Fahd International Airport',
					city55: 'JED-King Abdulaziz International Airport',
					city56: 'MED-Prince Mohammad bin Abdulaziz Airport',
					city57: 'RUH-King Khalid International Airport',
					city58: 'ALP-Aleppo International Airport',
					city59: 'DAM-Damascus International Airport',
					city60: 'LTK-Bassel al Assad International Airport',
					city61: 'AUH-Abu Dhabi International Airport',
					city62: 'AAN-Al Ain International Airport',
					city63: 'DXB-Dubai International Airport',
					city64: 'RKT-Ras Al Khaimah International Airport',
					city65: 'SHJ-Sharjah International Airport',
					city66: 'FJR-Fujairah International Airport',
					city67: 'ADE-Aden International Airport',
					city68: 'SAH-Sanaa International Airport or El Rahaba Airport'
				}
			}
			else if(country[ctryname] === 'SAINTH1-South Asia Indonasia Thailand etc A thru K')
                        {
                                console.log('SAINTH1-South Asia Indonasia Thailand etc A thru K',country[ctryname]);
                                var cities =
                                {
					city1: 'BCD-Bacolod Silay International Airport',
					city2: 'BDO-Husein Sastranegara International Airport',
					city3: 'BHV-Bahawalpur Airport',
					city4: 'BKI-Kota Kinabalu International Airport (KKIA)',
					city5: 'BKK-Suvarnabhumi Airport',
					city6: 'BPN-Sultan Aji Muhamad Sulaiman Airport',
					city7: 'BTJ-Sultan Iskandar Muda International Airport',
					city8: 'BWN-Brunei International Airport',
					city9: 'CEB-Mactan Cebu International Airport',
					city10: 'CEI-Mae Fah Luang International Airport',
					city11: 'CGK-Soekarno Hatta International Airport',
					city12: 'CGP-Shah Amanat International Airport',
					city13: 'CGY-Laguindingan International Airport',
					city14: 'CMB-Bandaranaike International Airport',
					city15: 'CNX-Chiang Mai International Airport',
					city16: 'CRK-Clark International Airport',
					city17: 'CXR-Cam Ranh International Airport',
					city18: 'DAC-Hazrat Shahjalal International Airport',
					city19: 'DAD-Ðà N?ng International Airport',
					city20: 'DEA-Dera Ghazi Khan international Airport',
					city21: 'DIL-Presidente Nicolau Lobato International Airport',
					city22: 'DMK-Don Mueang International Airport',
					city23: 'DPS-Ngurah Rai International Airport',
					city24: 'DVO-Francisco Bangoy International Airport',
					city25: 'GAN-Gan International Airport',
					city26: 'GES-General Santos International Airport',
					city27: 'GWD-Gwadar International Airport',
					city28: 'HAN-N?i Bài International Airport',
					city29: 'HDY-Hat Yai International Airport',
					city30: 'HKT-Phuket Airport',
					city31: 'HPH-Cat Bi International Airport',
					city32: 'HRI-Mattala Rajapaksa International Airport',
					city33: 'HUI-Phu Bai International Airport',
					city34: 'ILO-Iloilo International Airport',
					city35: 'IPH-Sultan Azlan Shah Airport',
					city36: 'ISB-Benazir Bhutto International Airport',
					city37: 'JHB-Senai International Airport',
					city38: 'JOG-Adisucipto (or Adisutjipto) International Airport',
					city39: 'KBV-Krabi Airport',
					city40: 'KHI-Jinnah International Airport',
					city41: 'KIA-Kuching International Airport',
					city42: 'KLO-Kalibo International Airport',
					city43: 'KNO-Kuala Namu International Airport',
					city44: 'KTM-Tribhuvan International Airport',
					city45: 'KUA-Sultan Ahmad Shah Airport',
					city46: 'KUL-Kuala Lumpur International Airport (KLIA)'
	
				}
			}
                        else if(country[ctryname] === 'SAINTH2-South Asia Indonasia Thailand etc L thru Z')
                        {
                                console.log('SAINTH2-South Asia Indonasia Thailand etc L thru Z',country[ctryname]);
                                var cities =
                                {
					city1: 'LAO-Laoag International Airport',
					city2: 'LGK-Langkawi International Airport',
					city3: 'LHE-Allama Iqbal International Airport',
					city4: 'LOP-Lombok International Airport',
					city5: 'LPQ-Luang Prabang International Airport',
					city7: 'LYP-Faisalabad International Airport',
					city8: 'MDC-Sam Ratulangi International Airport',
					city9: 'MDL-Mandalay International Airport',
					city10: 'MKZ-Malacca International Airport',
					city11: 'MLE-Ibrahim Nasir International Airport',
					city12: 'MNL-Ninoy Aquino International Airport',
					city13: 'MUX-Muhammad Bin Qasim International Airport',
					city15: 'MYY-Miri Airport',
					city16: 'PBH-Paro Airport',
					city17: 'PDG-Minangkabau International Airport',
					city18: 'PEN-Penang International Airport',
					city19: 'PEW-Bacha Khan International Airport',
					city20: 'PKU-Sultan Syarif Kasim II International Airport',
					city21: 'PKZ-Pakse International Airport',
					city22: 'PLM-Sultan Mahmud Badaruddin II Airport in Palembang, Indonesia',
					city23: 'PNH-Phnom Penh International Airport',
					city24: 'PPS-Puerto Princesa International Airport',
					city25: 'PQC-Phu Quoc International Airport',
					city26: 'REP-Siem Reap International Airport',
					city27: 'RGN-Yangon International Airport',
					city28: 'RML-Ratmalana Airport',
					city29: 'RYK-Shaikh Zayed International Airport',
					city30: 'SFS-Subic Bay International Airport',
					city31: 'SGN-Tân Son Nh?t International Airport',
					city32: 'SIN-Singapore Changi Airport',
					city33: 'SKT-Sialkot International Airport',
					city34: 'SOC-Adi Sumarmo International Airport',
					city35: 'SRG-Achmad Yani International Airport',
					city36: 'SUB-Juanda International Airport',
					city37: 'SZB-Sultan Abdul Aziz Shah Airport',
					city38: 'TUK-Turbat International Airport',
					city39: 'UET-Quetta International Airport',
					city40: 'UPG-Sultan Hasanuddin International Airport',
					city41: 'URT-Surat Thani Airport',
					city42: 'USM-Samui International Airport',
					city43: 'UTH-Udon Thani International Airport',
					city44: 'UTP-U Tapao Pattaya International Airport',
					city45: 'VCA-Can Tho International Airport',
					city46: 'VCL-Chu Lai International Airport',
					city47: 'VTE-Wattay International Airport',
					city48: 'ZAM-Zamboanga International Airport',
					city49: 'ZYL-MAG Osmani International Airport'
			        }
                        }
			else if(country[ctryname] === 'SA-South America')
			{
				console.log('SA-South America - country[ctryname]',country[ctryname]);
				var cities =
				{
					city1: 'EZE-Ministro Pistarini International Airport',
					city2: 'AEP-Aeroparque Jorge Newbery',
					city3: 'COR-Ingeniero Aeronáutico Ambrosio L.V. Taravella International Airport',
					city4: 'MDZ-Governor Francisco Gabrielli International Airport',
					city5: 'IGR-Cataratas del Iguazú International Airport',
					city6: 'RGL-Piloto Civil Norberto Fernández International Airport',
					city7: 'BRC-San Carlos de Bariloche Airport',
					city8: 'REL-Almirante Marcos A. Zar Airport',
					city9: 'USH-Ushuaia International Airport',
					city10: 'LPB-El Alto International Airport',
					city11: 'PSZ-Puerto Suárez International Airport',
					city12: 'VVI-Viru Viru International Airport',
					city13: 'AJU-Aracaju¿Santa Maria Airport',
					city14: 'BEL-Belém/Val de Cans¿Júlio Cezar Ribeiro International Airport',
					city15: 'CNF-Tancredo Neves/Confins International Airport',
					city16: 'BSB-Brasília Presidente Juscelino Kubitschek International Airport',
					city17: 'VCP-Viracopos Campinas International Airport',
					city18: 'CGR-Campo Grande International Airport',
					city19: 'XAP-Serafin Enoss Bertaso Airport',
					city20: 'CGB-Marechal Rondon International Airport',
					city21: 'CWB-Afonso Pena International Airport',
					city22: 'FLN-Florianópolis Hercílio Luz International Airport',
					city23: 'FOR-Pinto Martins Fortaleza International Airport',
					city24: 'GYN-Santa Genoveva/Goiânia Airport',
					city25: 'IOS-Ilhéus/Bahia Jorge Amado Airport',
					city26: 'JPA-Presidente Castro Pinto International Airport',
					city27: 'JDO-Orlando Bezerra de Menezes Airport',
					city28: 'LDB-Londrina Gov. José Richa Airport',
					city29: 'MCZ-Maceió/Zumbi dos Palmares International Airport',
					city30: 'MAO-Brigadeiro Eduardo Gomes Manaus International Airport',
					city31: 'NVT-Navegantes Ministro Victor Konder International Airport',
					city32: 'NAT-Augusto Severo International Airport',
					city33: 'PFB-Lauro Kurtz Airport',
					city34: 'PNZ-Petrolina Senador Nilo Coelho Airport',
					city35: 'POA-Salgado Filho International Airport',
					city36: 'BPS-Porto Seguro Airport',
					city37: 'PVH-Porto Velho Governador Jorge Teixeira de Oliveira International Airport',
					city38: 'REC-Recife/Guararapes¿Gilberto Freyre International Airport',
					city39: 'GIG-Rio de Janeiro/Galeão¿Antonio Carlos Jobim International Airport',
					city40: 'SDU-Santos Dumont Airport',
					city41: 'SSA-Salvador Deputado Luís Eduardo Magalhães International Airport',
					city42: 'SLZ-Marechal Cunha Machado International Airport',
					city43: 'GRU-São Paulo Guarulhos International Airport',
					city44: 'CGH-Congonhas São Paulo Airport',
					city45: 'VIX-Eurico de Aguiar Salles Airport',
					city46: 'ANF-Cerro Moreno International Airport',
					city47: 'CCP-Carriel Sur International Airport',
					city48: 'PMC-El Tepual International Airport',
					city49: 'PUQ-Presidente Carlos Ibáñez International Airport',
					city50: 'SCL-Comodoro Arturo Merino Benítez International Airport',
					city51: 'AXM-El Edén International Airport',
					city52: 'BAQ-Ernesto Cortissoz International Airport',
					city53: 'BOG-El Dorado International Airport',
					city54: 'BGA-Palonegro International Airport',
					city55: 'CLO-Alfonso Bonilla Aragón International Airport',
					city56: 'CTG-Rafael Núñez International Airport',
					city57: 'CUC-Camilo Daza International Airport',
					city58: 'LET-Alfredo Vásquez Cobo International Airport',
					city59: 'MDE-José María Córdova International Airport',
					city60: 'PEI-Matecaña International Airport',
					city61: 'ADZ-Gustavo Rojas Pinilla International Airport',
					city62: 'SMR-Santa Marta Simón Bolívar International Airport',
					city63: 'GYE-José Joaquín de Olmedo International Airport',
					city64: 'UIO-Mariscal Sucre International Airport',
					city65: 'TUA-Teniente Coronel Luis A Mantilla International Airport',
					city66: 'MPN-RAF Mount Pleasant',
					city67: 'CAY-Cayenne Félix Eboué Airport',
					city68: 'GEO-Cheddi Jagan International Airport',
					city69: 'ASU-Silvio Pettirossi International Airport',
					city70: 'AGT-Guarani International Airport',
					city71: 'AQP-Rodríguez Ballón International Airport',
					city72: 'CUZ-Alejandro Velasco Astete International Airport',
					city73: 'LIM-Jorge Chávez International Airport',
					city74: 'PBM-Johan Adolf Pengel International Airport',
					city75: 'MVD-Carrasco/General Cesáreo L. Berisso International Airport',
					city76: 'PDP-Capitan Corbeta CA Curbelo International Airport',
					city77: 'CCS-Simón Bolívar International Airport',
					city78: 'MAR-La Chinita International Airport',
					city79: 'VLN-Arturo Michelena International Airport'
				}
			}
                        else if(country[ctryname] === 'JPNCHI-Japan China S.Korea')
                        {
                                console.log('JPNCHI-Japan China S.Korea- country[ctryname]',country[ctryname]);
                                var cities =
                                {
					city1: 'AXT-Akita Airport',
					city2: 'AOJ-Aomori Airport',
					city3: 'FUK-Fukuoka Airport',
					city4: 'HKD-Hakodate Airport',
					city5: 'KOJ-Kagoshima Airport',
					city6: 'KMQ-Komatsu Airport',
					city7: 'HIJ-Hiroshima Airport',
					city8: 'KKJ-Kitakyushu Airport',
					city9: 'NGS-Nagasaki Airport',
					city10: 'NGO-Chubu Centrair International Airport',
					city11: 'KIJ-Niigata Airport',
					city12: 'OIT-Oita Airport',
					city13: 'OKJ-Okayama Airport',
					city14: 'KIX-Kansai International Airport',
					city15: 'CTS-New Chitose Airport',
					city16: 'SDJ-Sendai Airport',
					city17: 'FSZ-Shizuoka Airport',
					city19: 'HND-Tokyo International Airport',
					city20: 'NRT-Narita International Airport',
					city21: 'PEK-Beijing Capital International Airport',
					city22: 'CGQ-Changchun Longjia International Airport',
					city23: 'CSX-Changsha Huanghua International Airport',
					city24: 'CTU-Chengdu Shuangliu International Airport',
					city25: 'CKG-Chongqing Jiangbei International Airport',
					city26: 'DLC-Dalian Zhoushuizi International Airport',
					city27: 'FOC-Fuzhou Changle International Airport',
					city28: 'CAN-Guangzhou Baiyun International Airport',
					city29: 'KWL-Guilin Liangjiang International Airport',
					city30: 'KWE-Guiyang Longdongbao International Airport',
					city31: 'HAK-Haikou Meilan International Airport',
					city32: 'HGH-Hangzhou Xiaoshan International Airport',
					city33: 'HRB-Harbin Taiping International Airport',
					city34: 'HKG-Hong Kong International Airport',
					city35: 'SWA-Jieyang Chaoshan Airport',
					city36: 'TNA-Jinan Yaoqiang International Airport',
					city37: 'LXA-Lhasa Gonggar Airport',
					city38: 'MFM-Macau International Airport',
					city39: 'MDG-Mudanjiang Hailang Airport',
					city40: 'NKG-Nanjing Lukou International Airport',
					city41: 'NNG-Nanning Wuxu Airport',
					city42: 'NGB-Ningbo Lishe International Airport',
					city43: 'TAO-Qingdao Liuting International Airport',
					city44: 'SYX-Sanya Phoenix International Airport',
					city45: 'SHA-Shanghai Hongqiao International Airport',
					city46: 'PVG-Shanghai Pudong International Airport',
					city47: 'SHE-Shenyang Taoxian International Airport',
					city48: 'SZX-Shenzhen Baoan International Airport',
					city49: 'TSN-Tianjin Binhai International Airport',
					city50: 'URC-Ürümqi Diwopu International Airport',
					city51: 'WEH-Weihai Airport',
					city52: 'WUH-Wuhan Tianhe International Airport',
					city53: 'XMN-Xiamen Gaoqi International Airport',
					city54: 'XIY-Xi an Xianyang International Airport',
					city55: 'YNJ-Yanji Chaoyangchuan Airport',
					city56: 'YNT-Yantai Laishan International Airport',
					city57: 'CGO-Zhengzhou Xinzheng International Airport',
					city58: 'KHH-Kaohsiung International Airport',
					city59: 'TSA-Taipei Songshan Airport',
					city60: 'TPE-Taiwan Taoyuan International Airport',
					city61: 'TTT-Taitung Airport',
					city61: 'PUS-Gimhae International Airport',
					city62: 'TAE-Daegu International Airport',
					city63: 'CJU-Jeju International Airport',
					city64: 'GMP-Gimpo International Airport',
					city65: 'ICN-Incheon International Airport',
					city66: 'CJJ-Cheongju International Airport',
					city67: 'MWX-Muan International Airport',
					city68: 'YNY-Yangyang International Airport'
				}
			}
			else if(country[ctryname] === 'MEX-Mexico')
			{
				console.log('MEX-Mexico - country[ctryname]',country[ctryname]);
				var cities =
				{
					city1: 'ACA-General Juan N. Alvarez International Airport',
					city2: 'AGU-Lic. Jesús Terán Peredo International Airport',
					city3: 'CSL-Cabo San Lucas International Airport',
					city4: 'CPE-Ing. Alberto Acuña Ongay International Airport',
					city5: 'CUN-Cancún International Airport',
					city6: 'CUU-Roberto Fierro Villalobos International Airport',
					city7: 'CME-Ciudad del Carmen International Airport',
					city8: 'CZM-Cozumel International Airport',
					city9: 'CUL-Federal de Bachigualato International Airport',
					city10: 'DGO-General Guadalupe Victoria International Airport',
					city11: 'GDL-Guadalajara Don Miguel Hidalgo y Costilla International Airport',
					city12: 'HUX-Bahías de Huatulco International Airport',
					city13: 'ZIH-Ixtapa Zihuatanejo International Airport',
					city14: 'BJX-Del Bajío International Airport',
					city15: 'LTO-Loreto International Airport',
					city16: 'ZLO-Playa de Oro International Airport',
					city17: 'MZT-General Rafael Buelna International Airport',
					city18: 'MID-Manuel Crescencio Rejón International Airport',
					city19: 'MEX-Mexico City International Airport',
					city20: 'MTY-General Mariano Escobedo International Airport',
					city21: 'MLM-General Francisco J. Mujica International Airport',
					city22: 'OAX-Xoxocotlán International Airport',
					city23: 'PBC-Hermanos Serdán International Airport',
					city24: 'PVR-Lic. Gustavo Díaz Ordaz International Airport',
					city25: 'SLW-Plan de Guadalupe International Airport',
					city26: 'SJD-Los Cabos International Airport',
					city27: 'SLP-Ponciano Arriaga International Airport',
					city28: 'QRO-Querétaro International Airport',
					city29: 'TAM-General Francisco Javier Mina International Airport',
					city30: 'TIJ-Tijuana Gral. Abelardo L. Rodríguez International Airport',
					city31: 'TLC-Toluca Lic. Adolfo López Mateos International Airport',
					city32: 'TGZ-Angel Albino Corzo International Airport',
					city33: 'TRC-Francisco Sarabia International Airport',
					city34: 'VER-General Heriberto Jara International Airport',
					city35: 'VSA-Carlos Rovirosa Pérez International Airport',
					city36: 'FSP-Carlos Rovirosa Pérez International Airport',
					city37: 'MQC-Carlos Rovirosa Pérez International Airport'
				};
			}
                        else if(country[ctryname] === 'IT-Italy')
                        {
				console.log('IT-Italy - country[ctryname]',country[ctryname]);
                                var cities =
                                        {
						city1: 'QAQ-LAquila Preturo Airport',
						city2: 'PSR-Abruzzo Airport (Pescara Airport)',
						city3: 'AOT-Aosta Corrado Gex Airport',
						city4: 'BRI-Bari Palese Karol Wojtyla Airport',
						city5: 'BDS-Brindisi Casale Orazio Pierozzi Airport (Salento Airport)',
						city6: 'FOG-Foggia Gino Lisa Airport',
						city7: 'LCC-Lecce Galatina Airport',
						city8: 'TAR-Taranto Grottaglie Marcello Arlotta Airport',
						city9: 'CRV-Crotone SantAnna Airport',
						city10: 'SUF-Lamezia Terme Airport',
						city11: 'REG-Reggio Calabria Tito Minniti Airport',
						city12: 'NAP-Naples Capodichino Ugo Niutta Airport',
						city13: 'QSR-Salerno Costa dAmalfi Airport',
						city14: 'BLQ-Bologna Borgo Panigale Guglielmo Marconi Airport',
						city15: 'PMF-Parma Giuseppe Verdi Airport',
						city16: 'RAN-Ravenna Gastone Novelli Airport',
						city17: 'RMI-Rimini Miramare Federico Fellini Airport',
						city18: 'AVB-Aviano Air Base Maurizio Pagliano & Luigi Gori',
						city19: 'UDN-Udine Campoformido Airport',
						city20: 'TRS-Friuli Venezia Giulia Pietro Savorgnan di Brazzà Airport',
						city21: 'QFR-Frosinone Girolamo Moscardini Airport it military',
						city22: 'QLT-Latina Airport (military)',
						city23: 'FCO-Rome Fiumicino Leonardo da Vinci Airport',
						city24: 'CIA-Rome Ciampino Giovan Battista Pastine Airport',
						city25: 'ALL-Villanova dAlbenga Clemente Panero Airport',
						city26: 'GOA-Genoa Cristoforo Colombo Airport',
						city27: 'BGY-Orio al Serio Antonio Locatelli Airport',
						city28: 'VBS-Brescia Montichiari Gabriele DAnnunzio Airport',
						city29: 'MXP-Milan Malpensa Airport',
						city30: 'LIN-Milan Linate Enrico Forlanini Airport',
						city31: 'AOI-Ancona Falconara Raffaello Sanzio Airport',
						city32: 'CUF-Cuneo Levaldigi Turin Olympics Airport',
						city33: 'TRN-Turin Caselle Sandro Pertini Airport',
						city34: 'AHO-Alghero Fertilia Riviera del Corallo Airport',
						city35: 'CAG-Cagliari Elmas Mario Mameli Airport',
						city36: 'DCI-Decimomannu Air Base (G. Farina)',
						city37: 'OLB-Olbia Costa Smeralda Airport',
						city38: 'TTB-Tortolì Arbatax Airport',
						city39: 'CTA-Catania Fontanarossa Vincenzo Bellini Airport',
						city40: 'CIY-Comiso Vincenzo Magliocco Airport',
						city41: 'LMP-Lampedusa Airport',
						city42: 'PMO-Palermo Punta Raisi Falcone & Borsellino Airport',
						city43: 'PNL-Pantelleria Airport (public/military)',
						city44: 'NSY-Naval Air Station Sigonella (military)',
						city45: 'TPS-Trapani Birgi Vincenzo Florio Airport',
						city46: 'BZO-Bolzano Dolomiti Francesco Baracca Airport',
						city47: 'FLR-Florence Peretola Amerigo Vespucci Airport',
						city48: 'GRS-Grosseto Airport (Maremma Corrado Baccarini Airport)',
						city49: 'LCV-Lucca Tassignano Enrico Squaglia Airport',
						city50: 'EBA-Marina di Campo Teseo Tesei Airport',
						city51: 'PSA-Pisa San Giusto Galileo Galilei Airport (public/military)',
						city52: 'SAY-Siena Ampugnano Airport',
						city53: 'PEG-Perugia Sant Egidio Adamo Giuglietti Airport',
						city54: 'BLX-Belluno Arturo dell Oro Airport',
						city55: 'TSF-Treviso Sant Angelo Antonio Canova Airport',
						city56: 'VCE-Venice Marco Polo Airport',
						city57: 'VRN-Verona Villafranca Valerio Catullo Airport',
						city58: 'QBS-Verona Boscomantico Airport',
						city59: 'VIC-Vicenza Tommaso Dal Molin Airport',

                                        };
                        }
			else if(country[ctryname] === 'IND-India')
			{
				console.log('IND-India - country[ctryname]',country[ctryname]);

    	        		var cities =
    	        		{       				
					city1: 'HYD-Rajiv Gandhi International Airport',
					city2: 'RJA-Rajahmundry	Rajahmundry Airport',
					city3: 'TIR-Tirupati Tirupati Airport',
					city4: 'VGA-Vijayawada Vijayawada Airport',
					city5: 'DIB-Dibrugarh Airport',
					city6: 'GAU-Lokpriya Gopinath Bordoloi International Airport',
					city7: 'IXI-North Lakhimpur Lilabari Airport',
					city8: 'GAY-Gaya International Airport',
					city9: 'PAT-Lok Nayak Jayaprakash Airport',
					city10: 'IXC-Chandigarh	Chandigarh Chandigarh Airport',
					city11: 'RPR-Raipur Swami Vivekananda Airport',
					city12: 'DIU-Diu Airport',
					city13: 'DEL-Indira Gandhi International Airport',
					city14: 'AMD-Sardar Vallabhbhai Patel International Airport',
					city15: 'BDQ-Vadodara Vadodara Airport',
					city16: 'IXY-Kandla Kandla Airport',
					city17: 'BHU-Bhavnagar Airport',
					city18: 'PBD-Porbandar Airport',
					city19: 'RAJ-Rajkot Airport',
					city20: 'STV-Surat Airport',
					city21: 'DHM-Gaggal Airport',
					city22: 'SLV-Shimla Airport',
					city23: 'KUU-Bhuntar Airport',
					city24: 'IXR-Birsa Munda Airport',
					city25: 'BLR-Bengaluru International Airport',
					city26: 'IXG-Belgaum Belgaum Airport',
					city27: 'HBX-Hubli Airport',
					city28: 'IXE-Mangalore International Airport',
					city29: 'MYQ-Mysore Airport',
					city30: 'COK-Cochin International Airport',
					city31: 'CCJ-Calicut International Airport',
					city32: 'TRV-Trivandrum International Airport',
					city33: 'AGX-Agatti Aerodrome',
					city34: 'BHO-Raja Bhoj Airport',
					city35: 'GWL-Gwalior Airport',
					city36: 'IDR-Devi Ahilyabai Holkar Airport',
					city37: 'JLR-Jabalpur Airport',
					city38: 'HJR-Khajuraho Airport',
					city39: 'IXU-Aurangabad Airport',
					city40: 'BOM-Mumbai Chhatrapati Shivaji International Airport',
					city41: 'NAG-Dr.Babasaheb Ambedkar International Airport',
					city42: 'NDC-Nanded Airport',
					city43: 'IMF-Tulihal Airport',
					city44: 'SHL-Shillong Airport',
					city45: 'AJL-Lengpui Airport',	
					city46: 'DMU-Dimapur Airport',
					city47: 'BBI-Biju Patnaik International Airport',
					city48: 'PNY-Pondicherry Airport',
					city49: 'ATQ-Sri Guru Ram Dass Jee International Airport',
					city50: 'JAI-Jaipur International Airport',
					city51: 'UDR-Udaipur Airport',
					city52: 'MAA-Chennai International Airport',
					city53: 'CJB-Coimbatore International Airport',
					city54: 'IXM-Madurai Airport',
					city55: 'SXV-Salem Airport',
					city56: 'TRZ-Tiruchirapalli International Airport',
					city57: 'TCR-Tuticorin Airport',
					city58: 'VLR-Vellore Airport',
					city59: 'IXA-Tripura Agartala',
					city60: 'DED-Jolly Grant Airport',
					city61: 'PGH-Pantnagar Airport',
					city62: 'LKO-Charan Singh Airport',
					city63: 'VNS-Lal Bahadur Shastri Airport',
					city64: 'COH-Cooch Behar Airport',
					city65: 'CCU-Netaji Subhash Chandra Bose International Airport'
				};
			}
	   		else if (country[ctryname] === 'EUE1-East Europe & Scandivanian A thru K'){

				console.log('EUE1-East Europe & Scandivanian A thru K- country[ctryname]',country[ctryname]);
				var cities =
					{
						city1: 'ACH-St. Gallen¿Altenrhein Airport',
						city2: 'ADA-Adana Airport or Adana Sakirpasa Airport (Turkish: Adana Sakirpasa Havalimani)',
						city3: 'ADB-Izmir Adnan Menderes International Airport',
						city4: 'AER-Sochi International Airport',
						city5: 'AES-Ålesund Airport, Vigra',
						city6: 'AEY-Akureyri Airport',
						city7: 'AOK-Karpathos Island National Airport',
						city8: 'ARH-Talagi Airport',
						city9: 'ARN-Stockholm Arlanda Airport',
						city10: 'ASR-Erkilet Airport or Kayseri Erkilet Airport (Turkish: Kayseri Erkilet Havalimani)',
						city11: 'ATH-Athens International Airport Eleftherios Venizelos',
						city12: 'AYT-Antalya Airport',
						city13: 'BEG-Belgrade Nikola Tesla Airport',
						city14: 'BGO-Bergen Airport, Flesland',
						city15: 'BJV-Milas Bodrum Airport',
						city16: 'BRN-Bern Airport',
						city17: 'BTS-M. R. ¿tefánik Airport',
						city18: 'BUD-Budapest Ferenc Liszt International Airport',
						city19: 'BUS-Batumi International Airport',
						city20: 'BZG-Bydgoszcz Ignacy Jan Paderewski Airport',
						city21: 'CFU-Corfu International Airport Ioannis Kapodistrias',
						city22: 'CHQ-Chania International Airport Daskalogiannis',
						city23: 'CLJ-Cluj Avram Iancu International Airport',
						city24: 'CND-Mihail Kogalniceanu Airport',
						city25: 'CWC-Chernivtsi International Airport',
						city26: 'DEB-Debrecen International Airport',
						city27: 'DLM-Dalaman Airport',
						city28: 'DME-Moscow Domodedovo Airport',
						city29: 'DNK-Dnipropetrovsk International Airport',
						city30: 'DOK-Donetsk Sergey Prokofiev International Airport',
						city31: 'DUB-Dublin Airport',
						city32: 'EFL-Cephalonia International Airport',
						city33: 'ESB-Esenboga International Airport',
						city34: 'FAO-Faro International Airport',
						city35: 'FNC-Madeira Airport',
						city36: 'GCI-Guernsey Airport',
						city37: 'GDN-Gdansk Lech Walesa Airport',
						city38: 'GIB-Gibraltar International Airport or North Front Airport',
						city39: 'GOT-Göteborg Landvetter Airport',
						city40: 'GSE-Göteborg City Airport',
						city41: 'GVA-Geneva International Airport',
						city42: 'GZT-Gaziantep Oguzeli International Airport',
						city43: 'HAU-Haugesund Airport, Karmøy',
						city44: 'HER-Heraklion International Airport Nikos Kazantzakis',
						city45: 'HRK-Kharkiv International Airport',
						city46: 'HTA-Chita Kadala Airport',
						city47: 'IEV-Kyiv International Airport (Zhuliany)',
						city48: 'IFO-Ivano Frankivsk International Airport',
						city49: 'IKT-International Airport Irkutsk',
						city50: 'ILZ-¿ilina Airport',
						city51: 'INI-Ni¿ Constantine the Great Airport',
						city52: 'IOM-Isle of Man Airport',
						city53: 'IST-Istanbul Atatürk Airport',
						city54: 'JER-Jersey Airport',
						city55: 'JKH-Chios Island National Airport',
						city56: 'JMK-Mykonos Island National Airport',
						city57: 'JSI-Skiathos Airport Alexandros Papadiamantis',
						city58: 'JTR-Santorini (Thira) National Airport',
						city59: 'KBP-Boryspil International Airport',
						city60: 'KEF-Keflavík International Airport',
						city61: 'KGD-Khrabrovo Airport',
						city62: 'KGS-Kos Island International Airport Hippocrates',
						city63: 'KHV-Khabarovsk Novy Airport',
						city64: 'KIV-Chiinau International Airport',
						city65: 'KLX-Kalamata International Airport',
						city66: 'KRK-John Paul II International Airport Kraków Balice',
						city67: 'KRR-Krasnodar International Airport',
						city68: 'KSC-Ko¿ice International Airport',
						city69: 'KTW-Katowice International Airport',
						city70: 'KUF-Kurumoch International Airport',
						city71: 'KUN-Kaunas International Airport',
						city72: 'KVA-Kavala International Airport Alexander the Great',
						city73: 'KWG-Kryvyi Rih/Lozovatka International Airport',
						city74: 'KYA-Konya Airport (Turkish: Konya Havaalani)'					
					};
			}
	   		else if (country[ctryname] === 'EUE2-East Europe & Scandivanian K thru Z'){

				console.log('EUE2-East Europe & Scandivanian K thru Z- country[ctryname]',country[ctryname]);
				var cities =
					{
						city1: 'KZN-Kazan International Airport',
						city2: 'KZR-Zafer Airport',
						city3: 'LCJ-Lódz Wladyslaw Reymont Airport',
						city4: 'LED-Pulkovo Airport',
						city5: 'LIS-Lisbon Portela Airport',
						city6: 'LJU-Ljubljana Jo¿e Pucnik Airport',
						city7: 'LLA-Luleå Airport',
						city8: 'LUX-Luxembourg Findel Airport',
						city9: 'LWO-Lviv International Airport',
						city10: 'MJT-Mytilene International Airport (also known as Odysseas Elytis)',
						city11: 'MLA-Malta International Airport',
						city12: 'MLX-Erhaç Airport or Malatya Erhaç Airport (Turkish: Malatya Erhaç Havaalani)',
						city13: 'NAV-Nevsehir Kapadokya Airport',
						city14: 'NLV-Mykolaiv International Airport',
						city15: 'NRK-Norrköping Airport',
						city16: 'NYO-Stockholm Skavsta Airport',
						city17: 'ODS-Odessa International Airport',
						city18: 'OHD-Ohrid Airport',
						city19: 'ONQ-Zonguldak Airport',
						city20: 'OPO-Francisco Sá Carneiro Airport',
						city21: 'ORK-Cork Airport',
						city22: 'OSL-Oslo Airport',
						city23: 'OTP-Henri Coanda International Airport',
						city24: 'OVB-Novosibirsk Tolmachevo Airport',
						city25: 'OZH-Zaporizhia International Airport',
						city26: 'PDL-João Paulo II Airport',
						city27: 'PLQ-Palanga International Airport',
						city28: 'POW-Portoro¿ Airport (Slovene: Aerodrom Portoro¿)',
						city29: 'POZ-Poznan Lawica Henryk Wieniawski Airport',
						city30: 'PRN-Pristina International Airport Adem Jashari',
						city31: 'PVK-Aktion National Airport',
						city32: 'RHO-Rhodes International Airport, Diagoras',
						city33: 'RIX-Riga International Airport',
						city34: 'ROV-Rostov on Don Airport',
						city35: 'RYG-Moss Airport, Rygge',
						city36: 'RZE-Rzeszów Jasionka Airport',
						city37: 'SAW-Sabiha Gökçen International Airport',
						city38: 'SBZ-Sibiu International Airport or Aeroportul Interna?ional Sibiu',
						city39: 'SIP-Simferopol International Airport',
						city40: 'SKG-Thessaloniki International Airport Macedonia',
						city41: 'SKR-Skopje Airport',
						city42: 'SKU-Skyros Island National Airport',
						city43: 'SMI-Samos International Airport (also known as Aristarchos)',
						city44: 'SNN-Shannon Airport',
						city45: 'SOB-Hévíz Balaton Airport',
						city46: 'SQQ-¿iauliai International Airport',
						city47: 'SVG-Stavanger Airport, Sola',
						city48: 'SVO-Sheremetyevo International Airport',
						city49: 'SVX-Koltsovo Airport',
						city50: 'SZF-Samsun Çarsamba Airport',
						city51: 'SZZ-"Solidarity" Szczecin¿Goleniów Airport',
						city52: 'TBS-Tbilisi Airport',
						city53: 'TGD-Podgorica Airport',
						city54: 'TIV-Tivat Airport',
						city55: 'TOS-Tromsø Airport, Langnes',
						city56: 'TRF-Sandefjord Airport, Torp',
						city57: 'TSR-Timioara "Traian Vuia" International',
						city58: 'TZX-Trabzon Airport',
						city59: 'UKKM-Antonov Airport',
						city60: 'UME-Umeå Airport',
						city61: 'VBY-Visby Airport',
						city62: 'VKO-Vnukovo International Airport',
						city63: 'VNO-Vilnius Airport',
						city64: 'VNT-Ventspils International Airport',
						city65: 'VOL-Nea Anchialos National Airport',
						city66: 'VSG-Luhansk International Airport',
						city67: 'VST-Stockholm Västerås Airport',
						city68: 'VVO-Vladivostok International Airport',
						city69: 'VXO-Växjö Småland Airport',
						city70: 'WAW-Warsaw Chopin Airport',
						city71: 'WMI-Warsaw Modlin Mazovia Airport',
						city72: 'WRO-Wroclaw Copernicus Airport',
						city73: 'YEI-Yenisehir Airport',
						city74: 'YKS-Yakutsk Airport',
						city75: 'ZRH-Zurich Airport',
						city76: 'ZTH-Zakynthos International Airport'
					};
			}
			else if (country[ctryname] === 'GER-Germany'){

				console.log('GER-Germany - country[ctryname]',country[ctryname]);
    	        		var cities =
    	        			{       				
						city1: 'AAH-Merzbrück Airport (Aachen Merzbrück Airport)',
						city2: 'AOC-Leipzig Altenburg Airport (former Altenburg Nobitz Airport)',
						city3: 'AGB-Augsburg Airport',
						city4: 'FKB-Baden Airpark',
						city5: 'BER-Berlin Brandenburg Airport (under construction)',
						city6: 'SXF-Berlin Schönefeld Airport (closing 2014 or later)',
						city7: 'TXL-Berlin Tegel Airport (closing 2014 or later)',
						city8: 'BYU-Bindlacher Berg Airport (Bayreuth Airport)',
						city9: 'BBJ-Bitburg Airport',
						city10: 'BMK-Borkum Airfield',
						city11: 'BWE-Braunschweig Wolfsburg Airport',
						city12: 'BRE-Bremen Airport',
						city13: 'BRV-Bremerhaven Airport',
						city14: 'CGN-Cologne Bonn Airport',
						city15: 'DTM-Dortmund Airport',
						city16: 'DRS-Dresden Airport (Dresden Klotzsche Airport)',
						city17: 'DUS-Düsseldorf International Airport',
						city18: 'MGL-Düsseldorf Mönchengladbach Airport',
						city19: 'EME-Emden Airport',
						city20: 'ERF-Erfurt Weimar Airport',
						city21: 'FRA-Frankfurt Airport (Frankfurt am Main Airport) (Rhein Main Airport)',
						city22: 'FDH-Friedrichshafen Airport (Bodensee Airport, Friedrichshafen)',
						city23: 'GHF-Giebelstadt Airport / Giebelstadt Army Airfield',
						city24: 'HHN-Frankfurt Hahn Airport',
						city25: 'HAM-Hamburg Airport (Hamburg Fuhlsbüttel Airport)',
						city25: 'XFW-Hamburg Finkenwerder Airport',
						city26: 'HAJ-Hannover Langenhagen Airport',
						city27: 'HEI-Heide Büsum Airport',
						city28: 'HGL-Heligoland Airport (Helgoland-Düne Airport)',
						city29: 'HDF-Heringsdorf Airport',
						city30: 'HOQ-Hof Plauen Airport',
						city31: 'IGS-Ingolstadt Manching Airport',
						city32: 'KSF-Kassel Calden Airport',
						city33: 'KEL-Kiel Airport (Kiel Holtenau Airport)',
						city34: 'LHA-Black Forest Airport',
						city35: 'LEJ-Leipzig/Halle Airport (Schkeuditz Airport)',
						city36: 'LBC-Lübeck Airport (Lübeck Blankensee) (Hamburg Lübeck)',
						city37: 'CSO-Magdeburg Cochstedt Airport',
						city38: 'MHG-Mannheim City Airport',
						city39: 'FMM-Memmingen Airport (former Allgäu Airport/Memmingen)',
						city40: 'MUC-Munich Airport',
						city41: 'FMO-Münster Osnabrück International Airport',
						city42: 'FNB-Neubrandenburg Airport (de)',
						city43: 'NUE-Nuremberg Airport',
						city44: 'PAD-Paderborn Lippstadt Airport',
						city45: 'REB-Rechlin Lärz Airfield',
						city46: 'RLG-Rostock Laage Airport',
						city47: 'SCN-Saarbrücken Airport (Ensheim Airport)',
						city48: 'SGE-Siegerland Airport',
						city49: 'STR-Stuttgart Airport (was Stuttgart Army Airfield, Stuttgart Echterdingen Airport)',
						city50: 'NRN-Weeze Airport (Niederrhein Airport)',
						city51: 'GWT-Sylt Airport',
						city52: 'ZQW-Zweibrücken Airport',
						city53: 'ZCD-Bamberg Army Airfield (US Army) (de)',
						city54: 'FRZ-Fritzlar Air Base (Army)',
						city55: 'GKE-NATO Air Base Geilenkirchen (NATO)',
						city56: 'NDZ-Nordholz Air Base (Navy)',
						city57: 'QOE-Nörvenich Air Base (Air Force)',
						city58: 'RMS-Ramstein Air Base (U.S. Air Force)',
						city59: 'ZPQ-Rheine Bentlage Air Base (Army)',
						city60: 'WBG-Schleswig Air Base (Air Force)',
						city61: 'SPM-Spangdahlem Air Base (U.S. Air Force)',
						city62: 'WIE-Wiesbaden Army Airfield (U.S. Army)'
    	    				};
			
			}	
            		else if (country[ctryname] === 'CA1-Canada cities from A thru C'){

				console.log('CA1-Canada A thru C - country[ctryname]',country[ctryname]);
    	        		var cities =			            			
				{	    
					city1: 'YXX-Abbotsford, British Columbia',
                                        city2: 'LAK-Aklavik, Northwest Territories',
                                        city3: 'AKV-Akulivik, Quebec',
                                        city4: 'YLT-Alert, Nunavut',
                                        city5: 'YAL-Alert Bay, British Columbia',
                                        city6: 'YTF-Alma, Quebec',
                                        city7: 'YEY-Amos, Quebec',
                                        city8: 'YAA-Anahim Lake, British Columbia',
                                        city9: 'YAX-Wapekeka, Ontario',
                                        city10: 'YAB-Arctic Bay, Nunavut',
                                        city11: 'YYW-Armstrong, Ontario',
                                        city12: 'YEK-Arviat, Nunavut',
                                        city13: 'YIB-Atikokan, Ontario',
                                        city14: 'YAT-Attawapiskat, Ontario',
                                        city15: 'YPJ-Aupaluk, Quebec',
                                        city16: 'YBG-Bagotville, Quebec',
                                        city17: 'YBC-Baie Comeau, Quebec',
                                        city18: 'YBK-Baker Lake, Nunavut',
                                        city19: 'ZBF-Bathurst, New Brunswick',
                                        city20: 'XBE-Bearskin Lake, Ontario',
                                        city21: 'YXQ-Beaver Creek, Yukon',
                                        city22: 'YXQ-Beaver Creek, Yukon',
                                        city23: 'YBD-Bella Coola, British Columbia',
                                        city24: 'YBV-Berens River, Manitoba',
                                        city25: 'YTL-Big Trout Lake, Ontario',
                                        city26: 'YTZ-Toronto, Ontario',
                                        city27: 'YOS-Owen Sound, Ontario',
                                        city28: 'YBI-Black Tickle, Newfoundland and Labrador',
                                        city29: 'YCP-Blue River, British Columbia',
                                        city30: 'YDT-Bloodvein River, Manitoba',
                                        city31: 'YBO-Bob Quinn Lake, British Columbia',
                                        city32: 'YVB-Bonaventure, Quebec',
                                        city33: 'YBN-CFB Borden, Ontario',
                                        city34: 'YDT-Delta, British Columbia',
                                        city35: 'YBR-Brandon, Manitoba',
                                        city36: 'YFD-Brantford, Ontario',
                                        city37: 'YBT-Brochet, Manitoba',
                                        city38: 'XBR-Brockville, Ontario',
                                        city39: 'ZBM-Bromont, Quebec',
                                        city40: 'YVT-Buffalo Narrows, Saskatchewan',
                                        city41: 'YPZ-Burns Lake, British Columbia',
                                        city42: 'YDB-Burwash Landing, Yukon',
                                        city43: 'YKZ-Buttonville, Ontario',
                                        city44: 'YYC-Calgary, Alberta',
                                        city45: 'YBW-Calgary, Alberta',
                                        city46: 'YCB-Cambridge Bay, Nunavut',
                                        city47: 'YBL-Campbell River, British Columbia',
                                        city48: 'YTE-Cape Dorset, Nunavut',
                                        city49: 'YRP-Carp, Ontario',
                                        city50: 'YRF-Cartwright, Newfoundland and Labrador',
                                        city51: 'YCG-Castlegar, British Columbia',
                                        city52: 'YAC-Cat Lake, Ontario',
                                        city53: 'YCE-Centralia, Ontario',
                                        city54: 'YBG-Bagotville, Quebec',
                                        city55: 'YOD-Cold Lake, Alberta',
                                        city56: 'YQQ-Comox, British Columbia',
                                        city57: 'YYR-Happy Valley-Goose Bay, Newfoundland and Labrador',
                                        city58: 'YZX-Greenwood, Nova Scotia',
                                        city59: 'YMJ-Moose Jaw, Saskatchewan',
                                        city60: 'YAW-Shearwater, Nova Scotia',
                                        city61: 'YTR-Trenton, Ontario',
                                        city62: 'YLD-Chapleau, Ontario',
                                        city63: 'YML-Charlevoix, Quebec',
                                        city64: 'YCL-Charlo, New Brunswick',
                                        city65: 'YYG-Charlottetown, Prince Edward Island',
                                        city66: 'YHG-Charlottetown, Newfoundland and Labrador',
                                        city67: 'XCM-Chatham Kent, Ontario',
                                        city68: 'YCS-Chesterfield Inlet, Nunavut',
                                        city69: 'YCQ-Chetwynd, British Columbia',
                                        city70: 'YHR-Chevery, Quebec',
                                        city71: 'YMT-Chibougamau, Quebec',
                                        city72: 'CJH-Chilko Lake, British Columbia',
                                        city73: 'YCW-Chilliwack, British Columbia',
                                        city74: 'YKU-Chisasibi, Quebec',
                                        city76: 'YYQ-Churchill, Manitoba',
                                        city77: 'ZUM-Churchill Falls, Newfoundland and Labrador',
                                        city78: 'YCY-Clyde River, Nunavut',
                                        city79: 'YCN-Cochrane, Ontario',
                                        city80: 'YOD-Cold Lake, Alberta',
                                        city81: 'YCK-Colville Lake, Northwest Territories',
                                        city82: 'YZS-Coral Harbour, Nunavut',
                                        city83: 'YCC-Cornwall, Ontario',
                                        city84: 'YCF-Cortes Island, British Columbia',
                                        city85: 'YCA-Courtenay, British Columbia',
                                        city86: 'YXC-Cranbrook, British Columbia',
                                        city87: 'YCR-Cross Lake, Manitoba',   				
					city88: 'YDT-Bloodvein River, Manitoba'
        			};        			
            		}
            		else if (country[ctryname] === 'CA2-Canada cities from D thru G'){

				console.log('CA2-Canada D thru G - country[ctryname]',country[ctryname]);
    	        		var cities =			            			
				{	    
                                        city1: 'YDN-Dauphin, Manitoba',
                                        city2: 'YDA-Dawson City, Yukon',
                                        city3: 'YDQ-Dawson Creek, British Columbia',
                                        city4: 'YDL-Dease Lake, British Columbia',
                                        city5: 'YDF-Deer Lake, Newfoundland and Labrador',
                                        city6: 'YVZ-Deer Lake, Ontario',
                                        city7: 'YWJ-Deline, Northwest Territories',
                                        city8: 'ZEL-Bella Bella, British Columbia',
                                        city9: 'YDG-Digby, Nova Scotia',
                                        city10: 'YDO-Dolbeau Mistassini, Quebec',
                                        city11: 'YZD-Toronto, Ontario',
                                        city12: 'YHD-Dryden, Ontario',
                                        city13: 'DUQ-Duncan, British Columbia',
                                        city14: 'YXR-Earlton, Ontario',
                                        city15: 'ZEM-Eastmain, Quebec',
                                        city16: 'YXD-Edmonton, Alberta',
                                        city17: 'YEG-Nisku, Alberta',
                                        city18: 'YED-Edmonton, Alberta',
                                        city19: 'ZVL-Villeneuve, Alberta',
                                        city20: 'YET-Edson, Alberta',
                                        city21: 'YEL-Elliot Lake, Ontario',
                                        city22: 'YEN-Estevan, Saskatchewan',
                                        city23: 'YEU-Eureka, Nunavut',
                                        city24: 'YCZ-Fairmont Hot Springs, British Columbia',
                                        city25: 'ZFA-Faro, Yukon',
                                        city26: 'YFO-Flin Flon, Manitoba',
                                        city27: 'ZFD-Fond du Lac, Saskatchewan',
                                        city28: 'YFE-Forestville, Quebec',
                                        city29: 'YFA-Fort Albany, Ontario',
                                        city30: 'YPY-Fort Chipewyan, Alberta',
                                        city31: 'YAG-Fort Frances, Ontario',
                                        city32: 'YGH-Fort Good Hope, Northwest Territories',
                                        city33: 'YFH-Fort Hope, Ontario',
                                        city34: 'YJF-Fort Liard, Northwest Territories',
                                        city35: 'YMM-Fort McMurray, Alberta',
                                        city36: 'ZFM-Fort McPherson, Northwest Territories',
                                        city37: 'YYE-Fort Nelson, British Columbia',
                                        city38: 'YFR-Fort Resolution, Northwest Territories',
                                        city39: 'YER-Fort Severn, Ontario',
                                        city40: 'YFS-Fort Simpson, Northwest Territories',
                                        city41: 'YSM-Fort Smith, Northwest Territories',
                                        city42: 'YJM-Fort St. James, British Columbia',
                                        city43: 'YXJ-Fort St. John, British Columbia',
                                        city44: 'YFX-Fox Harbour, Nova Scotia',
                                        city45: 'YFC-Fredericton, New Brunswick',
                                        city46: 'YCX-Oromocto (CFB Gagetown), New Brunswick',
                                        city47: 'YRA-Gameti, Northwest Territories',
                                        city48: 'YQX-Gander, Newfoundland and Labrador',
                                        city49: 'YGG-Ganges, British Columbia',
                                        city50: 'YGP-Gaspé, Quebec',
                                        city51: 'YND-Gatineau, Quebec',
                                        city52: 'YGQ-Geraldton, Ontario',
                                        city53: 'YGX-Gillam, Manitoba',
                                        city54: 'YGM-Gimli, Manitoba',
                                        city55: 'YHK-Gjoa Haven, Nunavut',
                                        city56: 'YGD-Goderich, Ontario',
                                        city57: 'YGO-Gods Lake Narrows, Manitoba',
                                        city58: 'ZGI-Gods River, Manitoba',
                                        city59: 'YGE-Golden, British Columbia',
                                        city60: 'YYR-Happy Valley-Goose Bay, Newfoundland and Labrador',
                                        city61: 'YZE-Gore Bay, Ontario',
                                        city62: 'ZGF-Grand Forks, British Columbia',
                                        city63: 'YQU-Grande Prairie, Alberta',
                                        city64: 'DAS-Plummers Great Bear Lake Lodge, Northwest Territories',
                                        city65: 'YFC-Fredericton, New Brunswick',
                                        city66: 'YQM-Moncton, New Brunswick',
                                        city67: 'YSB-Greater Sudbury, Ontario',
                                        city68: 'YZX-Greenwood, Nova Scotia',
                                        city69: 'YGZ-Grise Fiord, Nunavut',
        			};        			
            		}
            		else if (country[ctryname] === 'CA3-Canada cities from H thru M'){

				console.log('CA3-Canada H thru M - country[ctryname]',country[ctryname]);
    	        		var cities =			            			
				{	    
                                        city1: 'YHT-Haines Junction, Yukon',
                                        city2: 'YHZ-Halifax Regional Municipality, Nova Scotia',
                                        city3: 'YAW-Shearwater, Nova Scotia',
                                        city4: 'YUX-Hall Beach, Nunavut',
                                        city5: 'YHM-Hamilton, Ontario',										
                                        city6: 'YTB-Hartley Bay, British Columbia',
                                        city7: 'YGV-Havre-Saint Pierre, Quebec',
                                        city8: 'YHY-Hay River, Northwest Territories',
                                        city9: 'YHF-Hearst, Ontario',
                                        city10: 'YOJ-High Level, Alberta',
                                        city11: 'YHE-Hope, British Columbia',
                                        city12: 'YHO-Hopedale, Newfoundland and Labrador',
                                        city13: 'YHN-Hornepayne, Ontario',
                                        city14: 'YHB-Hudson Bay, Saskatchewan',
                                        city15: 'YNH-Hudsons Hope, British Columbia',
                                        city16: 'YGT-Igloolik, Nunavut',
                                        city17: 'ZUC-Ignace, Ontario',
                                        city17: 'ILF-Ilford, Manitoba',
                                        city19: 'YPH-Inukjuak, Quebec',
                                        city20: 'YEV-Inuvik, Northwest Territories',
                                        city21: 'YFB-Iqaluit, Nunavut',
                                        city22: 'YIV-Island Lake, Manitoba',
                                        city23: 'YGR-Magdalen Islands, Quebec',
                                        city24: 'YIK-Ivujivik, Quebec',
                                        city25: 'YQY-Sydney, Nova Scotia',
                                        city26: 'YQB-Quebec City, Quebec',
                                        city27: 'ZJG-Jenpeg, Manitoba',
                                        city28: 'YHM-Hamilton, Ontario',
                                        city29: 'YKA-Kamloops, British Columbia',
                                        city30: 'XGR-Kangiqsualujjuaq, Quebec',
                                        city31: 'YKG-Kangirsuk, Quebec',
                                        city32: 'YYU-Kapuskasing, Ontario',
                                        city33: 'XKS-Kasabonika, Ontario',
                                        city34: 'ZKE-Kashechewan First Nation, Ontario',
                                        city35: 'YAU-Kattiniq, Quebec',
                                        city36: 'KEW-Keewaywin, Ontario',
                                        city37: 'YLW-Kelowna, British Columbia',
                                        city38: 'KES-Kelesy, Manitoba',
                                        city39: 'YQK-Kenora, Ontario',
                                        city40: 'YKJ-Key Lake, Saskatchewan',
                                        city41: 'YLC-Kimmirut, Nunavut',
                                        city42: 'YKD-Kincardine, Ontario',
                                        city43: 'YKY-Kindersley, Saskatchewan',
                                        city44: 'KIF-Kingfisher Lake, Ontario',
					city45: 'YGK-Kingston, Ontario',
                                        city46: 'YKX-Kirkland Lake, Ontario',
                                        city47: 'YKF-Regional Municipality of Waterloo, Ontario',
                                        city48: 'YBB-Kugaaruk, Nunavut',
                                        city49: 'YCO-Kugluktuk, Nunavut',
                                        city45: 'YVP-Kuujjuaq, Quebec',
                                        city46: 'YGW-Kuujjuarapik, Quebec',
                                        city47: 'YGL-Radisson, Quebec',
                                        city48: 'YAH-La Grande-4 generating station, Quebec',
                                        city49: 'YVC-La Ronge, Saskatchewan',
                                        city50: 'SSQ-La Sarre, Quebec',
                                        city51: 'ZLT-La Tabatière, Quebec',
                                        city52: 'YLQ-La Tuque, Quebec',
                                        city53: 'XLB-Lac Brochet, Manitoba',
                                        city54: 'YNJ-Langley, British Columbia',
                                        city55: 'YLH-Lansdowne House, Ontario',
                                        city56: 'YLR-Leaf Rapids, Manitoba',
                                        city57: 'YLS-Lebel sur Quévillon, Quebec',
                                        city58: 'YQL-Lethbridge, Alberta',
                                        city59: 'ZGR-Little Grand Rapids, Manitoba',
                                        city60: 'YLL-Lloydminster, Alberta',
                                        city61: 'YXU-London, Ontario',
                                        city62: 'YBX-Blanc Sablon, Quebec',
                                        city63: 'YYL-Lynn Lake, Manitoba',
                                        city64: 'YOW-Ottawa, Ontario',
                                        city65: 'YZY-Mackenzie, British Columbia',
                                        city66: 'YMN-Makkovik, Newfoundland and Labrador',
                                        city67: 'YMG-Manitouwadge, Ontario',
                                        city68: 'YEM-Manitowaning, Ontario',
                                        city69: 'YMW-Maniwaki, Quebec',
                                        city70: 'YSP-Marathon, Ontario',
                                        city71: 'YMH-Marys Harbour, Newfoundland and Labrador',
                                        city72: 'ZMT-Masset, British Columbia',
                                        city73: 'YNM-Matagami, Quebec',
                                        city74: 'YME-Matane, Quebec',
                                        city75: 'YMA-Mayo, Yukon',
                                        city76: 'YBR-Brandon, Manitoba',
                                        city77: 'YLJ-Meadow Lake, Saskatchewan',
                                        city78: 'YXH-Medicine Hat, Alberta',
					city79: 'YMB-Merritt, British Columbia',
                                        city80: 'YEE-Midland, Ontario',
                                        city81: 'YCH-Miramichi, New Brunswick',
                                        city82: 'YQM-Moncton, New Brunswick',
                                        city83: 'YYY-Mont Joli, Quebec',
                                        city84: 'YHU-Longueuil, Quebec',
                                        city85: 'YMX-Montreal, Quebec',
                                        city86: 'YUL-Montreal, Quebec',
                                        city87: 'YMJ-Moose Jaw, Saskatchewan',
                                        city88: 'YMO-Moosonee, Ontario',
                                        city89: 'YQA-Muskoka, Ontario',
                                        city90: 'MSA-Muskrat Dam, Ontario',
        			};        			
            		}
            		else if (country[ctryname] === 'CA4-Canada cities from N thru P'){

				console.log('CA4-Canada N thru P - country[ctryname]',country[ctryname]);
    	        		var cities =			            			
				{	    
                                        city1: 'YDP-Nain, Newfoundland and Labrador',
                                        city2: 'YQN-Nakina, Ontario',
                                        city3: 'YCD-Nanaimo, British Columbia',
                                        city4: 'ZNA-Nanaimo Harbour, British Columbia',
                                        city5: 'YNA-Natashquan, Quebec',
                                        city6: 'YNS-Nemaska, Quebec',
                                        city7: 'YBU-Nipawin, Saskatchewan',
                                        city8: 'YVQ-Norman Wells, Northwest Territories',
                                        city9: 'YQW-North Battleford, Saskatchewan',
                                        city10: 'YYB-North Bay, Ontario',
                                        city11: 'YXJ-Fort St. John, British Columbia',
                                        city12: 'YNO-North Spirit Lake, Ontario',
                                        city13: 'YXT-Terrace and Kitimat, British Columbia',
                                        city14: 'YNE-Norway House, Manitoba',
                                        city15: 'YDW-North of Sixty Fishing Camps, Northwest Territories',
                                        city16: 'ZOF-Ocean Falls, British Columbia',
                                        city17: 'YOG-Ogoki Post, Ontario',
                                        city18: 'YOC-Old Crow, Yukon',
                                        city19: 'ZMH-108 Mile Ranch, British Columbia',
                                        city20: 'YOO-Oshawa, Ontario',
                                        city21: 'YRP-Carp, Ontario',
                                        city22: 'YND-Gatineau, Quebec',
                                        city23: 'YOW-Ottawa, Ontario',
                                        city24: 'YRO-Ottawa, Ontario',
                                        city25: 'YOS-Owen Sound, Ontario',
                                        city26: 'YOH-Oxford House, Manitoba',
                                        city27: 'YXP-Pangnirtung, Nunavut',
                                        city28: 'YPD-Parry Sound, Ontario',
                                        city29: 'YPC-Paulatuk, Northwest Territories',
                                        city30: 'YPE-Peace River, Alberta',
                                        city31: 'YYZ-Toronto, Ontario',
                                        city32: 'YPO-Peawanuck, Ontario',
                                        city33: 'YTA-Pembroke, Ontario',
                                        city34: 'YPT-Pender Harbour, British Columbia',
                                        city35: 'YYF-Penticton, British Columbia',
                                        city36: 'YWA-Petawawa, Ontario',
                                        city37: 'YPQ-Peterborough, Ontario',
                                        city38: 'YPL-Pickle Lake, Ontario',
                                        city39: 'YPM-Pikangikum, Ontario',
                                        city40: 'PIW-Pikwitonei, Manitoba',
                                        city41: 'YPK-Pitt Meadows, British Columbia',
                                        city42: 'YNL-Points North Landing, Saskatchewan',
                                        city43: 'N/A-Pokemouche, New Brunswick',
                                        city44: 'YIO-Pond Inlet, Nunavut',
                                        city45: 'YHP-Poplar Hill, Ontario',
                                        city46: 'XPP-Poplar River, Manitoba',
                                        city47: 'YPB-Port Alberni, British Columbia',
                                        city48: 'YZT-Port Hardy, British Columbia',
                                        city49: 'YPS-Port Hawkesbury, Nova Scotia',
                                        city50: 'YHA-Port Hope Simpson, Newfoundland and Labrador',
                                        city51: 'YMP-Port McNeill, British Columbia',
                                        city52: 'YPI-Port Simpson, British Columbia',
                                        city53: 'YPG-Portage la Prairie, Manitoba',
                                        city54: 'YPN-Port-Menier, Quebec',
                                        city55: 'YSO-Postville, Newfoundland and Labrador',
                                        city56: 'WPL-Powell Lake, British Columbia',
                                        city57: 'YPW-Powell River, British Columbia',
        			};        			
            		}
                        else if (country[ctryname] === 'USA1-United States Of America (A thru E)'){

				console.log('USA1-United States America - country[ctryname]',country[ctryname]);
                                var cities =
                                {
					city1: 'ABE-Lehigh Valley International Airport',
					city1: 'ABI-Abilene Regional Airport',
					city2: 'ABQ-Albuquerque International Sunport',
					city3: 'ABR-Aberdeen Regional Airport',
					city4: 'ABY-Southwest Georgia Regional Airport',
					city5: 'ACK-Nantucket Memorial Airport',
					city6: 'ACT-Waco Regional Airport',
					city7: 'ACV-Arcata Airport',
					city8: 'ACY-Atlantic City International Airport',
					city9: 'ADQ-Kodiak Airport',
					city10: 'AEX-Alexandria International Airport',
					city11: 'AGS-Augusta Regional Airport (Bush Field)',
					city12: 'AKN-King Salmon Airport',
					city13: 'ALB-Albany International Airport',
					city13: 'ALI-Alice International Airport',
					city14: 'ALO-Waterloo Regional',
					city15: 'ALW-Walla Walla Regional Airport',
					city16: 'AMA-Rick Husband Amarillo International Airport',
					city17: 'ANC-Ted Stevens Anchorage International Airport',
					city18: 'ANI-Aniak Airport',
					city19: 'ART:Watertown International Airport',
					city20: 'ASE-Aspen Pitkin County Airport (Sardy Field)',
					city21: 'ATL-Hartsfield Jackson Atlanta International Airport',
					city22: 'ATW-Outagamie County Regional Airport',
					city23: 'AUS-Austin Bergstrom International Airport',
					city24: 'AVL-Asheville Regional Airport',
					city25: 'AVP-Wilkes Barre/Scranton International Airport',
					city26: 'AZO-Kalamazoo/Battle Creek International Airport',
					city27: 'BBG-Branson Airport (opened May 2009)',
					city28: 'BDL-Bradley International Airport',
					city29: 'BDL-Bradley International Airport',
					city30: 'BET-Bethel Airport (also see Bethel Seaplane Base)',
					city31: 'BFI-King County International Airport (Boeing Field)',
					city32: 'BFL-Bakersfield Meadows Field',
					city33: 'BFL-Meadows Field',
					city34: 'BGM-Greater Binghamton Airport (Edwin A. Link Field)',
					city35: 'BGR-Bangor International Airport',
					city36: 'BHB-Hancock County Bar Harbor Airport',
					city37: 'BHM-Birmingham Shuttlesworth International Airport',
					city38: 'BIL-Billings Logan International Airport',
					city39: 'BIS-Bismarck Municipal Airport',
					city40: 'BJI-Bemidji Regional Airport',
					city41: 'BLI-Bellingham International Airport',
					city42: 'BMI-Central Illinois Regional Airport at Bloomington Normal',
					city43: 'BNA-Nashville International Airport (Berry Field)',
					city44: 'BOI-Boise Airport (Boise Air Terminal) (Gowen Field)',
					city45: 'BOS-Gen. Edward Lawrence Logan International Airport',
					city46: 'BPT-Jack Brooks Regional Airport (was Southeast Texas Regional)',
					city47: 'BQK-Brunswick Golden Isles Airport',
					city48: 'BQN-Rafael Hernández International Airport',
					city49: 'BRD-Brainerd Lakes Regional Airport',
					city50: 'BRO-Brownsville/South Padre Island International Airport',
					city51: 'BRW-Wiley Post Will Rogers Memorial Airport',
					city52: 'BTM-Bert Mooney Airport',
					city53: 'BTR-Baton Rouge Metropolitan Airport (Ryan Field)',
					city54: 'BTV-Burlington International Airport',
					city55: 'BUF-Buffalo Niagara International Airport',
					city56: 'BUR-Bob Hope Airport',
					city57: 'BVU-Boulder City Municipal Airport',
					city58: 'BWI-Baltimore/Washington International Thurgood Marshall Airport',
					city59: 'BZN-Bozeman Yellowstone International Airport (was Gallatin Field Airport)',
					city60: 'CAE-Columbia Metropolitan Airport',
					city61: 'CAK-Akron Fulton International Airport',
					city62: 'CDV-Merle K. (Mudhole) Smith Airport',
					city63: 'CEC-Del Norte County Airport (Jack McNamara Field)',
					city64: 'CHA-Chattanooga Metropolitan Airport (Lovell Field)',
					city65: 'CHO-Charlottesville Albemarle Airport',
					city66: 'CHS-Glasgow International Airportort / Charleston AFB',
					city67: 'CIC-Chico Municipal Airport',
					city68: 'CID-The Eastern Iowa Airport',
					city69: 'CIU-Chippewa County International Airport',
					city70: 'CKB-North Central West Virginia Airport (was Harrison Marion Regional)',
					city71: 'CLE-Cleveland Hopkins International Airport',
					city72: 'CLL-Easterwood Airport (Easterwood Field)',
					city73: 'CLM-William R. Fairchild International Airport',
					city74: 'CLT-Charlotte/Douglas International Airport',
					city75: 'CMH-Port Columbus International Airport',
					city76: 'CMI-University of Illinois Willard Airport',
					city77: 'CMX-Houghton County Memorial Airport',
					city78: 'COD-Yellowstone Regional Airport',
					city79: 'COS-City of Colorado Springs Municipal Airport',
					city80: 'COU-Columbia Regional Airport',
					city81: 'CPR-Casper/Natrona County International Airport',
					city82: 'CRP-Corpus Christi International Airport',
					city83: 'CRQ-McClellan Palomar Airport',
					city84: 'CRW-Yeager Airport',
					city85: 'CSG-Columbus Airport (Columbus Metropolitan Airport)',
					city86: 'CVG-Cincinnati/Northern Kentucky International Airport',
					city87: 'CVX-Charlevoix Municipal Airport',
					city88: 'CWA-Central Wisconsin Airport',
					city89: 'CWF-Chennault International Airport',
					city90: 'CXL-Calexico Calexico International Airport',
					city91: 'CYS-Cheyenne Regional Airport',
					city92: 'DAB-Daytona Beach International Airport',
					city93: 'DAL-Dallas Love Field',
					city94: 'DAY-James M. Cox Dayton International Airport',
					city95: 'DBQ-Dubuque Regional Airport',
					city96: 'DCA-Ronald Reagan Washington National Airport',
					city97: 'DEN-Denver International Airport',
					city98: 'DFW-Dallas/Fort Worth International Airport',
					city99: 'DHN-Dothan Regional Airport',
					city100: 'DLG-Dillingham Airport',
					city101: 'DLH-Duluth International Airport',
					city102: 'DRO-Durango La Plata County Airport',
					city103: 'DRT-Del Rio International Airport',
					city104: 'DSM-Des Moines International Airport',
					city105: 'DTW-Detroit Metropolitan Wayne County Airport',
					city106: 'DUT-Unalaska Airport (Tom Madsen Airport)',
					city107: 'EAT-Pangborn Memorial Airport',
					city109: 'EAU-Chippewa Valley Regional Airport',
					city110: 'ECP-Northwest Florida Beaches International Airport',
					city111: 'ECP-Northwest Florida Beaches International Airport',
					city112: 'EGE-Eagle County Regional Airport',
					city113: 'EGP-Maverick County Memorial International Airport',
					city114: 'EKO-Elko Regional Airport (J.C. Harris Field)',
					city115: 'ELM-Elmira/Corning Regional Airport',
					city116: 'ELP-El Paso International Airport',
					city117: 'ENA-Kenai Municipal Airport',
					city118: 'ENM-Emmonak Airport',
					city119: 'ENV-Wendover Airport (charter flights)',
					city120: 'ERI-Erie International Airport (Tom Ridge Field)',
					city121: 'EUG-Eugene Airport (Mahlon Sweet Field)',
					city122: 'EVV-Evansville Regional Airport',
					city123: 'EWB-New Bedford Regional Airport',
					city124: 'EWN-Coastal Carolina Regional Airport (was Craven County Regional)',
					city125: 'EWR-Newark Liberty International Airport',
					city126: 'EYW-Key West International Airport'
                                };
                        }
                        else if (country[ctryname] === 'USA2-United States Of America (F thru L)'){
                                console.log('USA2-United States Of America (F thru L)',country[ctryname]);
                                var cities =
                                {
					city1: 'FAI-Fairbanks International Airport',
					city2: 'FAR-Hector International Airport',
					city3: 'FAT-Fresno Yosemite International Airport',
					city4: 'FAY-Fayetteville Regional Airport (Grannis Field)',
					city5: 'FHR-Friday Harbor Airport',
					city6: 'FLG-Flagstaff Pulliam Airport',
					city7: 'FLL-Fort Lauderdale Hollywood International Airport',
					city8: 'FLO-Florence Regional Airport',
					city9: 'FMN-Four Corners Regional Airport',
					city10: 'FNL-Fort Collins Loveland Municipal Airport (scheduled service ended in 2012)',
					city11: 'FNT-Bishop International Airport',
					city12: 'FOD-Fort Dodge Regional Airport',
					city13: 'FSD-Sioux Falls Regional Airport (Joe Foss Field)',
					city14: 'FSM-Fort Smith Regional Airport',
					city15: 'FTW-Fort Worth Meacham International Airport',
					city16: 'FWA-Fort Wayne International Airport',
					city17: 'GAL-Edward G. Pitka Sr. Airport',
					city18: 'GCC-GilletteCampbell County Airport',
					city19: 'GCK-Garden City Regional Airport',
					city20: 'GCN-Grand Canyon National Park Airport',
					city21: 'GCW-Grand Canyon West Airport',
					city22: 'GEG-Spokane International Airport (Geiger Field)',
					city23: 'GFK-Grand Forks International Airport',
					city24: 'GGG-East Texas Regional Airport',
					city25: 'GGW:Glasgow International Airport',
					city26: 'GJT-Grand Junction Regional Airport (Walker Field)',
					city27: 'GNV-Gainesville Regional Airport',
					city28: 'GPI-Glacier Park International Airport',
					city29: 'GPT-Gulfport Biloxi International Airport',
					city30: 'GRB-Austin Straubel International Airport',
					city31: 'GRI-Central Nebraska Regional Airport',
					city32: 'GRK-Killeen Fort Hood Regional Airport / Robert Gray Army Airfield',
					city33: 'GRO-Rota International Airport',
					city34: 'GRR-Gerald R. Ford International Airport',
					city35: 'GSN-Saipan International Airport (Francisco C. Ada)',
					city36: 'GSO-Piedmont Triad International Airport',
					city37: 'GSP-Greenville Spartanburg International Airport (Roger Milliken Field)',
					city38: 'GTF-Great Falls International Airport',
					city39: 'GTR-Golden Triangle Regional Airport',
					city40: 'GUC-Gunnison Crested Butte Regional Airport',
					city41: 'GUM-Antonio B. Won Pat International Airport',
					city42: 'HDN-Yampa Valley Airport (Yampa Valley Regional)',
					city43: 'HGR-Hagerstown Regional Airport (Richard A. Henson Field)',
					city44: 'HIB-Range Regional Airport (Chisholm Hibbing Airport)',
					city45: 'HLN-Helena Regional Airport',
					city46: 'HNH-Hoonah Airport (also see Hoonah Seaplane Base)',
					city47: 'HNL-Honolulu International Airport / Hickam',
					city48: 'HOM-Homer Airport',
					city49: 'HOU-William P. Hobby Airport',
					city50: 'HPN-Westchester County Airport',
					city51: 'HRL-Valley International Airport',
					city52: 'HSV-Huntsville International Airport (Carl T. Jones Field)',
					city53: 'HTS-Tri State Airport (Milton J. Ferguson Field)',
					city54: 'HUL:Houlton International Airport',
					city55: 'HVN-Tweed New Haven Regional Airport (was Tweed New Haven Airport)',
					city56: 'HXD-Hilton Head Airport',
					city57: 'HYA-Barnstable Municipal Airport (Boardman/Polando Field)',
					city58: 'IAD-Washington Dulles International Airport',
					city59: 'IAG-Niagara Falls International Airport',
					city60: 'IAH-George Bush Intercontinental Airport',
					city61: 'ICT-Wichita Mid Continent Airport',
					city62: 'IDA-Idaho Falls Regional Airport (Fanning Field)',
					city63: 'IFP-Laughlin/Bullhead International Airport',
					city64: 'ILM-Wilmington International Airport',
					city65: 'IND-Indianapolis International Airport',
					city66: 'INL-Falls International Airport',
					city67: 'IPT-Williamsport Regional Airport',
					city68: 'ISN-Sloulin Field International Airport',
					city69: 'ISP-Long Island MacArthur Airport',
					city70: 'ITH-Ithaca Tompkins Regional Airport',
					city71: 'ITO-Hilo International Airport',
					city72: 'IWA-Phoenix Mesa Gateway Airport',
					city73: 'IYK-Inyokern Airport',
					city74: 'JAC-Jackson Hole Airport',
					city75: 'JAN-Jackson Evers International Airport',
					city76: 'JAN-Jackson Medgar Wiley Evers International Airport',
					city77: 'JAX-Jacksonville International Airport',
					city78: 'JFK-John F. Kennedy International Airport',
					city79: 'JNU-Juneau International Airport',
					city80: 'KOA-Kona International Airport at Keahole',
					city82: 'KTN-Ketchikan International Airport',
					city83: 'LAN-Capital Region International Airport (was Lansing Capital City)',
					city84: 'LAR-Laramie Regional Airport',
					city85: 'LAS-McCarran International Airport',
					city86: 'LAW-Lawton Fort Sill Regional Airport',
					city87: 'LAX-Los Angeles International Airport',
					city88: 'LBB-Lubbock Preston Smith International Airport',
					city89: 'LCH-Lake Charles Regional Airport',
					city90: 'LCK-Columbus Rickenbacker International Airport',
					city100: 'LEX-Blue Grass Airport',
					city101: 'LFT-Lafayette Regional Airport',
					city102: 'LGA-LaGuardia Airport (and Marine Air Terminal)',
					city103: 'LGB-Long Beach Airport (Daugherty Field)',
					city104: 'LIH-Lihue Airport (Lihue Airport)',
					city105: 'LIT-Bill and Hillary Clinton National Airport (Adams Field) (was Little Rock National)',
					city106: 'LMT-Klamath Falls Airport (Kingsley Field)',
					city107: 'LNK-Lincoln Airport (was Lincoln Municipal)',
					city108: 'LNY-Lanai Airport (Lanai Airport)',
					city109: 'LRD-Laredo International Airport',
					city110: 'LRU-Las Cruces International Airport',
					city111: 'LSE-La Crosse Regional Airport',
					city112: 'LWB-Greenbrier Valley Airport',
					city113: 'LWS-Lewiston Nez Perce County Airport',
					city114: 'LYH-Lynchburg Regional Airport (Preston Glenn Field)'
                                };
                        }
                        else if (country[ctryname] === 'USA3-United States Of America (M thru R)'){
                        	console.log('USA3-United States Of America (M thru R)')
                                var cities =
                                {
					city1: 'MAF-Midland International Airport',
					city2: 'MBA-Manokotak Airport',
					city3: 'MBS-International Airport',
					city4: 'MCI-Kansas City International Airport',
					city5: 'MCO-Orlando International Airport',
					city6: 'MCW-Mason City Municipal Airport',
					city7: 'MDT-Harrisburg International Airport',
					city8: 'MDW-Chicago Midway International Airport',
					city9: 'MEI-Meridian Regional Airport (Key Field)',
					city10: 'MEM-Memphis International Airport',
					city11: 'MFE-McAllen Miller International Airport (McAllen Miller International)',
					city12: 'MFR-Rogue Valley International Medford Airport',
					city13: 'MGM-Montgomery Regional Airport',
					city14: 'MGW-Morgantown Municipal Airport (Walter L. Bill Hart Field)',
					city15: 'MHK-Manhattan Regional Airport',
					city16: 'MHT-Manchester Boston Regional Airport',
					city18: 'MIA-Miami International Airport',
					city19: 'MKE-General Mitchell International Airport',
					city20: 'MKG-Muskegon County Airport',
					city21: 'MKK-Molokai Airport (Molokai Airport)',
					city22: 'MLB-Melbourne International Airport',
					city23: 'MLI-Quad City International Airport',
					city24: 'MLU-Monroe Regional Airport',
					city25: 'MMH-Mammoth Yosemite Airport',
					city26: 'MOB-Mobile Regional Airport',
					city27: 'MOD-Modesto City County Airport (Harry Sham Field)',
					city28: 'MOT-Minot International Airport',
					city29: 'MRI-Merrill Field',
					city30: 'MRY-Monterey Regional Airport (was Monterey Peninsula Airport)',
					city31: 'MSN-Dane County Regional Airport (Truax Field)',
					city32: 'MSO-Missoula International Airport',
					city33: 'MSP-Minneapolis St. Paul International Airport (Wold Chamberlain Field)',
					city34: 'MSS-Massena International Airport',
					city35: 'MSV-Sullivan County International Airport',
					city36: 'MSY-Louis Armstrong New Orleans International Airport',
					city37: 'MTJ-Montrose Regional Airport',
					city38: 'MVY-Marthas Vineyard Airport',
					city39: 'MWH-Grant County International Airport',
					city40: 'MYR-Myrtle Beach International Airport',
					city41: 'OAJ-Albert J. Ellis Airport',
					city42: 'OAK-Oakland International Airport',
					city43: 'OAK-Oakland International Airport',
					city44: 'OGG-Kahului Airport',
					city45: 'OGS-Ogdensburg International Airport',
					city46: 'OKC-Will Rogers World Airport',
					city47: 'OMA-Eppley Airfield',
					city48: 'OME-Nome Airport',
					city49: 'ONT-Ontario International Airport',
					city50: 'ORD-Chicago OHare International Airport',
					city51: 'ORF-Norfolk International Airport',
					city52: 'ORH-Worcester Regional Airport',
					city53: 'OTH-Southwest Oregon Regional Airport (was North Bend Municipal)',
					city54: 'OTZ-Ralph Wien Memorial Airport',
					city55: 'OWB-Owensboro Daviess County Regional Airport',
					city56: 'PAH-Barkley Regional Airport',
					city57: 'PBG-Plattsburgh International Airport',
					city58: 'PBI-Palm Beach International Airport',
					city59: 'PDX-Portland International Airport',
					city60: 'PGA-Page Municipal Airport',
					city61: 'PGD-Punta Gorda Airport (was Charlotte County Airport)',
					city62: 'PGV-Pitt Greenville Airport',
					city63: 'PHF-Newport News/Williamsburg International Airport',
					city64: 'PHL-Philadelphia International Airport',
					city65: 'PHL-Philadelphia International Airport',
					city66: 'PHN-St. Clair County International Airport',
					city67: 'PHX-Phoenix Sky Harbor International Airport',
					city68: 'PHX-Phoenix Sky Harbor International Airport',
					city69: 'PIA-General Downing  Peoria International Airport(was Greater Peoria Regional Airport)',
					city70: 'PIA-General Wayne A. Downing Peoria International Airport',
					city71: 'PIB-Hattiesburg Laurel Regional Airport',
					city72: 'PIE-St. Petersburg Clearwater International Airport',
					city73: 'PIH-Pocatello Regional Airport',
					city74: 'PIR-Pierre Regional Airport',
					city75: 'PIT-Pittsburgh International Airport',
					city76: 'PLN-Pellston Regional Airport of Emmet County',
					city77: 'PNS-Pensacola International Airport',
					city78: 'PNS-Pensacola International Airport (Pensacola Gulf Coast Regional Airport)',
					city79: 'PPG-Pago Pago International Airport',
					city80: 'PQI-Northern Maine Regional Airport at Presque Isle',
					city81: 'PSC-Tri Cities Airport',
					city82: 'PSE-Mercedita International Airport',
					city83: 'PSG-Petersburg James A. Johnson Airport',
					city84: 'PSM-Portsmouth International Airport at Pease',
					city85: 'PSP-Palm Springs International Airport',
					city86: 'PSP-Palm Springs International Airport',
					city87: 'PTK-Oakland County International Airport',
					city88: 'PUB-Pueblo Memorial Airport',
					city89: 'PUW-Pullman/Moscow Regional Airport',
					city90: 'PVC-Provincetown Municipal Airport',
					city91: 'PVD-Theodore Francis Green State Airport',
					city92: 'PVU-Provo Municipal Airport',
					city93: 'PWM-Portland International Jetport',
					city94: 'RAP-Rapid City Regional Airport',
					city95: 'RDD-Redding Municipal Airport',
					city96: 'RDM-Redmond Municipal Airport (Roberts Field)',
					city97: 'RDU-Raleigh Durham International Airport',
					city98: 'RFD-Chicago Rockford International Airport',
					city99: 'RHI-Rhinelander Oneida County Airport',
					city100: 'RIC-Richmond International Airport (Byrd Field)',
					city101: 'RIW-Riverton Regional Airport',
					city102: 'RKD-Knox County Regional Airport',
					city103: 'RKS-Rock Springs Sweetwater County Airport',
					city104: 'RNO-Reno/Tahoe International Airport',
					city105: 'ROA-Roanoke Regional Airport (Woodrum Field)',
					city106: 'ROC-Greater Rochester International Airport',
					city107: 'ROW-Roswell International Air Center',
					city108: 'RST-Rochester International Airport',
					city109: 'RSW-Southwest Florida International Airport',
                                };
			}
                        else if (country[ctryname] === 'USA4-United States Of America (S thru Y)'){
                        	console.log('USA-United States Of America (S thru Y)')
                                var cities =
                                {
					city1: 'SAF-Santa Fe Municipal Airport (scheduled passenger service resumed 2009)',
					city2: 'SAN-San Diego International Airport',
					city3: 'SAT-San Antonio International Airport',
					city4: 'SAV-Savannah/Hilton Head International Airport',
					city5: 'SAW-Sawyer International Airport',
					city6: 'SBA-Santa Barbara Municipal Airport (Santa Barbara Airport)',
					city7: 'SBN-South Bend Airport (was South Bend Regional)',
					city8: 'SBP-San Luis Obispo County Regional Airport (McChesney Field)',
					city9: 'SBY-Salisbury Ocean City Wicomico Regional Airport',
					city10: 'SCC-Deadhorse Airport (Prudhoe Bay Airport)',
					city11: 'SCK-Stockton Metropolitan Airport',
					city12: 'SDF-Louisville International Airport (Standiford Field)',
					city13: 'SEA-Seattle Tacoma International Airport',
					city14: 'SFB-Orlando Sanford International Airport',
					city15: 'SFO-San Francisco International Airport',
					city16: 'SGF-Springfield Branson National Airport',
					city17: 'SGU-St. George Municipal Airport',
					city18: 'SHD-Shenandoah Valley Regional Airport',
					city19: 'SHR-Sheridan County Airport',
					city20: 'SHV-Shreveport Regional Airport',
					city21: 'SIG-Fernando Luis Ribas Dominicci Airport',
					city22: 'SIT-Sitka Rocky Gutierrez Airport',
					city23: 'SJC-Norman Y. Mineta San José International Airport',
					city24: 'SJT-San Angelo Regional Airport (Mathis Field)',
					city25: 'SJU-Luis Muñoz Marín International Airport',
					city26: 'SLC-Salt Lake City International Airport',
					city27: 'SMF-Sacramento International Airport',
					city28: 'SMX-Santa Maria Public Airport (Capt G. Allan Hancock Field)',
					city29: 'SNA-John Wayne Airport Orange County (was Orange County Airport)',
					city30: 'SPI-Abraham Lincoln Capital Airport',
					city31: 'SPS-Wichita Falls Municipal Airport / Sheppard Air Force Base',
					city32: 'SRQ-Sarasota¿Bradenton International Airport',
					city33: 'STC-St. Cloud Regional Airport (scheduled passenger service resumed Dec. 2012)',
					city34: 'STL-Lambert St. Louis International Airport',
					city35: 'STS-Charles M. Schulz Sonoma County Airport',
					city36: 'STT-Cyril E. King Airport',
					city37: 'STX-Henry E. Rohlsen Airport',
					city38: 'SUN-Friedman Memorial Airport',
					city39: 'SWF-Stewart International Airport',
					city40: 'SYR-Syracuse Hancock International Airport',
					city41: 'TLH-Tallahassee Regional Airport',
					city42: 'TNI-Tinian International Airport (West Tinian)',
					city43: 'TOL-Toledo Express Airport',
					city44: 'TPA-Tampa International Airport',
					city45: 'TRI Tri Cities Regional Airport (Tri Cities Regional TN/VA)',
					city46: 'TUL-Tulsa International Airport',
					city47: 'TUP-Tupelo Regional Airport (C.D. Lemons Field)',
					city48: 'TUS:Tucson International Airport',
					city49: 'TUS-Tucson International Airport',
					city50: 'TVC-Cherry Capital Airport',
					city51: 'TWD:Jefferson County International Airport',
					city52: 'TWF-Magic Valley Regional Airport (Joslin Field)',
					city53: 'TXK-Texarkana Regional Airport (Webb Field)',
					city54: 'TYR-Tyler Pounds Regional Airport',
					city55: 'TYS-McGhee Tyson Airport',
					city56: 'UNK-Unalakleet Airport',
					city57: 'UNV-University Park Airport',
					city58: 'VDZ-Valdez Airport (Pioneer Field)',
					city59: 'VGT-North Las Vegas Airport',
					city60: 'VLD-Valdosta Regional Airport',
					city61: 'VPS-Northwest Florida Regional Airport / Eglin Air Force Base',
					city62: 'VQS-Antonio Rivera Rodríguez Airport',
					city63: 'WRG-Wrangell Airport (also see Wrangell Seaplane Base)',
					city64: 'WST-Westerly State Airport',
					city65: 'XNA-Northwest Arkansas Regional Airport',
					city66: 'YAK-Yakutat Airport (also see Yakutat Seaplane Base)',
					city67: 'YKM-Yakima Air Terminal (McAllister Field)',
					city69: 'YNG-Youngstown Warren Regional Airport / Youngstown',
					city70: 'YUM-Yuma International Airport / MCAS Yuma'
                                };
			}
                        else if(country[ctryname] === 'CAR-Caribbean')
                        {
                                console.log('CAR-Caribbean',country[ctryname]);
                                var cities =
                                {
					city1: 'AXA-Clayton J. Lloyd International Airport',
					city2: 'ANU-V. C. Bird International Airport',
					city3: 'NAS-Lynden Pindling International Airport',
					city4: 'CCZ-Chub Cay Airport',
					city5: 'GGT-Exuma International Airport',
					city6: 'FPO-Grand Bahama International Airport',
					city7: 'RSD-Rock Sound International Airport',
					city8: 'BGI-Grantley Adams International Airport',
					city9: 'EIS-Terrance B. Lettsome International Airport',
					city10: 'GCM-Owen Roberts International Airport',
					city11: 'CCC-Jardines del Rey Airport',
					city12: 'HAV-José Martí International Airport',
					city13: 'HOG-Frank País Airport',
					city14: 'SNU-Abel Santamaría Airport',
					city15: 'VRA-Juan Gualberto Gómez Airport',
					city16: 'DOM-Melville Hall Airport',
					city17: 'BRX-María Montez International Airport',
					city18: 'LRM-La Romana International Airport',
					city19: 'PUJ-Punta Cana International Airport',
					city20: 'AZS-Samaná El Catey International Airport',
					city21: 'POP-Gregorio Luperón International Airport',
					city22: 'STI-Cibao International Airport',
					city23: 'SDQ-Las Américas International Airport',
					city24: 'GND-Maurice Bishop International Airport',
					city25: 'PTP-Pointe à Pitre International Airport',
					city26: 'PAP-Toussaint Louverture International Airport',
					city27: 'KIN-Norman Manley International Airport',
					city28: 'MBJ-Sangster International Airport',
					city29: 'FDF-Martinique Aimé Césaire International Airport',
					city30: 'MNI-John A. Osborne Airport',
					city31: 'BON-Flamingo International Airport',
					city32: 'AUA-Queen Beatrix International Airport',
					city33: 'SXM-Princess Juliana International Airport',
					city34: 'CUR-Hato International Airport',
					city35: 'BQN-Rafael Hernández Airport',
					city36: 'SJU-Luis Muñoz Marín International Airport',
					city37: 'SBH-Gustaf III Airport',
					city38: 'UVF-Hewanorra International Airport',
					city39: 'SKB-Robert L. Bradshaw International Airport',
					city40: 'SVD-E.T. Joshua Airport',
					city41: 'Canouan Airport',
					city42: 'POS-Piarco International Airport',
					city43: 'TAB-A.N.R. Robinson International Airport',
					city44: 'PLS-Providenciales International Airport',
					city45: 'STT-Cyril E. King Airport',
					city46: 'STX-Henry E. Rohlsen Airport',
					city47: 'BZE-Philip S. W. Goldson International Airport',
					city48: 'LIR-Daniel Oduber Quirós International Airport',
					city49: 'SJO-Juan Santamaría International Airport',
					city50: 'SAL-El Salvador International Airport',
					city51: 'FRS-Mundo Maya International Airport',
					city52: 'GUA-La Aurora International Airport',
					city53: 'LCE-Golosón International Airport',
					city54: 'RTB-Juan Manuel Gálvez International Airport',
					city55: 'SAP-Ramón Villeda Morales International Airport',
					city56: 'TGU-Toncontín International Airport',
					city57: 'MGA-Augusto César Sandino International Airport',
					city58: 'RNI-Corn Island International Airport',
					city59: 'BOC-Bocas del Toro "Isla Colón" International Airport',
					city60: 'DAV-Enrique Malek International Airport',
					city61: 'PTY-Tocumen International Airport'
                                };
                        }
                        else if(country[ctryname] === 'FR1-France Airport codes A thru J')
                        {
                                console.log('FR-France Airport codes A-J',country[ctryname]);
                                var cities =
                                {
					city1: 'AGF-Agen La Garenne Aerodrome',
					city2: 'AHZ-Alpe dHuez Airport',
					city3: 'AJA-Ajaccio Napoleon Bonaparte Airport',
					city4: 'ANG-Angoulême Brie Champniers Airport',
					city5: 'AUF-Auxerre Branches Aerodrome',
					city6: 'AUR-Aurilac Airport',
					city7: 'AVN-Avignon Caumont Airport',
					city8: 'BAE-Barcelonnette Saint Pons Airport',
					city9: 'BES-Brest Bretagne Airport',
					city10: 'LAI-Lannion Côte de Granit Airport (Lannion Servel Airport)',
					city11: 'BIA-Bastia Poretta Airport',
					city12: 'BIQ-Biarritz Anglet Bayonne Airport',
					city13: 'BOD-Bordeaux Merignac Airport (BA 106)',
					city14: 'BOR-Belfort Fontaine Aerodrome',
					city15: 'BOU-Bourges Airport',
					city16: 'BVA-Beauvais Tille Airport',
					city17: 'BVE-Brive Souillac Airport (Brive Dordogne Valley Airport)',
					city18: 'BZR-Béziers Cap dAgde Airport (Béziers Vias Airport)',
					city19: 'CCF-Salvaza Airport',
					city20: 'CDG-Paris Charles de Gaulle Airport (Roissy Airport)',
					city21: 'CEQ-Cannes Mandelieu Airport',
					city22: 'CER-Cherbourg Maupertus Airport',
					city23: 'CET-Cholet The Aerodrome Pontreau ( UAF )',
					city24: 'CFE-Clermont Ferrand Auvergne Airport',
					city25: 'CFR-Caen Carpiquet Airport',
					city26: 'CHR-Châteauroux Centre Marcel Dassault Airport',
					city27: 'CLY-Calvi Sainte Catherine Airport',
					city28: 'CMF-Chambéry Savoie Airport',
					city29: 'CMR-Colmar Houssen Airport',
					city30: 'CNG-Cognac Châteaubernard Air Base (BA 709)',
					city31: 'CQF-Calais Dunkerque Airport',
					city32: 'CSF-Creil Air Base (BA 110)',
					city33: 'CTT-Le Castellet Airport',
					city34: 'CVF-Courchevel Aerodrome',
					city35: 'DCM-Castres Mazamet Airport',
					city36: 'DLE-Dole Jura Airport',
					city37: 'DNR-Dinard Pleurtuit Saint Malo Airport',
					city38: 'DOL-Deauville Saint Gatien Airport',
					city39: 'EBU-Saint Étienne Bouthéon Airport',
					city40: 'ECD-Dieppe Saint Aubin Airport ( UAF )',
					city41: 'EDM-La Roche sur Yon Aerodrome ( UAF )',
					city42: 'EGC-Bergerac Dordogne Périgord Airport',
					city43: 'ENC-Nancy Essey Airport',
					city44: 'EPL-Epinal Mirecourt Airport',
					city45: 'ETZ-Metz Nancy Lorraine Airport',
					city46: 'EVX-Evreux Fauville Air Base (BA 105)',
					city47: 'FNI-Nîmes Alès Camargue Cévennes Airport (Garons Airport)',
					city48: 'FSC-Figari Sud Corse Airport (Figari South Corsica Airport)',
					city49: 'GAT-Gap Tallard Airport',
					city50: 'GFR-Granville Mont Saint Michel Aerodrome ( UAF )',
					city51: 'GNB-Grenoble Isère Airport',
					city52: 'HZB-Merville Calonne Airport',
					city53: 'IDY-Ile dYeu Aerodrome',
					city54: 'IFR-Istres Le Tubé Air Base / Airport (BA 125)',
					city55: 'IJ-Dijon Burgundy Airport (BA 102)',
					city56: 'IPU-Quimper Cornwall Airport',
					city57: 'JAH-Aubagne Agora Heliport',
					city58: 'JCA-Cannes Croisette Heliport',
					city59: 'JDP-Paris Issy les Moulineaux Heliport ( UAF )',
					city60: 'JEV-Evry Heliport',
					city61: 'JLP-Juan les Pins Heliport',
					city62: 'JSZ-Saint Tropez The Pilon Heliport'
                                };
                        }
                        else if(country[ctryname] === 'FR2-France Airport codes L thru V')
                        {
                                console.log('FR-France Airport codes L-V',country[ctryname]);
                                var cities =
                                {
					city1: 'LBG-Paris Le Bourget Airport',
					city2: 'LBI-Albi The Aerodrome Sequestre ( UAF )',
					city3: 'LBY-La Baule Pornichet The Pouliguen Airport ( UAF )',
					city4: 'LDE-Tarbes Lourdes Pyrénées Airport',
					city5: 'LDV-Landivisiau Air Base',
					city6: 'LEH-Le Havre Octeville Airport',
					city7: 'LIG-Limoges Bellegarde Airport',
					city8: 'LIL-Lille Airport (Lesquin Airport)',
					city9: 'LME-Le Mans Arnage Aerodrome ( UAF )',
					city10: 'LPY-Le Puy Loudes Airport',
					city11: 'LRH-La Rochelle Île de Ré Airport',
					city12: 'LRT-Lorient South Brittany Airport (South Brittany)   Government',
					city13: 'LSO-Les Sables dOlonne Talmont Airport',
					city14: 'LTQ-Le Touquet Côte dOpale Airport',
					city15: 'LTT-The Mole St Tropez Airport',
					city16: 'LVA-Laval Entrammes Airport ( UAF )',
					city17: 'LYN-Lyon Bron Airport',
					city18: 'MCU-Montlucon Gueret Airport',
					city19: 'MEN-Mende Brenoux Airport',
					city20: 'MLH-EuroAirport Basel Mulhouse Freiburg',
					city21: 'MRS-Marseille Provence Airport',
					city22: 'MVP-Paris La Defense Heliport',
					city23: 'MVV-Megève Aerodrome',
					city24: 'MXN-Morlaix Ploujean Airport',
					city25: 'MZM-Metz Frescaty Air Base (BA 128)',
					city26: 'NCE-Nice Côte dAzur Airport',
					city27: 'NIT-Niort Souché Airport (UAF )',
					city28: 'NSA-Angers Loire Airport (Angers Marce Airport)',
					city29: 'NTE-Nantes Atlantique Airport',
					city30: 'NVS-Nevers Fourchambault Airport ( WEB UAF )',
					city31: 'OBS-Aubenas Ardeche Southern Aerodrome',
					city32: 'ORE-Orléans Bricy Air Base (BA 123)',
					city33: 'ORY-Paris Orly Airport',
					city34: 'PGF-Perpignan Rivesaltes Airport (Llabanère Airport)',
					city35: 'PGX-Périgueux Bassillac Airport',
					city36: 'PIS-Poitiers Biard Airport',
					city37: 'POX-Pontoise Cormeilles Aerodrome',
					city38: 'PRP-Propriano Airport',
					city39: 'PUF-Pau Pyrenees Airport',
					city40: 'QAM-Amiens Glisy Aerodrome',
					city41: 'QBQ-Besançon La Vèze Aerodrome',
					city42: 'QNX-Mâcon Charnay Airport ( UAF )',
					city43: 'QRV-Arras Roclincourt Airport',
					city44: 'QTJ-Chartres Champhol Aerodrome',
					city45: 'QXB-Aix en Provence Aerodrome',
					city46: 'QYR-Troyes Barberey Airport',
					city47: 'QZE-Mont Louis The Aerodrome Quillane',
					city48: 'RCO-Rochefort Saint Agnant Airport (BA 721) ( UAF )',
					city49: 'RDZ-Rodez Marcillac Airport',
					city50: 'RHE-Reims Champagne Aerodrome (BA 112)',
					city51: 'RNE-Roanne Renaison Airport ( UAF )',
					city52: 'RNS-Rennes Saint Jacques Airport',
					city53: 'RYN-Royan Medis Aerodrome',
					city54: 'SBK-Saint Brieuc Armor Airport',
					city55: 'SNR-Saint Nazaire Montoir Airport ( UAF )',
					city56: 'SOZ-Solenzara Air Base (BA 126)',
					city57: 'SXB-Strasbourg Airport (BA 124)',
					city58: 'SYT-Saint Yan Airport',
					city59: 'TLN-Toulon Hyères Airport',
					city60: 'TLS-Toulouse Blagnac Airport',
					city61: 'TNF-Toussus le Noble Airport',
					city62: 'TUF-Tours Val de Loire Airport (Tours Loire Valley Airport)',
					city63: 'URO-Rouen Airport',
					city64: 'VAF-Valencia Chabeuil Airport',
					city65: 'VHY-Vichy Charmeil Airport',
					city66: 'VNE-Vannes Meucon Airport',
					city67: 'VTL-Vittel Champ de Courses Airport'
                                };
                        }
                        else if(country[ctryname] === 'FR3-France Airport codes X thru Z')
                        {
                                console.log('FR-France Airport codes X-Z',country[ctryname]);
                                var cities =
                                {
					city1: 'XAB-Abbeville Buigny Saint Maclou Aerodrome',
					city2: 'XAC-Arcachon La Teste de Buch Airport',
					city3: 'XAM-Amboise Dierre Airport',
					city4: 'XAN-Alençon Valframbert Aerodrome ( WEB UAF )',
					city5: 'XBD-Bar le Duc Les Hauts de Chee Airport',
					city6: 'XBF-Bellegarde Vouvray Aerodrome',
					city7: 'XBK-Bourg Ceyzériat Airport',
					city8: 'XBQ-Blois Le Breuil Airport ( UAF )',
					city9: 'XBV-Beaune Challanges Airport',
					city10: 'XBX-Bernay St. Martin Airport',
					city11: 'XCB-Cambrai Épinoy Air Base (BA 103)',
					city12: 'XCD-Chalon Champforgeuil Airport',
					city13: 'XCP-Compiègne Margny Airport',
					city14: 'XCR-Chalons Vatry Airport',
					city15: 'XCW-Chaumont Semoutiers Airport ( UAF )',
					city16: 'XCX-Chatellerault Targe Airport',
					city17: 'XCY-Château Thierry Belleau Aerodrome',
					city18: 'XCZ-Charleville Mézières Aerodrome ( UAF )',
					city19: 'XDA-Dax Seyresse Airport',
					city20: 'XDK-Dunkirk The Moëres Airport',
					city21: 'XEP-Epernay Plivot Airport',
					city22: 'XGT-Gueret St. Lawrence Airport',
					city23: 'XLE-Lens Bénifontaine Airport',
					city24: 'XLN-Laon Chambery Airport',
					city25: 'XLR-Libourne Artigues de Lussac Airport',
					city26: 'XME-Maubeuge Aerodrome ( UAF )',
					city27: 'XMF-Montbeliard Courcelles Aerodrome',
					city28: 'XMJ-Mont de Marsan Air Base (BA 118)',
					city29: 'XMK-Montelimar Ancona Airport',
					city30: 'XMU-Moulins Montbeugny Airport',
					city31: 'XMW-Montauban Airport',
					city32: 'XOG-Orange Caritat Air Base (BA 115)',
					city33: 'XRN-Redon Bains sur Oust Aerodrome ( UAF )',
					city34: 'XSB-Saint Servan Airport',
					city35: 'XSG-Saint Omer Wizernes Airport',
					city36: 'XSL-Sarlat Domme Airport',
					city37: 'XSN-Mont Blanc Sallanches Aerodrome',
					city38: 'XSS-Soissons Courmelles Airport',
					city39: 'XST-Saintes Thénac Airport (EETAA 722)',
					city40: 'XSU-Saumur Saint Hilaire Saint Florent Aerodrome ( UAF )',
					city41: 'XSW-Sedan Douzy Airport',
					city42: 'XTC-Saint Claude Pratz Aerodrome',
					city43: 'XTD-Saint Die Remomeix Airport',
					city44: 'XTH-Thionville Yutz Airport',
					city45: 'XVI-Vienna Reventin Airport',
					city46: 'XVN-Verdun The Rozelier Airport',
					city47: 'XVO-Vesoul Frotey Airport',
					city48: 'XVS-Valenciennes Denain Airport',
					city49: 'XVZ-Vierzon Méreau Aerodrome',
					city50: 'XWA-Coulsdon Voisins Aerodrome',
					city51: 'XXG-Autun Bellevue Aerodrome ( UAF )',
					city52: 'XXY-Chelles The Aerodrome Pin( UAF )',
					city53: 'XYB-Meaux Esbly Aerodrome( UAF )',
					city54: 'XYP-Persian Beaumont Airport',
					city55: 'XYT-Toulouse Montaudran',
					city56: 'XZB-Saint Cyr Aerodrome School ( UAF )',
					city57: 'XZX-Chavenay Villepreux Aerodrome( UAF )',
					city58: 'ZAO-Cahors Lalbenque Airport'
				};
			}
                        else if(country[ctryname] === 'AUS-Australia & Surrounding Islands')
                        {
                                console.log('AUS-Australia & Surrounding Islands',country[ctryname]);
                                var cities =
                                {
					city1: 'ADL-Adelaide Airport',
					city2: 'BNE-Brisbane Airport',
					city3: 'CNS-Cairns Airport',
					city4: 'DRW-Darwin International Airport',
					city5: 'OOL-Gold Coast Airport',
					city6: 'MEL-Melbourne Airport',
					city7: 'PER-Perth Airport',
					city8: 'PHE-Port Hedland International Airport',
					city9: 'SYD-Sydney Airport',
					city10: 'TSV-Townsville Airport',
					city11: 'XCH-Christmas Island Airport',
					city12: 'CCK-Cocos (Keeling) Island Airport',
					city13: 'RAR-Rarotonga International Airport',
					city14: 'IPC-Mataveri International Airport or Isla de Pascua Airport',
					city15: 'NAN-Nadi International Airport',
					city16: 'SUV-Nausori International Airport',
					city17: 'PPT-Faaa International Airport (French: Aéroport International Tahiti Faaa)',
					city18: 'GUM-Antonio B. Won Pat International Airport',
					city19: 'CXI-Cassidy International Airport',
					city20: 'TRW-Bonriki International Airport',
					city21: 'KWA-Bucholz Army Airfield',
					city22: 'MAJ-Marshall Islands International Airport',
					city23: 'TKK-Chuuk International Airport',
					city24: 'KSA-Kosrae International Airport',
					city25: 'PNI-Pohnpei International Airport',
					city26: 'YAP-Yap International Airport',
					city27: 'INU-Nauru International Airport',
					city28: 'NOU-La Tontouta International Airport or Nouméa La Tontouta International Airport',
					city29: 'AKL-Auckland Airport (Auckland International Airport)',
					city30: 'CHC-Christchurch International Airport',
					city31: 'DUD-Dunedin International Airport',
					city32: 'HLZ-Hamilton International Airport',
					city33: 'ZQN-Queenstown International Airport',
					city34: 'ROT-Rotorua International Airport',
					city35: 'WLG-Wellington International Airport',
					city36: 'NLK-Norfolk Island Airport',
					city37: 'SPN-Saipan International Airport',
					city38: 'ROP-Rota International Airport',
					city39: 'TIQ-Tinian International Airport',
					city40: 'IUE-Niue International Airport',
					city41: 'ROR-Roman Tmetuchl International Airport',
					city42: 'POM-Jacksons International Airport',
					city43: 'APW-Faleolo International Airport',
					city44: 'HIR-Honiara International Airport',
					city45: 'TBU-Fuaamotu International Airport',
					city46: 'FUN-Funafuti International Airport',
					city47: 'VLI-Bauerfield International Airport',
					city48: 'FUT-Pointe Vele Airport',
					city49: 'WLS-Hihifo Airport'
                                };
                        }
                        else if(country[ctryname] === 'AFR1-Central East North South West Africa A thru D')
                        {
                                console.log('AFR1-Central East North South West Africa A thru D',country[ctryname]);
                                var cities =
                                {
					city1: 'AAE-Rabah Bitat Airport',
					city3: 'ABJ-Port Bouet Airport',
					city4: 'ABV-Nnamdi Azikiwe International Airport',
					city5: 'ACC-Accra Kotoka International Airport',
					city6: 'ADD-Addis Ababa Bole International Airport',
					city7: 'ADD-Addis Ababa Bole International Airport',
					city8: 'AGA-Al Massira Airport',
					city9: 'ALG-Houari Boumedienne Airport',
					city10: 'ALY-Alexandria International Airport',
					city11: 'APL-Nampula Airport',
					city12: 'ASA-Assab International Airport',
					city13: 'ASM-Asmara International Airport',
					city14: 'ASW-Aswan International Airport',
					city16: 'AZI-Al Bateen Executive Airport',
					city17: 'AZR-Touat Cheikh Sidi Mohamed Belkebir Airport',
					city18: 'BBK-Kasane Airport',
					city19: 'BEN-Benina International Airport',
					city20: 'BEW-Beira Airport',
					city21: 'BGF-Bangui M Poko International Airport',
					city22: 'BJA-Abane Ramdane Airport',
					city23: 'BJL-Banjul International Airport',
					city24: 'BKO-Bamako Senou International Airport',
					city25: 'BLJ-Ben Boulaid Airport',
					city26: 'BLZ-Chileka International Airport',
					city27: 'BOY-Bobo Dioulasso Airport',
					city28: 'BSA-Bender Qassim International Airport',
					city29: 'BSK-Biskra Airport',
					city30: 'BUQ-Joshua Mqabuko Nkomo International Airport',
					city31: 'BVC-Aristides Pereira International Airport',
					city32: 'BZV-Maya Maya Airport',
					city33: 'CAI-Cairo International Airport',
					city34: 'CFK-Aéroport International de Chlef',
					city35: 'CKY-Conakry International Airport',
					city36: 'CMN-Mohammed V International Airport',
					city37: 'COO-Cotonou Cadjehoun Airport',
					city38: 'CPT-Cape Town International Airport',
					city39: 'CZL-Mohamed Boudiaf International Airport',
					city40: 'DAR-Julius Nyerere International Airport',
					city41: 'DIE-Arrachart Airport',
					city42: 'DIR-Aba Tenna Dejazmach Yilma International Airport',
					city43: 'DJE-Djerba Zarzis Airport',
					city44: 'DKR-Léopold Sédar Senghor International Airport',
					city45: 'DLA-Douala Airport',
					city46: 'DUR-King Shaka International Airport',
					city47: 'DWC-Al Maktoum International Airport',
				}
			}
                        else if(country[ctryname] === 'AFR2-Central East North South West Africa E thru M')
                        {
                                console.log('AFR2-Central East North South West Africa E thru M',country[ctryname]);
                                var cities =
                                {
					city1: 'EBB-Entebbe International Airport',
					city2: 'EDL-Eldoret International Airport',
					city3: 'EUN¿Hassan I Airport',
					city4: 'FBM-Lubumbashi International Airport',
					city5: 'FEZ-Fes Saïss Airport',
					city6: 'FIH-Ndjili Airport',
					city8: 'FKI-Bangoka International Airport',
					city9: 'FNA-Freetown Lungi International Airport',
					city10: 'FRW-Francistown International Airport',
					city11: 'FTU-Tolanaro Airport',
					city12: 'GBE-Sir Seretse Khama International Airport',
					city13: 'GGR-Garowe International Airport',
					city14: 'GJL-Jijel Ferhat Abbas Airport',
					city15: 'GLK-Abdullahi Yusuf International Airport',
					city16: 'GOM-Goma International Airport',
					city17: 'HAH-Prince Said Ibrahim International Airport',
					city18: 'HGA-Hargeisa International Airport',
					city19: 'HLA-Lanseria International Airport',
					city20: 'HME-Oued Irara Krim Belkacem Airport',
					city21: 'HRE-Harare International Airport',
					city22: 'HRG-Hurghada International Airport',
					city23: 'INH-Inhambane Airport',
					city24: 'JIB-Djibouti Ambouli International Airport',
					city25: 'JNB-OR Tambo International Airport',
					city26: 'JRO-Kilimanjaro International Airport',
					city27: 'JUB-Juba Airport',
					city28: 'JUB-Juba Airport',
					city29: 'KAN-Mallam Aminu Kano International Airport',
					city30: 'KGL-Kigali International Airport',
					city31: 'KIS-Kisumu International Airport',
					city32: 'KMS-Kumasi Airport',
					city33: 'KMU-Kismayo Airport',
					city34: 'KRT-Khartoum International Airport',
					city35: 'LAD-Luanda	Quatro de Fevereiro Airport',
					city36: 'LBV-Libreville International Airport',
					city37: 'LFW-Lomé Tokoin Airport',
					city38: 'LLW-Lilongwe International Airport',
					city39: 'LOS-Murtala Mohammed International Airport',
					city40: 'LUN-Kenneth Kaunda International Airport',
					city41: 'LVI-Harry Mwanga Nkumbula International Airport',
					city42: 'LXR-Luxor International Airport',
					city43: 'MBA-Moi International Airport',
					city44: 'MGQ-Aden Adde International Airport',
					city45: 'MIR-Monastir Habib Bourguiba International Airport',
					city46: 'MJN-Amborovy Airport',
					city47: 'MPM-Maputo International Airport',
					city48: 'MQP-Kruger Mpumalanga International Airport',
					city49: 'MRU-Sir Seewoosagur Ramgoolam International Airport',
					city50: 'MSU-Moshoeshoe I International Airport',
					city51: 'MSW-Massawa International Airport',
					city52: 'MTS-Matsapha Airport',
					city53: 'MUB-Maun Airport'
				}
			}
                        else if(country[ctryname] === 'AFR3-Central East North South West Africa N thru Z')
                        {
                                console.log('AFR3-Central East North South West Africa N thru Z',country[ctryname]);
                                var cities =
                                {
					city1: 'NBE-Enfidha Hammamet International Airport',
					city2: 'NBO-Jomo Kenyatta International Airport',
					city3: 'NDJ-N Djamena International Airport',
					city4: 'NDR-Nador International Airport',
					city5: 'NHD-Al Minhad Air Base',
					city6: 'NIM-Diori Hamani International Airport',
					city7: 'NKC-Nouakchott International Airport',
					city8: 'NLA-Ndola Simon Mwansa Kapwepwe Airport',
					city9: 'NOS-Fascene Airport',
					city10: 'NSI-Yaoundé Nsimalen International Airport',
					city11: 'ORN-Es Sénia Ben Bella Airport',
					city12: 'OUA-Ouagadougou Airport',
					city13: 'OUD-Angads Airport',
					city14: 'PHC-Port Harcourt International Airport',
					city15: 'PNR-Antonio Agostinho Neto International Airport',
					city16: 'POL-Pemba Airport',
					city17: 'QSF-Ain Arnat Airport',
					city18: 'RAK-Marrakesh Menara Airport',
					city19: 'RBA-Rabat Salé Airport',
					city21: 'RMF-Marsa Alam International Airport',
					city22: 'ROB-Monrovia Roberts International Airport',
					city23: 'SDD-Lubango	Lubango Airport',
					city24: 'SEB-Sebha International Airport',
					city25: 'SEZ-Seychelles International Airport',
					city26: 'Sfax Thyna International Airport',
					city28: 'SID-Amílcar Cabral International Airport',
					city29: 'SSG-Malabo International Airport',
					city30: 'SSH-Mersa Matruh Airport',
					city31: 'SSH-Sharm el Sheikh International Airport',
					city32: 'Tabarka Ain Draham International Airport',
					city33: 'TCP-Taba International Airport',
					city34: 'TET-Chingozi Airport',
					city35: 'TIP-Tripoli International Airport',
					city36: 'TLE-Toliara Airport',
					city37: 'TLM-Messali El Hadj Airport',
					city38: 'TMM-Toamasina Airport',
					city39: 'TMR-Hadj Bey Akhamok Airport',
					city40: 'TMS-São Tomé International Airport',
					city41: 'TNG-Tangier Ibn Battouta Airport',
					city42: 'TNR-Ivato International Airport',
					city43: 'Tozeur Nefta International Airport',
					city44: 'TTU-Sania Ramel Airport',
					city45: 'Tunis Carthage International Airport',
					city46: 'VFA-Victoria Falls Airport',
					city47: 'VIL-Dakhla Airport',
					city49: 'VNX-Vilankulo Airport',
					city50: 'WDH-Hosea Kutako International Airport',
					city51: 'WVB-Walvis Bay Airport',
					city52: 'ZDY-Dalma Airport',
					city53: 'ZNZ-Abeid Amani Karume International Airport'
				}
			}
            		else if(country[ctryname] === 'UK1-United Kingdom & Surrounding Nations A thru F')
			{
				console.log('United Kingdom & Surrounding Nations A thru F- country[ctryname]',country[ctryname]);
                                var cities =
                                {
					city1: 'AAL-Aalborg Airport (Danish: Aalborg Lufthavn)',
					city2: 'AAR-Aarhus Airport (Danish: Aarhus Lufthavn)',
					city3: 'ABB-RAF Abingdon',
					city4: 'ABZ-Aberdeen Airport',
					city5: 'ACI-Alderney Airport',
					city6: 'ADX-RAF Leuchars',
					city7: 'AMS-Amsterdam Airport Schiphol',
					city8: 'ANR-Antwerpen International Airport',
					city9: 'BBP-Bembridge Airport',
					city10: 'BBS-Blackbushe Airport',
					city11: 'BEB-Benbecula Airport',
					city12: 'BEQ-RAF Honington',
					city13: 'BEQ-RAF Honington',
					city14: 'BEX-RAF Benson',
					city15: 'BFC-Castle Mill Airfield',
					city16: 'BFS-Belfast International Airport',
					city17: 'BHD-George Best Belfast City Airport',
					city18: 'BHX-Birmingham Airport',
					city19: 'BLK-Blackpool International Airport',
					city20: 'BLL-Billund Airport (Danish: Billund Lufthavn)',
					city21: 'BNX-Banja Luka International Airport',
					city22: 'BOH-Bournemouth Airport',
					city23: 'BOJ-Burgas Airport',
					city24: 'BQH-London Biggin Hill Airport',
					city25: 'BRQ-Brno Turany Airport',
					city26: 'BRR-Barra Airport',
					city27: 'BRS-Bristol Airport',
					city28: 'BRU-Brussels Airport',
					city29: 'BWF-Barrow/Walney Island Airport',
					city30: 'BZZ-RAF Brize Norton',
					city31: 'CAL-Campbeltown Airport (RAF Machrihanish)',
					city32: 'CAX-Carlisle Lake District Airport',
					city33: 'CBG-Cambridge Airport',
					city34: 'CEG-Chester Hawarden Airport',
					city35: 'CLF-RAF Coltishall',
					city36: 'COL-Coll Airport',
					city37: 'CPH-Copenhagen Airport Kastrup',
					city38: 'CRL-Brussels South Charleroi Airport (BSCA)',
					city39: 'CSA-Colonsay Airport',
					city40: 'CVT-Coventry Airport',
					city41: 'CWL-Cardiff Airport',
					city42: 'DBV-Dubrovnik Airport',
					city43: 'DGX-RAF Saint Athan',
					city44: 'DND-Dundee Airport',
					city45: 'DSA-Robin Hood Airport Doncaster Sheffield',
					city46: 'EDI-Edinburgh Airport',
					city47: 'EIN-Eindhoven Airport',
					city48: 'EMA-East Midlands Airport',
					city49: 'ENK-Enniskillen/St Angelo Airport',
					city50: 'EOI-Eday Airport',
					city51: 'ESH-Shoreham Airport',
					city52: 'ETR-Elstree Airfield',
					city53: 'EXT-Exeter International Airport',
					city54: 'FAB-Farnborough Airport',
					city55: 'FAE-Vágar Airport',
					city56: 'FFD-RAF Fairford',
					city57: 'FIE-Fair Isle Airport',
					city58: 'FOA-Foula Airport',
					city59: 'FSS-RAF Kinloss',
					city60: 'FZO-Bristol Filton Airport'
                                }
			}
                        else if(country[ctryname] === 'UK2-United Kingdom & Surrounding Nations G thru O')
                        {
                                console.log('United Kingdom & Surrounding Nations- country[ctryname]',country[ctryname]);
                                var cities =
                                {
					city1: 'GCI-Guernsey Airport',
					city2: 'GLA-Glasgow International Airport',
					city3: 'GLO-Gloucestershire Airport',
					city4: 'GME-Gomel Airport',
					city5: 'GNA-Hrodna Airport',
					city6: 'GRQ-Groningen Airport Eelde',
					city7: 'GRZ-Graz Airport',
					city8: 'HAW-Haverfordwest Aerodrome',
					city9: 'HEL-Helsinki Vantaa Airport',
					city10: 'HRT-RAF Linton on Ouse',
					city11: 'HUY-Humberside Airport',
					city12: 'ILY-Islay Airport',
					city13: 'INN-Innsbruck Airport',
					city14: 'INV-Inverness Airport',
					city15: 'IOM-Isle of Man Airport',
					city16: 'ISC-St Marys Airport',
					city17: 'JER-Jersey Airport',
					city18: 'KAO-Kuusamo Airport',
					city19: 'KLU-Klagenfurt Airport',
					city20: 'KLV-Karlovy Vary Airport (Czech: Leti¿te Karlovy Vary)',
					city21: 'KNF-RAF Marham',
					city22: 'KOI-Kirkwall Airport',
					city23: 'KRH-Redhill Aerodrome',
					city24: 'KTT-Kittilä Airport',
					city25: 'KUO-Kuopio Airport',
					city26: 'LBA-Leeds Bradford International Airport',
					city27: 'LCA-Larnaca International Airport',
					city28: 'LCY-London City Airport',
					city29: 'LDY-City of Derry Airport',
					city30: 'LEQ-Lands End Airport',
					city31: 'LGW-Gatwick Airport',
					city32: 'LKZ-RAF Lakenheath',
					city33: 'LMO-RAF Lossiemouth',
					city34: 'LNZ-Linz Airport',
					city35: 'LPL-Liverpool John Lennon Airport',
					city36: 'LPP-Lappeenranta Airport',
					city37: 'LSI-Sumburgh Airport',
					city38: 'LTN-London Luton Airport',
					city39: 'LWK-Tingwall Airport',
					city40: 'LYE-RAF Lyneham',
					city41: 'LYX-Lydd Airport',
					city42: 'MAN-Manchester Airport',
					city43: 'MHQ-Mariehamn Airport',
					city44: 'MHZ-RAF Mildenhall',
					city45: 'MME-Durham Tees Valley Airport',
					city46: 'MSE-Manston Airport',
					city47: 'MSQ-Minsk National Airport',
					city48: 'MST-Maastricht Aachen Airport',
					city49: 'NCL-Newcastle Airport',
					city50: 'NDY-Sanday Airport',
					city51: 'NHT-RAF Northolt',
					city52: 'NQT-Nottingham Airport',
					city53: 'NQY-Newquay Cornwall Airport / RAF St Mawgan',
					city54: 'NRL-North Ronaldsay Airport',
					city55: 'NWI-Norwich International Airport',
					city56: 'OBN-Oban Airport',
					city56: 'ODH-RAF Odiham',
					city57: 'ORM-Sywell Aerodrome',
					city58: 'OSI-Osijek Airport',
					city59: 'OSR-Leo¿ Janácek Airport Ostrava',
					city60: 'OUK-Outer Skerries Airport',
					city61: 'OUL-Oulu Airport',
					city62: 'OXF-London Oxford Airport'
                                }
                        }
                        else if(country[ctryname] === 'UK3-United Kingdom & Surrounding Nations P thru Z')
                        {
                                console.log('United Kingdom & Surrounding Nations- country[ctryname]',country[ctryname]);
                                var cities =
                                {
					city1: 'PDV-Plovdiv Airport',
					city2: 'PFO-Paphos International Airport',
					city3: 'PIK-Glasgow Prestwick International Airport',
					city4: 'PPW-Papa Westray Airport',
					city5: 'PRG-Prague Václav Havel Airport or Václav Havel Airport Prague',
					city6: 'PSL-Perth Airport',
					city7: 'PSV-Papa Stour Airport',
					city8: 'PUY-Pula Airport',
					city9: 'PZE-Penzance Heliport',
					city10: 'QCY-RAF Coningsby',
					city11: 'QFO-Duxford Aerodrome',
					city12: 'QLA-Lasham Airfield',
					city13: 'QUG-Chichester/Goodwood Airport',
					city14: 'QUY-RAF Wyton',
					city15: 'RCS-Rochester Airport',
					city16: 'RTM-Rotterdam The Hague Airport',
					city17: 'RVN-Rovaniemi Airport',
					city18: 'SCS-Scatsta Airport',
					city19: 'SEN-London Southend Airport',
					city20: 'SJJ-Sarajevo International Airport',
					city21: 'SKL-Broadford Airfield',
					city22: 'SOF-Sofia Airport',
					city23: 'SOU-Southampton Airport',
					city24: 'SOY-Stronsay Airport',
					city25: 'SPU-Split Airport',
					city26: 'SQZ-RAF Scampton',
					city27: 'STN-London Stansted Airport',
					city28: 'SWS-Swansea Airport',
					city29: 'SYY-Stornoway Airport',
					city30: 'SZD-Sheffield City Airport',
					city31: 'SZG-Salzburg Airport or Salzburg Airport W. A. Mozart',
					city32: 'TAY-Tartu Airport',
					city33: 'TIA-Tirana International Airport Nënë Tereza',
					city34: 'TKU-Turku Airport',
					city35: 'TLL-Tallinn Airport',
					city36: 'TMP-Tampere Pirkkala Airport',
					city37: 'TRE-Tiree Airport',
					city38: 'TSO-Tresco Heliport',
					city39: 'UPV-former RAF Upavon',
					city40: 'VAA-Vaasa Airport',
					city41: 'VAR-Varna Airport',
					city42: 'VIE-Vienna International Airport',
					city43: 'VLY-Anglesey Airport',
					city44: 'WHS-Whalsay Airport',
					city45: 'WIC-Wick Airport',
					city46: 'WRY-Westray Airport',
					city47: 'WTN-RAF Waddington	Military',
					city48: 'YEO-RNAS Yeovilton',
					city49: 'ZAD-Zadar Airport',
					city50: 'ZAG-Zagreb Airport'
                                }
                        }
            		else {
				console.log('Common - country[ctryname]',country[ctryname]);
    	        		var cities =
            			{	        			        			
    	        			city1: 'DCA-WashingtonDC Ronald Reagan National',
    	        			city2: 'SEA-Seattle Tacoma',
    	        			city3: 'SNA-John Wayne',
    	        			city4: 'SJC-Mineta San José',
    	        			city5: 'SFO-San Francisco',
    	        			city6: 'SAT-San Antonio',	
    	        			city7: 'RDU-Raleig Durham',
    	        			city8: 'PDX-Portland',
    	        			city9: 'PHX-Sky Harbor' 
            			}
            		}
            			
    	        		for (var ctyname in cities) {
    	            		console.log('country name', cities[ctyname]);
    		        	   				var tempairlinescities = [
    		        		        		        	{
    		        		        		        		passengerId: id,
    		        		        		        		countryname: country[ctryname],
    		        		        		        		cityname: cities[ctyname]
    		        		        		            }];    

    		        		        	  db.collection('passengercountrycities', function(err, collection) {
	    		        		                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
    		        		                    if (err) {
    		        		                        res.send({'error':'An error has occurred'});
    		        		                    } else {
    		        		                        console.log('Success: ' + JSON.stringify(result[0]));
    		        		                        //res.send(result[0]);
    		        		                    }
    		        		                });
    		        		               });
    	        		}
				    db.collection('passengercountrycities', function(err, collection) {
					collection.find({'passengerId' : id}).toArray(function(err, items) {
						//console.log('items', items);
						res.send(items);
						});
					});
        		    }        			
        		}

	        });
	    });
    //});
};

exports.findPassengerCountries = function(req, res) {
	var id = req.params.id;
    console.log('Retrieving Passenger countries', id);
   	var tempairlinescities = [
	        		        	{
	        		        		passengerId: id,
	        		        		//countryname: 'SP-Spain'
	        		        		//countryname: 'CA-Canada'
	        		        		//countryname: 'GER-Germany'
	        		        		//countryname: 'IND-India'
	        		        		//countryname: 'IT-Italy'
	        		        		//countryname: 'MAL-Malaysia'	
	        		        		//countryname: 'NZ-New Zealand'
	        		        		//countryname: 'UAE-United Arab Emirates'
	        		        		//countryname: 'UK-United Kingdom'
	        		        		countryname: 'USA-United States Of America'
	        		            	//city: 'SFO-San Francisco>CIA-Rome>VCE-Venice>VIE-Vienna>MSQ-Minsk,Belarus>PIT-Pittsburgh'
	        		        		//cityname: 'DCA-WashingtonDC Ronald Reagan National>SFO-San Francisco>IAD-WashingtonDC Dulles Airport
	        		        		//	>TPA-Tampa International>STL-Lambert>SEA-Seattle-Tacoma>SNA-John Wayne>SJC-Mineta San José>SFO-San Francisco>SAN-Lindbergh Field>SAT-San Antonio>SLC-Salt Lake City>SMF-Sacramento>RDU-Raleigh-Durham>PDX-Portland>PIT-Pittsburgh>PHX-Sky Harbor>PHL-Philadelphia>MCO-Orlando>ONT-Ontario'
	        		        		//city: 'CMH-Columbus>JFK-New York>IAH-Houston>DFW-Dallas>AUS-Austin>ORD-Chicago,OHare'
	        		        		//city: 'MCI-Kansas City>IND-Indianapolis>MSP-Minneapolis>DTW-Detroit>CLT-Charlotte>PHL-Philadelphia'
	        		        		//city: 'ATL-Atlanta>MIA-Miami>MCO-Orlando>LAS-Las Vegas>LAX-Los Angeles>PHX-Phoenix'
	        		            }];    
	        	  /*db.collection('passengercountries', function(err, collection) {        		       
	                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
	                    if (err) {
	                        res.send({'error':'An error has occurred'});
	                    } else {
	                        console.log('Success: ' + JSON.stringify(result[0]));
	                        res.send(result[0]);
	                    }
	                });
	               });*/
   	
   	/*var tempairlinescities = [
	        		        	{	        		        		
	        		        		passengerId: id,
	                        		countryname: "MEX-Mexico",	        		        		
	        		        		cityname: 'LAX-Los Angeles'
	        		            	//city: 'SFO-San Francisco>CIA-Rome>VCE-Venice>VIE-Vienna>MSQ-Minsk,Belarus>PIT-Pittsburgh'
	        		        		//cityname: 'DCA-WashingtonDC Ronald Reagan National>SFO-San Francisco>IAD-WashingtonDC Dulles Airport
	        		        		//	>TPA-Tampa International>STL-Lambert>SEA-Seattle-Tacoma>SNA-John Wayne>SJC-Mineta San José>SFO-San Francisco>SAN-Lindbergh Field>SAT-San Antonio>SLC-Salt Lake City>SMF-Sacramento>RDU-Raleigh-Durham>PDX-Portland>PIT-Pittsburgh>PHX-Sky Harbor>PHL-Philadelphia>MCO-Orlando>ONT-Ontario'
	        		        		//city: 'CMH-Columbus>JFK-New York>IAH-Houston>DFW-Dallas>AUS-Austin>ORD-Chicago,OHare'
	        		        		//city: 'MCI-Kansas City>IND-Indianapolis>MSP-Minneapolis>DTW-Detroit>CLT-Charlotte>PHL-Philadelphia'
	        		        		//city: 'ATL-Atlanta>MIA-Miami>MCO-Orlando>LAS-Las Vegas>LAX-Los Angeles>PHX-Phoenix'
	        		            }];    
	        	   db.collection('passengercountrycities', function(err, collection) {        		       
	                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
	                    if (err) {
	                        res.send({'error':'An error has occurred'});
	                    } else {
	                        console.log('Success: ' + JSON.stringify(result[0]));
	                        res.send(result[0]);
	                    }
	                });
	               });*/
   	// This code is adding New Zealand
    /*db.collection('passengercountries', function(err, collection) {
		collection.update({"_id":{ $exists : true }},{$set:{passengerId: id}});
    */
    db.collection('passengercountries', function(err, collection) {
    	collection.find({'passengerId' : id}).toArray(function(err, items) {
        	//console.log('items', items);
        	if(items.length > 0)
    		{
        		console.log('items length', items.length);
                res.send(items);    		
    		}
        	else
    		{
        		console.log('items1');
        		var countries =
        			{
					USA1: 'USA1-United States Of America (A thru E)',
					USA2: 'USA2-United States Of America (F thru L)',
					USA3: 'USA3-United States Of America (M thru R)',
					USA4: 'USA4-United States Of America (S thru Y)',
					UK1: 'UK1-United Kingdom & Surrounding Nations A thru F',
					UK2: 'UK2-United Kingdom & Surrounding Nations G thru O',
					UK3: 'UK3-United Kingdom & Surrounding Nations P thru Z',
					EUE1: 'EUE1-East Europe & Scandivanian A thru K',
					EUE2: 'EUE2-East Europe & Scandivanian K thru Z',
					GER: 'GER-Germany',
					JPMCHI: 'JPNCHI-Japan China S.Korea',
					CA1: 'CA1-Canada cities from A thru C',
					CA2: 'CA2-Canada cities from D thru G',
					CA3: 'CA3-Canada cities from H thru M',
					CA4: 'CA4-Canada cities from N thru P',
					FR1: 'FR1-France Airport codes A thru J',
					FR2: 'FR2-France Airport codes L thru V',
					FR3: 'FR3-France Airport codes X thru Z',
					IT: 'IT-Italy',
					AUS: 'AUS-Australia & Surrounding Islands',
					SP: 'SP-Spain',
					IND: 'IND-India',
					MEX: 'MEX-Mexico',        
					CAR: 'CAR-Caribbean',
					SA: 'SA-South America',
					SAINTH1: 'SAINTH1-South Asia Indonasia Thailand etc A thru K', 
					SAINTH2: 'SAINTH2-South Asia Indonasia Thailand etc L thru Z',
					AFR1: 'AFR1-Central East North South West Africa A thru D',
					AFR2: 'AFR2-Central East North South West Africa E thru M',
					AFR3: 'AFR3-Central East North South West Africa N thru Z',
					SWASIA: 'SWASIA-South West Asia incl. Kazak Iran Iraq Isreal etc'
    				};	
	        		for (var ctryname in countries) {
	            		console.log('country name: ', countries[ctryname]);
		        	   				var tempairlinescities = [
		        		        		        	{
		        		        		        		passengerId: id,
		        		        		        		countryname: countries[ctryname]
		        		        		            }];    
		        		        	  db.collection('passengercountries', function(err, collection) {
		        		                collection.insert(tempairlinescities, {safe:true}, function(err, result) {
		        		                    if (err) {
		        		                        res.send({'error':'An error has occurred'});
		        		                    } else {
		        		                        console.log('Success: ' + JSON.stringify(result[0]));
		        		                        //res.send(result[0]);
		        		                    }
		        		                });
		        		               });
	        		}
	        	    db.collection('passengercountries', function(err, collection) {
	        	    	collection.find({'passengerId' : id}).toArray(function(err, items) {
	        	        	//console.log('items', items);
	        	                res.send(items);
	        		        });
	    	        });
    			}
	        });
	    });
    //});
};

exports.findAirlinesNotByCities = function(req, res) {
    var city = req.params.city;
    var id = req.params.id;
    console.log('city = ', req.params.city, 'id = ', req.params.id);
    db.collection('airlinescities', function(err, collection) {
    	collection.find({ "city": { $ne: city } ,  id: id  }).toArray(function(err, items) {
        	console.log('Item records', items);
            res.send(items);
        	});
        });
};

exports.findUsersfromQueue = function(req, res) {
    console.log('findUsersfromQueue', req);
    var carrierFsCode = req.body.carrierFsCode;
    var flightNumber = req.body.flightNumber;
    console.log('carrierFsCode = ', carrierFsCode, 'flightNumber = ', flightNumber);
    	
	  return res.redirect('#passqueuesearch/'
		//	+ JSON.stringify(items) + '/' 
			  + req.body.airlineslat + '/' 
			  + req.body.airlineslong + '/' 
			  + req.body.miles  + '/' 
			  + req.body.departureAirportFsCode  + '/' 
			  + req.body.arrivalAirportFsCode + '/' 
			  +  req.body.departureTime + '/'
			  +  req.body.arrivalTime + '/' 
			  +  req.body.arrivalTerminal + '/'
			  +  req.body.carrierFsCode + '/'
			  +  req.body.flightNumber + '/'
			  +  req.body.currentDate);
	  
};

//manoj
exports.findUserQueue = function(req, res) {
    console.log('findUserQueue');
    var carrierFsCode = req.params.carrierFsCode;
    var flightNumber = req.params.flightNumber;
    console.log('carrierFsCode = ', carrierFsCode, 'flightNumber = ', flightNumber);
    	
    db.collection('userlocation', function(err, collection) {
    	collection.find({ "carrierFsCode": carrierFsCode ,  "flightNumber": flightNumber  }).toArray(function(err, items) {    		
        	console.log('Item records', items);
        	res.send(items);
        	});
        });
};


exports.addAirlines = function(req, res) {
    var airlines = req.body;
    console.log('Adding airlines: ' + JSON.stringify(airlines));
    db.collection('airlines', function(err, collection) {
        collection.insert(airlines, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
//manoj
exports.addUserLoc = function(req, res) {
    var userloc = req.body;
    console.log('Adding Userloc: ' + JSON.stringify(userloc));
    db.collection('userlocation', function(err, collection) {
        collection.insert(userloc, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.findByCountry= function(req, res) {
    console.log('Retrieving airlines: ' + id);
    var country = req.params.country;
    db.collection('airlines', function(err, collection) {
        collection.find({country: "Spain"}, function(err, item) {
            res.send(item);
        });
    });
        
};

exports.getuserlocation = function(req, res) {
	console.log('Getting User location: ', req.params.id);
	db.collection('userlocation', function(err, collection) {	
		collection.findOne({'passengerId':req.params.id}, function(err, item) {
	                   	res.send(item);
	            });
	            
	});    
};
//manoj
exports.updateUserLoc = function(req, res) {
console.log('Retrieving User id: ', req.body.passengerId)
db.collection('userlocation', function(err, collection) {	
	collection.findOne({'passengerId':req.body.passengerId}, function(err, item) {
    	item.lat = req.body.lat;
    	item.long = req.body.long;
    	// for a passenger login we will not update the city
        console.log('Updating user: ' + item.passengerId);                
        console.log(JSON.stringify(item));
        db.collection('userlocation', function(err, collection) {
        	
            collection.update({'passengerId':req.body.passengerId}, item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating airlines: ' + err);
                    	res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    
                    //res.sendRedirect("login.htm");
              	  //return 
              	  return res.redirect('#newuserlocation/' + req.body.passengerId) ;
              	  
                   	//res.send(item);
                }
            });
            
        });            
    });
});    
}

exports.addtempUserLoc = function(req, res) {
    //console.log('req.user', req);
	var userloc = req.body;
    
    console.log('Adding Temp Userloc: ' + JSON.stringify(userloc));
    console.log('req.body', req.body);

	    db.collection('tempuserlocation', function(err, collection) {
	        collection.insert(userloc, {safe:true}, function(err, result) {
	            if (err) {
	                res.send({'error':'An error has occurred'});
	            } else {
	                console.log('Success: ' + JSON.stringify(result[0]));
	                res.send(result[0]);
	            	}
	        	});
	    	});
}

exports.addAirlinesLoc = function(req, res) {
    var userloc = req.body;
    console.log('Adding Airlinesloc: ' + JSON.stringify(userloc));
    db.collection('airlineslocation', function(err, collection) {
        collection.insert(userloc, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateAirlines = function(req, res) {
    var id = req.params.id;
    var airlines = req.body;
    delete airlines._id;
    console.log('Updating airlines: ' + id);
    console.log(JSON.stringify(airlines));
    db.collection('airlines', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, airlines, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating airlines: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(airlines);
            }
        });
    });
}

exports.deleteAirlines = function(req, res) {
    var id = req.params.id;
    console.log('Deleting airlines: ' + id);
    db.collection('airlines', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

var airlines = [
/*	{
    	name: "United Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "UnitedA.gif"
    },
    {
        name: "Australian Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Australian.gif"
    },
    {
        name: "Sri Lankan Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "SL.gif"
    },
    {
    	name: "Southwest Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "SS.gif"
    },
    {
        name: "Northwest Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "NW.gif"
    },
    {
        name: "KML Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "KLM.gif"
    },
    {
    	name: "Malaysia Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Mal.gif"
    },
    {
        name: "Japanese Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "JAL.gif"
    },
    {
        name: "KingFisher Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "KFA.gif"
    },
    {
    	name: "Hawaiian Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Hawaiian.gif"
    },
    {
        name: "Italia Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Itali.gif"
    },
    {
        name: "Indian Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Indian.gif"
    },
    {
    	name: "Emirates Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Emirates.gif"
    },
    {
        name: "Continental Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Continental.gif"
    },
    {
        name: "Ethiopian Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Ethiopian.gif"
    },
    {
    	name: "Austrian Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Austrian.gif"
    },
    {
        name: "China Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "China.gif"
    },
    {
        name: "Austrian Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Austrian_A.gif"
    },
    {
        name: "Aeroflot Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Aeroflot.gif"
    },
	{
    	name: "Asiana Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Asiana.gif"
    },
    {
        name: "Turkish Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Turkish.gif"
    }, */
   // I need this
    {
        name: "American Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "AA.gif"
    },                        
   // I need this too
    {
        name: "Spirit Airways",
        year: "2009",
        city: "Cabernet Sauvignon",
        country: "USA",
        region: "Tuscany",
        description: "Sprit Airways Domestic and International Airlines.",
        picture: "Spirit.gif"
    },
   // I need this too
    {
        name: "South West Airways",
        year: "2009",
        city: "Chardonnay",
        country: "USA",
        region: "Burgundy",
        description: "South West Airways Domestic and International Airlines.",
        picture: "Southwest.gif"
    },
// plese verify from internet for skywest profile
    {
        name: "Sky West Airways",
        year: "2009",
        city: "New York",
        country: "USA",
        region: "East Coast",
        description: "Sky West Airways Domestic and International Airlines operated in East Coast.",
        picture: "SkyWest.jpg"
    },
// plese verify from internet for Jet Blue profile
    {
        name: "Jet Blue Airlines",
        year: "2008",
        city: "New Jersey",
        country: "USA",
        region: "East Coast",
        description: "Jet Blue Airways Domestic and International Airlines operated in East Coast.",
        picture: "JetBlue.png"
    },
   // I need this too
    {
        name: "Hawaian Airlines",
        year: "2011",
        city: "Pinot Gris",
        country: "USA",
        region: "Mendoza",
        description: "Hawaian Airlines Domestic and International Airlines.",
        picture: "Hawaiian.gif"
    },
   // I need this too
    {
        name: "Continental Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "California",
        description: "Continental Airlines Domestic and International Airlines.",
        picture: "Continental.jpg"
    },
   // I need this too
    {
        name: "Frontier Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Frontier.gif"
    },
   // I need this too
    {
        name: "Air Canada Airlines",
        year: "2007",
        city: "Toronto",
        country: "USA",
        region: "Ontario",
        description: "Canadian Domestic and International Airlines.",
        picture: "AirCanada.jpg"
    },
   // I need this too
    {
        name: "Air Tran Airlines",
        year: "2011",
        city: "None",
        country: "USA",
        region: "South coast",
        description: "Air Tran Domestic and International Airlines.",
        picture: "AirTran.gif"
    },
   // I need this too
    {
        name: "American Eagle Airlines",
        year: "2011",
        city: "None",
        country: "USA",
        region: "South coast",
        description: "Air Tran Domestic and International Airlines.",
        picture: "AmericanEagle.jpg"
    },
   // I need this too
    {
        name: "Delta Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "South Island",
        description: "Delta Airlines Domestic and International Airlines.",
        picture: "Delta.jpg"
    },
   // I need this too
    {
        name: "United Airlines",
        year: "2010",
        city: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "United Airlines Domestic and International Airlines.",
        picture: "united.jpg"
    },

/*
	{
    	name: "AMC Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "AMC_.gif"
    },
    {
        name: "Alexandria Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Alexandria_.gif"
    },
    {
        name: "Avior Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Avior_.gif"
    },
	{
    	name: "KARTIKA Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "KARTIKA_.gif"
    },
    {
        name: "VG Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "VG_.gif"
    },
    {
        name: "Aseman Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Aseman_.gif"
    },
	{
    	name: "Alma Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Alma_.gif"
    },
    {
        name: "kish Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "kish_.gif"
    },
    {
        name: "Kosovo Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Kosovo_.gif"
    },
	{
    	name: "Syrian Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Syrian_.gif"
    },
    {
        name: "Kosovo Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Kosovo_1.gif"
    },
    {
        name: "Vietnam Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Vietnam_.gif"
    },
	{
    	name: "Aeroflot Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Aeroflot_.gif"
    },
    {
        name: "Santa Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Santa_.gif"
    },
    {
        name: "Ural Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Ural_.gif"
    },
	{
    	name: "Aeroflot Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Aeroflot_1.gif"
    },
    {
        name: "Allegheny Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Allegheny_.gif"
    },
    {
        name: "Holiday Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Holiday_.gif"
    },
    {
        name: "Iberia Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Iberia_.gif"
    },
	{
    	name: "IHY Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "IHY_.gif"
    },
    {
        name: "Frontier Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Frontier_.gif"
    },
    {
        name: "go Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "go_.gif"
    },                     
    {
        name: "Copa Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Copa_.gif"
    },
	{
    	name: "Flash Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Flash_.gif"
    },
    {
        name: "Eurocypria Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Eurocypria_.gif"
    },
    {
        name: "EL Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "EL_.gif"
    },             
	{
    	name: "Volare Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "Volare_.gif"
    },
    {
        name: "Volga Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "Volga_.gif"
    },
    {
        name: "Western Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "Western_.gif"
    }
	*/
    ];

var airlinescities = [
            	{
                	airlinesId: "0000000",
                    city: "Dallas"
                }];

var passengercountrycities = [
                  	{
                  		passengerId : "0000000",
                  		countryname: "Denmark",
                      	cityname: "Bangalore"
                      }];

var passengercountries = [
                  	{
                  		passengerId: "0000000",
                        countryname: "Denmark",
                      }];

var userlocation = [
                  	{
                  	    departureAirportFsCode: 'XXX',
                  	    arrivalAirportFsCode: 'ZZZ', 
                  	    departureTime: '2013-10-14T19:30:00.000',
                  	    arrivalTime: '2013-10-14T19:30:00.000',
                  	    arrivalTerminal: 'X',
                  	    carrierFsCode: 'YYY',   	
                  	    flightNumber: 0000,
                  	    currentDate: '2013-10-14T19:30:00.000', 
                  	    lat: 39.1392974,
                  		long: -85.9973236,
                  		passengerId: 009988
                  	}];

var tempuserlocation = [
                  	{
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
                  		}];

var airlineslocation = [
                  	{
                  	    departureAirportFsCode: 'AAA',
                  	    arrivalAirportFsCode: 'BBB', 
                  	    departureTime: '2013-10-13T13:00:01.000',
                  	    arrivalTime: '2013-10-12T11:20:03.000',
                  	    arrivalTerminal: 'K',
                  	    carrierFsCode: 'LLL',   	
                  	    flightNumber: 1111,
                  	    currentDate: '2013-08-02T12:90:00.000', 
                  	    lat: 29.1392974,
                  		long: -71.9093236  	        	
                  	}];

/*          
	var user = [
	        	{
	        		dbId: "007654",
	            	username: "9861230965",
	                email: "xyz@gmail.com",
	                name: "XYZ",
	                userType: false
	            }];
          
    {
        name: "American Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Priceton Junction",
        description: "Domestic and International Airlines.",
        picture: "aa2.gif"
    },
    {
        name: "Russian Airlines",
        year: "2010",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Domestic and International Airlines.",
        picture: "aeroflot_logo.gif"
    },
    {
        name: "Aero Mexico",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California Central Cosat",
        description: "Domestic and International Airlines.",
        picture: "aeromexico.gif"
    },
    {
        name: "Air \"New Zealand\"",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Washington",
        description: "New Zealand Domestic and International Airlines.",
        picture: "air_new_zealand_logo2.gif"
    },
    {
        name: "Air Berlin",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Oregon",
        description: "Germany Domestic and International Airlines.",
        picture: "airberlin.gif"
    },
    {
        name: "Air Canada",
        year: "2007",
        city: "None",
        country: "Italy",
        region: "Tuscany",
        description: "Canadian Domestic and International Airlines.",
        picture: "aircanada.gif"
    },
    {
        name: "Air France",
        year: "2005",
        city: "None",
        country: "France",
        region: "Bordeaux",
        description: "French Domestic and International Airlines.",
        picture: "airfrance2.gif"
    },
    {
        name: "Air India",
        year: "2009",
        city: "None",
        country: "France",
        region: "Bordeaux",
        description: "Indian Domestic and International Airlines.",
        picture: "airindia2.gif"
    },
    {
        name: "Air Madagascar",
        year: "2009",
        city: "None",
        country: "USA",
        region: "California",
        description: "Madagascar Domestic and International Airlines.",
        picture: "airmadagascar.gif"
    },
    {
        name: "Air Philippines",
        year: "2007",
        city: "None",
        country: "USA",
        region: "Oregon",
        description: "Philippines Domestic and International Airlines.",
        picture: "airphillipines.gif"
    },
    {
        name: "Air Tran",
        year: "2011",
        city: "None",
        country: "Argentina",
        region: "Mendoza",
        description: "Air Tran Domestic and International Airlines.",
        picture: "airtran.gif"
    },
    {
        name: "Alaskan Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "Burgundy",
        description: "Alaskan Airlines Domestic and International Airlines.",
        picture: "alaskaairlines3.gif"
    },
    {
        name: "Al Italia",
        year: "2009",
        city: "None",
        country: "Italy",
        region: "Tuscany",
        description: "Italian Airlines Domestic and International Airlines.",
        picture: "alitalia.gif"
    },
    {
        name: "Austrian ",
        year: "2008",
        city: "None",
        country: "Spain",
        region: "Rioja",
        description: "Italian Airlines Domestic and International Airlines.",
        picture: "austrian2.gif"
    },
    {
        name: "Avianca",
        year: "2009",
        city: "None",
        country: "Spain",
        region: "Castilla y Leon",
        description: "Italian Airlines Domestic and International Airlines.",
        picture: "avianca1.gif"
    },
    {
        name: "British Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "California",
        description: "British Airlines Domestic and International Airlines.",
        picture: "ba2.gif"
    },
    {
        name: "Brussels Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "Oregon",
        description: "Brussels Airlines Domestic and International Airlines.",
        picture: "brusselsairlines2.gif"
    },
    {
        name: "Cathay Pacific",
        year: "2010",
        city: "None",
        country: "France",
        region: "Alsace",
        description: "Cathay Pacific Airlines Domestic and International Airlines.",
        picture: "cathaypacific21.gif"
    },
    {
        name: "China Airlines",
        year: "2011",
        city: "None",
        country: "USA",
        region: "California",
        description: "China Airlines Domestic and International Airlines.",
        picture: "china_airlines.gif"
    },
    {
        name: "Continental Airlines",
        year: "2009",
        city: "None",
        country: "USA",
        region: "California",
        description: "Continental Airlines Domestic and International Airlines.",
        picture: "continental-airlines-logo2.gif"
    },
    {
        name: "Croatia Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "California",
        description: "Croatian Airlines Domestic and International Airlines.",
        picture: "croatia2.gif"
    },
    {
        name: "Dragonair Airlines",
        year: "2010",
        city: "None",
        country: "France",
        region: "Bordeaux",
        description: "Dragonair Airlines Domestic and International Airlines.",
        picture: "dagonair.gif"
    },
    {
        name: "Delta Airlines",
        year: "2010",
        city: "None",
        country: "USA",
        region: "South Island",
        description: "Delta Airlines Domestic and International Airlines.",
        picture: "delta3.gif"
    },
    {
        name: "Elal",
        year: "2009",
        city: "Merlot",
        country: "USA",
        region: "Washington",
        description: "Elal Airlines Domestic and International Airlines.",
        picture: "elal2.gif"
    },
    {
        name: "Emirates",
        year: "2009",
        city: "Merlot",
        country: "France",
        region: "Bordeaux",
        description: "Elal Airlines Domestic and International Airlines.",
        picture: "emirates_logo2.gif"
    },
    {
        name: "Ethiopian",
        year: "2009",
        city: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "Ethiopian Airlines Domestic and International Airlines.",
        picture: "ethiopianairlines4.gif"
    },
    {
        name: "Garuda Indonesia",
        year: "2007",
        city: "Pinot Noir",
        country: "USA",
        region: "Oregon",
        description: "Garuda Indonesia Airlines Domestic and International Airlines.",
        picture: "garudaindonesia.gif"
    },
    {
        name: "Hawaian Airlines",
        year: "2011",
        city: "Pinot Gris",
        country: "Argentina",
        region: "Mendoza",
        description: "Hawaian Airlines Domestic and International Airlines.",
        picture: "hawaiian2.gif"
    },
    {
        name: "Iberia Airlines",
        year: "2009",
        city: "Chardonnay",
        country: "France",
        region: "Burgundy",
        description: "Iberia Airlines Domestic and International Airlines.",
        picture: "iberia2.gif"
    },
    {
        name: "Icelandair Airlines",
        year: "2009",
        city: "Cabernet Sauvignon",
        country: "Italy",
        region: "Tuscany",
        description: "Iberia Airlines Domestic and International Airlines.",
        picture: "icelandair_logo2.gif"
    },
    {
        name: "Jal Airlines",
        year: "2008",
        city: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "Jal Airlines Domestic and International Airlines.",
        picture: "jal2.gif"
    },
    {
        name: "KLM Airlines",
        year: "2009",
        city: "Mencia",
        country: "Spain",
        region: "Castilla y Leon",
        description: "KLM Airlines Domestic and International Airlines.",
        picture: "klm2.gif"
    },
    {
        name: "Korean Airlines",
        year: "2009",
        city: "Chardonnay",
        country: "USA",
        region: "California",
        description: "Korean Airlines Domestic and International Airlines.",
        picture: "korean.gif"
    },
    {
        name: "Lan Airlines",
        year: "2010",
        city: "Pinot Gris",
        country: "USA",
        region: "Oregon",
        description: "Lan Airlines Domestic and International Airlines.",
        picture: "lan2.gif"
    },
    {
        name: "Lot Airlines",
        year: "2010",
        city: "Pinot Gris",
        country: "France",
        region: "Alsace",
        description: "Lot Airlines Domestic and International Airlines.",
        picture: "lot2.gif"
    },
    {
        name: "Lufthansa Airlines",
        year: "2011",
        city: "Zinfandel",
        country: "USA",
        region: "California",
        description: "Lufthansa Airlines Domestic and International Airlines.",
        picture: "lufthansa4.gif"
    },
    {
        name: "Malaysia Airlines",
        year: "2009",
        city: "Zinfandel",
        country: "USA",
        region: "California",
        description: "Malaysia Airlines Domestic and International Airlines.",
        picture: "malaysia.gif"
    },
    {
        name: "Midwest Airlines",
        year: "2010",
        city: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "Midwest Airlines Domestic and International Airlines.",
        picture: "midweat.gif"
    },
    {
        name: "NWA Airlines",
        year: "2010",
        city: "Cabernet Sauvignon",
        country: "France",
        region: "Bordeaux",
        description: "NWA Airlines Domestic and International Airlines.",
        picture: "nwa1.gif"
    },
    {
        name: "Oceanic Airlines",
        year: "2010",
        city: "Sauvignon Blanc",
        country: "New Zealand",
        region: "South Island",
        description: "Oceanic Airlines Domestic and International Airlines.",
        picture: "oceanic.gif"
    },
    {
        name: "Qantas Airlines",
        year: "2009",
        city: "Merlot",
        country: "France",
        region: "Bordeaux",
        description: "Qantas Airlines Domestic and International Airlines.",
        picture: "qantas2.gif"
    },
    {
        name: "Sabena Airlines",
        year: "2009",
        city: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "Sabena Airlines Domestic and International Airlines.",
        picture: "sabena2.gif"
    },
    {
        name: "Singapore Airlines",
        year: "2007",
        city: "Pinot Noir",
        country: "USA",
        region: "Oregon",
        description: "Singapore Airlines Domestic and International Airlines.",
        picture: "singapore_airlines2.gif"
    },
    {
        name: "South African Airways",
        year: "2011",
        city: "Pinot Gris",
        country: "Argentina",
        region: "Mendoza",
        description: "South African Airways Domestic and International Airlines.",
        picture: "southafricanairways2.gif"
    },
    {
        name: "South West Airways",
        year: "2009",
        city: "Chardonnay",
        country: "France",
        region: "Burgundy",
        description: "South West Airways Domestic and International Airlines.",
        picture: "southwest2.gif"
    },
    {
        name: "Spirit Airways",
        year: "2009",
        city: "Cabernet Sauvignon",
        country: "Italy",
        region: "Tuscany",
        description: "Sprit Airways Domestic and International Airlines.",
        picture: "spirit.gif"
    },
    {
        name: "SriLankan Airways",
        year: "2008",
        city: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "SriLankan Airways Domestic and International Airlines.",
        picture: "srilankan.gif"
    },
    {
        name: "Swiss Airways",
        year: "2009",
        city: "Mencia",
        country: "Spain",
        region: "Castilla y Leon",
        description: "Swiss Airways Domestic and International Airlines.",
        picture: "swiss.gif"
    },
    {
        name: "Swiss Air Airways",
        year: "2009",
        city: "Chardonnay",
        country: "USA",
        region: "California",
        description: "Swiss Air Domestic and International Airlines.",
        picture: "swissair3.gif"
    },
    {
        name: "Tap Airlines",
        year: "2010",
        city: "Pinot Gris",
        country: "USA",
        region: "Oregon",
        description: "Tap Airlines Domestic and International Airlines.",
        picture: "tap.gif"
    },
    {
        name: "Tarom Airlines",
        year: "2010",
        city: "Pinot Gris",
        country: "France",
        region: "Alsace",
        description: "Tarom Airlines Domestic and International Airlines.",
        picture: "tarom.gif"
    },
    {
        name: "Thai Airlines",
        year: "2011",
        city: "Zinfandel",
        country: "USA",
        region: "California",
        description: "Thai Airlines Domestic and International Airlines.",
        picture: "thai4.gif"
    },
    {
        name: "Turkish Airlines",
        year: "2009",
        city: "Zinfandel",
        country: "USA",
        region: "California",
        description: "Turkish Airlines Domestic and International Airlines.",
        picture: "turkish.gif"
    },
    {
        name: "United Airlines",
        year: "2010",
        city: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "United Airlines Domestic and International Airlines.",
        picture: "united.gif"
    },
    {
        name: "Varig Airlines",
        year: "2010",
        city: "Cabernet Sauvignon",
        country: "France",
        region: "Bordeaux",
        description: "United Airlines Domestic and International Airlines.",
        picture: "varig.gif"
    },
    {
        name: "Vietnam Airlines",
        year: "2010",
        city: "Sauvignon Blanc",
        country: "New Zealand",
        region: "South Island",
        description: "Vietnam Airlines Domestic and International Airlines.",
        picture: "vietnamairlines.gif"
    },
    {
        name: "Virgin Airlines",
        year: "2008",
        city: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "Virgin Airlines Domestic and International Airlines.",
        picture: "virgin4.gif"
    },
    {
        name: "WideRoe Airlines",
        year: "2009",
        city: "Mencia",
        country: "Spain",
        region: "Castilla y Leon",
        description: "WideRoe Airlines Domestic and International Airlines.",
        picture: "wideroe1.gif"
    }
*/
	//db.airlines.remove();
    db.collection('airlines', function(err, collection) {
        collection.insert(airlines, {safe:true}, function(err, result) {});
    });

    db.collection('airlinescities', function(err, collection) {
        collection.insert(airlinescities, {safe:true}, function(err, result) {});
    });
    
    db.collection('passengercountrycities', function(err, collection) {
        collection.insert(passengercountrycities, {safe:true}, function(err, result) {});
    });
    
    db.collection('userlocation', function(err, collection) {
        collection.insert(userlocation, {safe:true}, function(err, result) {});
    });
    
    db.collection('tempuserlocation', function(err, collection) {
        collection.insert(userlocation, {safe:true}, function(err, result) {});
    });

    db.collection('airlineslocation', function(err, collection) {
        collection.insert(userlocation, {safe:true}, function(err, result) {});
    });    
         
};
