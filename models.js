/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * Schema definition
 */

var User = new Schema({
	email		: { type: String, unique: true }
  ,	name		: String
  ,	password	: String // TODO: FOR NOW STORE RAW STRING...
  ,	token		: String
  , teams		: [Schema.ObjectId]
}, { strict: true });

var Team = new Schema({
	name		: { type: String, unique: true }
  ,	password	: String // TODO: hash
  ,	players		: [Schema.ObjectId]
}, { strict: true });

var Article = new Schema({
    type		: { type: String, enum: ['player', 'ball', 'cone'] }
  , color		: String
  , shape		: String
  , label		: { type: String, uppercase: true }
  , team		: String
}, { strict: true });

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
}, { strict: true });

var Annotation = new Schema({
	text		: String
  ,	x			: Number
  ,	y			: Number
  , width		: Number
  , height		: Number
}, { strict: true });

var Set = new Schema({
    name		: String
  ,	number		: { type: Number, required: true }
  , comments	: String
  , paths		: [Path]
  , annotations	: [Annotation]
}, { strict: true });

var Owner = new Schema({
	ownerId: Schema.ObjectId
  ,	ownerType: { type: String, enum: ['user', 'team'] }
}, {
	strict: true
  ,	_id: false
});

var Play = new Schema({
	name		: String
  , description	: String
  , fieldType	: { type : String, enum: ['ultimate', 'soccer', 'football', 'basketball'] }
  , fieldSize	: { type : String, enum: ['full', 'half', 'empty'] }
  , teamColors	: [String]
  , teamShapes	: [String]
  , articles	: [Article]
  , sets		: [Set]
  , privacy		: { type : String, enum: ['public', 'protected', 'private'], required: true }
  , categories	: [String]
  , owners		: [Owner]
}, { strict: true });

// validate teamColors, teamShapes length == 2

/**
 * Models
 */

mongoose.model('User', User);
exports.User = function(db) {
	return db.model('User');
};

mongoose.model('Team', Team);
exports.Team = function(db) {
	return db.model('Team');
};

mongoose.model('Play', Play);
exports.Play = function(db) {
	return db.model('Play');
};

mongoose.model('Owner', Owner);
exports.Owner = function(db) {
	return db.model('Owner');
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

