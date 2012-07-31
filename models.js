
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var Article = new Schema({
    x			: Number
  , y			: Number 
  , type		: { type: String, enum: ['player', 'ball', 'cone'] }
  , color		: String
  , label		: { type: String, uppercase: true }
  , setId		: Schema.ObjectId
});

Article.path('label').validate(function (v) {
  return v.length <= 2;
}, 'Label too long'); 

var Set = new Schema({
    name		: String
  ,	description	: String
  , articles	: [Article]
});

/**
 * Models
 */

mongoose.model('Set', Set);
exports.Set = function(db) {
  return db.model('Set');
};

mongoose.model('Article', Article);
exports.Article = function(db) {
    return db.model('Article');
};

