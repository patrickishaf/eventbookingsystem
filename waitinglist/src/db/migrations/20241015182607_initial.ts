import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('waiting_list_members', function(table) {
    table.increments('id').primary();
    table.string('user_email').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.integer('event_id').unsigned();
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('waiting_list_members');
}

