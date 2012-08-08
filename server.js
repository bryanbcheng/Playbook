/* Imports */
var express = require('express'),
	$ = require('jquery'),
	_ = require('underscore'),
	util = require('util');

var app = express.createServer();

/* Configuration */
app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/* Database */

var mongoose = require('mongoose')
  , db = mongoose.connect('mongodb://localhost/playbook')
  , Play = require('./models.js').Play(db)
  , Set = require('./models.js').Set(db)
  , Path = require('./models.js').Path(db)
  , Article = require('./models.js').Article(db);

/* Views */

function get_play(req, res, next) {
	var send_result = function(err, play) {
        if (err) {
            return next(err);
        }
        
        if(play) {
            res.send(play);
        } else {
            return next(new Error("Could not find play"));
        }
    };
    
    if('_id' in req.params) {
        Play.findOne({'_id': req.params._id}, send_result);
    } else {
        Play.find({}, send_result);        
    }
}

function post_play(req, res, next) {
	new_play = new Play({name: req.body.name, description: req.body.description});
    new_play.save();
    res.send(new_play);
}

// Update name/description of play
function put_play(req, res, next) {
	Play.findOne({'_id' :req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find play with _id=" + req.params._id));
		}
		
		for (var attr in req.body) {
			if (attr !== '_id')
				play[attr] = req.body[attr];
		}
		
		play.save();
		
		// propagate up
		
		res.send(play);
	});
}

function delete_play(req, res, next) {
	// no implemented yet
}

function post_set(req, res, next) {
	Play.findOne({_id: req.body.play}, function(err, play) {
        if (err) {
            return next(err);
        } else if(!play) {
            return next(new Error("Could not find play with _id=" + req.body.play));
        }
        
        new_set = new Set({
			name : req.body.name,
			number : req.body.number,
			comments : req.body.comments
		});
       	
        play.sets.push(new_set);
        play.save();
        
        res.send(new_set);
    });
}

// Update name/comments of set
function put_set(req, res, next) {
	Play.findOne({'sets._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find set with _id=" + req.params._id));
		}
		
		var updateSet = play.sets.id(req.params._id);
		for (var attr in req.body) {
			if (attr !== 'play' && attr !== '_id')
				updateSet[attr] = req.body[attr];
		}
		
		play.save();
		
		res.send(updateSet);
	});
}

function delete_set(req, res, next) {
	Play.findOne({'sets._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find set with _id=" + req.params._id));
		}
		
		var deleteSet = play.sets.id(req.params._id);
		deleteSet.remove();
		res.send(deleteSet);
	});
}

function post_path(req, res, next) {
	Play.findOne({'sets._id': req.body.set}, function(err, play) {
        if (err) {
            return next(err);
        } else if(!play) {
            return next(new Error("Could not find set with _id=" + req.body.set));
        }
        
        new_path = new Path({
        	prevX: req.body.prevX,
        	prevY: req.body.prevY,
        	currX: req.body.currX,
        	currY: req.body.currY,
        	nextX: req.body.nextX,
        	nextY: req.body.nextY,
        	articleId: req.body.articleId
        });
        
        play.sets.id(req.body.set).paths.push(new_path);
        play.save();
        
        res.send(new_path);
    });
}

function put_path(req, res, next) {
	Play.findOne({'sets.paths._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find path with _id=" + req.params._id));
		}
		
		var updatePath = play.sets.id(req.body.set).paths.id(req.params._id);
		for (var attr in req.body) {
			if (attr !== 'set' && attr !== '_id')
				updatePath[attr] = req.body[attr];
		}
		
		play.save();
		
		res.send(updatePath);
	});
}

function delete_path(req, res, next) {
	Play.findOne({'sets.paths._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find path with _id=" + req.params._id));
		}
		
		for (var i = 0; i < play.sets.length; i++) {
			var deletePath = play.sets[i].paths.id(req.params._id);
			if (deletePath) {
				deletePath.remove();
				res.send(deletePath);
				play.save();
				break;	
			}
		}
	});
}

function post_article(req, res, next) {
	Play.findOne({_id: req.body.play}, function(err, play) {
        if (err) {
            return next(err);
        } else if(!play) {
            return next(new Error("Could not find play with _id=" + req.body.play));
        }
        
        new_article = new Article({
        	type: req.body.type,
        	color: req.body.color,
        	label: req.body.label
        });
        
        play.articles.push(new_article);
        play.save();
        
        res.send(new_article);
    });
}

function put_article(req, res, next) {
	Play.findOne({'articles._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find article with _id=" + req.params._id));
		}
		
		var updateArticle = play.articles.id(req.params._id);
		for (var attr in req.body) {
			if (attr !== 'play' && attr !== '_id')
				updateArticle[attr] = req.body[attr];
		}
		
		play.save();
		
		res.send(updateArticle);
	});
}

function delete_article(req, res, next) {
	Play.findOne({'articles._id': req.params._id}, function(err, play) {
		if (err)
			return next(err);
		else if (!play) {
			return next(new Error("Could not find article with _id=" + req.params._id));
		}
		
		var deleteArticle = play.articles.id(req.params._id);
		deleteArticle.remove();
		play.save();
		
		res.send(deleteArticle);
	});
}

/* Routes */

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});
app.get('/play/:_id', function(req, res) {
	res.sendfile('public/index.html');
});


// Play routes
app.get('/api/play/:_id', get_play);
app.post('/api/play', post_play);
app.put('/api/play/:_id', put_play);
app.delete('/api/play/:_id', delete_play);

// Set routes
//app.get('/api/set/:_id', get_set);
app.post('/api/set', post_set);
app.put('/api/set/:_id', put_set);
app.delete('/api/set/:_id', delete_set);

// Path routes
app.post('/api/path', post_path);
app.put('/api/path/:_id', put_path);
app.delete('/api/path/:_id', delete_path);

// Article routes
//app.get('/api/article/:id', get_article);
app.post('/api/article', post_article);
app.put('/api/article/:_id', put_article);
app.delete('/api/article/:_id', delete_article);

app.listen(3000);

