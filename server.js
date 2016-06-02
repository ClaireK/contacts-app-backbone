var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

var id = 7;
var data = {
	1: { id: 1, firstName: 'Walter', lastName: 'White', email: 'walter.white@test.com' },
	2: { id: 2, firstName: 'Jesse', lastName: 'Pinkman', email: 'jesse.pinkman@test.com' },
	3: { id: 3, firstName: 'Hank', lastName: 'Schrader', email: 'hank.schrader@test.com' },
	4: { id: 4, firstName: 'Saul', lastName: 'Goodman', email: 'saul.goodman@test.com' },
	5: { id: 5, firstName: 'Gus', lastName: '', email: 'gus@test.com' },
	6: { id: 6, firstName: 'Skyler', lastName: 'White', email: 'skyler.white@test.com' },
	7: { id: 7, firstName: 'Marie', lastName: 'Schrader', email: 'marie.schrader@test.com' }
};

app.use(bodyParser.json());
app.use(express.static('./public'));

app.route('/api/contacts')
	.get(function (req, res) {
		res.json(Object.keys(data).map(function (key) {
			return data[key];
		}));
	})
	.post(function (req, res) {
		var record = req.body;
		record.id = ++id;
		data[record.id] = record;
		res.json(record);
	});

app.route('/api/contacts/:id')
	.get(function (req, res) {
		res.json(data[req.params.id]);
	})
	.put(function(req, res) {
		data[req.params.id] = req.body;
		res.json(req.body);
	})
	.delete(function(req, res) {
		delete data[req.params.id];
		res.json(null);
	});

app.get('*', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);