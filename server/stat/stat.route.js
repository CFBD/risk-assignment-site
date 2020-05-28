const statControl = require('./stat.controller');

module.exports = (app) => {
    const controller = statControl();

    app.route('/api/leaderboard').get(controller.getTerritoryCounts);
};
