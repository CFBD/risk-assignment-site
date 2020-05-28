const crypto = require('crypto');
const userController = require('./user.controller');

module.exports = (app, auth, passport, db) => {
    const controller = userController(passport, crypto, db);

    app.route('/auth').get(controller.auth);
    app.route('/auth/reddit').get(controller.authReddit);
    app.route('/auth/reddit/callback').get(controller.authRedditCallback, controller.addTokenToCookie);
    app.route('/api/me').get(auth, controller.userInfo);
};
