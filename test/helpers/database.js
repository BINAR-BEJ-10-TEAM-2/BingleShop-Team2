const {sequelize} = require('../../src/models');

module.exports = {
    cleanup: async () => {
        await sequelize.sync({force: true});
    }
}