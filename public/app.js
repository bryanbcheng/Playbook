/* GLOBALS */
var stage,
	socket = io.connect();

$(function() {
	$.playbook = {}
	
	$.playbook.Article = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				type: "player",
				color: "blue",
				shape: "circle",
				label: "",
				team: "",
				select: false
			};
		},
		
		initialize: function() {
			_.bindAll(this, 'serverChange', 'serverDelete');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
		},
		
		//urlRoot: "/api/article"
		urlRoot: "article",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
			this.ioBind('delete', this.serverDelete, this);
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
			
			this.trigger("replaceShape");
		},
		
		serverDelete: function(data) {
			this.trigger("clear");
		},
	});
	
	$.playbook.Path = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				prevX: null,
				prevY: null,
				nextX: null,
				nextY: null
			}
		},
		
		initialize: function() {
			_.bindAll(this, 'serverChange', 'serverDelete');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
		},
		
		//urlRoot: "/api/path",
		urlRoot: "path",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
			this.ioBind('delete', this.serverDelete, this);
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
		},
		
		serverDelete: function(data) {
			this.trigger("clear", true);
		},
		
		moveTo: function(x, y) {
			// Saving previous set
			var prevSet = this.get("set").prevSet();
			
			if (prevSet) {
				var articleId = this.get("articleId");
				var prevPath = prevSet.get("paths").find(function(path) {
					return path.get("articleId") === articleId;
				});
				
				prevPath.save({nextX: x, nextY: y});
			}
			
			// Saving next set
			var nextSet = this.get("set").nextSet();
			
			if (nextSet) {
				var articleId = this.get("articleId");
				var nextPath = nextSet.get("paths").find(function(path) {
					return path.get("articleId") === articleId;
				});
				
				// Check if article below is at same location
				if (nextPath.get("currX") === this.get("currX") &&
					nextPath.get("currY") === this.get("currY")) {
					this.save({currX: x, currY: y, nextX: x, nextY: y}, {silent: true});
					nextPath.moveStackTo(x, y);
				} else {
					this.save({currX: x, currY: y}, {silent: true});
					nextPath.save({prevX: x, prevY: y});
				}
			} else {
				this.save({currX: x, currY: y, nextX: x, nextY: y}, {silent: true});
			}
		},
		
		moveStackTo: function(x, y) {
			var nextSet = this.get("set").nextSet();
			
			if (nextSet) {
				var articleId = this.get("articleId");
				var nextPath = nextSet.get("paths").find(function(path) {
					return path.get("articleId") === articleId;
				});
				
				if (nextPath.get("currX") === this.get("currX") &&
					nextPath.get("currY") === this.get("currY")) {
					this.save({prevX: x, prevY: y, currX: x, currY: y, nextX: x, nextY: y});
					nextPath.moveStackTo(x, y);
				} else {
					this.save({prevX: x, prevY: y, currX: x, currY: y});
					nextPath.save({prevX: x, prevY: y});
				}
			} else {
				this.save({prevX: x, prevY: y, currX: x, currY: y, nextX: x, nextY: y});
			}
		},
		
		moveArrow: function(x, y) {
			// Assume next set always there since arrow exists
			var nextSet = this.get("set").nextSet();
			
			var articleId = this.get("articleId");
			var nextPath = nextSet.get("paths").find(function(path) {
				return path.get("articleId") === articleId;
			});
			
			nextPath.save({currX: x, currY: y});
			
			// Saving current set
			this.save({nextX: x, nextY: y});
		},
		
		link: function(path) {
			if (!path) {
				errorMessage("Could not find matching paths");
				return;
			}
			
			this.save({nextX: path.get("currX"), nextY: path.get("currY")});
			path.save({prevX: this.get("currX"), prevY: this.get("currY")});
		},
		
		linkFirst: function() {
			this.save({prevX: null, prevY: null});
		},
		
		linkLast: function() {
			this.save({nextX: this.get("currX"), nextY: this.get("currY")});
		},
	});
	
	$.playbook.Annotation = Backbone.RelationalModel.extend({
		idAttribute: "_id",
		
		defaults: function() {
			return {
				text: "text",
				width: 20,
				height: 3,
			}
		},
		
		initialize: function() {
			if (!this.get("x") || !this.get("y")) {
				this.set("x", CANVAS_WIDTH / 2 - stage.current.getX() - (20 * SCALE / 2));
				this.set("y", CANVAS_HEIGHT / 2 - stage.current.getY() - (3 * SCALE / 2));
			}
		
			_.bindAll(this, 'serverChange', 'serverDelete');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
		},
		
		//urlRoot: "/api/annotation",
		urlRoot: "annotation",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
			this.ioBind('delete', this.serverDelete, this);
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
		},
		
		serverDelete: function(data) {
			this.trigger("clear");
		},
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
			},
			{
				type: Backbone.HasMany,
				key: 'annotations',
				relatedModel: '$.playbook.Annotation',
				reverseRelation: {
					key: 'set',
					includeInJSON: '_id',
				}
			}/*
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
				comments: "",
				paths: [],
				annotations: [],
			};
		},
		
		initialize: function() {
			if (!this.get("name")) this.set("name", "Set_" + this.get("number"));
			
			_.bindAll(this, 'serverChange', 'serverDelete', 'serverCreatePath', 'serverCreateAnnotation');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
				
				this.ioBind('createPath', this.serverCreatePath, this);
				this.ioBind('createAnnotation', this.serverCreateAnnotation, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
			
			// LINK SETS??
		},
		
		//urlRoot: "/api/set",
		urlRoot: "set",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
			this.ioBind('delete', this.serverDelete, this);
			
			this.ioBind('createPath', this.serverCreatePath, this);
			this.ioBind('createAnnotation', this.serverCreateAnnotation, this);
			
			this.get("paths").each(function(path) {
				path.ioBind('update', path.serverChange, path);
				path.ioBind('delete', path.serverDelete, path);
			});
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
		},
		
		serverDelete: function(data) {
			this.trigger("clear");
		},
		
		serverCreatePath: function(data) {
			// Add newly created path
			var newPath = new $.playbook.Path($.extend(data, {set: this}));
			
			this.trigger("addPath", newPath);
		},
		
		serverCreateAnnotation: function(data) {
			// Add newly created annotation
			var newAnnotation = new $.playbook.Annotation($.extend(data, {set: this}));
			
			this.trigger("addNewAnnotation", newAnnotation);
		},
				
		// Assume array is in order (sorting not an issue yet)
		prevSet: function() {
			var prevIndex = this.get("play").get("sets").indexOf(this) - 1;
			return this.get("play").get("sets").at(prevIndex);
		},
		
		nextSet: function() {
			var nextIndex = this.get("play").get("sets").indexOf(this) + 1;
			return this.get("play").get("sets").at(nextIndex);
		},
		
		link: function(nextSet) {
			this.get("paths").each(function(path) {
				// Could potentially use index as well
				path.link(nextSet.get("paths").find(function(nextPath) {
					return nextPath.get("articleId") == path.get("articleId");
				}));
			});
		},
		
		linkFirst: function() {
			this.get("paths").each(function(path) {
				path.linkFirst();
			});
		},
		
		linkLast: function() {
			this.get("paths").each(function(path) {
				path.linkLast();
			});
		},
		
		renumber: function(num) {
			this.save({number: num});
			
			var nextSet = this.nextSet();
			if (nextSet) {
				nextSet.renumber(num + 1);
			}
		}
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
				description: "no description",
				fieldType: $("#field-type").data("value") ? $("#field-type").data("value") : "ultimate",
				fieldSize: $("#field-size").data("value") ? $("#field-size").data("value") : "full",
				teamColors: ["#0000ff", "#ff0000", ],
				teamShapes: ["circle", "circle", ],
				privacy: "public", // public for now, changed to protected later
			};
		},
		
		initialize: function() {
			_.bindAll(this, 'serverChange', 'serverDelete', 'serverCreateSet', 'serverCreateArticle', 'serverReset', 'serverFormation');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
				
				this.ioBind('createSet', this.serverCreateSet, this);
				this.ioBind('createArticle', this.serverCreateArticle, this);
				
				this.ioBind('reset', this.serverReset, this);
				this.ioBind('formation', this.serverFormation, this);
			}
		},
		
		//urlRoot: "/api/play",
		urlRoot: "play",
		
		socket: socket,
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
		},
		
		serverDelete: function(data) {
			//this.trigger("clear");
		},
		
		serverCreateSet: function(data) {
			// Add newly created set
			var newSet = new $.playbook.Set($.extend(data, {play: this}));
			
			this.trigger("addNewSet", newSet);
		},
		
		serverCreateArticle: function(data) {
			// Add newly created article
			var newArticle = new $.playbook.Article($.extend(data, {play: this}));
			
			this.trigger("addArticle", newArticle);
		},
		
		serverReset: function(data) {
			this.set(data, {silent: true});
		
			this.trigger("resetPlayView");
		},
		
		serverFormation: function(data) {
		
		},
	});
	
	$.playbook.PlayCollection = Backbone.Collection.extend({
		model: $.playbook.Play,
		
		initialize: function() {
			_.bindAll(this, 'serverCreate');
// 			if (!this.isNew()) {
				this.ioBind('create', this.serverCreate, this);
// 			}
		},
		
		url: "plays",
		
		socket: socket,
		
		serverCreate: function(data) {
		
		},
	});
	
	$.playbook.ArticleView = Backbone.View.extend({
		tagName: "div",
		className: "article-view",
		
		template: $("#article-template").html(),
		
		events: {
			"keyup .label"  : "updateLabel",
			"click .delete" : "clear",
			
			"mouseover .article-prop"	: "showArticlePropOptions",
			"mouseout .article-prop"	: "hideArticlePropOptions",
			"mouseover .article-option"	: "fadeArticlePropOptions",
			"mouseout .article-option"	: "unfadeArticlePropOptions",
			"click .article-option" 	: "changeType",
// 			"change select" : "changeType",
		},
		
		initialize: function() {
			this.paths = [];
		
			this.model.on('addPathShape', this.addPathShape, this);
			this.model.on('removePathShape', this.removePathShape, this);
			this.model.on('editLabel', this.editLabel, this);
			this.model.on('change', this.render, this);
			this.model.on('changeColor', this.changeColor, this);
			this.model.on('changeShape', this.changeShape, this);
			
			this.model.on('replaceShape', this.replaceShape, this);
			this.model.on('selectArticle', this.selectArticle, this);
			this.model.on('unselectArticle', this.unselectArticle, this);
      		this.model.on('clear', this.clear, this);
		},
		
		render: function() {
			var html = Mustache.render(this.template, this.model.toJSON()),
				htmlObj = $(html);
			
			
			// Hack to select correct item in list
// 			html = $(html).find('option[value=' + this.model.get("type") + ']').attr('selected', 'selected').end();
			
			// if (this.model.get("type") === "player") {
// 				htmlObj.find('option[value=' + this.model.get("team") + ']').attr('selected', 'selected').end();
// 				htmlObj.closest(".team-select").show();
// 			}
			
			var teamDisplay = this.model.get("team");
			if (teamDisplay) {
				teamDisplay = teamDisplay.slice(0, -1) + " " + (parseInt(teamDisplay.slice(-1)) + 1);
			} else {
				teamDisplay = "No Team";
				htmlObj.find(".article-team").addClass("disabled");
			}
			htmlObj.find(".article-team").children(".selected").children("span").html(teamDisplay);
			
			this.$el.html(htmlObj);
			return this;
		},
		
		addPathShape: function(path) {
			this.paths.push(path);
		},
		
		removePathShape: function(path) {
			// remove path from this.paths
			var index = _.indexOf(this.paths, path)
			if (index !== -1) this.paths.splice(index, 1);
		},
		
		editLabel: function(e) {
			this.$el.find(".label").focus();
			setCaretPosition(this.$el.find(".label")[0], 3); // 3 will ensure always at end
		},
		
		updateLabel: function(e) {
			if (e.target.value.toUpperCase() === this.model.get("label"))
				return;
		
			var view = this;
			var pos = getCaretPosition(this.$el.find(".label")[0]);
			this.model.save({label: e.target.value.toUpperCase()}, {
				wait: true,
				success: function(model, response) {
					view.$el.find(".label").focus();
					setCaretPosition(view.$el.find(".label")[0], pos);
					
					model.trigger("replaceShape");
				}
			});
		},
		
		changeColor: function(color) {
			this.model.save({color: color}, {
				wait: true,
				success: function(model, response) {
					model.trigger("replaceShape");
				}
			});
		},
		
		changeShape: function(shape) {
			this.model.save({shape: shape}, {
				wait: true,
				success: function(model, response) {
					model.trigger("replaceShape");
				}
			});
		},
		
		showArticlePropOptions: function(e) {
			if ($(e.target).closest(".article-prop").hasClass("disabled")) return;
		
			$(e.target).closest(".article-prop").find("ul").fadeIn(350, "swing");
		},
		
		hideArticlePropOptions: function(e) {
			if ($(e.relatedTarget).closest(".article-prop")[0] === $(e.target).closest(".article-prop")[0]) return;
			
			$(e.target).closest(".article-prop").find("ul").fadeOut(350, "swing");
		},
		
		fadeArticlePropOptions: function(e) {
			$(e.target).closest(".article-prop").addClass("article-prop-faded");
		},
		
		unfadeArticlePropOptions: function(e) {
			$(e.target).closest(".article-prop").removeClass("article-prop-faded");
		},
		
		changeField: function(e) {
			var fieldProp = $(e.target).closest(".field-prop");
			var fieldOption = $(e.target).closest(".field-option");
			
			if (fieldProp.data("value") !== fieldOption.data("value")) {
				fieldProp.data("value", fieldOption.data("value"));
				this.model.save({fieldType: $("#field-type").data("value"), fieldSize: $("#field-size").data("value")});
			}
		},
		
		changeType: function(e) {
			var articleProp = $(e.target).closest(".article-prop");
			var articleOption = $(e.target).closest(".article-option");
			
			if (articleProp.data("value") !== articleOption.data("value")) {
				var articlePropList = {};
				// Assign by default to team0
				if (articleOption.data("value") === "player") {
					articlePropList.type = articleOption.data("value");
					articlePropList.color = $("#color0").val();
					articlePropList.shape = $("#shape0").val();
					articlePropList.team = "team0";
				} else if (articleOption.data("value") === "team0") {
					articlePropList.color = $("#color0").val();
					articlePropList.shape = $("#shape0").val();
					articlePropList.team = "team0";
				} else if (articleOption.data("value") === "team1") {
					articlePropList.color = $("#color1").val();
					articlePropList.shape = $("#shape1").val();
					articlePropList.team = "team1";
				} else if (articleOption.data("value") === "ball") {
					articlePropList.type = articleOption.data("value");
					articlePropList.color = "white";
					articlePropList.shape = "circle";
					articlePropList.team = "";
				} else if (articleOption.data("value") === "cone") {
					articlePropList.type = articleOption.data("value");
					articlePropList.color = "orange";
					articlePropList.shape = "triangle";
					articlePropList.team = "";
				}
				this.model.save(articlePropList, {
					wait: true,
					success: function(model, response) {
						model.trigger("replaceShape");
					}
				});				
			}
		},
		
		replaceShape: function() {
			for (var index in this.paths) {
				var path = this.paths[index];
				
				path.trigger("change");
			}
		},
		
		selectArticle: function() {
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
		
			var tempModel = this.model;
			this.model.get("play").get("articles").each(function(article) {
				if (article.get("select") && article.get("_id") !== tempModel.get("_id"))
					article.trigger("unselectArticle");
			});
			
			this.model.set("select", true);
			for (var index in this.paths) {
				var path = this.paths[index];
				
				path.trigger("selectPath");
			}
		},
		
		unselectArticle: function() {
			this.$el.removeClass("selected");
		
			if (this.model.get("select")) {
				this.model.set("select", false);
				
				for (var index in this.paths) {
					var path = this.paths[index];
					
					path.trigger("unselectPath");
				}
			}
		},
		
		clear: function() {
			for (var index in this.paths) {
				var path = this.paths[index];
				
				// Potentially need to save parent here
				path.trigger("clear");
			}
			
			this.model.off();
			this.model.destroy();
			this.remove();
		},
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
			this.arrow = null;
			
			this.model.on("change", this.render, this);
			this.model.on("selectPath", this.selectPath, this);
			this.model.on("unselectPath", this.unselectPath, this);
			this.model.on("clear", this.clear, this);
			this.model.on("removeFromArticle", this.removeFromArticle, this);
			
      		this.model.on('animate', this.animate, this);
			this.model.on('reset', this.reset, this);
			
			this.model.trigger("change");
		},
		
		render: function() {
			var view = this;
			
			// Draw shape
			if (this.shape) this.shape.parent.remove(this.shape);
			this.shape = createArticle({
				x: view.model.get("currX"),
				y: view.model.get("currY"),
				type: view.article.get("type"),
				color: view.article.get("color"),
				shape: view.article.get("shape"),
				label: view.article.get("label"),
				//name: view.article.get("team")
				select: view.article.get("select")
			});
			
			// Shape event handlers
			this.shape.on('click', function(e) {
				// Move select shape to selected article
				view.article.trigger("selectArticle");
			});
			
			this.shape.on('dblclick', function(e) {
				view.article.trigger("editLabel");
			});
				
			this.shape.on('dragstart', function(e) {
				// Move select shape to selected article
				view.article.trigger("selectArticle");
			});
			
			this.shape.on('dragend', function(e) {
				view.model.moveTo(this.getX(), this.getY());
			});
			
			if (this.line) {
				this.line.parent.remove(this.line);
				this.line = null; // Prevention for deleting sets
			}
			
			// Draw line to shape
			if (this.model.get("prevX") != null && this.model.get("prevY") != null) {
				
				this.line = createLine({
					points: [
						view.model.get("prevX"), view.model.get("prevY"),
						view.model.get("currX"), view.model.get("currY")
					]
				});
				
				this.layer.add(this.line);
				this.line.moveToBottom();
				
				this.shape.on('dragmove', function(e) {
					view.layer.remove(view.line);
					view.line = createLine({points: [view.model.get("prevX"), view.model.get("prevY"), this.getX(), this.getY()]});
					view.layer.add(view.line);
					view.line.moveToBottom();
					view.layer.draw();
				});
			}
			
			// Draw arrow from shape
			if (this.arrow) {
				this.arrow.parent.remove(this.arrow);
				this.arrow = null; // Prevention for deleting sets
			}
			
			if (this.model.get("nextX") !== this.model.get("currX") ||
				this.model.get("nextY") !== this.model.get("currY")) {
				this.arrow = createArrow({
					points: [
						view.model.get("currX"), view.model.get("currY"),
						view.model.get("nextX"), view.model.get("nextY")
					]
				});
				
				this.layer.add(this.arrow);
				this.arrow.moveToBottom();
				
				this.shape.on('dragmove', function(e) {
					view.layer.remove(view.arrow);
					view.arrow = createArrow({points: [this.getX(), this.getY(), view.model.get("nextX"), view.model.get("nextY")]});
					view.layer.add(view.arrow);
					view.arrow.moveToBottom();
					view.layer.draw();
				});
				
				var arrowHead = this.arrow.get(".arrowHead")[0];
				
				arrowHead.on('dragmove', function(e) {
					view.layer.remove(view.arrow);
					view.arrow = createArrow({points: [view.model.get("currX"), view.model.get("currY"), this.getX(), this.getY()]});
					view.layer.add(view.arrow);
					view.arrow.moveToBottom();
					view.layer.draw();
				});
				
				arrowHead.on('dragend', function(e) {
					view.model.moveArrow(this.getX(), this.getY());
				});
			}
			
			this.layer.add(this.shape);
			this.layer.draw();
		},
		
		selectPath: function() {
			this.shape.get(".select")[0].show();
			this.layer.draw();
		},
		
		unselectPath: function() {
			this.shape.get(".select")[0].hide();
			this.layer.draw();
		},
		
		clear: function() {
			if (this.line) this.layer.remove(this.line);
			if (this.arrow) this.layer.remove(this.arrow);
			this.layer.remove(this.shape);
			this.layer.draw();
			
			// Remove article DOM
			this.remove();
			
			this.model.off();
			this.model.destroy();
		},
		
		removeFromArticle: function() {
			this.article.trigger("removePathShape", this.model);
		}, 
		
		animate: function(cb) {
			this.shape.transitionTo({
				x: this.model.get("nextX"),
				y: this.model.get("nextY"),
				// 1 - slow, 5 - fast
				duration: 3 - $(".animation-speed").slider("value"),
				callback: cb
			});
		},
		
		// Reset after animation
		reset: function() {
			this.shape.setPosition({
				x: this.model.get("currX"),
				y: this.model.get("currY")
			});
		},
	});
	
	// (Mostly) Hidden view, used to control annotation model
	$.playbook.AnnotationView = Backbone.View.extend({
		tagName: "div",
		className: "annotation-view",
		
		template: $("#annotation-template").html(),
		
		events: {
			"keyup .annotation-edit"	: "checkSize",
			"click .annotation-save"	: "saveAnnotation",
			"click .annotation-cancel"	: "closeEdit",
		},
		
		initialize: function(options) {
			this.layer = options.layer;
			
			this.shape = null;
			
			this.model.on("change", this.render, this);
			//this.model.on("selectPath", this.selectPath, this);
			//this.model.on("unselectPath", this.unselectPath, this);
			this.model.on("clear", this.clear, this);
			
			this.model.trigger("change");
		},
		
		render: function() {
			var view = this;
			
			// Draw shape
			if (this.shape) this.shape.parent.remove(this.shape);
			this.shape = createAnnotation({
				text: this.model.get("text"),
				x: this.model.get("x"),
				y: this.model.get("y"),
				width: this.model.get("width"),
				height: this.model.get("height")
			});
			
			// Shape event handlers
			this.shape.on('dblclick', function(e) {
				// Deselect other annotations
				$(".annotation-cancel").click();
			
				// Hide current text
				this.get(".annotationText")[0].hide();
				this.parent.draw();
			
				// Append to set, move over canvas dom
				if (!view.$el.parent().length)
					$("#annotation").append(view.el);
				view.$el.addClass("editing");
				
				console.log($("#annotation").offset());
				// Calculate offset (canvas DOM + layer offset + item location)
				view.$el.css({
					left:  -$("#annotation").offset().left + $("#canvas").offset().left + stage.current.getX() + view.model.get("x") + 1, // + 1 for slight offset
					top: -$("#annotation").offset().top + $("#canvas").offset().top + stage.current.getY() + view.model.get("y") + 1,
				});
				// Calculate size (item size - padding size)
				view.$el.find(".annotation-edit").css({
					width: (view.model.get("width")) * SCALE,
// 					height: (view.model.get("height")) * SCALE
				});
				
				view.$el.find(".annotation-edit").focus();
			});
			
			this.shape.on('mouseover', function(e) {
				view.shape.get(".annotationX")[0].show();
				view.layer.draw();
			});
			
			this.shape.on('mouseout', function(e) {
				view.shape.get(".annotationX")[0].hide();
				view.shape.get(".annotationXHover")[0].hide();
				view.layer.draw();
			});
 			
			this.shape.on('dragend', function(e) {
				view.model.save({x: this.getX(), y: this.getY()});
			});
			
			this.layer.add(this.shape);
 			
 			this.shape.get(".annotationX")[0].on('mouseover', function(e) {
 				view.shape.get(".annotationX")[0].hide();
 				view.shape.get(".annotationXHover")[0].show();
 				view.layer.draw();
 				
 				e.cancelBubble = true;
 			});
 			
 			this.shape.get(".annotationXHover")[0].on('click', function(e) {
 				view.model.trigger("clear");
 			});
 			
 			this.shape.get(".annotationXHover")[0].on('mouseout', function(e) {
 				view.shape.get(".annotationXHover")[0].hide();
 				view.shape.get(".annotationX")[0].show();
 				view.layer.draw();
 			});
			
			this.layer.draw();
			
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
		},
		
		renderBackground: function(height) {
			this.shape.remove(this.shape.get(".annotationBox")[0]);
			this.shape.add(createAnnotationBox({width: this.model.get("width"), height: height}));
			this.layer.draw();
		},

		checkSize: function(e) {
			var divHeight = Math.max($(e.target).height() / SCALE, 3);
			if (divHeight !== this.model.get("height")) {
				this.renderBackground(divHeight);
			}
		},

		saveAnnotation: function(e) {
			this.model.save({
				text: this.$el.find(".annotation-edit").text(),
				height: Math.max(this.$el.find(".annotation-edit").height() / SCALE, 3)
			});
			
			this.$el.detach();
		},
		
		closeEdit: function(e) {
			// Show text
			this.shape.get(".annotationText")[0].show();
			this.layer.draw();
			
			// Reset background size
			this.renderBackground(this.model.get("height"));
		
			//Reset textarea's data
			this.$el.find(".annotation-edit").html(this.model.get("text"));
		
			this.$el.detach();
		},
		
		clear: function() {
			// Remove to prevent triggering after shape is deleted
			this.shape.off('mouseout');
			this.shape.get(".annotationXHover")[0].off('mouseout');
		
			this.layer.remove(this.shape);
			this.layer.draw();
			
			this.remove();
			
			this.model.off();
			this.model.destroy();
		}
	});
	
	$.playbook.SetView = Backbone.View.extend({
		tagName: "div",
		className: "set-view",
		
		template: $("#set-template").html(),
		
		events: {
			"blur .name"	 : "updateName",
			"blur .comments" : "updateComments",
		},
		
		initialize: function() {
			this.layer = new Kinetic.Layer({
				x: stage.get(".fieldLayer")[0].getX(),
				y: stage.get(".fieldLayer")[0].getY(),
				visible: false,
				name: "setLayer_" + this.model.get("number")
			});
			stage.add(this.layer);
			
			this.count = 0;
			
			this.model.on('change', this.render, this);
			this.model.on('clear', this.clear, this);
			this.model.on('clearAll', this.clearAll, this);
			this.model.on('addPath', this.addPath, this);
			this.model.on('addAnnotation', this.addAnnotation, this);
			this.model.on('addNewAnnotation', this.addNewAnnotation, this);
			this.model.on('show', this.show, this);
			this.model.on('init', this.addAll, this);
			
			// Animation events
			this.model.on('animate', this.animate, this);
			this.model.on('wait', this.wait, this);
			this.model.on('reset', this.reset, this);
			
			this.model.trigger('init');
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			
			if (this.model.changedAttributes()) {
				this.model.get("play").trigger("change");
			}
			
			return this;
		},
		
		clear: function() {
			var prevSet = this.model.prevSet();
			var nextSet = this.model.nextSet();
			
			// Prevent deleting last set
			if (!prevSet && !nextSet) {
				errorMessage("Cannot delete last set!");
				// Allow for now
				//return;
			}
			
			// Remove layer from canvas
			this.layer.clear();
			stage.remove(this.layer);
			$(this.layer.getCanvas().element).remove();
			
			// Link prev set and next set
			if (prevSet && nextSet) {
				prevSet.link(nextSet);
			} else if (prevSet) {
				prevSet.linkLast();
			} else if (nextSet) {
				nextSet.linkFirst();
			}
			
			// Renumber all succeeding sets
			if (nextSet) {
				nextSet.renumber(this.model.get("number"));
			}
			
			// Remove set DOM
			this.remove();
			this.model.get("play").trigger("change"); // refreshes # for other sets
			$("#" + this.model.get("_id")).remove(); // removes this set from set list, it is there because set not yet removed from play
			
			// Remove paths from article array
			this.model.get("paths").each(function(path) {
				path.trigger("removeFromArticle");
			});
			
			// Delete model
			this.model.off();
			this.model.get("play").get("sets").remove(this.model);
			this.model.destroy();
			
			// Set current set to next set if exists, otherwise, to prev set
			if (nextSet)
				nextSet.trigger("show");
			else if (prevSet)
				prevSet.trigger("show");
		},
		
		// Only called from reset all
		clearAll: function() {
			// Remove layer from canvas
			this.layer.clear();
			stage.remove(this.layer);
			$(this.layer.getCanvas().element).remove();
			
			// Remove set DOM
			this.remove();
			$("#" + this.model.get("_id")).remove();
			
			// Delete model
			this.model.off();
			this.model.destroy({wait: true});
		},
		
		addPath: function(item) {
			var pathView = new $.playbook.PathView({model: item, layer: this.layer});
		},
		
		addAnnotation: function(item) {
			var annotationView = new $.playbook.AnnotationView({model: item, layer: this.layer});
		},
		
		// Potentially may not even need this
		addNewAnnotation: function(item) {
			this.model.trigger("addAnnotation", item);
		},
		
		addAll: function() {
			var tempModel = this.model;
			this.model.get("paths").each(function(path) {
				tempModel.trigger('addPath', path);
			});
			
			this.model.get("annotations").each(function(annotation) {
				tempModel.trigger('addAnnotation', annotation);
			});
		},
		
		updateName: function(e) {
			// Check if changed
			var newValue = $.trim($(e.target).text());
			if (this.model.get("name") !== newValue) {
				this.model.save({name: newValue});
			}
		},
		
		updateComments: function(e) {
			// Check if changed
			var newValue = $.trim($(e.target).text());
			if (this.model.get("comments") !== newValue) {
				this.model.save({comments: newValue});
			}
		},
		
		show: function() {
			if (stage.current) {
				stage.current.hide();
				stage.current.draw();
				
				$(".annotation-cancel").click();
			}
			stage.current = this.layer;
			this.layer.show();
			this.layer.draw();
			
			this.$el.siblings().removeClass("selected");
			this.$el.addClass("selected");
			
			$("#" + this.model.get("_id")).siblings().removeClass("selected");
			$("#" + this.model.get("_id")).addClass("selected");
		},
		
		animate: function(cb) {
			// call path to animate
			var view = this;
			if (this.model.get("paths").length ===  0) {
				errorMessage("Cannot animate without any objects in the play.");
				this.model.trigger("wait", cb);
			} else {			
				this.model.get("paths").each(function(path) {
					path.trigger("animate", function() {
						view.model.trigger("wait", cb);
					});
				});
			}
		},
		
		wait: function(cb) {
			this.count++;
			
			if(this.count >= this.model.get("paths").length) {
				this.count = 0;
				cb();
			}
		},
		
		reset: function() {
			this.model.get("paths").each(function(path) {
				path.trigger("reset");
			});
		}
	});
	
	$.playbook.PlayView = Backbone.View.extend({
		tagName: "div",
		className: "play-view",
		
		template: $("#play-template").html(),
		
		events: {
			"blur .name"		: "updateName",
			"blur .desc"		: "updateDescription",
			"click .new-play"	: "newPlay",
			"click .reset-play"	: "resetPlay",
			"click .print-play"	: "printPlay",
			
			"mouseover .new-formation" : "showFormations",
			"mouseout .new-formation"  : "hideFormations",
			"click .formation-option"  : "useFormation",
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		
		render: function(bindEvents) {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			$("#play").append(this.el);
			
			if (bindEvents) this.delegateEvents();
			return this;
		},
		
		updateName: function(e) {
			// Check if changed
			var newValue = $.trim($(e.target).text());
			if (this.model.get("name") !== newValue) {
				this.model.save({name: newValue});
			}
		},
		
		updateDescription: function(e) {
			// Check if changed
			var newValue = $.trim($(e.target).text());
			if (this.model.get("description") !== newValue) {
				this.model.save({description: newValue});
			}
		},
		
		newPlay: function() {
			var play = new $.playbook.Play({});
			
			play.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					$.playbook.app.navigate("play/" + model.get("_id"), {trigger: true});
				}
			});
		},
		
		resetPlay: function() {
			if (confirm("Resetting this play will remove all work done so far on this play. Are you sure you want to continue?")) {				
				var io = this.model.socket;
				
				io.emit("play:reset", this.model.toJSON());
			} else {
				console.log("Cancelled reset");
			}
		},
		
		printPlay: function(e) {
			var view = this;
			
			// Cover screen to prevent touching
			coverScreen();
			$("#whiteout").html("Configuring print settings...");
		
			// Reset #playbook-print
			$("#playbook-print").html("");
			
			// Save current set
			var currSet = $(".set-list").find(".selected");
			// Start printing from beginning
			$(".first-set").click();
			
			// Save the current layer position
			var currPosition = stage.current.getPosition();
		
			var tempStage = stage.clone({height: 1200});
			$(tempStage.getDOM()).addClass("print");
			while(stage.getChildren().length > 0) {
				var layer = stage.getChildren()[0];
				layer.moveTo(tempStage);
				layer.canvas.setHeight(1200);
				layer.setPosition({x: 0, y: 0});
				layer.draw();
			}
		
			// Generate the image for each of the sets
			var count = 1;
			async.whilst(
				function() {
					return count <= view.model.get("sets").length;
				},
				function(callback) {
					tempStage.toImage({
						callback: function(image) {
							// put play and set info
							$("#playbook-print").append(Mustache.render($("#play-print-template").html(), view.model.toJSON()));
							var thisSet = view.model.get("sets").find(function(set) {
								return set.get("number") === count;
							});
							$("#playbook-print").append(Mustache.render($("#set-print-template").html(), thisSet.toJSON()));
							
							$("#playbook-print").append(image);
							$("#playbook-print").append('<div class="page-break"></div>');
							
							$(".next-set").click();
							count++;
							callback();
						}
					});
				},
				function(err) {
					if (!err) {
						while(tempStage.getChildren().length > 0) {
							var layer = tempStage.getChildren()[0];
							layer.moveTo(stage);
							layer.canvas.setHeight(CANVAS_HEIGHT);
							layer.setPosition(currPosition);
							layer.draw();
						}
						
						$(tempStage.getDOM()).remove();
					
						currSet.click();
						window.print();
						uncoverScreen();
					} else {
						errorMessage("Sorry could not print, please try again later.");
					}
				}
			);
		},
		
		showFormations: function(e) {
			this.$el.find(".formations").fadeIn(350, "swing");
		},
		
		hideFormations: function(e) {
			if ($(e.relatedTarget).closest(".new-formation").length) return;
			
			this.$el.find(".formations").fadeOut(350, "swing");
		},
		
		useFormation: function(e) {
			if (confirm("Selecting a formation removes all items currently in your play. Are you sure you want to continue?")) {
				var articles = this.model.get("articles")
				while (!articles.isEmpty()) {
					articles.shift().trigger("clear");
				}
				var formationType = $(e.target).data("value");
				
				// Formation sport is same as field sport
				var sportType = $("#field-type").data("value");
				
				var formationData = formation(sportType, formationType);
				for (var index in formationData) {
					var data = formationData[index];
					var color = data.team ? data.team === "team0" ? $("#color0").val() : $("#color1").val() : data.type === "ball" ? "white" : "orange";
					var shape = data.team ? data.team === "team0" ? $("#shape0").val() : $("#shape1").val() : data.type === "ball" ? "circle" : "triangle";
					var article = new $.playbook.Article({
						type: data.type,
						color: color,
						shape: shape,
						label: data.label,
						team: data.team,
						play: this.model.get("_id"),
						tempX: data.x,
						tempY: data.y
					});
					
					article.save({}, {
						silent: true,
						wait: true,
						success: function(model, response) {
							model.trigger("addIoBind");
							model.get("play").trigger("addNewArticle", model, model.get("tempX"), model.get("tempY"));
							model.unset("tempX");
							model.unset("tempY");
						}
					});
				}
			} else {
				console.log("Cancelled formation selection");
			}
		},
		
	});
	
	$.playbook.PlayContentsView = Backbone.View.extend({
		tagName: "div",
		className: "play-contents-view",
		
		template: $("#play-contents-template").html(),
		
		events: {
			"mouseover .field-prop"	  : "showFieldPropOptions",
			"mouseout .field-prop"	  : "hideFieldPropOptions",
			"mouseover .field-option" : "fadeFieldPropOptions",
			"mouseout .field-option"  : "unfadeFieldPropOptions",
			"click .field-option"	  : "changeField",

			"click .add-set"	: "createSet",
			"click .set-list"	: "changeSet",
			"click .remove-set"	: "deleteSet",
			"click .first-set"	: "firstSet",
			"click .prev-set"	: "prevSet",
			"click .next-set"	: "nextSet",
			"click .last-set"	: "lastSet",
			"click .add-player"	: "addPlayer",
			"click .add-ball"	: "addBall",
			"click .add-cone"	: "addCone",
			"click .add-ann"	: "addAnnotation",
			"click .animate"	: "animateSets",
		},
		
		initialize: function() {
			// Remove previous stage if necessary
			if (stage) {
				$(stage.getDOM()).remove();
			}
			// create stage
			stage = new Kinetic.Stage({
				container: "canvas",
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
			});
			
			this.model.on('change', this.render, this);
			this.model.on('addSet', this.addSet, this);
			this.model.on('addNewSet', this.addNewSet, this);
			this.model.on('addArticle', this.addArticle, this);
			this.model.on('addNewArticle', this.addNewArticle, this);
			this.model.on('animate', this.animate, this);
			this.model.on('resetPlayView', this.resetPlayView, this);
			this.model.on('init', this.addAll, this);
			
			var view = this;
			this.model.fetch({
				success: function(model, response) {
					model.trigger('init');
				}
			});
		},
		
		render: function(bindEvents) {
			// Sort set list
			var sortedSets = this.model.get("sets").sortBy(function(set) {
				return set.get("number");
			});
			this.model.set("sets", sortedSets, {silent: true});
			
			var html = Mustache.render(this.template, this.model.toJSON()),
				htmlObj = $(html);
			
// 			$(html).find("li[value=" + this.model.get("fieldType") + "]").addClass("selected");

			this.addField(this.model.get("fieldType"), this.model.get("fieldSize"));
			
			// Hack to keep current set selected
			var currSetId = $(".set-list").find(".selected").attr("id");
			if (currSetId) htmlObj.find('#' + currSetId).addClass('selected');
			
			// JQuery UI Plugins
			var view = this;
			htmlObj.find(".select-color").colorPicker({onColorChange: function(id, newValue) {
				// PREVENT CHOOSING THE SAME COLOR FOR BOTH TEAMS		
				
				view.model.save({teamColors: [$("#color0").val(), $("#color1").val()]}, {
					silent: true,
					wait: true,
					success: function(model, response) {
						var teamPlayers = model.get("articles").filter(function(article) {
							return article.get("team") == $("#" + id).parent().attr("id");
						});
						
						// update each article with new color
						_.each(teamPlayers, function(player) {
							player.trigger("changeColor", newValue);
						});
					}
				});
			}});
			
			htmlObj.find(".select-shape").shapePicker({onShapeChange: function(id, newValue) {
				view.model.save({teamShapes: [$("#shape0").val(), $("#shape1").val()]}, {
					silent: true,
					wait: true,
					success: function(model, response) {
						var teamPlayers = model.get("articles").filter(function(article) {
							return article.get("team") == $("#" + id).parent().attr("id");
						});
						
						// update each article with new color
						_.each(teamPlayers, function(player) {
							player.trigger("changeShape", newValue);
						});
					}
				});
			}});
			
			htmlObj.find(".animate-control").on("mouseover", function(e) {
				$(this).find(".animation").fadeIn(350, "swing");
				
				$(this).on("mouseout", function(e) {
					if ($(e.relatedTarget).closest(".animate-control").length) return;
					
					$(this).find(".animation").fadeOut(350, "swing");
					
					$(this).off("mouseout");
				});
			});
			
			var currSpeed = $(".animation-speed").length ? $(".animation-speed").slider("value") : 1.5;
			htmlObj.find(".animation-speed").slider({
				value: currSpeed,
				min: 0.5,
				max: 2.5,
				step: 0.5,
				orientation: "vertical",
				slide: function(event, ui) {
					htmlObj.find(".animation-speed-display").html(ui.value + "x");
				}
			});
			htmlObj.find(".animation-speed-display").html(htmlObj.find(".animation-speed").slider("value") + "x");
			
			this.$el.html(htmlObj);
			
			$("#play-contents").append(this.el);
			
			if (bindEvents) this.delegateEvents();
			
			return this;
		},
		
		addField: function(fieldType, fieldSize) {
			// TODO: draw only when changed
			var fieldLayer = stage.get(".fieldLayer")[0];
			var currX, currY;
			
			if (fieldLayer) {
				currX = fieldLayer.getX();
				currY = fieldLayer.getY();
				fieldLayer.clear();
				stage.remove(fieldLayer);
				$(fieldLayer.getCanvas().element).remove();
			}
			
			if (fieldType === "ultimate") {
				fieldLayer = ultimateField(fieldSize, currX, currY);
			} else if (fieldType === "soccer") {
				fieldLayer = soccerField(fieldSize, currX, currY);
			} else if (fieldType === "football") {
				fieldLayer = footballField(fieldSize, currX, currY);
			} else if (fieldType === "basketball") {
				fieldLayer = basketballField(fieldSize, currX, currY);
			}
			
			this.addFieldEvents(fieldLayer);
			stage.add(fieldLayer);
			fieldLayer.moveToBottom();
			$("#canvas .kineticjs-content").prepend($(fieldLayer.getCanvas().element).detach());
		},
		
		addFieldEvents: function(fieldLayer) {
			var view = this;
			
			fieldLayer.on('dragmove', function(e) {
				var tempLayer = fieldLayer;
				$.each(stage.getChildren(), function(index, value) {
					if (value.getName() !== "fieldLayer") {
						value.setPosition(fieldLayer.getPosition());
						value.draw();
					}
				});
			});
			
			// Deselect currently selected item
			fieldLayer.on('click', function(e) {
				$("#article").children().removeClass("selected");
				
				view.model.get("articles").each(function(article) {
					article.trigger("unselectArticle");
				});
				
				$(".annotation-cancel").click();
			});
			
			fieldLayer.on('dragstart', function(e) {
				$("#article").children().removeClass("selected");
				
				view.model.get("articles").each(function(article) {
					article.trigger("unselectArticle");
				});
				
				$(".annotation-cancel").click();
			});
		},
		
		addSet: function(item, show) {
			var view = new $.playbook.SetView({model: item});
			
			// Add info div
			$("#set").append(view.render().el);
			
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
		
		addNewArticle: function(item, x, y) {
			this.model.trigger("addIoBind");
			
			this.model.trigger("addArticle", item);
		
			var count = 0, numSets = this.model.get("sets").length;
			this.model.get("sets").each(function(set) {
				var path;
				// If x, y provided, then using formation and need to adjust
				// If no x, y provided, then add to middle of canvas
				var point = {
					x: x != null ? x + stage.get(".fieldLayer")[0].get(".fieldGroup")[0].getX() : CANVAS_WIDTH / 2 - stage.current.getX(),
					y: y != null ? y + stage.get(".fieldLayer")[0].get(".fieldGroup")[0].getY(): CANVAS_HEIGHT / 2 - stage.current.getY()
				};
				
				if (set.get("number") === 1)
					path = new $.playbook.Path({
						prevX: null,
						prevY: null,
						currX: point.x,
						currY: point.y,
						nextX: point.x,
						nextY: point.y,
						set: set,
						articleId: item.get("_id")
					});
				else
					path = new $.playbook.Path({
						prevX: point.x,
						prevY: point.y,
						currX: point.x,
						currY: point.y,
						nextX: point.x,
						nextY: point.y,
						set: set,
						articleId: item.get("_id")
					});
				
				path.save({}, {
					wait: true,
					success: function(model, response) {
						model.trigger("addIoBind");
						set.trigger("addPath", path);
						
						if (++count == numSets) {
							item.trigger("selectArticle");
						}
					}
				});
				
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
		
		showFieldPropOptions: function(e) {
			$(e.target).closest(".field-prop").find("ul").fadeIn(350, "swing");
		},
		
		hideFieldPropOptions: function(e) {
			if ($(e.relatedTarget).closest(".field-prop").attr("id") == $(e.target).closest(".field-prop").attr("id")) return;
			
			$(e.target).closest(".field-prop").find("ul").fadeOut(350, "swing");
		},
		
		fadeFieldPropOptions: function(e) {
			$(e.target).closest(".field-prop").addClass("field-prop-faded");
		},
		
		unfadeFieldPropOptions: function(e) {
			$(e.target).closest(".field-prop").removeClass("field-prop-faded");
		},
		
		changeField: function(e) {
			var fieldProp = $(e.target).closest(".field-prop");
			var fieldOption = $(e.target).closest(".field-option");
			
			if (fieldProp.data("value") !== fieldOption.data("value")) {
				fieldProp.data("value", fieldOption.data("value"));
				this.model.save({fieldType: $("#field-type").data("value"), fieldSize: $("#field-size").data("value")});
			}
		},

		currentSet: function() {
			var currSetId = $(".set-list").find(".selected").attr("id");
			return this.model.get("sets").find(function(set) {
				return set.get("_id") === currSetId;
			});
		},
		
		createSet: function(e) {
			// build off the last set
			var lastSet = this.model.get("sets").max(function(set) {
				return set.get("number");
			});
		
			var newSet = new $.playbook.Set({number: this.model.get("sets").length + 1,  play: this.model});
			
			// Copy the article locations from the last set
			if (lastSet) {
				lastSet.get("paths").each(function(path) {
					var newPath = new $.playbook.Path({
						prevX: path.get("currX"),
						prevY: path.get("currY"),
						currX: path.get("currX"),
						currY: path.get("currY"),
						nextX: path.get("currX"),
						nextY: path.get("currY"),
						set: newSet,
						articleId: path.get("articleId")
					});
					// Added automatically to newSet by setting set prop to set
				});
			}
			
			newSet.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.trigger("addIoBind");
					model.get("play").trigger("change");
					model.get("play").trigger("addNewSet", model);
				}
			});
		},
		
		changeSet: function(e) {
			var setId = $(e.target).closest("tr").attr("id");
			
			var currSet = this.currentSet();
			
			if (setId && setId != currSet.get("_id")) {
				var displaySet = this.model.get("sets").find(function(set) {
					return set.get("_id") === setId;
				});
				
				displaySet.trigger("show");
			}
		},
		
		deleteSet: function(e) {
			var currSet = this.currentSet();
			
			currSet.trigger("clear");
		},
		
		firstSet: function(e) {
			var firstSet = $(".set-list").find(".set-row").first();
			if (firstSet.length !== 0) firstSet.click();
		},
		
		prevSet: function(e) {
			var prevSet = $('.set-list').find(".selected").prev();
			if (prevSet.length !== 0) prevSet.click();
		},
		
		nextSet: function(e) {
			var nextSet = $('.set-list').find(".selected").next();
			if (nextSet.length !== 0) nextSet.click();
		},
		
		lastSet: function(e) {
			var lastSet = $(".set-list").find(".set-row").last();
			if (lastSet.length !== 0) lastSet.click();
		},
		
		addPlayer: function(e) {
			var player = new $.playbook.Article({
				type: "player",
				color: $(e.target).siblings(".select-color").val(),
				shape: $(e.target).siblings(".select-shape").val(),
				team: $(e.target).parent().attr("id"),
				play: this.model.get("_id")
			});
			player.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
		},
		
		addBall: function(e) {
			var ball = new $.playbook.Article({type: "ball", color: "white", shape: "circle", play: this.model.get("_id")});
			ball.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
		},
		
		addCone: function(e) {
			var cone = new $.playbook.Article({type: "cone", color: "orange", shape: "triangle", play: this.model.get("_id")});
			cone.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.get("play").trigger("addNewArticle", model);
				}
			});
		},
		
		addAnnotation: function(e) {
			var annotation = new $.playbook.Annotation({set: this.currentSet()});
			annotation.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.trigger("addIoBind");
					model.get("set").trigger("addNewAnnotation", model);
				}
			});
		},
		
		// Animation recursion wrapper
		animateSets: function(e) {
			this.undelegateEvents();
			
			var currSet = this.currentSet();
			
			this.model.trigger("animate", currSet, currSet);
		},
		
		animate: function(set, initialSet) {
			var view = this;
			set.trigger("animate", function() {
				// Show next set
				var nextSet = set.nextSet();
				if (!nextSet) {
					initialSet.trigger("show");
					
					view.delegateEvents();
					return;
				}
				nextSet.trigger("show");
				
				// Reset animation
				set.trigger("reset");
				
				// simulate animate press
				view.model.trigger("animate", nextSet, initialSet);
			});
		},
		
		resetPlayView: function() {
			clearDivs();
		
			// Remove previous stage if necessary
			if (stage) {
				$(stage.getDOM()).remove();
			}
			// create stage
			stage = new Kinetic.Stage({
				container: "canvas",
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
			});
			
			this.model.trigger("change", true); // Renders both PlayView and PlayContentsView
			this.model.trigger("init");
		},
	});
	
	$.playbook.PlayCollectionView = Backbone.View.extend({
		tagName: "div",
		className: "play-collection-view",
	
		template: $("#play-collection-template").html(),
		listTemplate: $("#play-list-template").html(),
		
// 		events:
		
		initialize: function() {
			this.collection.on('init', this.render, this);
			
			var view = this;
			this.collection.fetch({
				success: function(collection, response) {
					collection.trigger('init');
				}
			});
		},
		
		render: function() {
			var view = this;	
			
			$("#plays-container").html("");
			
			this.$el.html(Mustache.render(this.template, this.collection.toJSON()));
			
			$("#plays-container").append(this.el);
			
			$("#play-list").html("");
			
			this.collection.each(function(play) {
				var html = Mustache.render(view.listTemplate, play.toJSON()),
					htmlObj = $(html);
				console.log(html);
				htmlObj.find(".link").on("click", function(e) {
					$.playbook.app.navigate("play/" + play.get("_id"), {trigger: true});
				});
				$("#play-list").append(htmlObj);
			});
		},
	});
	
	$.playbook.Router = Backbone.Router.extend({
		routes: {
			"":				"home",
			"plays":		"show_plays",
			"play/:_id":	"show_play",
		},
		
		home: function() {
			clearDivs();
			
			$("#playbook").attr("class", "home");
		},
		
		show_plays: function() {
			clearDivs();
			
			$("#playbook").attr("class", "plays");
			
			var plays = new $.playbook.PlayCollection();
			
			var playsView = new $.playbook.PlayCollectionView({collection: plays});
		},
		
		show_play: function(_id) {
			// clear previous divs
			clearDivs();
			
			$("#playbook").attr("class", "play");
		
			var play = new $.playbook.Play({_id: _id});
			
			var playView = new $.playbook.PlayView({model: play});
			
			var playContentsView = new $.playbook.PlayContentsView({model: play});
		},
	});
	
	$.playbook.app = null;
	
	$.playbook.bootstrap = function() {
		$.playbook.app = new $.playbook.Router();
		Backbone.history.start({pushState: true});
		
		$("#header").click(function() {
			$.playbook.app.navigate("/", {trigger: true});
		});
		
		var play;
		$("#new-play").click(function() {
			play = new $.playbook.Play({});
			
			coverScreen();
			$("#whiteout").on("click", function() {
				$("#whiteout").off("click");
				$("#new-play-container").fadeOut(350, "swing");
				uncoverScreen();
			});
			$("#new-play-container").find(".new-play-page").hide();
			$("#new-play-field-type").fadeIn(350, "swing");
			$("#new-play-container").fadeIn(350, "swing");
		});
		
		$("#new-play-field-type").find(".choice").on("click", function(e) {
			play.set("fieldType", $(e.target).closest(".choice").data("value"));
			
			$("#new-play-field-type").fadeOut(350, "swing");
			$("#new-play-field-size").fadeIn(350, "swing");
		});
		
		$("#new-play-field-size").find(".choice").on("click", function(e) {
			play.set("fieldSize", $(e.target).closest(".choice").data("value"));
			
			$("#new-play-field-size").fadeOut(350, "swing");
			$("#new-play-options").fadeIn(350, "swing");
		});
		
		$("#new-play-options").find(".choice").on("click", function(e) {
			if ($(e.target).closest(".choice").data("value") === "blank") {
				$("#new-play-options").fadeOut(350, "swing");
				
				play.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					uncoverScreen();
					$.playbook.app.navigate("play/" + model.get("_id"), {trigger: true});
				}
			});
			} else if ($(e.target).closest(".choice").data("value") === "template") {
				$("#new-play-options").fadeOut(350, "swing");
				$("#new-play-templates").find("ul").hide();
				$("#new-play-templates").fadeIn(350, "swing");
				$("#new-play-templates").find("." + play.get("fieldType") + "-formations").fadeIn(350, "swing");
				
			}
		});
		
		$("#new-play-templates").find(".choice").on("click", function(e) {
			// Create play with that formation
		});
		
		$("#new-play-container").find(".back").on("click", function(e) {
			var currPage = $(e.target).closest(".new-play-page");
			
			currPage.fadeOut(350, "swing");
			currPage.prev().fadeIn(350, "swing");
		});
		
		$("#new-play-container").find(".close").on("click", function(e) {
			$("#whiteout").off("click");
			$("#new-play-container").fadeOut(350, "swing");
			uncoverScreen();
		});
		
		$("#view-plays").click(function() {
			$.playbook.app.navigate("plays", {trigger: true});
		});
		
		$(window).keypress(changeSet);
	}
	
	$.playbook.bootstrap();
});

/* Util functions */

function coverScreen() {
	// show div that covers entire screen
	$("#whiteout").fadeIn(350, "swing");
}

function uncoverScreen() {
	// hide that div
	$("#whiteout").fadeOut(350, "swing");
}

function changeSet(e) {
	if (e.target.tagName === "BODY") {
		if (e.keyCode === 37 || e.keyCode === 38) {
			$(".prev-set").click();
		} else if (e.keyCode === 39 || e.keyCode === 40) {
			$(".next-set").click();
		} else if (e.charCode === 32) {
			$(".animate").click();
		}
	}
}

function clearDivs() {
	$("#plays-container").html("");
	
	$("#play").html("");
	$("#play-contents").html("");
	$("#set").html("");
	$("#article").html("");
}

function errorMessage(msg) {
	// DO NOTHING NOW
	// POP UP ERROR MESSAGE
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