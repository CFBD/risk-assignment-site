const turnControl = require('./turn.controller');

module.exports = (app) => {
    const controller = turnControl();

    app.route('/api/turns').get(controller.getTurns);
};
