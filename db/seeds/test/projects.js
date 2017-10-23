const projectsData = [{
  id: 1,
  name: 'Project 1'
},
{
  id: 2,
  name: 'Project 2'
}];

const paletteData = [
  { id: 1,
    name: 'Palette 1',
    hex1: '#3F856C',
    hex2: '#065A83',
    hex3: '#94AD42',
    hex4: '#BBB345',
    hex5: '#6303D0',
    project_id: '1' },
  { id: 2,
    name: 'Palette 2',
    hex1: '#4A914E',
    hex2: '#E1930C',
    hex3: '#C54E51',
    hex4: '#2DAC4A',
    hex5: '#898117',
    project_id: '1' },
  { id: 3,
    name: 'This other Palette',
    hex1: '#68608F',
    hex2: '#49C262',
    hex3: '#AB50E5',
    hex4: '#BBB345',
    hex5: '#6303D0',
    project_id: '2'},
  { id: 4,
    name: 'The best palette ever',
    hex1: '#3F856C',
    hex2: '#065A83',
    hex3: '#94AD42',
    hex4: '#BBB345',
    hex5: '#6303D0',
    project_id: '2'}
];



const createProject = (knex, project) => {
  return knex('projects').insert({
    id: project.id,
    name: project.name
  }, 'id')
  .then(projectId => {
    let palettePromises = [];

    pale.forEach(palette => {
      palettePromises.push(
        createPalette(knex, {
          id: palette.id,
          name: palette.name,
          hex1: palette.hex1,
          hex2: palette.hex2,
          hex3: palette.hex3,
          hex4: palette.hex4,
          hex5: palette.hex5,
          project_id: palette.project_id
        })
      )
    });

    return Promise.all(palettePromises);
  })
};

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette);
};

exports.seed = (knex, Promise) => {
  // delete palettes first
  return knex('palettes').del()
  // delete projects second
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];

      projectsData.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });

      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
