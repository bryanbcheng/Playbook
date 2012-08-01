/* CONSTANTS */
var SCALE = 10;
var START_X = 150;
var START_Y = 50;

/* GLOBALS */
var stage;
var articleId = 0;

// $(document).ready(function() {
// 	stage = new Kinetic.Stage({
// 		container: "canvas",
// 		width: 1000,
// 		height: 1000,
// 	});
// 
// 	// Depending on field
// 	var field = ultimateField();
// 	
//     stage.add(field);
// });

$(function() {
	$.playbook = {}
	
	$.playbook.Article = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				x: 0,
				y: 0,
				type: "player",
				color: "blue",
				label: ""
			};
		},
		
		urlRoot: "/article"
	});
	
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
				name: "" ,
				comments: "",
				prevSetId: null,
				nextSetId: null
			};
		},
		
		initialize: function() {
			if (!this.get("name")) this.set("name", "Set_" + this.get("number"));
		},
		
		urlRoot: "/set"
		//localStorage: new Store("sets"),
		
		
	});
	
	$.playbook.Play = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		relations: [
			{
				type: Backbone.HasMany,
				key: 'articles',
				relatedModel: '$.playbook.Article',
				reverseRelation: {
					key: 'play',
					includeInJSON: '_id',
				}
			},
			{
				type: Backbone.HasMany,
				key: 'sets',
				relatedModel: '$.playbook.Set',
				reverseRelation: {
					key: 'play',
					includeInJSON: '_id',
				}
			}
		],
		
		defaults: function() {
			return {
				name: "untitled play",
				description: "no description"
			};
		},
		
		urlRoot: "/play",
		
		/*
		addTeam: function() {
		
		},
		
		removeTeam: function() {
		
		},
		*/
		
		addSet: function() {
		
		},
		
		removeSet: function() {
		
		},
	});
	
	//var set = new $.playbook.Set({name : "test1", description : "arrow", _id : "501611993b45987f33000001" });
	//set.save();
	
	$.playbook.ArticleView = Backbone.View.extend({
		tagName: "div",
		
		template: $("#article-template").html(),
		
		events: {
			"keyup .label"  : "updateLabel",
			"change select" : "changeType",
			"click .delete" : "destroy"
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
		
		updateLabel: function(e) {
			var pos = getCaretPosition(this.$el.find(".label")[0]);
			this.model.save({label: e.target.value.toUpperCase()});
			this.$el.find(".label").focus();
			setCaretPosition(this.$el.find(".label")[0], pos);
			
			this.replaceShape(this);
		},
		
		changeType: function(e) {
			var articleColor = "blue";
			if (e.currentTarget.value === "ball") articleColor = "white";
			else if (e.currentTarget.value === "cone") articleColor = "orange";
			this.model.save({type: e.currentTarget.value, color: articleColor});
			
			this.replaceShape(this);
		},
		
		replaceShape: function(view) {
			var article = createArticle(view.model);
			
			article.on('click', function(e) {
				view.show();
			});		
						
			article.on('dragstart', function(e) {
				view.show();
			});
		
			article.on('dragend', function(e) {
				console.log(this);
				view.model.save({x : this.getX(), y : this.getY()});
			});
			
			view.shape.parent.add(article);
			view.shape.parent.remove(view.shape);
			view.shape.parent.draw();
			
			view.shape = article;
		},
		
		destroy: function() {
			// Potentially need to save parent here
			this.shape.parent.remove(this.shape);
			this.shape.parent.draw();
			this.model.destroy();
		}
	});
	
	$.playbook.SetView = Backbone.View.extend({
		tagName: "div",
		
		template: $("#set-template").html(),
		
		events: {
			"dblclick .name"      : "editName",
			"blur .name-edit"     : "updateName",
			"dblclick .comments"  : "editComments",
			"blur .comments-edit" : "updateComments",
		},
		
		initialize: function() {
			this.layer = new Kinetic.Layer({
				x: START_X,
				y: START_Y,
				visible: false,
				name: "setLayer_" + this.model.get("number")
			});
			stage.add(this.layer);
			
			this.model.on('change', this.render, this);
			//this.model.on('add', this.add, this);
			this.model.on('init', this.addAll, this);
			
			/*
			this.model.fetch({
				success: function(model, response) {
					//model.trigger('init');
				}
			});
			*/
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			return this;
		},
		
		add: function(item) {
			/*
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
			this.layer.draw();*/
		},
		
		addAll: function() {
			var tempModel = this.model;
			this.model.get("paths").each(function(item) {
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
		
		editComments: function(e) {
			$(e.currentTarget).addClass("edit");
			$(e.currentTarget).find("textarea").focus();
		},
		
		updateComments: function(e) {
			$(e.currentTarget).parent().removeClass("edit");
			this.model.save({comments: e.currentTarget.value});
		},
		
		show: function() {
			this.layer.show();
			
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
		},
		
		hide: function() {
			this.layer.hide();
		}
	});
	
	$.playbook.PlayView = Backbone.View.extend({
		el: $("#play"),
		
		template: $("#play-template").html(),
		setListTemplate: $("#set-list-template").html(),
		
		events: {
			"dblclick .name"	: "editName",
			"blur .name-edit"	: "updateName",
			"dblclick .desc"	: "editDescription",
			"blur .desc-edit"	: "updateDescription",
			"click .add-set"	: "addNewSet",
			"click .add-player"	: "addPlayer",
			"click .add-ball"	: "addBall",
			"click .add-cone"	: "addCone"
		},
		
		initialize: function() {
			// create stage
			stage = new Kinetic.Stage({
				container: "canvas",
				width: 1000,
				height: 1000,
			});
		
			// Depending on field
			var field = ultimateField();
			
			stage.add(field);
			
			this.model.on('change', this.render, this);
			this.model.on('addSet', this.addSet, this);
			this.model.on('addArticle', this.addArticle, this);
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
		
		addSet: function(item, show) {
			var view = new $.playbook.SetView({model: item});
			
			// Add info div
			$("#set").append(view.render().el);
			
			if (show) view.show();
			
			// select view
		},
		
		addArticle: function(item) {
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
			
			// add to each layer
			this.layer.add(article);
			// redraw top layer
			this.layer.draw();
		},
		
		addAll: function() {
			var tempModel = this.model;
			this.model.get("sets").each(function(item) {
				tempModel.trigger('addSet', item, item.get("number") === 1);
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
		
		addNewSet: function(e) {
			var set = new $.playbook.Set({number: this.model.get("sets").length + 1, play: this.model});
			set.save();
			this.model.trigger('addSet', set, true);
		},
		
		addPlayer: function(e) {
			var player = new $.playbook.Article({type: "player", play: this.model.get("_id")});
			player.save();
			this.model.trigger('addArticle', player);
		},
		
		addBall: function(e) {
			var ball = new $.playbook.Article({type: "ball", color: "white", play: this.model.get("_id")});
			ball.save();
			this.model.trigger('addArticle', ball);
		},
		
		addCone: function(e) {
			var cone = new $.playbook.Article({type: "cone", color: "orange", play: this.model.get("_id")});
			cone.save();
			this.model.trigger('addArticle', cone);
		}
	});
	
	$.playbook.Router = Backbone.Router.extend({
		routes: {
			"play/:_id":	"show_play",
			//"set/:_id":		"show_set",
		},
		
		show_play : function(_id) {
			var play = new $.playbook.Play({_id: _id});
			var playView = new $.playbook.PlayView({model: play});
		},
		/*
		show_set : function(_id) {
			var set = new $.playbook.Set({_id: _id});
			var setView = new $.playbook.SetView({model: set});
		},*/
	});
	
	$.playbook.app = null;
	
	$.playbook.bootstrap = function() {
		$.playbook.app = new $.playbook.Router();
		Backbone.history.start({pushState: true});
	}
	
	$.playbook.bootstrap();
	$("#start-button").on("click", function(event) {
		
// 		var a = new $.playbook.Play();
// 		a.save({}, {success: function() {
// 			var b = new $.playbook.Set({number : 1, playId : a.get("_id")});
// 			b.save();
// 		}});
		
		$.playbook.app.navigate('play/50189f152cb5a523bb000004', {trigger: true});
	});
});

function createArticle(item) {
	var group = new Kinetic.Group({
		x: item.get("x"),
		y: item.get("y"),
		draggable: true
	});
	
	if (item.get("type") === "player") {
		group.add(createPlayer(item));
	} else if (item.get("type") === "ball") {
		group.add(createBall(item));
	} else if (item.get("type") === "cone") {
		group.add(createCone(item));
	}
	
	if (item.get("label"))
		group.add(createLabel(item));
		
	return group;
}

function createPlayer(player) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: player.get("color"),
		stroke: "black",
		strokeWidth: 1,
		//x: player.get("x"),
		//y: player.get("y"),
		draggable: true
	});
}

function createBall(ball) {
	return new Kinetic.Circle({
		radius: 1.5 * SCALE,
		fill: ball.get("color"),
		stroke: "black",
		strokeWidth: 1,
		//x: ball.get("x"),
		//y: ball.get("y"),
		draggable: true
	});
}

function createCone(cone) {
	return new Kinetic.RegularPolygon({
		sides: 3,
		radius: 1.5 * SCALE,
		fill: cone.get("color"),
		stroke: "black",
		strokeWidth: 1,
		//x: cone.get("x"),
		//y: cone.get("y"),
		draggable: true
	});
}

function createLabel(label) {
	// Use custom shape to draw text, Kinetic.Text too limited options
	return new Kinetic.Shape({
		drawFunc: function(context) {
			context.beginPath();
			context.closePath(); 			
 			context.fillStyle = "black";
 			context.font = "15px Arial";
 			context.textAlign = "center";
 			context.textBaseline = "middle";
 			context.fillText(label.get("label"), 0, 0);
		},
		//x: label.get("x"),
		//y: label.get("y"),
		draggable: true
	});
}

function getCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}

function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}