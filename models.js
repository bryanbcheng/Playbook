
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var Set = new Schema({
    name		: String
  ,	description	: String
  , articles	: [Article]
});

var Article = new Schema({
    x			: Number
  , y			: Number 
  , type		: String
  , color		: String
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

