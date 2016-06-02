var Contact = Backbone.Model.extend({});

var Contacts = Backbone.Collection.extend({
	model: Contact,
	url: '/api/contacts'
});

// ActionsView
// ContactsListView
// ContactsItemView

var ContactsListView = Backbone.View.extend({
	tagName: 'ul',
	render: function () {
		console.log(this.collection);
		this.collection.forEach(function (model) {
			this.$el.append( (new ContactsItemView({ model: model })).render().el );
		}, this);
		return this;
	}
});

var ContactsItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click a': 'handleClick'
	},
	template: _.template( $('#ContactsItemViewTemplate').html() ),
	render: function () {
		console.log(this.model);
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	},
	handleClick: function (evt) {
		evt.preventDefault();
		Backbone.history.navigate('contacts/' + this.model.get('id'), { trigger: true });
	}
});

var ActionsView = Backbone.View.extend({
	className: 'actions',
	events: {
		'click a': 'handleClick'
	},
	template: '<a href="/contacts/new"> Add New Contact </a>',
	render: function () {
		this.el.innerHTML = this.template;
		return this;
	},
	handleClick: function (evt) {
		evt.preventDefault();
		Backbone.history.navigate('contacts/new', { trigger: true });
	}
});

var ContactView = Backbone.View.extend({
	template: _.template( $('#ContactViewTemplate').html() ),
	initialize: function () {
		this.listenTo(this.model, 'change:firstName change:lastName', this.updateName);
	},
	events: {
		'click .update': 'update',
		'click .delete': 'delete',
		'click .back': 'back'
	},
	render: function () {
		this.el.innerHTML = this.template(this.model.toJSON());
		return this;
	},
	updateName: function () {
		this.$('h2').text( this.model.get('firstName') + ' ' + this.model.get('lastName') );
	},
	update: function () {
		this.model.save({
			firstName: this.$('#firstName').val(),
			lastName: this.$('#lastName').val(),
			email: this.$('#email').val()
		});
	},
	delete: function () {
		this.model.destroy();
		Backbone.history.navigate('', { trigger: true })
	},
	back: function () {
		Backbone.history.navigate('', { trigger: true });
	}
});

var NewContactView = Backbone.View.extend({
	template:$('#NewContactViewTemplate').html(),
	events: {
		'click .add': 'add',
		'click .back': 'back'
	},
	render: function() {
		this.el.innerHTML = this.template;
		return this;
	},
	add: function () {
		this.collection.create({
			firstName: this.$('#firstName').val(),
			lastName: this.$('#lastName').val(),
			email: this.$('#email').val()
		}, {
			success: function () {
				Backbone.history.navigate('', { trigger: true });
			}
		});
	},
	back: function () {
		Backbone.history.navigate('', { trigger: true });
	}
});


var Router = Backbone.Router.extend({
	initialize: function (options) {
		this.contacts = options.contacts;
		this.el = $('#app');
	},
	routes: {
		'': 'main',
		'contacts': 'displayList',
		'contacts/new': 'displayForm',
		'contacts/:id': 'displaySingle'
	},

	main: function() {
		Backbone.history.navigate('contacts', { trigger: true});
	},
	displayList: function() {
		this.el.empty()
			.append(new ActionsView().render().el)
			.append(new ContactsListView({ collection: this.contacts }).render().el);
	},
	displayForm: function() {
		this.el.empty()
			.append(new NewContactView({ collection: this.contacts }).render().el);
	},
	displaySingle: function(id) {
		var model = this.contacts.get( parseInt(id, 10));
		this.el.empty().append( new ContactView({ model: model }).render().el );
	}
});

var contacts = new Contacts();

contacts.fetch().then(function () {
	var r = new Router({
		contacts: contacts
	});
	Backbone.history.start({ pushState: true });
});