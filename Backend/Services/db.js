const knex = require('knex');

const db = knex({
    client: 'mysql2',
    connection: {
        host: 'web0164.zxcs.be',
        user: 'adb_neal',
        password: '9MEUswqjJ2YNHuLMtmgz',
        database: 'adb_project_neal',
    }
});

module.exports = db;
