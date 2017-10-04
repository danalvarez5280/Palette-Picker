
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('colors');
      table.string('hex1');
      table.string('hex2');
      table.string('hex3');
      table.string('hex4');
      table.string('hex5');
      table.integer('project_id').unsigned()
      table.foreign('project_id').references('projects.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = (knex, Promise) => {
  return Promise.all[
    knex.schema.dropTable('paletts'),
    knex.schema.dropTable('projects')
  ]
};
