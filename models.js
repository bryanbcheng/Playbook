
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var Article = new Schema({
    type		: { type: String, enum: ['player', 'ball', 'cone'] }
  , color		: String
  , shape		: String
  , label		: { type: String, uppercase: true }
  , team		: String
});

Article.path('label').validate(function (v) {
  return v.length <= 3;
}, 'Label too long'); 

var Path = new Schema({
	prevX		: Number
  , prevY		: Number
  ,	currX		: Number
  , currY		: Number
  , nextX		: Number
  , nextY		: Number
  , articleId	: { type: Schema.ObjectId, required: true }
});

var Annotation = new Schema({
	text		: String
  ,	x			: Number
  ,	y			: Number
  , width		: Number
  , height		: Number
});

var Set = new Schema({
    name		: String
  ,	number		: { type: Number, required: true }
  , comments	: String
  , paths		: [Path]
  , annotations	: [Annotation]
});

var Play = new Schema({
	name		: String
  , description	: String
  , type		: { type : String, enum: ['ultimate', 'soccer', 'football'] }
  , size		: { type : String, enum: ['full', 'half'] }
  , teamColors	: [String]
  , teamShapes	: [String]
  , articles	: [Article]
  , sets		: [Set]
});

/**
 * Models
 */

mongoose.model('Play', Play);
exports.Play = function(db) {
	return db.model('Play');
};

mongoose.model('Set', Set);
exports.Set = function(db) {
	return db.model('Set');
};

mongoose.model('Path', Path);
exports.Path = function(db) {
	return db.model('Path');
};

mongoose.model('Annotation', Annotation);
exports.Annotation = function(db) {
	return db.model('Annotation');
};

mongoose.model('Article', Article);
exports.Article = function(db) {
    return db.model('Article');
};

