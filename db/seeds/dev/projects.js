//seeds delete the data in a database

exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then( () => knex('projects').del() )
    .then( () => {
      return Promise.all([
        knex('projects').insert({
          project_name: 'JohnSnow'
        }, 'id')
        .then( project => {
          return knex('palettes').insert([
            {
              name: 'lighters',
              hex1: '#C0390F',
              hex2: '#B4F806',
              hex3: '#F58CC7',
              hex4: '#040D16',
              hex5: '#EF634B',
              project_id: project[0]
            }
          ])
        })
        .then( () => console.log('Seeding complete!'))
        .catch( error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch( error => console.log(`Error seeding data: ${error}`))
};
