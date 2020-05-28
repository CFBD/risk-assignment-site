module.exports = (passport, crypto, db) => ({
    auth: passport.authenticate('jwt', {
        session: false,
        successRedirect: '/',
        failureRedirect: '/'
    }),
    authReddit: (req, res, next) => {
        req.logout();
        passport.authenticate('reddit', {
            state: crypto.randomBytes(32).toString('hex'),
            session: false,
            duration: 'permanent'
        })(req, res, next);
    },
    authRedditCallback: passport.authenticate('reddit', {
        session: false,
        failureRedirect: '/'
    }),
    addTokenToCookie: (req, res) => {
        res.cookie('jwt', req.account ? req.account : req.user, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            domain: process.env.JWT_DOMAIN,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.redirect('/auth');
    },
    userInfo: async (req, res) => {
        if (req.isAuthenticated() && req.user) {
            const roles = await db.any(`
                SELECT r.name
                FROM role as r
                    INNER JOIN player_role as pr on r.id = pr.role_id AND pr.player_id = $1
            `, [req.user.id]);

            res.send({
                id: req.user.id,
                name: req.user.name,
                discordName: req.user.discordName,
                roles: roles.map((r) => r.name)
            });
        } else {
            res.sendStatus(404);
        }
    }
});
