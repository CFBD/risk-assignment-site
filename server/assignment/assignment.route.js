const assignmentControl = require('./assignment.controller');

module.exports = async (app, auth, db, io) => {
    const controller = await assignmentControl(db, io);

    app.route('/api/assignments').get(auth, controller.getAssignments);
    app.route('/api/assignment').post(auth, controller.addAssignment);
    app.route('/api/assignment/update').post(auth, controller.updateAssignment);
    app.route('/api/turns/current').get(controller.getCurrentTurn);
    app.route('/api/teams').get(auth, controller.getTeams);
    app.route('/api/tallies').get(auth, controller.getTallies);
    app.route('/api/moves').get(auth, controller.getPossibleMoves);
    app.route('/api/player/assignment')
        .post(auth, controller.getOrCreateUserAssignment)
        .get(auth, controller.getCurrentUserAssignment);
    app.route('/api/reminders').post(auth, controller.updateReminders).get(auth, controller.getReminderList);
};
