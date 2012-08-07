/* GLOBALS */
var stage;
var testSet = [];

$(function() {
	$.playbook = {}
	
	$.playbook.Article = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				type: "player",
				color: "blue",
				label: ""
			};
		},
		
		urlRoot: "/api/article"
	});
	
	$.playbook.Path = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				startX: null,
				startY: null
			}
		},
		
		urlRoot: "/api/path",
		
		moveTo: function(x, y) {
			this.save({endX: x, endY: y});
			
			var nextSetNum = this.get("set").get("number") + 1;
			var nextSet = this.get("set").get("play").get("sets").find(function(set) {
				return set.get("number") === nextSetNum;
			});
			
			if (nextSet) {
				var articleId = this.get("articleId");
				var nextPath = nextSet.get("paths").find(function(path) {
					return path.get("articleId") === articleId;
				});
				
				nextPath.save({startX: x, startY: y});
			}
		}
	});
	
	$.playbook.Set = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		relations: [
			{
				type: Backbone.HasMany,
				key: 'paths',
				relatedModel: '$.playbook.Path',
				reverseRelation: {
					key: 'set',
					includeInJSON: '_id',
				}
			}/*,
			{
				type: Backbone.HasOne,
				key: 'prevSet',
				relatedModel: '$.playbook.Set',
				reverseRelation: {
					type: Backbone.HasOne,
					key: 'nextSet',
					includeInJSON: '_id',
				}
			}*/
		],
		
		defaults: function() {
			return {
				name: "" ,
				comments: ""
			};
		},
		
		initialize: function() {
			if (!this.get("name")) this.set("name", "Set_" + this.get("number"));
		},
		
		urlRoot: "/api/set"
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
		
		urlRoot: "/api/play",
	});
	
	$.playbook.ArticleView = Backbone.View.extend({
		tagName: "div",
		
		template: $("#article-template").html(),
		
		events: {
			"keyup .label"  : "updateLabel",
			"change select" : "changeType",
			"click .delete" : "destroy"
		},
		
		initialize: function() {
			this.paths = [];
		
			this.model.on('addPathShape', this.addPathShape, this);
			this.model.on('show', this.show, this);
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
		
		addPathShape: function(path) {
			this.paths.push(path);
		},
		
		show: function() {
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
		},
		
		updateLabel: function(e) {
			if (e.target.value.toUpperCase() === this.model.get("label"))
				return;
		
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
			for (var index in view.paths) {
				var path = view.paths[index];
				
				path.trigger("change");
			}
		},
		
		destroy: function() {
			for (var index in this.paths) {
				var path = this.paths[index];
				
				// Potentially need to save parent here
				path.trigger("clear");
			}
			
			this.model.destroy();
			this.remove();
		}
	});
	
	// Hidden view, used to control path model
	$.playbook.PathView = Backbone.View.extend({
		initialize: function(options) {
			this.layer = options.layer;
			var tempModel = this.model;
			this.article = this.model.get("set").get("play").get("articles").find(function(article) {
				return article.get("_id") === tempModel.get("articleId");
			});
			this.article.trigger("addPathShape", this.model);
			this.shape = null;
			this.line = null;
			
			this.model.on("change", this.render, this);
			this.model.on("clear", this.clear, this);
			
			this.model.trigger("change");
		},
		
		render: function() {
			var view = this;
		
			if (this.shape) this.shape.parent.remove(this.shape);
			this.shape = createArticle({
				x: view.model.get("endX"),
				y: view.model.get("endY"),
				type: view.article.get("type"),
				color: view.article.get("color"),
				label: view.article.get("label")
			});
			
			if (this.line) this.line.parent.remove(this.line);
			
			if (this.model.get("startX") != null && this.model.get("startY") != null) {
				this.line = createLine({
					points: [
						view.model.get("startX"), view.model.get("startY"),
						view.model.get("endX"), view.model.get("endY")
					]
				});
				
				this.layer.add(this.line);
				this.line.moveToBottom();
			}
			
			// event handlers
			this.shape.on('click', function(e) {
				view.article.trigger("show");
			});
				
			this.shape.on('dragstart', function(e) {
				view.article.trigger("show");
				console.log(view.model);
			});
			
			if (this.model.get("startX") != null && this.model.get("startY") != null) {
				this.shape.on('dragmove', function(e) {
					view.layer.remove(view.line);
					view.line = createLine({points: [view.model.get("startX"), view.model.get("startY"), this.getX(), this.getY()]});
					view.layer.add(view.line);
					view.line.moveToBottom();
					view.layer.draw();
				});
			}
			
			this.shape.on('dragend', function(e) {
				view.model.moveTo(this.getX(), this.getY());
			});
			
			this.layer.add(this.shape);
			this.layer.draw();
		},
		
		clear: function() {
			if (this.line) this.layer.remove(this.line);
			this.layer.remove(this.shape);
			this.layer.draw();
			
			this.model.destroy();
		}
	});
	
	$.playbook.SetView = Backbone.View.extend({
		tagName: "div",
		
		template: $("#set-template").html(),
		templateLi: $("#set-list-template").html(),
		
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
			this.model.on('addPath', this.addPath, this);
			this.model.on('init', this.addAll, this);
			
			this.model.trigger('init');
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			return this;
		},
		
		renderLi: function() {
			return Mustache.render(this.templateLi, this.model.toJSON());
		},
		
		addPath: function(item) {
			var pathView = new $.playbook.PathView({model: item, layer: this.layer});
		},
		
		addAll: function() {
			var tempModel = this.model;
			this.model.get("paths").each(function(item) {
				tempModel.trigger('addPath', item);
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
			if (stage.current) {
				stage.current.hide();
				stage.current.draw();
			}
			stage.current = this.layer;
			this.layer.show();
			this.layer.draw();
			
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
			
			$("#" + this.model.get("_id")).siblings().removeClass("selected");
			$("#" + this.model.get("_id")).addClass("selected");
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
			"click .add-set"	: "createSet",
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
			var field;
			if ($("#fieldType")[0].value === "ultimate") {
				field = ultimateField($("#fieldSize")[0].value);
			} else if ($("#fieldType")[0].value === "soccer") {
				field = soccerField($("#fieldSize")[0].value);
			}
			
			stage.add(field);
			
			this.model.on('change', this.render, this);
			this.model.on('addSet', this.addSet, this);
			this.model.on('addNewSet', this.addNewSet, this);
			this.model.on('addArticle', this.addArticle, this);
			this.model.on('addNewArticle', this.addNewArticle, this);
			this.model.on('init', this.addAll, this);
			
			this.model.fetch({
				success: function(model, response) {
					model.trigger('init');
				}
			});
		},
		
		render: function() {
			// Save the list and re-add after the render
			var setList = this.$el.find('.set-list').detach();
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			if (setList[0]) this.$el.find('.set-list').replaceWith(setList);
			return this;
		},
		
		addSet: function(item, show) {
			var view = new $.playbook.SetView({model: item});
			
			// Add info div
			$("#set").append(view.render().el);
			
			$("#play .set-list tbody").append(view.renderLi());
			$("#" + item.get("_id")).on("click", function(e) {
				view.show();
			});
			
			if (show) view.show();
		},
		
		addNewSet: function(item) {
			this.model.trigger("addSet", item, true);
		},
		
		addArticle: function(item) {
			var view = new $.playbook.ArticleView({model: item});
			
			// Add info div
			$("#article").append(view.render().el);
		},
		
		addNewArticle: function(item) {
			this.model.trigger("addArticle", item);
		
			this.model.get("sets").each(function(set) {
				var path;
				if (set.get("number") === 1)
					path = new $.playbook.Path({startX: null, startY: null, endX: 0, endY: 0, set: set, articleId: item.get("_id")});
				else
					path = new $.playbook.Path({startX: 0, startY: 0, endX: 0, endY: 0, set: set, articleId: item.get("_id")});
					
				path.save();
				set.trigger("addPath", path);
			});
		},
		
		addAll: function() {
			// may not be needed
			var tempModel = this.model;
			this.model.get("articles").each(function(article) {
				tempModel.trigger("addArticle", article);
			});
			
			this.model.get("sets").each(function(set) {
				tempModel.trigger("addSet", set, set.get("number") === 1);
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
		
		createSet: function(e) {
			// build off the last set
			var lastSet = this.model.get("sets").max(function(set) {
				return set.get("number");
			});
		
			var newSet = new $.playbook.Set({number: this.model.get("sets").length + 1,  play: this.model});
			
			newSet.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					// Copy the article locations from the last set
					if (lastSet) {
						lastSet.get("paths").each(function(path) {
							var newPath = new $.playbook.Path({
								startX: path.get("endX"),
								startY: path.get("endY"),
								endX: path.get("endX"),
								endY: path.get("endY"),
								set: model,
								articleId: path.get("articleId")
							});
						});
					}
					
					model.save({}, {success: function(model, response) {
						model.get("play").trigger("addNewSet", model);
					}});
				}
			});
		},
		
		addPlayer: function(e) {
			var player = new $.playbook.Article({type: "player", play: this.model.get("_id")});
			player.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
		},
		
		addBall: function(e) {
			var ball = new $.playbook.Article({type: "ball", color: "white", play: this.model.get("_id")});
			ball.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
		},
		
		addCone: function(e) {
			var cone = new $.playbook.Article({type: "cone", color: "orange", play: this.model.get("_id")});
			cone.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
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
		
		$("#fieldType").on("change", changeField);
		$("#fieldSize").on("change", changeField);
	}
	
	$.playbook.bootstrap();
});

/* Util functions */

function changeField(e) {
	var fieldLayer = stage.get(".fieldLayer")[0];
	var currX = fieldLayer.getX();
	var currY = fieldLayer.getY();
	fieldLayer.clear();
	stage.remove(fieldLayer);
	$(fieldLayer.getCanvas().element).remove();
	
	if ($("#fieldType")[0].value === "ultimate") {
		fieldLayer = ultimateField($("#fieldSize")[0].value, currX, currY);
	} else if ($("#fieldType")[0].value === "soccer") {
		fieldLayer = soccerField($("#fieldSize")[0].value, currX, currY);
	}
	
	stage.add(fieldLayer);
	fieldLayer.moveToBottom();
	$("#canvas .kineticjs-content").prepend($(fieldLayer.getCanvas().element).detach());
}

function getCaretPosition(ctrl) {
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