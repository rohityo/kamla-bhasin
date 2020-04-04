
exports.up = async (knex, Promise) => {
    await knex.schema.createTable('ng-joined-users', (table) => {
      table.increments('id').notNullable();
      table.string('name').notNullable();
      table.string('mobile').notNullable();
      table.datetime('createdAt').notNullable();
    });
  };
  
  exports.down = async (knex, Promise) => {
    const dropTable = await knex.schema.dropTable('ng-joined-users');
      return dropTable;
  };
  