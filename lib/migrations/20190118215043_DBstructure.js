
exports.up = async (knex, Promise) => {
    await knex.schema.createTable('users', (table) => {
      table.increments('id').notNullable();
      table.string('email').notNullable();
      table.string('name').notNullable();
      table.string('profilepicture').notNullable();
      table.string('googleuserid').notNullable();
      table.string('center').notNullable();
      table.string('githublink').notNullable();
      table.string('linkedinlink').notNullable();
      table.string('mediumlink').notNullable();
      table.datetime('createdAt').notNullable();
    });
  };
  
  exports.down = async (knex, Promise) => {
    // const dropTable = await knex.schema.dropTable('users');
    //   return dropTable;
  };
