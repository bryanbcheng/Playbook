
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
  , label		: { type: String, uppercase: true }
});

Article.path('label').validate(function (v) {
  return v.length <= 2;
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

var Set = new Schema({
    name		: String
  ,	number		: { type: Number, required: true }
  , comments	: String
  , paths		: [Path]
});

var Play = new Schema({
	name		: String
  , description	: String
  , sport		: { type : String, enum: ['ultimate', 'soccer'] }
  , size		: { type : String, enum: ['full', 'half'] }
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

mongoose.model('Article', Article);
exports.Article = function(db) {
    return db.model('Article');
};

