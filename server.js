//required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

//allows us to set the environment we are working in, or to 'development' by default
const environment = process.env.NODE_ENV || 'development';
//tells the server it which database file name to connect to?
const configuration = require('./knexfile')[environment];
//the database
const database = require('knex')(configuration);

//automatically pasres information for the database
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//allows the server to
app.use(express.static(path.join(__dirname, 'public')));

//allows to set a url (or localhost 3000 by default) for the server to listen to
app.set('port', process.env.PORT || 3000);
//sets the app title
app.locals.title = 'Palette Picker';

//--END POINTS--//

//retrieves all projects in database to display on the DOM
app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then(projects => {
    response.status(200).json(projects);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
});


//retrieves all the palettes from database to display on the DOM
app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
  .then(palettes => {
    response.status(200).json(palettes);
  })
  .catch(error => response.status(500).json({ error }));
})


//retrieves the project id to find corresponding palettes
app.get('/api/v1/projects/:name', (request, response) => {
  database('projects').where('name', request.params.name).select()
  .then(project => {
    if(project.length) {
      response.status(200).json(project[0])
    }
    else{
      response.status(404).json({
          error: `Could not find a project with the ID of ${request.params.id}`
        });
    }
  })
});

// post methods

//saves a project to the database
app.post('/api/v1/projects', (request, response) => {
  const name = request.body;
  // console.log('WTHAT THE WHT:', name);

  if (!name) {
    return response.status(422).send({ error: `Expected format: { name: <String> }. You're missing the name property.` });
  }

  database('projects').insert(name, '*')
    .then(project => {
      response.status(201).json(project)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//saves a palette to the database
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'hex1', 'hex2', 'hex3', 'hex4', 'hex5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: {
          name: <String>,
          hex1: <String>,
          hex2: <String>,
          hex3: <String>,
          hex4: <String>,
          hex5: <String>,
          project_id: <Integer>,
        }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, '*')
    .then(palette => {
      response.status(201).json(palette)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete methods
app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;
  console.log('id: ', id);

  database('palettes').where({ id }).del()
  .then(palette => {
    if (palette) {
      response.sendStatus(204)
    } else {
      response.status(422).json({ error: 'Not Found' })
    }
  })
  .catch(error => {
    response.status(500).json({ error })
  })
});

//listens for the connection with the the port and sends a message in the terminal
// this let's you know the app title and which port it is running on
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
