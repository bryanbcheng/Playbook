/* Imports */
var express = require('express'),
	$ = require('jquery'),
	_ = require('underscore');

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
  , Set = require('./models.js').Set(db)
  , Article = require('./models.js').Article(db);

/* Views */

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

function post_set(req, res, next) {
	new_set = new Set({name: req.body.name, description: req.body.description});
    new_set.save();
    res.send(new_set);
}

function post_article(req, res, next) {
    Set.findOne({_id: req.body.set}, function(err, set) {
        if (err) {
            return next(err);
        } else if(!set) {
            return next(new Error("Could not find set with _id=" + req.body.set));
        }
        
        new_article = new Article({x: req.body.x,
                                   y: req.body.y,
                                   type: req.body.type,
                                   color: req.body.color});
        new_article.save();
        set.articles.push(new_article);
        set.save();
        
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
			article[attr] = req.body[attr];
		}
		
		article.save();
		
		Set.findOne({'_id' : article.set}, function(err, set) {
			$.each(set.articles, function (index, value) {
				if (_.isEqual(article._id, value._id)) {
					set.articles[index] = article;
					return false;
				}
			});
			console.log('aaa' + set);
			set.save(function(err) {
				console.log('hwhuwhwuwh');
				if (err) console.log("123456" + err);
			});
			console.log('bbb' + set);
		});
		
		res.send(article);
	});
}

/* Routes */

app.get('/', function(req, res) {
	res.sendfile('public/index.html');
});

app.get('/set/:_id', get_set);
app.post('/set', post_set);
//app.get('/article/:id', get_article);
app.post('/article', post_article);
app.put('/article/:_id', put_article);

app.listen(3000);

