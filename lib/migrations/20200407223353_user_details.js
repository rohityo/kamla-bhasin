exports.up = async (knex, Promise) => {
    await knex.schema.createTable('k_details', (table) => {
        table.increments('id').notNullable();
        table.string('name').notNullable();
        table.string('parents_name').notNullable();
        table.string('address').notNullable();
        table.string('city').notNullable();
        table.string('state').notNullable();
        table.string('pin_code').notNullable();
        table.datetime('createdAt').notNullable();
        table.string('email').notNullable();
      });
};

exports.down = async (knex, Promise) => {
    // const dropTable = await knex.schema.dropTable('k_details');
    //   return dropTable;
};