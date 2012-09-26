/* GLOBALS */
var stage,
	socket = io.connect();

$(function() {
	$.playbook = {}
	
	/***** MODELS *****/
	
	$.playbook.User = Backbone.Model.extend({
		idAttribute: "_id",
		
		initialize: function() {
			_.bindAll(this, 'serverChange');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
		},
		
		urlRoot: "user",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
			
			this.trigger("change");
		},
	});
		
	$.playbook.Users = Backbone.Collection.extend({
		model: $.playbook.User,
		
		initialize: function() {
		
		},
		
		url: "users",
		
		socket: socket,
	});
	
	$.playbook.Team = Backbone.Model.extend({
		idAttribute: "_id",
		
		initialize: function() {
			_.bindAll(this, 'serverChange');
			if (!this.isNew()) {
				this.ioBind('update', this.serverChange, this);
			}
			
			this.on("addIoBind", this.addIoBind, this);
		},
		
		urlRoot: "team",
		
		socket: socket,
		
		addIoBind: function() {
			this.ioBind('update', this.serverChange, this);
		},
		
		serverChange: function(data) {
			// Useful to prevent loops when dealing with client-side updates (ie: forms).
			data.fromServer = true;
			this.set(data);
			
			this.trigger("change");
		},
	});
	
	$.playbook.Teams = Backbone.Collection.extend({
		model: $.playbook.Team,
		
		initialize: function() {
			
		},
		
		url: "teams",
		
		socket: socket,
	});
	
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
			
			nextPath.moveTo(x, y);
			nextPath.trigger("change");
			
			// Saving current set
			//this.save({nextX: x, nextY: y});
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
				user: $.playbook.user ? $.playbook.user.get("_id") : null, // add prop
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
			this.set(data, {silent: true});
		
			this.trigger("resetPlayView");
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
	
	/***** VIEWS *****/
	
	$.playbook.UserView = Backbone.View.extend({
		tagName: "div",
		className: "user-view",
		
		template: $("#user-template").html(),
		loginTemplate: $("#login-template").html(),
		
		events: {
			"click .login"	: "login",
			"click .logout"	: "logout",
			
			"click .name"	: "showProfile",
			"click .new-play"	: "newPlay",
			"click .view-plays"	: "viewPlays",
			"click .profile"	: "showProfile",
			"click .teams"	: "showTeams",
		},
		
		initialize: function() {
			_.bindAll(this, 'render', 'loginScreen', 'closeLoginScreen', 'loginCallback', 'signupCallback', 'logout');
			
			// show login div
			if (localStorage) {
				var userData = JSON.parse(localStorage.getItem("userData"));
				
				if (userData) {
					// assume logged in for now
					this.model = new $.playbook.User(userData);
					$.playbook.user = this.model;
					
					this.model.on('change', this.render, this);
					
					this.render();
// 					socket.emit("user:login", user, loginCallback);
				} else {
					this.loginScreen();
				}
			}
			
			// TODO: fallback when no localstorage
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, this.model ? this.model.toJSON() : {_id : null}));
			$("#user-control-panel").html(this.el);
			
			this.delegateEvents();
			
			return this;
		},
		
		loginScreen: function() {
			var view = this;
			
			coverScreen();
			
			if ($("#login-container").length) {
				// may not need could remove the DOM after done
				$("#login-container").fadeIn(350, "swing");
			} else {
				$("body").append($("#login-template").html());
				$("#login-container").fadeIn(350, "swing");
				$("#login-page").fadeIn(350, "swing");
				
				$("#login").on("click", function(e) {
					var user = {};
					user.email = $("#login-page").find(".email-field").val();
					user.password = $("#login-page").find(".password-field").val();
					user.remember = $("#login-page").find(".remember-field").is(':checked');
					
					// Check conditions
					var warnings = [];
					if (user.email === "") {
						warnings.push("Please enter an email.");
					} else {
						var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						if (!re.test(user.email))
							warnings.push("Not a valid email.");
					}
					
					if (user.password === "") {
						warnings.push("Please enter a password.");
					}
					
					if (warnings.length) {
						var warning = $("#login-page").find(".warning");
						warning.html("");
						$.each(warnings, function(index, value) {
							warning.append("<li>" + value + "</li>");
						});
						return;
					}
					
					socket.emit("user:login", user, view.loginCallback);
				});
				
				$("#login-page").find(".link").on("click", function(e) {
					// Potentially expand to link to other pages
					$("#login-page").fadeOut(350, "swing");
					$("#signup-page").fadeIn(350, "swing");
				});
				
				$("#signup").on("click", function(e) {
					var user = {};
					user.email = $("#signup-page").find(".email-field").val();
					user.name = $("#signup-page").find(".name-field").val();
					user.password = $("#signup-page").find(".password-field").val();
					user.confirm = $("#signup-page").find(".confirm-password-field").val();
					
					// Check conditions
					var warnings = [];
					if (user.email === "") {
						warnings.push("Please enter an email.");
					} else {
						var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						if (!re.test(user.email))
							warnings.push("Not a valid email.");
					}
					
					if (user.name === "") {
						warnings.push("Please enter a name.");
					}
					
					if (user.password === "" || user.confirm === "") {
						warnings.push("Please enter a password."); // TODO: correct text enter a password and confirmation???
					} else if (user.password !== user.confirm) {
						warnings.push("Passwords do not match.");
					}
					
					if (warnings.length) {
						var warning = $("#signup-page").find(".warning");
						warning.html("");
						$.each(warnings, function(index, value) {
							warning.append("<li>" + value + "</li>");
						});
						return;
					}
					
					socket.emit("user:signup", user, view.signupCallback);
				});
				
				$("#signup-page").find(".cancel").on("click", function(e) {
					$("#signup-page").fadeOut(350, "swing");
					$("#login-page").fadeIn(350, "swing");
				});
				
				$("#login-container").find(".continue").on("click", function(e) {
					view.closeLoginScreen();
					
					view.render();
				});
			}
		},
		
		closeLoginScreen: function() {
			$("#login-container").fadeOut(350, "swing", function() {
				$("#login-container").remove();
				uncoverScreen();
			});
			
			this.render();
		},
		
		loginCallback: function(err, result) {
			if (err) {
				$("#login-page").find(".warning").html("<li>" + err + "</li>");
			} else {
				// Login Successful
				// store login credentials in local storage, only if they checked remember me
				if (result.remember) {
					delete result.remember;
					localStorage.setItem("userData", JSON.stringify(result));
				}
				
				this.model = new $.playbook.User(result);
				$.playbook.user = this.model;
				
				this.closeLoginScreen();
			}
		},
		
		signupCallback: function(err, result) {
			if (err) {
				$("#signup-page").find(".warning").html("<li>" + err + "</li>");
			} else {
				// Signup Successful
				// store login credentials in local storage
				localStorage.setItem("userData", JSON.stringify(result));
				
				this.model = new $.playbook.User(result);
				$.playbook.user = this.model;
				
				this.model.trigger("addIoBind");
				
				this.closeLoginScreen();
			}
		},
		
		login: function(e) {
			this.loginScreen();
		},
		
		logout: function(e) {
			localStorage.removeItem("userData");
			
			this.model = null;
			$.playbook.user = null;
			
			this.teamsView = null;
			
			this.render();
			
			$.playbook.app.navigate("/", {trigger: true});
		},
		
		newPlay: function() {
			$.playbook.NewPlay.newPlay();
			
			coverScreen();
			$("#whiteout").on("click", function() {
				$("#whiteout").off("click");
				$("#new-play-container").fadeOut(350, "swing");
				uncoverScreen();
			});
			$("#new-play-container").find(".new-play-page").hide();
			$("#new-play-field-type").fadeIn(350, "swing");
			$("#new-play-container").fadeIn(350, "swing");
		},
		
		viewPlays: function() {
			$.playbook.app.navigate("plays", {trigger: true});
		},
		
		showProfile: function() {
			$.playbook.app.navigate("user/" + $.playbook.user.get("_id"), {trigger: true});
		},
		
		showTeams: function() {
			if (!this.teamsView) {
				this.teamsView = new $.playbook.TeamsView();
			} else {
				this.teamsView.toggle();
			}
		},
		
		getUser: function() {
			return this.model ? this.model.get("_id") : null;
		},
	});
	
	$.playbook.ProfileView = Backbone.View.extend({
		el: $("#user-container"),
	
		tagName: "div",
		className: "profile-view",
		
		template: $("#profile-template").html(),
		
		events: {
			"click .update"	: "updateProfile",
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
			
			this.model.trigger("change");
		},
		
		render: function(bindEvents) {
			// Check if user
			this.model.set("self", this.model.get("_id") === ($.playbook.user ? $.playbook.user.get("_id") : null), {silent: true});
		
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			
			return this;
		},
		
		updateProfile: function() {
			var user = {};
			// ignore email since readonly
			user.name = $("#user-container").find(".name-field").val();
			user.old = $("#user-container").find(".old-password-field").val();
			user.password = $("#user-container").find(".new-password-field").val();
			user.confirm = $("#user-container").find(".confirm-new-password-field").val();
			
			// Check conditions
			var warnings = [];
			
			if (user.old === "" && (user.password || user.confirm)) {
				warnings.push("Please enter current password.")
			}
			
			if (user.password !== user.confirm) {
				warnings.push("New passwords do not match.");
			}
			
			if (warnings.length) {
				$("#user-container").find(".success").html("");
				var warning = $("#user-container").find(".warning");
				warning.html("");
				$.each(warnings, function(index, value) {
					warning.append("<li>" + value + "</li>");
				});
				return;
			}
			
			var saveAttr = {};
			if (user.name && this.model.get("name") !== user.name) {
				saveAttr.name = user.name;
			}
			
			if (user.old && user.password && user.confirm) {
				saveAttr.old = user.old;
				saveAttr.password = user.password;
			}
			
			// Don't save if no changes
			if (_.isEmpty(saveAttr)) {
				return;
			}
			
			this.model.save(saveAttr, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.unset("old", {silent: true});
					model.unset("password", {silent: true});
					localStorage.setItem("userData", JSON.stringify(model.toJSON()));
					model.trigger("change");
					$("#user-container").find(".success").html("Update Successful!");
				},
				error: function(model, response) {
					$("#user-container").find(".success").html("");
					$("#user-container").find(".warning").html("<li>" + response + "</li>");
				},
			});
		},
	});
	
	$.playbook.TeamsView = Backbone.View.extend({
		tagName: "div",
		className: "teams-view",
		
		template: $("#teams-template").html(),
		
		events: {
			"click .team-link"	: "showTeam",
			"click .join-team"	: "showJoinTeam",
			"click .create-team"	: "showCreateTeam",
			
			"click .join"	: "joinTeam",
			"click .create"	: "createTeam",
			"click .cancel"	: "hideForms",
		},
		
		initialize: function() {
			this.collection = new $.playbook.Teams();
			this.showOrHide = false;
		
			_.bindAll(this, 'show', 'toggle', 'checkMouse', 'showJoinTeam', 'showCreateTeam', 'joinTeam', 'joinCallback', 'createTeam', 'hideForms');
			this.collection.on('refresh', this.render, this);
			
			this.collection.fetch({
				data: _.extend({}, {players: $.playbook.user.get("_id")}),
				success: function(collection, response) {
					collection.trigger('refresh');
				}
			});
		},
		
		render: function() {
			var view = this;
			this.$el.html(Mustache.render(this.template, {teams: this.collection.toJSON()}));
			
			if (this.collection.length === 0) {
				this.$el.find("#team-list").append("<li class='team-item'><span>No Teams Joined...</span></li>");
			}
			
// 			$("#user-control-panel .teams-view").remove();
			$("#user-control-panel").append(this.el);
			
			this.show();
		},
		
		show: function() {
			// If already showing
			if (this.showOrHide) return;
			
			this.showOrHide = true;
			
			$(document).on("mousedown", this.checkMouse);
			this.$el.toggle(this.showOrHide);
		},
		
		toggle: function() {
			this.showOrHide = !this.showOrHide;
			
			if (this.showOrHide) {
				$(document).on("mousedown", this.checkMouse);
			} else {
				$(document).off("mousedown", this.checkMouse);
			}

			this.$el.toggle(this.showOrHide);
		},
		
		checkMouse: function(e) {
			if ($(e.target).closest(".teams-view")[0] || $(e.target).closest(".button").hasClass("teams")) return;
			
			this.showOrHide = false;
			
			$(document).off("mousedown", this.checkMouse);
			this.$el.toggle(this.showOrHide);
		},
		
		showTeam: function(e) {
			$.playbook.app.navigate("team/" + $(e.target).closest(".team-item").attr("id"), {trigger: true});
			
			this.showOrHide = false;
			
			$(document).off("mousedown", this.checkMouse);
			this.$el.toggle(this.showOrHide);
		},
		
		showJoinTeam: function() {
			this.$el.find(".create-team").removeClass("selected");
			this.$el.find(".create-team-form").hide();
			
			this.$el.find(".join-team").addClass("selected");
			this.$el.find(".join-team-form").show();
		},
		
		showCreateTeam: function() {
			this.$el.find(".join-team").removeClass("selected");
			this.$el.find(".join-team-form").hide();
			
			this.$el.find(".create-team").addClass("selected");
			this.$el.find(".create-team-form").show();
		},

		joinTeam: function() {
			var team = {};
			team.name = $("#team-forms").find(".join-team-form").find(".name-field").val();
			team.password = $("#team-forms").find(".join-team-form").find(".password-field").val();
			
			// Check conditions
			var warnings = [];
			if (team.name === "") {
				warnings.push("Please enter a team name.");
			}
			
			if (team.password === "") {
				warnings.push("Please enter a password."); // TODO: correct text enter a password and confirmation???
			}
			
			if (warnings.length) {
				var warning = $("#team-forms").find(".join-team-form").find(".warning");
				warning.html("");
				$.each(warnings, function(index, value) {
					warning.append("<li>" + value + "</li>");
				});
				return;
			}
			
			team.user = $.playbook.user.get("_id");
			// send socket
			socket.emit("team:join", team, this.joinCallback);
		},
		
		joinCallback: function(err, result) {
			if (err) {
				$("#team-forms").find(".join-team-form").find(".warning").html("<li>" + err + "</li>");
			} else {
				// Join Successful
				var team = new $.playbook.Team(result);
				
				this.collection.add(team);
				this.collection.trigger("refresh");
			}
		},
		
		createTeam: function() {
			var team = {};
			team.name = $("#team-forms").find(".create-team-form").find(".name-field").val();
			team.password = $("#team-forms").find(".create-team-form").find(".password-field").val();
			team.confirm = $("#team-forms").find(".create-team-form").find(".confirm-password-field").val();
			
			// Check conditions
			var warnings = [];
			if (team.name === "") {
				warnings.push("Please enter a team name.");
			}
			
			if (team.password === "" || team.confirm === "") {
				warnings.push("Please enter a password."); // TODO: correct text enter a password and confirmation???
			} else if (team.password !== team.confirm) {
				warnings.push("Passwords do not match.");
			}
			
			if (warnings.length) {
				var warning = $("#team-forms").find(".create-team-form").find(".warning");
				warning.html("");
				$.each(warnings, function(index, value) {
					warning.append("<li>" + value + "</li>");
				});
				return;
			}
			
			// send socket
			var view = this;
			var team = new $.playbook.Team({name: team.name, password: team.password, user: $.playbook.user.get("_id")});
			team.save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					model.unset("password", {silent: true});
					model.unset("user", {silent: true});
					
					view.collection.add(model);
					view.collection.trigger("refresh");
				},
				error: function(model, response) {
					$("#team-forms").find(".create-team-form").find(".warning").html("<li>" + response + "</li>");
				},
			});
		},
		
		hideForms: function() {
			this.$el.find(".selected").removeClass("selected");
			this.$el.find(".team-form").hide();
		},
	});
	
	$.playbook.TeamView = Backbone.View.extend({
		el: $("#team-container"),
		
		template: $("#team-template").html(),
		
		events: {
// 			"click .update"	: "updateProfile",
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
			
			this.model.fetch({
				success: function(model, response) {
// 					model.trigger('change');
					// change triggered automatically
				},
				error: function(model, response) {
					// navigate to error pages
					$.playbook.app.navigate("error/" + response.status, {trigger: true});
				},
			});
		},
		
		render: function(bindEvents) {
			this.$el.html(Mustache.render(this.template, this.model.toJSON()));
			return this;
		},
	});
	
	$.playbook.TeamMembersView = Backbone.View.extend({
		el: $("#team-panel"),
		
		tagName: "div",
		className: "team-members-view",
		
		template: $("#team-members-template").html(),
		
		events: {
			"click .member-link"	: "showUser",
		},
		
		initialize: function(options) {
			this.collection = new $.playbook.Users();
			
// 			_.bindAll(this, 'show', 'toggle', 'checkMouse', 'showJoinTeam', 'showCreateTeam', 'joinTeam', 'joinCallback', 'createTeam', 'hideForms');
			this.collection.on('refresh', this.render, this);
			
			this.collection.fetch({
				data: _.extend({}, {teams: options._id}),
				success: function(collection, response) {
					collection.trigger('refresh');
				}
			});
		},
		
		render: function() {
			this.$el.html(Mustache.render(this.template, {users: this.collection.toJSON()}));
			
			if (this.collection.length === 0) {
				this.$el.find("#member-list").append("<li class='member-item'><span>No Members Joined...</span></li>");
			}
			
			return this;
		},
		
		showUser: function(e) {
			$.playbook.app.navigate("user/" + $(e.target).closest(".member-item").attr("id"), {trigger: true});
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
		
			$(e.target).closest(".article-prop").find("ul").removeClass("fading");
			$(e.target).closest(".article-prop").find("ul").css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideArticlePropOptions: function(e) {
			if ($(e.relatedTarget).closest(".article-prop")[0] === $(e.target).closest(".article-prop")[0]) return;
			
			$(e.target).closest(".article-prop").find("ul").addClass("fading");
			$(e.target).closest(".article-prop").find("ul").css({height: 0, opacity: 0, visibility: "hidden"});
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
				
				// Calculate offset (canvas DOM + layer offset + item location)
				view.$el.css({
					left:  -$("#annotation").offset().left + $("#canvas").offset().left + stage.current.getX() + view.model.get("x") + 1, // + 1 was for border
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
// 			this.model.on('clearAll', this.clearAll, this);
			this.model.on('addPath', this.addPath, this);
			this.model.on('addAnnotation', this.addAnnotation, this);
			this.model.on('addNewAnnotation', this.addNewAnnotation, this);
			this.model.on('show', this.show, this);
			this.model.on('undelegate', this.undelegateEve, this);
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
			
			"mouseover .new-formation"	: "showFormations",
			"mouseout .new-formation"	: "hideFormations",
			"click .formation-option"	: "useFormation",
			
			"mouseover .play-options"	: "showOptions",
			"mouseout .play-options"	: "hideOptions",
			
			"mouseover .option-menu"	: "showSuboptions",
			"mouseout .option-menu"		: "hideSuboptions",
			
			"click .privacy-option"	: "updatePrivacy",
			"click .help-option"	: "showHelp",
		},
		
		initialize: function() {
			this.model.on('change', this.render, this);
		},
		
		render: function(bindEvents) {
			// Check if owner
			this.model.set("isOwner", this.model.get("owner") && this.model.get("owner") === ($.playbook.user ? $.playbook.user.get("_id") : null), {silent: true});
		
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
			$.playbook.NewPlay.newPlay();
			
			coverScreen();
			$("#whiteout").on("click", function() {
				$("#whiteout").off("click");
				$("#new-play-container").fadeOut(350, "swing");
				uncoverScreen();
			});
			$("#new-play-container").find(".new-play-page").hide();
			$("#new-play-field-type").fadeIn(350, "swing");
			$("#new-play-container").fadeIn(350, "swing");
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
		
			// TODO: use deep clone and copy layer attributes
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
			this.$el.find(".formations").removeClass("fading");
			this.$el.find(".formations").css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideFormations: function(e) {
			if ($(e.relatedTarget).closest(".new-formation").length) return;
			
			this.$el.find(".formations").addClass("fading");
			this.$el.find(".formations").css({height: 0, opacity: 0, visibility: "hidden"});
		},
		
		useFormation: function(e) {
			if (confirm("Selecting a formation removes all items currently in your play. Are you sure you want to continue?")) {
				var formationType = $(e.target).data("value");
				var fieldType = $("#field-type").data("value");
				
				var formationData = formation(fieldType, formationType);
				for (var index in formationData) {
					var data = formationData[index];
					data.color = data.team ? data.team === "team0" ? $("#color0").val() : $("#color1").val() : data.type === "ball" ? "white" : "orange";
					data.shape = data.team ? data.team === "team0" ? $("#shape0").val() : $("#shape1").val() : data.type === "ball" ? "circle" : "triangle";
				}
				
				this.model.set("formation", formationData);
				this.model.set("offset", fieldOffset(fieldType));
				
				var io = this.model.socket;
				
				io.emit("play:formation", this.model.toJSON());
			} else {
				console.log("Cancelled formation selection");
			}
		},
		
		showOptions: function(e) {
			this.$el.find(".options").removeClass("fading");
			this.$el.find(".options").css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideOptions: function(e) {
			if ($(e.relatedTarget).closest(".play-options").length) return;
			
			this.$el.find(".options").addClass("fading");
			this.$el.find(".options").css({height: 0, opacity: 0, visibility: "hidden"});
		},
		
		showSuboptions: function(e) {
			$(e.target).closest(".option-menu").find(".submenu").removeClass("fading");
			$(e.target).closest(".option-menu").find(".submenu").css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideSuboptions: function(e) {
			if ($(e.relatedTarget).closest(".option-menu")[0] === $(e.target).closest(".option-menu")[0]) return;
			
			$(e.target).closest(".option-menu").find(".submenu").addClass("fading");
			$(e.target).closest(".option-menu").find(".submenu").css({height: 0, opacity: 0, visibility: "hidden"});
		},
		
		updatePrivacy: function(e) {
			// Check if changed
			var newValue = $(e.target).closest(".privacy-option").data("value");
			if (this.model.get("privacy") !== newValue) {
				// close the options menu
				$(e.target).closest(".submenu").attr("class", "submenu " + newValue);
				
				this.model.save({privacy: newValue}, {silent: true});
			}
		},
		
		showHelp: function(e) {
			var helpOption = $(e.target).closest(".help-option").data("value");
			
			var template = $("#" + helpOption + "-template").html();
			
			coverScreen();
			
			// generate popup
			if ($("#popup-container")[0]) {
				var popup = $("#popup-template").html();
				var popupHtml = Mustache.render(popup, {contents: template});
				
				$("#popup-container").html($(popupHtml).html());
			} else {
				var popup = $("#popup-template").html();
				$("body").append(Mustache.render(popup, {contents: template}));
				
				// Close event handlers
				// TODO: use once?
				$("#whiteout").on("click", function() {
					$("#whiteout").off("click");
					$("#popup-container").fadeOut(350, "swing", function() {
						$("#popup-container").remove();
					});
					uncoverScreen();
				});
				
				$("#popup-container").fadeIn(350, "swing");	
			}
			
			$("#popup-close").on("click", function(e) {
				$("#whiteout").off("click");
				$("#popup-container").fadeOut(350, "swing", function() {
					$("#popup-container").remove();
				});
				uncoverScreen();
			});
			
			if (helpOption === "report-issue") {
				$("#report-issue .submit").on("click", function() {
					// SEND ISSUE
					$("#report-issue .warning").html("SORRY, coming soon!");
				});
				
				$("#report-issue .cancel").on("click", function() {
					$("#popup-close").click();
				});
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
			
			// For hidden scroll effect
			//$("#canvas").css("width", CANVAS_WIDTH + getScrollbarWidth());
			
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
				},
				error: function(model, response) {
					// navigate to error pages
					$.playbook.app.navigate("error/" + response.status, {trigger: true});
				},
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
				$(this).find(".animation").removeClass("fading");
				$(this).find(".animation").css({opacity: 1, visibility: "visible"});
				
				$(this).on("mouseout", function(e) {
					if ($(e.relatedTarget).closest(".animate-control").length) return;
					
					$(this).find(".animation").addClass("fading");
					$(this).find(".animation").css({opacity: 0, visibility: "hidden"});
					
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
			
			fieldLayer = createField(fieldType, fieldSize, currX, currY);
			
			this.addFieldEvents(fieldLayer);
			stage.add(fieldLayer);
			// TODO: remove check after kinetic update???
			if (fieldLayer.getParent().getChildren().length > 1) {
				fieldLayer.moveToBottom();
			}
			// TODO: fixed in kinetic 4.0 but layer hide and draw doesn't work yet
			$("#canvas .kineticjs-content").prepend($(fieldLayer.getCanvas().element).detach());
			
			var dragLayer = stage.get(".dragLayer")[0];
			
			if (dragLayer) {
				dragLayer.clear();
				stage.remove(dragLayer);
				$(dragLayer.getCanvas().element).remove();
				
				$("#canvas").off("mousewheel");
			}
			
			var bb = stage.get(".blankBackground")[0];
			dragLayer = createDragLayer(bb.getWidth(), bb.getHeight(), currX, currY)
			stage.add(dragLayer);
			
			this.addDragEvents(dragLayer, bb);
		},
		
		addFieldEvents: function(fieldLayer) {
			var view = this;
			
			fieldLayer.on('dragmove', function(e) {
				//var tempLayer = fieldLayer;
				$.each(stage.getChildren(), function(index, value) {
					if (value.getName() !== "fieldLayer" && value.getName() !== "dragLayer") {
						value.setPosition(fieldLayer.getPosition());
						value.draw();
					} else if (value.getName() === "dragLayer") {
						var bb = stage.get(".blankBackground")[0];
						var dragBar = value.get(".dragBar")[0];
						var dragPanel = value.get(".dragPanel")[0];
						
						if (dragBar && dragPanel) {
							var dY = fieldLayer.getY() / (bb.getHeight() - CANVAS_HEIGHT);
							var scaledY = -dY * (dragPanel.getHeight() - dragBar.getHeight());
							
							dragBar.setY(scaledY);
							value.draw();
						}
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
			
			fieldLayer.on('mouseover', function(e) {
				stage.get(".dragLayer")[0].show();
				stage.get(".dragLayer")[0].draw();
			});
			
			fieldLayer.on('mouseout', function(e) {
				// Still in canvas
				if ((!e.relatedTarget && e.currentTarget) || $(e.relatedTarget).parent("#canvas").length) return;

				if (stage.get(".dragLayer")[0]) {
					stage.get(".dragLayer")[0].hide();
					stage.get(".dragLayer")[0].draw();
				}
			});
		},
		
		addDragEvents: function(dragLayer, bb) {
			var dragBar = dragLayer.get(".dragBar")[0],
				dragPanel = dragLayer.get(".dragPanel")[0];
			
			if (dragBar && dragPanel) {
				dragBar.on("mouseover", function() {
					this.setFill("rgb(59, 191, 206)");
					//this.setStrokeWidth(1);
					//this.setStroke("#2faab8");
					this.setAlpha(0.25);
					this.getLayer().draw();
				
					document.body.style.cursor = "pointer";
				});
				
				dragBar.on("mouseout", function() {
					this.setFill("#000");
					//this.setStrokeWidth(0);
					this.setAlpha(0.25);
					this.getLayer().draw();
				
					document.body.style.cursor = "default";
				});
				
				dragBar.on("mousedown dragstart", function() {
					this.setFill("rgb(59, 191, 206)");
					this.setAlpha(0.75);
					this.getLayer().draw();
					
					document.body.style.cursor = "pointer";
				});
				
				dragBar.on("mouseup dragend", function(e) {
					if (this.intersects({x: e.layerX, y: e.layerY})) {
						this.setFill("rgb(59, 191, 206)");
					} else {
						this.setFill("#000");
						//this.setStrokeWidth(0);
					}
					this.setAlpha(0.25);
					this.getLayer().draw();
					
					document.body.style.cursor = "pointer";
				});
				
				dragBar.on("dragmove dragend", function(e) {
					//this.getY() === 0, setY === 0
					// get change of Y over entire bar scale to change for entire canvas
					var dragPanel = stage.get(".dragPanel")[0];
					var dY = this.getY() / (dragPanel.getHeight() - dragBar.getHeight());
					var scaledY = -dY * (bb.getHeight() - CANVAS_HEIGHT);
					
					$.each(stage.getChildren(), function(index, value) {
						if (value.getName() !== "dragLayer") {
							value.setY(scaledY);
							value.draw();
						}
					});
				});
				
				$("#canvas").on("mousewheel", function(e, delta, deltaX, deltaY) {
					// assume deltaY in terms of the scrollbar
					var dragBounds = dragBar.getDragBounds();
					
					// allow default scroll if at edge, should only prevent when actually scrolling
					if ((dragBar.getY() === dragBounds.top && deltaY > 0) || 
						(dragBar.getY() === dragBounds.bottom && deltaY < 0))
						return;
					e.preventDefault();
					
					// Speed up scroll
					var dY = 5 * deltaY;
					var newY = dragBar.getY() - dY;
					// check boundaries
					if (newY < dragBounds.top) newY = dragBounds.top;
					else if (newY > dragBounds.bottom) newY = dragBounds.bottom;
					
					// scaledY for change in Y for canvas
					var scaledY = -newY * (bb.getHeight() - CANVAS_HEIGHT) / (dragPanel.getHeight() - dragBar.getHeight());
					
					$.each(stage.getChildren(), function(index, value) {
						if (value.getName() !== "dragLayer") {
							value.setY(scaledY);
							value.draw();
						} else if (value.getName() === "dragLayer") {
							dragBar.setY(newY);
							value.draw();
						}
					});
				});
			}
			
			$("#canvas").off("mouseleave");
			// To catch the edge cases
			$("#canvas").on("mouseleave", function(e) {
				if (dragBar && dragPanel) {
					stage.get(".dragLayer")[0].hide();
					stage.get(".dragLayer")[0].draw();
				}
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
			$(e.target).closest(".field-prop").find("ul").removeClass("fading");
			$(e.target).closest(".field-prop").find("ul").css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideFieldPropOptions: function(e) {
			if ($(e.relatedTarget).closest(".field-prop").attr("id") == $(e.target).closest(".field-prop").attr("id")) return;
			
			$(e.target).closest(".field-prop").find("ul").addClass("fading");
			$(e.target).closest(".field-prop").find("ul").css({height: 0, opacity: 0, visibility: "hidden"});
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
		el: $("#plays-container"),
	
		tagName: "div",
		className: "play-collection-view",
	
		template: $("#play-collection-template").html(),
		listTemplate: $("#play-list-template").html(),
		
		events: {
			"click .all-plays"	: "showAllPlays",
			"click .recent-plays"	: "showRecentPlays",
			"click .my-plays"	: "showMyPlays",
		
			"click .prev"	: "previousPage",
			"click .next" 	: "nextPage",
		},
		
		initialize: function() {
			 _.bindAll(this, 'fetch', 'showAllPlays', 'showRecentPlays', 'showMyPlays', 'pagination', 'previousPage', 'nextPage');
			this.collection.on('refresh', this.render, this);
			this.collection.on('filter', this.filter, this);
			
			if ($.playbook.user) {
				this.showMyPlays();
			} else {		
				this.showAllPlays();
			}
		},
		
		render: function() {
			var view = this;
			
			this.$el.html(Mustache.render(this.template, $.extend({}, this.collection.toJSON(), this.info, {user: $.playbook.user ? $.playbook.user.get("_id") : null})));
			
			$("." + this.tab).addClass("selected");
			
			if (this.collection.length === 0) {
				$("#play-list").append("<li class='empty'>No Plays Found...</li>");
			}
			
			this.collection.each(function(play) {
				var html = Mustache.render(view.listTemplate, play.toJSON()),
					htmlObj = $(html);
				htmlObj.find(".link").on("click", function(e) {
					$.playbook.app.navigate("play/" + play.get("_id"), {trigger: true});
				});
				$("#play-list").append(htmlObj);
			});
		},
		
		fetch: function() {
			this.collection.fetch({
				data: _.extend({}, this.data, this.filterOptions),
				success: function(collection, response) {
					collection.trigger('refresh');
				}
			});
		},
		
		showAllPlays: function() {
			if ($("#play-list-tabs").find(".selected").hasClass("all-plays")) return;
			$("#play-list-tabs").find(".selected").removeClass("selected");
			$("#play-list-tabs").find(".all-plays").addClass("selected");
			this.tab = "all-plays";
			
			this.data = {};
			this.filter(this.filterOptions); // keep same filter in effect
		},
		
		showRecentPlays: function() {
			if ($("#play-list-tabs").find(".selected").hasClass("recent-plays")) return;
			$("#play-list-tabs").find(".selected").removeClass("selected");
			$("#play-list-tabs").find(".recent-plays").addClass("selected");
			this.tab = "recent-plays";
			
			if (localStorage) {
				this.data = {_id: {$in: JSON.parse(localStorage.getItem("recentPlays"))}};
			}
			this.filter(this.filterOptions);
		},
		
		showMyPlays: function() {
			if ($("#play-list-tabs").find(".selected").hasClass("my-plays")) return;
			$("#play-list-tabs").find(".selected").removeClass("selected");
			$("#play-list-tabs").find(".my-plays").addClass("selected");
			this.tab = "my-plays";
			
			this.data = {owner: $.playbook.user.get("_id")};
			this.filter(this.filterOptions);
		},
		
		filter: function(options) {
			this.filterOptions = _.extend({}, options);
			
			var io = this.collection.socket;
			io.emit("plays:info", _.extend({}, this.data, this.filterOptions), this.pagination);
		},
		
		pagination: function(err, data) {
			this.info = data;
			this.info.page = 1;
			
			this.info.prev = this.info.page > 1;
			this.info.next = this.info.page < this.info.pages;
			
			this.fetch();
		},
		
		previousPage: function(jump) {
			if (this.info.prev) {
			  // load previous page
			  this.info.page = this.info.page - 1;
			  
			  this.info.next = true;
			  this.info.prev = this.info.page > 1;
			  
			  // Calibrate data options
			  this.data._id = {$gt: this.collection.first().get("_id")};
			  this.data.jump = this.info.page - 1;
			  this.fetch();
			}
		},
		
		nextPage: function(jump) {
			if (this.info.next) {
				// load next page
				this.info.page = this.info.page + 1;
				
				this.info.prev = true;
				this.info.next = this.info.page < this.info.pages;
				
				// Calibrate data options
				this.data._id = {$lt: this.collection.last().get("_id")};
				this.data.jump = 0; // can configure for multiple page jumps later
				this.fetch();
			}
		},
	});
	
	$.playbook.PlaysFilterView = Backbone.View.extend({
		el: $("#plays-panel"),
	
		tagName: "div",
		className: "plays-filter-view",
	
		template: $("#plays-filter-template").html(),
		
		events: {
			"mouseover .filter"	: "showFilterOptions",
			"mouseout .filter"	: "hideFilterOptions",
			"mouseover .option"	: "fadeFilter",
			"mouseout .option"	: "unfadeFilter",
			"click .option"		: "applyFilter",
		},
		
		initialize: function() {
// 			 _.bindAll(this, 'fetch', 'setPageInfo', 'previousPage', 'nextPage');
			this.collection.on('init', this.render, this);
			
			// Default options
			this.options = {
				fieldType: "",
			}
			
			this.collection.trigger('init');
		},
		
		render: function() {
			var html = Mustache.render(this.template, $.extend({}, this.collection.toJSON(), this.options)),
				htmlObj = $(html);
			
			// Display correct words
			if (htmlObj.find(".selected span").html() === "") {
				htmlObj.find(".selected span").html("all sports");	
			}
			
			this.$el.html(htmlObj);
			
			return this;
		},
		
		showFilterOptions: function(e) {
			var filter = $(e.target).closest(".filter");
		
			filter.find("ul").removeClass("fading");
			filter.find("ul").css({left: -1, top: filter.height()}).css({height: "auto", opacity: 1, visibility: "visible"});
		},
		
		hideFilterOptions: function(e) {
			if ($(e.relatedTarget).closest(".filter").data("type") == $(e.target).closest(".filter").data("type")) return;
			
			$(e.target).closest(".filter").find("ul").addClass("fading");
			$(e.target).closest(".filter").find("ul").css({height: 0, opacity: 0, visibility: "hidden"});
		},
		
		fadeFilter: function(e) {
			$(e.target).closest(".filter").addClass("filter-faded");
		},
		
		unfadeFilter: function(e) {
			$(e.target).closest(".filter").removeClass("filter-faded");
		},
		
		applyFilter: function(e) {
			var filter = $(e.target).closest(".filter");
			var option = $(e.target).closest(".option");
			
			if (filter.data("value") !== option.data("value")) {
				filter.data("value", option.data("value"));
				if (option.data("value")) {
					this.options[filter.data("type")] = option.data("value");
				} else {
					delete this.options[filter.data("type")];
				}
				
				this.collection.trigger("init");
				
				// fetch
				this.collection.trigger("filter", this.options);
			}
		},
	});
	
	$.playbook.NewPlay = function() {
		var play;
		
		return {
			newPlay: function() {
				play = new $.playbook.Play({owner: $.playbook.user ? $.playbook.user.get("_id") : null});
			},
			
			play: function() {
				return play;
			}
		}
	}(); // execute function when NewPlay initialized
	
	$.playbook.Router = Backbone.Router.extend({
		routes: {
			""				: "home",
			"plays"			: "showPlays",
			"play/:_id"		: "showPlay",
			"user/:_id"		: "showUser",
			"team/:_id"		: "showTeam",
			"error/:status"	: "error",
		},
		
		home: function() {
			clearDivs();
			
			$("#playbook").attr("class", "home");
		},
		
		showPlays: function() {
			clearDivs();
			
			$("#playbook").attr("class", "plays");
			
			var plays = new $.playbook.PlayCollection();
			
			var playsView = new $.playbook.PlayCollectionView({collection: plays});
			var playsFilterView = new $.playbook.PlaysFilterView({collection: plays});
		},
		
		showPlay: function(_id) {
			// clear previous divs
			clearDivs();
			
			$("#playbook").attr("class", "play");
			
			if (localStorage) {
				var recentPlays = JSON.parse(localStorage.getItem("recentPlays")) || [];
				
				if (recentPlays) {
					recentPlays = $.grep(recentPlays, function(value, index) {
						return value != _id;
					});
					
					recentPlays.unshift(_id);
					// limit recent plays to 8
					if (recentPlays.length > 8) {
						recentPlays.pop();
					}
					
					localStorage.setItem("recentPlays", JSON.stringify(recentPlays));
				}
			}
		
			var play = new $.playbook.Play({_id: _id});
			
			var playView = new $.playbook.PlayView({model: play});
			
			var playContentsView = new $.playbook.PlayContentsView({model: play});
		},
		
		showUser: function(_id) {
			clearDivs();
			
			$("#playbook").attr("class", "user");
			
			if (_id === ($.playbook.user ? $.playbook.user.get("_id") : null)) {
				var profileView = new $.playbook.ProfileView({model: $.playbook.user});
			} else {
				$.playbook.app.navigate("error/401", {trigger: true});
			}
			
// 			var plays = new $.playbook.PlayCollection();
			
// 			var playsView = new $.playbook.PlayCollectionView({collection: plays});
// 			var playsFilterView = new $.playbook.PlaysFilterView({collection: plays});
		},
		
		showTeam: function(_id) {
			clearDivs();
			
			$("#playbook").attr("class", "team");
			
			var team = new $.playbook.Team({_id: _id});
			var teamView = new $.playbook.TeamView({model: team});
			var teamMembersView = new $.playbook.TeamMembersView({_id: _id});
		},
		
		error: function(status) {
			clearDivs();
			
			$("#playbook").attr("class", "error");
			
			var template = $("#" + status + "-error").html();
			$("#error-container").html(template);
		},
	});
	
	$.playbook.app = null;
	
	$.playbook.bootstrap = function() {
		// initialize login / user details
		var userView = new $.playbook.UserView();
	
		$.playbook.app = new $.playbook.Router();
		Backbone.history.start({pushState: true});
		
		$("#header h1, #icon").on("click", function() {
			$.playbook.app.navigate("/", {trigger: true});
		});
		
		$("#new-play").on("click", function() {
			$.playbook.NewPlay.newPlay();
			
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
			$.playbook.NewPlay.play().set("fieldType", $(e.target).closest(".choice").data("value"));
			
			$("#new-play-field-type").fadeOut(350, "swing");
			$("#new-play-field-size").fadeIn(350, "swing");
		});
		
		$("#new-play-field-size").find(".choice").on("click", function(e) {
			$.playbook.NewPlay.play().set("fieldSize", $(e.target).closest(".choice").data("value"));
			
			$("#new-play-field-size").fadeOut(350, "swing");
			$("#new-play-options").fadeIn(350, "swing");
		});
		
		$("#new-play-options").find(".choice").on("click", function(e) {
			if ($(e.target).closest(".choice").data("value") === "blank") {
				$("#new-play-options").fadeOut(350, "swing");
				
				$.playbook.NewPlay.play().save({}, {
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
				
				// Adjust for the scrollbar
// 				var scrollbarWidth = getScrollbarWidth();
// 				$("#new-play-templates").find(".choice").css("width", );
				
				$("#new-play-templates").fadeIn(350, "swing");
				$("#new-play-templates").find("." + $.playbook.NewPlay.play().get("fieldType") + "-formations").fadeIn(350, "swing");
				
			}
		});
		
		$("#new-play-templates").find(".choice").on("click", function(e) {
			// Create play with that formation
			var formationType = $(e.target).closest(".choice").data("value");
			var fieldType = $.playbook.NewPlay.play().get("fieldType");
			
			var formationData = formation(fieldType, formationType);
			
			for (var index in formationData) {
				var data = formationData[index];
				data.color = data.team ? data.team === "team0" ? $.playbook.NewPlay.play().get("teamColors")[0] : $.playbook.NewPlay.play().get("teamColors")[1] : data.type === "ball" ? "white" : "orange";
				data.shape = data.team ? data.team === "team0" ? $.playbook.NewPlay.play().get("teamShapes")[0] : $.playbook.NewPlay.play().get("teamShapes")[1] : data.type === "ball" ? "circle" : "triangle";
			}
			
			$.playbook.NewPlay.play().set("formation", formationData);
			$.playbook.NewPlay.play().set("offset", fieldOffset(fieldType));
			$("#new-play-templates").fadeOut(350, "swing");
			$.playbook.NewPlay.play().save({}, {
				silent: true,
				wait: true,
				success: function(model, response) {
					uncoverScreen();
					$.playbook.app.navigate("play/" + model.get("_id"), {trigger: true});
				}
			});
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
		
		$(window).keypress(keyboardShortcut);
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

// TODO: only active inside play menu
function keyboardShortcut(e) {
	if (e.target.tagName === "BODY") {
		if (e.keyCode === 37 || e.keyCode === 38) { // ←↑
			e.preventDefault();
			$(".prev-set").click();
		} else if (e.keyCode === 39 || e.keyCode === 40) { // →↓
			e.preventDefault();
			$(".next-set").click();
		} else if (e.charCode === 32) { // <space>
			e.preventDefault();
			$(".animate").click();
		} else if (e.charCode === 43) { // +
			e.preventDefault();
			$(".add-set").click();
		} else if (e.charCode === 45) { // -
			e.preventDefault();
			$(".remove-set").click();
		} else if (e.charCode === 49) { // 1
			e.preventDefault();
			$("#team0").find(".add-player").click();
		} else if (e.charCode === 50) { // 2
			e.preventDefault();
			$("#team1").find(".add-player").click();
		} else if (e.charCode === 66 || e.charCode == 98) { // b
			e.preventDefault();
			$(".add-ball").click();
		} else if (e.charCode === 67 || e.charCode == 99) { // c
			e.preventDefault();
			$(".add-cone").click();
		} else if (e.charCode === 78 || e.charCode == 110) { // n
			e.preventDefault();
			$(".add-ann").click();
		} else if (e.charCode === 73 || e.charCode == 105) { // i
			e.preventDefault();
			$(".instructions").click();
		} else if (e.charCode === 63) { // ?
			e.preventDefault();
			$(".keyboard-shortcuts").click();
		} else {
			console.log(e.keyCode);
			console.log(e.charCode);
		}
	}
}

function clearDivs() {
	$("#plays-container").html("");
	
	$("#play").html("");
	$("#play-contents").html("");
	$("#set").html("");
	$("#article").html("");
	
	$("#error-container").html("");
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

/**
 * Gets the width of the OS scrollbar
 */
function getScrollbarWidth() {
	var scrollbarWidth = 0;
	if ( !scrollbarWidth ) {
		if ( $.browser.msie ) {
			var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
					.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
				$textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
					.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
			scrollbarWidth = $textarea1.width() - $textarea2.width();
			$textarea1.add($textarea2).remove();
		} else {
			var $div = $('<div />')
				.css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
				.prependTo('body').append('<div />').find('div')
					.css({ width: '100%', height: 200 });
			scrollbarWidth = 100 - $div.width();
			$div.parent().remove();
		}
	}
	return scrollbarWidth;
}