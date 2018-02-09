
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('markers', function (table) {
            table.text('description');
        })
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.table('markers', function (table) {
            table.dropColumn('description');
        })
    ])
};