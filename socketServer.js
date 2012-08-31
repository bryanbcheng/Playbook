/* Imports */
var express = require('express'),
	_ = require('underscore'),
	util = require('util');

var app = express();
var server = app.listen(process.env['app_port'] || 3000);
var io = require('socket.io').listen(server);

/* Configuration */
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/* Database */

if (!process.env.NODE_ENV) {
  var mongo = {"hostname":"localhost", "port":27017, "db":"playbook"};
} else {
  var mongo = {"hostname":"ds037097.mongolab.com", "port":37097, "username":"bloodthirsty", "password":"smut", "name":"", "db":"playbook"};
}

var generate_mongo_url = function(obj) {
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'kudoshare');

  if (obj.username && obj.password) {
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  } else {
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
}

var mongourl = generate_mongo_url(mongo);

var mongoose = require('mongoose')
  , db = mongoose.connect(mongourl)
  , Play = require('./models.js').Play(db)
  , Set = require('./models.js').Set(db)
  , Path = require('./models.js').Path(db)
  , Annotation = require('./models.js').Annotation(db)
  , Article = require('./models.js').Article(db);

/* Socket.io Connections */

io.sockets.on('connection', function(socket) {
	// plays:read
	socket.on('plays:read', function(data, callback) {
		var send_result = function(err, plays) {
			if (err) {
				return callback(err);
			}
			
			if(plays) {
				callback(null, plays);
			} else {
				return callback(new Error("Could not find plays"));
			}
		};
		
		// Makes the query much smaller and faster -path not needed, but for extra safety
// 		var selectFields = "name description fieldType -fieldSize -teamColors -teamShapes -articles -sets -privacy categories";
		var selectFields = "name description fieldType categories";
		if(!_.isEmpty(data)) {
			// Find based on query
// 			Play.find({'_id': data._id}, selectFields, send_result);
			Play.find({privacy: "public"}, selectFields, send_result);
		} else {
			Play.find({privacy: "public"}, selectFields, send_result);
		}
	});


	// play:create
	socket.on('play:create', function(data, callback) {
		var newPlay = new Play({
			name: data.name, 
			description: data.description,
			fieldType: data.fieldType,
			fieldSize: data.fieldSize,
			teamColors: data.teamColors,
			teamShapes: data.teamShapes,
			privacy: data.privacy,
		});
		newPlay.save();
		
		var set_1 = new Set({name: "Set_1", number: 1, comments: ""});
		var set_2 = new Set({name: "Set_2", number: 2, comments: ""});
		var set_3 = new Set({name: "Set_3", number: 3, comments: ""});
		newPlay.sets.push(set_1, set_2, set_3);
		
		if (data.formation) {
			for (var index in data.formation) {
				var item = data.formation[index];
				
				var newArticle = new Article({
					type: item.type,
					color: item.color,
					shape: item.shape,
					label: item.label,
					team: item.team
				});
				newPlay.articles.push(newArticle);
				
				// for each set, add the path
				for (var i = 0; i < newPlay.sets.length; i++) {
					var set = newPlay.sets[i];
					var newPath;
					if (set.number === 1) {
						newPath = new Path({
							prevX: null,
							prevY: null,
							currX: item.x + data.offset.x,
							currY: item.y + data.offset.y,
							nextX: item.x + data.offset.x,
							nextY: item.y + data.offset.y,
							articleId: newArticle._id
						});
					} else {
						newPath = new Path({
							prevX: item.x + data.offset.x,
							prevY: item.y + data.offset.y,
							currX: item.x + data.offset.x,
							currY: item.y + data.offset.y,
							nextX: item.x + data.offset.x,
							nextY: item.y + data.offset.y,
							articleId: newArticle._id
						});
					}
					set.paths.push(newPath);
				}
			}
		}
		
		newPlay.save();
		
		//socket.emit('play:create', newPlay);
		socket.broadcast.emit('play:create', newPlay);
		callback(null, newPlay);
	});
	
	// play:read
	socket.on('play:read', function(data, callback) {
		var send_result = function(err, play) {
			if (err) {
				return callback(err);
			}
			
			if(play) {
				callback(null, play);
			} else {
				return callback(new Error("Could not find play"));
			}
		};
		
		if(data._id) {
			Play.findOne({'_id': data._id}, send_result);
		} else {
			Play.find({}, send_result);        
		}
	});
	
	// play:update
	socket.on('play:update', function(data, callback) {
		Play.findOne({'_id' :data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find play with _id=" + data._id));
			}
			
			for (var attr in data) {
				if (attr !== '_id')
					play[attr] = data[attr];
			}
			
			play.save();
			
			// TODO: only send partial data since play is very large
			//socket.emit('play/' + data._id + ':update', play);
			socket.broadcast.emit('play/' + data._id + ':update', play);
			callback(null, play);
		});
	});
	
	// play:delete
	socket.on('play:delete', function(data, callback) {
		// not implemented yet
		
		//socket.emit('play/' + data._id + ':delete', json);
		socket.broadcast.emit('play/' + data._id + ':delete', json);
		callback(null, json);
	});
	
	// custom events
	// play:reset
	socket.on('play:reset', function(data) {
		Play.findOne({'_id' :data._id}, function(err, play) {
			/*
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find play with _id=" + data._id));
			}
			*/
			play.articles = new Array();
			
			var newSets = new Array();
			var set_1 = new Set({name: "Set_1", number: 1, comments: ""});
			var set_2 = new Set({name: "Set_2", number: 2, comments: ""});
			var set_3 = new Set({name: "Set_3", number: 3, comments: ""});
			newSets.push(set_1, set_2, set_3);
			play.sets = newSets;
			play.save();
			
			socket.emit('play/' + data._id + ':reset', play);
			socket.broadcast.emit('play/' + data._id + ':reset', play);
// 			callback(null, play);
		});
	});
	
	// set:create
	socket.on('set:create', function(data, callback) {
		Play.findOne({_id: data.play}, function(err, play) {
			if (err) {
				return callback(err);
			} else if(!play) {
				return callback(new Error("Could not find play with _id=" + data.play));
			}
			
			var newSet = new Set({
				name : data.name,
				number : data.number,
				comments : data.comments,
				paths: data.paths,
				annotations: data.annotations
			});
			
			play.sets.push(newSet);
			play.save();
			
			//socket.emit('set/' + data._id + ':create', newSet);
			//socket.broadcast.emit('set/' + data._id + ':create', newSet);
			socket.broadcast.emit('play/' + data.play + ':createSet', newSet);
			callback(null, newSet);	
		});			
	});
	
	// set:update
	socket.on('set:update', function(data, callback) {
		Play.findOne({'sets._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find set with _id=" + data._id));
			}
			
			var updateSet = play.sets.id(data._id);
			for (var attr in data) {
				if (attr !== 'play' && attr !== '_id')
					updateSet[attr] = data[attr];
			}
			
			play.save();
			
			//socket.emit('set/' + data._id + ':update', updateSet);
			socket.broadcast.emit('set/' + data._id + ':update', updateSet);
			callback(null, updateSet);	
		});	
	});
	
	// set:delete
	socket.on('set:delete', function(data, callback) {
		Play.findOne({'sets._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find set with _id=" + data._id));
			}
			
			var deleteSet = play.sets.id(data._id);
			deleteSet.remove();
			play.save(function(err, play) {
				if (err) {
					return callback(new Error("Could not save play"));
				}
				
				//socket.emit('set/' + data._id + ':delete', deleteSet);
				socket.broadcast.emit('set/' + data._id + ':delete', deleteSet);
				callback(null, deleteSet);	
			});
		});
	});
	
	// path:create
	socket.on('path:create', function(data, callback) {
		Play.findOne({'sets._id': data.set}, function(err, play) {
			if (err) {
				return callback(err);
			} else if(!play) {
				return callback(new Error("Could not find set with _id=" + data.set));
			}
			
			var newPath = new Path({
				prevX: data.prevX,
				prevY: data.prevY,
				currX: data.currX,
				currY: data.currY,
				nextX: data.nextX,
				nextY: data.nextY,
				articleId: data.articleId
			});
			
			play.sets.id(data.set).paths.push(newPath);
			play.save();
			
			//socket.emit('path/' + data._id + ':create', newPath);
			//socket.broadcast.emit('path/' + data._id + ':create', newPath);
			socket.broadcast.emit('set/' + data.set + ':createPath', newPath);
			callback(null, newPath);
		});
	});
	
	// path:update
	socket.on('path:update', function(data, callback) {
		Play.findOne({'sets.paths._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find path with _id=" + data._id));
			}
			
			var updatePath = play.sets.id(data.set).paths.id(data._id);
			for (var attr in data) {
				if (attr !== 'set' && attr !== '_id')
					updatePath[attr] = data[attr];
			}
			
			play.save();
			
			//socket.emit('path/' + data._id + ':update', updatePath);
			socket.broadcast.emit('path/' + data._id + ':update', updatePath);
			callback(null, updatePath);
		});
	});
	
	// path:delete
	socket.on('path:delete', function(data, callback) {
		Play.findOne({'sets.paths._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find path with _id=" + data._id));
			}
			
			for (var i = 0; i < play.sets.length; i++) {
				var deletePath = play.sets[i].paths.id(data._id);
				if (deletePath) {
					deletePath.remove();
					play.save(function(err, play) {
						if (err) {
							return callback(new Error("Could not save play"));
						}
						
						//socket.emit('path/' + data._id + ':delete', deletePath);
						socket.broadcast.emit('path/' + data._id + ':delete', deletePath);
						callback(null, deletePath);
					});
					
					break;
				}
			}
		});
	});
	
	// annotation:create
	socket.on('annotation:create', function(data, callback) {
		Play.findOne({'sets._id': data.set}, function(err, play) {
			if (err) {
				return callback(err);
			} else if(!play) {
				return callback(new Error("Could not find set with _id=" + data.set));
			}
			
			var newAnnotation = new Annotation({
				text: data.text,
				x: data.x,
				y: data.y,
				width: data.width,
				height: data.height
			});
			
			play.sets.id(data.set).annotations.push(newAnnotation);
			play.save();
			
			//socket.emit('annotation:create', newAnnotation);
			//socket.broadcast.emit('annotation/' + data._id + ':create', newAnnotation);
			socket.broadcast.emit('set/' + data.set + ':createAnnotation', newAnnotation);
			callback(null, newAnnotation);
		});
	});
	
	// annotation:update
	socket.on('annotation:update', function(data, callback) {
		Play.findOne({'sets.annotations._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find annotation with _id=" + data._id));
			}
			
			var updateAnnotation = play.sets.id(data.set).annotations.id(data._id);
			for (var attr in data) {
				if (attr !== 'set' && attr !== '_id')
					updateAnnotation[attr] = data[attr];
			}
			
			play.save();
			
			//socket.emit('annotation/' + data._id + ':update', updateAnnotation);
			socket.broadcast.emit('annotation/' + data._id + ':update', updateAnnotation);
			callback(null, updateAnnotation);
		});
	});
	
	// annotation:delete
	socket.on('annotation:delete', function(data, callback) {
		Play.findOne({'sets.annotations._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find annotation with _id=" + data._id));
			}
			
			for (var i = 0; i < play.sets.length; i++) {
				var deleteAnnotation = play.sets[i].annotations.id(data._id);
				if (deleteAnnotation) {
					deleteAnnotation.remove();
					play.save(function(err, play) {
						if (err) {
							return callback(new Error("Could not save play"));
						}						
						
						//socket.emit('annotation/' + data._id + ':delete', deleteAnnotation);
						socket.broadcast.emit('annotation/' + data._id + ':delete', deleteAnnotation);
						callback(null, deleteAnnotation);
					});
					
					break;	
				}
			}
		});
	});
	
	// article:create
	socket.on('article:create', function(data, callback) {
		Play.findOne({_id: data.play}, function(err, play) {
			if (err) {
				return callback(err);
			} else if(!play) {
				return callback(new Error("Could not find play with _id=" + data.play));
			}
			
			var newArticle = new Article({
				type: data.type,
				color: data.color,
				shape: data.shape,
				label: data.label,
				team: data.team
			});
			
			play.articles.push(newArticle);
			play.save();
			
			//socket.emit('article/' + data._id + ':create', newArticle);
			//socket.broadcast.emit('article/' + data._id + ':create', newArticle);
			socket.broadcast.emit('play/' + data.play + ':createArticle', newArticle);
			callback(null, newArticle);	
		});
	});
	
	// article:update
	socket.on('article:update', function(data, callback) {
		Play.findOne({'articles._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find article with _id=" + data._id));
			}
			
			var updateArticle = play.articles.id(data._id);
			for (var attr in data) {
				if (attr !== 'play' && attr !== '_id')
					updateArticle[attr] = data[attr];
			}
			
			play.save();
			
			//socket.emit('article/' + data._id + ':update', updateArticle);
			socket.broadcast.emit('article/' + data._id + ':update', updateArticle);
			callback(null, updateArticle);	
		});
	});
	
	// article:delete
	socket.on('article:delete', function(data, callback) {
		Play.findOne({'articles._id': data._id}, function(err, play) {
			if (err)
				return callback(err);
			else if (!play) {
				return callback(new Error("Could not find article with _id=" + data._id));
			}
			
			var deleteArticle = play.articles.id(data._id);
			deleteArticle.remove();
			play.save(function(err, play) {
				if (err) {
					return callback(new Error("Could not save play"));
				}
				
				//socket.emit('article/' + data._id + ':delete', deleteArticle);
				socket.broadcast.emit('article/' + data._id + ':delete', deleteArticle);
				callback(null, deleteArticle);	
			});
		});
	});
});

/* Routes */

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
app.get('/plays', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
app.get('/play/:_id', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

