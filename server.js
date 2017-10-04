const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Shut up baby I know it!');
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    response.status(200).json(projects);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
});

app.post('/api/v1/projects', (request, response) => {
  const name = request.body;

  for (let requiredParameter of ['name']) {
    if (!name[requiredParameter]) {
      return response.status(422).send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(name, 'id')
    .then(project => {
      response.status(201).json(project)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
