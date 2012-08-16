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

	// play:create
	socket.on('play:create', function(data, callback) {
		var newPlay = new Play({
			name: data.name, 
			description: data.description,
			type: data.type,
			size: data.size,
			teamColors: data.teamColors
		});
		newPlay.save();
		
		var set_1 = new Set({name: "Set_1", number: 1, comments: ""});
		var set_2 = new Set({name: "Set_2", number: 2, comments: ""});
		var set_3 = new Set({name: "Set_3", number: 3, comments: ""});
		newPlay.sets.push(set_1, set_2, set_3);
		newPlay.save();
		
		socket.emit('play:create', newPlay);
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
				return next(new Error("Could not find play"));
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
				return next(err);
			else if (!play) {
				return next(new Error("Could not find play with _id=" + data._id));
			}
			
			for (var attr in data) {
				if (attr !== '_id')
					play[attr] = data[attr];
			}
			
			play.save();
			
			socket.emit('play/' + data._id + ':update', play);
			socket.broadcast.emit('play/' + data._id + ':update', play);
			callback(null, play);
		});
	});
	
	// play:delete
	socket.on('play:delete', function(data, callback) {
		// not implemented yet
		
		socket.emit('play/' + data._id + ':delete', json);
		socket.broadcast.emit('play/' + data._id + ':delete', json);
		callback(null, json);
	});
	
	// set:create
	socket.on('set:create', function(data, callback) {
		Play.findOne({_id: data.play}, function(err, play) {
			if (err) {
				return next(err);
			} else if(!play) {
				return next(new Error("Could not find play with _id=" + data.play));
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
			
			socket.emit('set:create', newSet);
			socket.broadcast.emit('set:create', newSet);
			callback(null, newSet);	
		});			
	});
	
	// set:update
	socket.on('set:update', function(data, callback) {
		Play.findOne({'sets._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find set with _id=" + data._id));
			}
			
			var updateSet = play.sets.id(data._id);
			for (var attr in data) {
				if (attr !== 'play' && attr !== '_id')
					updateSet[attr] = data[attr];
			}
			
			play.save();
			
			socket.emit('set:update', updateSet);
			socket.broadcast.emit('set:update', updateSet);
			callback(null, updateSet);	
		});	
	});
	
	// set:delete
	socket.on('set:delete', function(data, callback) {
		Play.findOne({'sets._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find set with _id=" + data._id));
			}
			
			var deleteSet = play.sets.id(data._id);
			deleteSet.remove();
			play.save();
			
			socket.emit('set:delete', deleteSet);
			socket.broadcast.emit('set:delete', deleteSet);
			callback(null, deleteSet);	
		});
	});
	
	// path:create
	socket.on('path:create', function(data, callback) {
		Play.findOne({'sets._id': data.set}, function(err, play) {
			if (err) {
				return next(err);
			} else if(!play) {
				return next(new Error("Could not find set with _id=" + data.set));
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
			
			socket.emit('path:create', newPath);
			socket.broadcast.emit('path:create', newPath);
			callback(null, newPath);
		});
	});
	
	// path:update
	socket.on('path:update', function(data, callback) {
		Play.findOne({'sets.paths._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find path with _id=" + data._id));
			}
			
			var updatePath = play.sets.id(data.set).paths.id(data._id);
			for (var attr in data) {
				if (attr !== 'set' && attr !== '_id')
					updatePath[attr] = data[attr];
			}
			
			play.save();
			
			socket.emit('path:update', updatePath);
			socket.broadcast.emit('path:update', updatePath);
			callback(null, updatePath);
		});
	});
	
	// path:delete
	socket.on('path:delete', function(data, callback) {
		Play.findOne({'sets.paths._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find path with _id=" + data._id));
			}
			
			for (var i = 0; i < play.sets.length; i++) {
				var deletePath = play.sets[i].paths.id(data._id);
				if (deletePath) {
					deletePath.remove();
					play.save();
					
					socket.emit('path:delete', deletePath);
					socket.broadcast.emit('path:delete', deletePath);
					callback(null, deletePath);
					break;	
				}
			}
		});
	});
	
	// annotation:create
	socket.on('annotation:create', function(data, callback) {
		Play.findOne({'sets._id': data.set}, function(err, play) {
			if (err) {
				return next(err);
			} else if(!play) {
				return next(new Error("Could not find set with _id=" + data.set));
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
			
			socket.emit('annotation:create', newAnnotation);
			socket.broadcast.emit('annotation:create', newAnnotation);
			callback(null, newAnnotation);
		});
	});
	
	// annotation:update
	socket.on('annotation:update', function(data, callback) {
		Play.findOne({'sets.annotations._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find annotation with _id=" + data._id));
			}
			
			var updateAnnotation = play.sets.id(data.set).annotations.id(data._id);
			for (var attr in data) {
				if (attr !== 'set' && attr !== '_id')
					updateAnnotation[attr] = data[attr];
			}
			
			play.save();
			
			socket.emit('annotation:update', updateAnnotation);
			socket.broadcast.emit('annotation:update', updateAnnotation);
			callback(null, updateAnnotation);
		});
	});
	
	// annotation:delete
	socket.on('annotation:delete', function(data, callback) {
		Play.findOne({'sets.annotations._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find annotation with _id=" + data._id));
			}
			
			for (var i = 0; i < play.sets.length; i++) {
				var deleteAnnotation = play.sets[i].annotations.id(data._id);
				if (deleteAnnotation) {
					deleteAnnotation.remove();
					play.save();
					
					socket.emit('annotation:delete', deleteAnnotation);
					socket.broadcast.emit('annotation:delete', deleteAnnotation);
					callback(null, deleteAnnotation);
					break;	
				}
			}
		});
	});
	
	// article:create
	socket.on('article:create', function(data, callback) {
		Play.findOne({_id: data.play}, function(err, play) {
			if (err) {
				return next(err);
			} else if(!play) {
				return next(new Error("Could not find play with _id=" + data.play));
			}
			
			var newArticle = new Article({
				type: data.type,
				color: data.color,
				label: data.label,
				team: data.team
			});
			
			play.articles.push(newArticle);
			play.save();
			
			socket.emit('article:create', newArticle);
			socket.broadcast.emit('article:create', newArticle);
			callback(null, newArticle);	
		});
	});
	
	// article:update
	socket.on('article:update', function(data, callback) {
		Play.findOne({'articles._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find article with _id=" + data._id));
			}
			
			var updateArticle = play.articles.id(data._id);
			for (var attr in data) {
				if (attr !== 'play' && attr !== '_id')
					updateArticle[attr] = data[attr];
			}
			
			play.save();
			
			socket.emit('article:update', updateArticle);
			socket.broadcast.emit('article:update', updateArticle);
			callback(null, updateArticle);	
		});
	});
	
	// article:delete
	socket.on('article:delete', function(data, callback) {
		Play.findOne({'articles._id': data._id}, function(err, play) {
			if (err)
				return next(err);
			else if (!play) {
				return next(new Error("Could not find article with _id=" + data._id));
			}
			
			var deleteArticle = play.articles.id(data._id);
			deleteArticle.remove();
			play.save();
			
			socket.emit('article:delete', deleteArticle);
			socket.broadcast.emit('article:delete', deleteArticle);
			callback(null, deleteArticle);	
		});
	});
});

/* Routes */

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
app.get('/play/:_id', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});
