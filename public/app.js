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
				x: 0,
				y: 0,
				width: 20,
				height: 3,
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
				type: $("#field-type").val() ? $("#field-type").val() : "ultimate",
				size: $("#field-size").val() ? $("#field-size").val() : "full",
				teamColors: ["#0000ff", "#ff0000", ],
				teamShapes: ["circle", "circle", ],
			};
		},
		
		initialize: function() {
			_.bindAll(this, 'serverChange', 'serverDelete', 'serverCreateSet', 'serverCreateArticle');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
				this.ioBind('delete', this.serverDelete, this);
				
				this.ioBind('createSet', this.serverCreateSet, this);
				this.ioBind('createArticle', this.serverCreateArticle, this);
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
	});
	
	$.playbook.ArticleView = Backbone.View.extend({
		tagName: "div",
		className: "article-view",
		
		template: $("#article-template").html(),
		
		events: {
			"keyup .label"  : "updateLabel",
			"change select" : "changeType",
			"click .delete" : "clear"
		},
		
		initialize: function() {
			this.paths = [];
		
			this.model.on('addPathShape', this.addPathShape, this);
			this.model.on('removePathShape', this.removePathShape, this);
// 			this.model.on('show', this.show, this);
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
			var html = Mustache.render(this.template, this.model.toJSON());
			// Hack to select correct item in list
			html = $(html).find('option[value=' + this.model.get("type") + ']').attr('selected', 'selected').end();
			
			if (this.model.get("type") === "player") {
				html = $(html).find('option[value=' + this.model.get("team") + ']').attr('selected', 'selected').end();
				$(html).closest(".team-select").show();
			}
			
			this.$el.html(html);
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
		
// 		show: function() {
// 			this.$el.siblings().removeClass("selected");
// 			this.$el.addClass("selected");
// 		},
		
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
		
		changeType: function(e) {
			var articleProp = {};
			// Assign by default to team0
			if (e.currentTarget.value === "player") {
				articleProp.type = e.currentTarget.value;
				articleProp.color = $("#color0").val();
				articleProp.shape = $("#shape0").val();
				articleProp.team = "team0";
			} else if (e.currentTarget.value === "team0") {
				articleProp.color = $("#color0").val();
				articleProp.shape = $("#shape0").val();
				articleProp.team = "team0";
			} else if (e.currentTarget.value === "team1") {
				articleProp.color = $("#color1").val();
				articleProp.shape = $("#shape1").val();
				articleProp.team = "team1";
			} else if (e.currentTarget.value === "ball") {
				articleProp.type = e.currentTarget.value;
				articleProp.color = "white";
				articleProp.shape = "circle";
				articleProp.team = "";
			} else if (e.currentTarget.value === "cone") {
				articleProp.type = e.currentTarget.value;
				articleProp.color = "orange";
				articleProp.shape = "triangle";
				articleProp.team = "";
			}
			this.model.save(articleProp, {
				wait: true,
				success: function(model, response) {
					model.trigger("replaceShape");
				}
			});
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
					$("#set").append(view.el);
				view.$el.addClass("editing");
				
				// Calculate offset (canvas DOM + layer offset + item location)
				view.$el.css({
					left: $("#canvas").position().left + stage.current.getX() + view.model.get("x"),
					top: $("#canvas").position().top + stage.current.getY() + view.model.get("y"),
				});
				// Calculate size (item size - padding size)
				view.$el.find(".annotation-edit").css({
					width: (view.model.get("width") + 1) * SCALE - 10,
					height: (view.model.get("height") + 1) * SCALE - 6
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

		saveAnnotation: function() {
			this.model.save({text: this.$el.find(".annotation-edit").text()});
			
			this.$el.detach();
		},
		
		closeEdit: function() {
			// Hide text
			this.shape.get(".annotationText")[0].show();
			this.layer.draw();
		
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
			"dblclick .name"      : "editName",
			"blur .name-edit"     : "updateName",
			"dblclick .comments"  : "editComments",
			"blur .comments-edit" : "updateComments",
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
			
			this.model.get("play").trigger("change");
			
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
			"click .name"			: "editName",
			"blur .name-edit"		: "updateName",
			"keypress .name-edit"	: "updateName",
			"dblclick .desc"		: "editDescription",
			"blur .desc-edit"		: "updateDescription",
			"click .new-play"		: "newPlay",
			"click .reset-play"		: "resetPlay",
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			
			$("#play").append(this.el);
			return this;
		},
		
		editName: function(e) {
			$(e.currentTarget).addClass("edit");
			$(e.currentTarget).find("input").focus();
		},
		
		updateName: function(e) {
			if (e.type === "keypress" && e.keyCode != 13) return;
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
				// Remove all articles
				var articles = this.model.get("articles")
				while (!articles.isEmpty()) {
					articles.shift().trigger("clear");
				}
				
				// Remove all sets
				var sets = this.model.get("sets")
				while (!sets.isEmpty()) {
					sets.pop().trigger("clearAll");
				}
				
				// Add three new sets
				var newSet1 = new $.playbook.Set({number: 1,  play: this.model});
				var newSet2 = new $.playbook.Set({number: 2,  play: this.model});
				var newSet3 = new $.playbook.Set({number: 3,  play: this.model});
				
				newSet1.save({}, {
					wait: true,
					success: function(model, response) {
						model.trigger("addIoBind");
						model.get("play").trigger("change");
						model.get("play").trigger("addNewSet", model);
					}
				});
				newSet2.save({}, {
					wait: true,
					success: function(model, response) {
						model.trigger("addIoBind");
						model.get("play").trigger("change");
						model.get("play").trigger("addNewSet", model);
					}
				});
				newSet3.save({}, {
					wait: true,
					success: function(model, response) {
						model.trigger("addIoBind");
						model.get("play").trigger("change");
						model.get("play").trigger("addNewSet", model);
					}
				});
			} else {
				console.log("Cancelled reset");
			}
		}
	});
	
	$.playbook.PlayContentsView = Backbone.View.extend({
		tagName: "div",
		className: "play-contents-view",
		
		template: $("#play-contents-template").html(),
		
		events: {
			"change #field-type"	: "changeField",
			"change #field-size"	: "changeField",
			"click .add-set"		: "createSet",
			"click .set-list"		: "changeSet",
			"click .remove-set"		: "deleteSet",
			"click .useForm"		: "useFormation",
			"click .add-player"		: "addPlayer",
			"click .add-ball"		: "addBall",
			"click .add-cone"		: "addCone",
			"click .add-ann"		: "addAnnotation",
			"click .animate"		: "animateSets",
		},
		
		initialize: function() {
			// Remove previous stage if necessary
			if (stage) {
				$(stage.getDOM()).remove();
			}
			// create stage
			stage = new Kinetic.Stage({
				container: "canvas",
				width: 800,
				height: 600,
			});
			
			this.model.on('change', this.render, this);
			this.model.on('addSet', this.addSet, this);
			this.model.on('addNewSet', this.addNewSet, this);
			this.model.on('addArticle', this.addArticle, this);
			this.model.on('addNewArticle', this.addNewArticle, this);
			this.model.on('animate', this.animate, this);
			this.model.on('init', this.addAll, this);
			
			var view = this;
			this.model.fetch({
				success: function(model, response) {
					model.trigger('init');
				}
			});
		},
		
		render: function() {
			// Sort set list
			var sortedSets = this.model.get("sets").sortBy(function(set) {
				return set.get("number");
			});
			this.model.set("sets", sortedSets, {silent: true});
			
			var html = Mustache.render(this.template, this.model.toJSON());
			
			// Hack to select correct field type and size
			html = $(html).find('option[value=' + this.model.get("type") + ']').attr('selected', 'selected').end();
			html = $(html).find('option[value=' + this.model.get("size") + ']').attr('selected', 'selected').end();
			
			this.addField(this.model.get("type"), this.model.get("size"));
			
			// Hack to keep current set selected
			var currSetId = $(".set-list").find(".selected").attr("id");
			if (currSetId) $(html).find('#' + currSetId).addClass('selected');
			
			// JQuery UI Plugins
			var view = this;
			$(html).find(".select-color").colorPicker({onColorChange: function(id, newValue) {
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
			
			$(html).find(".select-shape").shapePicker({onShapeChange: function(id, newValue) {
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
			
			var currSpeed = $(".animation-speed").slider("value");
			$(html).find(".animation-speed").slider({
				value: currSpeed ? currSpeed : 1.5,
				min: 0.5,
				max: 2.5,
				step: 0.5,
				slide: function(event, ui) {
					$(html).find(".animation-speed-display").html(ui.value + "x");
				}
			});
			$(html).find(".animation-speed-display").html($(html).find(".animation-speed").slider("value") + "x");
			
			this.$el.html(html);
			
			$("#play-contents").append(this.el);
			
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
				var point = {
					x: x != null ? x : stage.get(".fieldLayer")[0].get(".playingField")[0].getWidth() / 2 - START_X,
					y: y != null ? y : stage.get(".fieldLayer")[0].get(".playingField")[0].getHeight() / 2 - START_Y
				};
				
				point.x += stage.get(".fieldLayer")[0].get(".fieldGroup")[0].getX();
				point.y += stage.get(".fieldLayer")[0].get(".fieldGroup")[0].getY();
				
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
		
		changeField: function(e) {
			this.model.save({type: $("#field-type").val(), size: $("#field-size").val()});
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
		
		useFormation: function() {
			if ($(".formationType").val() === "default") return;
			if (confirm("Selecting a formation removes all items currently in your play. Are you sure you want to continue?")) {
				var articles = this.model.get("articles")
				while (!articles.isEmpty()) {
					articles.shift().trigger("clear");
				}
				var formationType = $(".formationType").val();
				
				// Formation sport does not have to be same as field sport
				var sportType = $(".formationType").find("option:selected").parent().attr("value");
				
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
	});
	
	$.playbook.Router = Backbone.Router.extend({
		routes: {
			"play/:_id":	"show_play",
		},
		
		show_play : function(_id) {
			// clear previous divs
			clearDivs();
		
			var play = new $.playbook.Play({_id: _id});
			
			var playView = new $.playbook.PlayView({model: play});
			
			var playContentsView = new $.playbook.PlayContentsView({model: play});
		},
	});
	
	$.playbook.app = null;
	
	$.playbook.bootstrap = function() {
		$.playbook.app = new $.playbook.Router();
		Backbone.history.start({pushState: true});
		
		$("#new-play").click(function() {
			var play = new $.playbook.Play({});
			
			play.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					$.playbook.app.navigate("play/" + model.get("_id"), {trigger: true});
				}
			});
		});
		
		$(window).keypress(changeSet);
	}
	
	$.playbook.bootstrap();
});

/* Util functions */

function print() {
// 	console.log(stage);
// 	var fl = stage.get(".fieldLayer")[0];
// 	console.log(fl);
// 	console.log(fl.getPosition());
// 	console.log(stage.getDOM());
	console.log(stage.current);
}

function changeSet(e) {
	if (e.target.tagName === "BODY") {
		if (e.keyCode === 37 || e.keyCode === 38) {
			var prevSet = $('.set-list').find(".selected").prev();
			if (prevSet.length !== 0) prevSet.click();
		} else if (e.keyCode === 39 || e.keyCode === 40) {
			var nextSet = $('.set-list').find(".selected").next();
			if (nextSet.length !== 0) nextSet.click();
		}
	}
}

function clearDivs() {
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