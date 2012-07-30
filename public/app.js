/* CONSTANTS */
var SCALE = 10;
var START_X = 150;
var START_Y = 50;

/* GLOBALS */
var stage;
var articleId = 0;

$(document).ready(function() {
	stage = new Kinetic.Stage({
		container: "canvas",
		width: 1000,
		height: 1000,
	});

	// Depending on field
	var field = ultimateField();
	
    stage.add(field);
});

$(function() {
	$.playbook = {}
	
	/*
	$.playbook.Play = Backbone.Model.extend({
		defaults: function() {
			return {
				name: "untitled play",
				teams: [],
				ball: "default",
				sets: [],
				steps: []
			};
		},
		
		addTeam: function() {
		
		},
		
		removeTeam: function() {
		
		},
		
		addSet: function() {
		
		},
		
		removeSet: function() {
		
		},
		
		addStep: function() {
		
		},
		
		removeStep: function() {
		
		}
	});
	*/
	
	$.playbook.Article = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				x: 0,
				y: 0,
				type: "player",
				color: "blue"
			};
		},
		
		urlRoot: "/article"
	});
	/*
	ArticleCollection = Backbone.Collection.extend({
		localStorage: new Store("articles")
	});
	*/
	$.playbook.Set = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		relations: [{
			type: Backbone.HasMany,
			key: 'articles',
			relatedModel: '$.playbook.Article',
			//collectionType: 'ArticleCollection',
			reverseRelation: {
				key: 'set',
				includeInJSON: '_id',
			}
		}],
		
		defaults: function() {
			return {
				name: "set_",
				description: "no description",
			};
		},
		
		urlRoot: "/set"
		//localStorage: new Store("sets"),
		
		
	});
	
	//var set = new $.playbook.Set({name : "test1", description : "arrow", _id : "501611993b45987f33000001" });
	//set.save();
	
	$.playbook.ArticleView = Backbone.View.extend({
		li: "div",
		
		template: $("#article-template").html(),
		
		events: {
			"keypress .label" : "test",
			"change select"   : "changeType",
			"click .delete"   : "destroy"
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
      		this.model.on('destroy', this.remove, this);
		},
		
		render: function() {
			var html = Mustache.render(this.template, this.model.toJSON());
			// Hack to select correct item in list
			html = $(html).find('option[value=' + this.model.get("type") + ']').attr('selected', 'selected').end().html();
			this.$el.html(html);
			return this;
		},
		
		show: function() {
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
		},
		
		test: function() {
			console.log(this.model);
			console.log(this);
		},
		
		updateLabel: function(e) {
			console.log("Not yet implemented.");
		},
		
		changeType: function(e) {
			this.model.save({type: e.currentTarget.value});
			
			var article = createArticle(this.model);
			
			var view = this;
			article.on('click', function(e) {
				view.show();
			});		
						
			article.on('dragstart', function(e) {
				view.show();
			});
		
			article.on('dragend', function(e) {
				view.model.save({x : this.getX(), y : this.getY()});
			});
			
			this.shape.parent.add(article);
			this.shape.parent.remove(this.shape);
			this.shape.parent.draw();
			
			this.shape = article;
		},
		
		destroy: function() {
			// Potentially need to save parent here
			this.shape.parent.remove(this.shape);
			this.shape.parent.draw();
			this.model.destroy();
		}
	});
	
	$.playbook.SetView = Backbone.View.extend({
		el: $("#set"),
		
		template: $("#set-template").html(),
		
		events: {
			"dblclick .name"    : "editName",
			"blur .name-edit"   : "updateName",
			"dblclick .desc"    : "editDescription",
			"blur .desc-edit"   : "updateDescription",
			"click #add-player" : "addPlayer",
			"click #add-ball"   : "addBall"
		},
		
		initialize: function() {
			this.layer = new Kinetic.Layer({
				x: START_X,
				y: START_Y,
				name: "setLayer"
			});
			stage.add(this.layer);
			
			this.model.on('change', this.render, this);
			this.model.on('add', this.add, this);
			this.model.on('init', this.addAll, this);
			
			this.model.fetch({
				success: function(model, response) {
					model.trigger('init');
				}
			});
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			return this;
		},
		
		add: function(item) {
			var article = createArticle(item);
			
			var view = new $.playbook.ArticleView({model: item});
			view.shape = article;
			
			// Add info div
			$("#article").append(view.render().el);
			
			article.on('click', function(e) {
				view.show();
			});
				
			article.on('dragstart', function(e) {
				view.show();
			});
			
			article.on('dragend', function(e) {
				item.save({x : this.getX(), y : this.getY()});
			});
			
			this.layer.add(article);
			this.layer.draw();
		},
		
		addAll: function() {
			var tempModel = this.model;
			console.log(this.model.get("articles"));
			this.model.get("articles").each(function(item) {
				console.log(this);
				tempModel.trigger('add', item);
			});
		},
		
		editName: function(e) {
			$(e.currentTarget).addClass("edit");
			$(e.currentTarget).find("input").focus();
		},
		
		updateName: function(e) {
			$(e.currentTarget).parent().removeClass("edit");
			this.model.save({name: e.currentTarget.value});
		},
		
		editDescription: function(e) {
			$(e.currentTarget).addClass("edit");
			$(e.currentTarget).find("textarea").focus();
		},
		
		updateDescription: function(e) {
			$(e.currentTarget).parent().removeClass("edit");
			this.model.save({description: e.currentTarget.value});
		},
		
		addPlayer: function(e) {
			var player = new $.playbook.Article({type: "player", set: this.model.get("_id")});
			player.save();
			this.model.trigger('add', player);
		},
		
		addBall: function(e) {
			this.collection.create({type: "ball", color: "white"});
		},
		
		addCone: function(e) {
			this;
		}
		
	});
	
	//var setView = new $.playbook.SetView({model: set});
	
	$.playbook.Router = Backbone.Router.extend({
		routes: {
			"set/:_id":		"show_set",
		},
		
		show_set : function(_id) {
			var set = new $.playbook.Set({_id: _id});
			var setView = new $.playbook.SetView({model: set});
		},
	});
	
	$.playbook.app = null;
	
	$.playbook.bootstrap = function() {
		$.playbook.app = new $.playbook.Router();
		Backbone.history.start({pushState: true});
	}
	
	$.playbook.bootstrap();
	$("#start-button").on("click", function(event) {
		$.playbook.app.navigate('set/501611993b45987f33000001', {trigger: true});
	});
});

function createArticle(item) {
	if (item.get("type") === "player") {
		return createPlayer(item);
	} else if (item.get("type") === "ball") {
		return createBall(item);
	} else if (item.get("type") === "cone") {
		return createCone(item);
	}
}

function createPlayer(player) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: player.get("color"),
		stroke: "black",
		strokeWidth: 1,
		x: player.get("x"),
		y: player.get("y"),
		draggable: true
	});
}

function createBall(ball) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: "white",
		stroke: "black",
		strokeWidth: 1,
		x: ball.get("x"),
		y: ball.get("y"),
		draggable: true
	});
}

function createCone(cone) {
	return new Kinetic.RegularPolygon({
		sides: 3,
		radius: 1.5 * SCALE,
		fill: "orange",
		stroke: "black",
		strokeWidth: 1,
		x: cone.get("x"),
		y: cone.get("y"),
		draggable: true
	});
}