
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.string('user_key');
    })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropColumn('user_key');
    })
  ])
};
