import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('events', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.integer('total_tickets').unsigned().notNullable().defaultTo(0);
    table.integer('remaining_tickets').unsigned().notNullable().defaultTo(0);
    table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('events');
}

