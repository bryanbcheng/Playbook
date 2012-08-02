
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
  	startX		: Number
  , startY		: Number
  , endX		: Number
  , endY		: Number
  , articleId	: { type: Schema.ObjectId, required: true }
});

var Set = new Schema({
    name		: String
  ,	number		: { type: Number, required: true }
  , comments	: String
  , paths		: [Path]
  , prevSetId	: Schema.ObjectId
  , nextSetId	: Schema.ObjectId
});

var Play = new Schema({
	name		: String
  , description	: String
  , sport		: { type : String, enum: ['ultimate'] }
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

mongoose.model('Article', Article);
exports.Article = function(db) {
    return db.model('Article');
};

