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

/*
function get_set(req, res, next) {
    var send_result = function(err, set) {
        if (err) {
            return next(err);
        }
        
        if(set) {
            res.send(set);
        } else {
            return next(new Error("Could not find set"));
        }
    };
    
    if('_id' in req.params) {
        Set.findOne({'_id': req.params._id}, send_result);
    } else {
        Set.find({}, send_result);        
    }
}
*/

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
			comments : req.body.comments,
			playId : req.body.play,
			prevSetId : req.body.prevSetId,
			nextSetId : req.body.nextSetId
		});
        
        new_set.save();
        play.sets.push(new_set);
        play.save();
        
        res.send(new_set);
    });
}

// Update name/comments of set
function put_set(req, res, next) {
	Set.findOne({'_id' :req.params._id}, function(err, set) {
		if (err)
			return next(err);
		else if (!set) {
			return next(new Error("Could not find set with _id=" + req.params._id));
		}
		
		for (var attr in req.body) {
			if (attr !== 'play' && attr !== '_id')
				set[attr] = req.body[attr];
		}
		
		set.save();
		
		// propagate up
		Play.findOne({'_id' : set.playId}, function(err, play) {
			var updateSet = play.sets.id(set._id);
			for (var attr in req.body) {
				if (attr !== 'play' && attr !== '_id')
					updateSet[attr] = req.body[attr];
			}

			play.save();
		});
		
		res.send(set);
	});
}

function delete_set(req, res, next) {
	Set.findOne({'_id' :req.params._id}, function(err, set) {
		if (err)
			return next(err);
		else if (!set) {
			return next(new Error("Could not find set with _id=" + req.params._id));
		}
		
		// propagate up
		Play.findOne({'_id' : set.playId}, function(err, play) {
			play.sets.id(set._id).remove();

			play.save();
		});
		
		set.remove();
		
		res.send(set);
	});
}

function post_article(req, res, next) {
	Play.findOne({_id: req.body.play}, function(err, play) {
        if (err) {
            return next(err);
        } else if(!play) {
            return next(new Error("Could not find play with _id=" + req.body.play));
        }
        
        new_article = new Article({type: req.body.type,
                                   color: req.body.color,
                                   playId: req.body.play});
        new_article.save();
        play.articles.push(new_article);
        play.save();
        
        res.send(new_article);
    });
}

function put_article(req, res, next) {
	Article.findOne({'_id' :req.params._id}, function(err, article) {
		if (err)
			return next(err);
		else if (!article) {
			return next(new Error("Could not find article with _id=" + req.params._id));
		}
		
		for (var attr in req.body) {
			if (attr !== 'play' && attr !== '_id')
				article[attr] = req.body[attr];
		}
		
		article.save();
		
		// propagate up
		Play.findOne({'_id' : article.playId}, function(err, play) {
			var updateArticle = play.articles.id(article._id);
			for (var attr in req.body) {
				if (attr !== 'play' && attr !== '_id')
					updateArticle[attr] = req.body[attr];
			}

			play.save();
		});
		
		res.send(article);
	});
}

function delete_article(req, res, next) {
	Article.findOne({'_id' :req.params._id}, function(err, article) {
		if (err)
			return next(err);
		else if (!article) {
			return next(new Error("Could not find article with _id=" + req.params._id));
		}
		
		// propagate up
		Play.findOne({'_id' : article.playId}, function(err, play) {
			play.articles.id(article._id).remove();

			play.save();
		});
		
		article.remove();
		
		res.send(article);
	});
}

/* Routes */

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});

// Play routes
app.get('/play/:_id', get_play);
app.post('/play', post_play);
app.put('/play/:_id', put_play);
app.delete('/play/:_id', delete_play);

// Set routes
//app.get('/set/:_id', get_set);
app.post('/set', post_set);
app.put('/set/:_id', put_set);
app.delete('/set/:_id', delete_set);

// Article routes
//app.get('/article/:id', get_article);
app.post('/article', post_article);
app.put('/article/:_id', put_article);
app.delete('/article/:_id', delete_article);

app.listen(3000);

