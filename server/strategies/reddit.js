const RedditStrategy = require('passport-reddit').Strategy;
const jwt = require('jsonwebtoken');

module.exports = (passport, db) => {
    const appId = process.env.REDDIT_ID;
    const appSecret = process.env.REDDIT_SECRET;
    const webHost = process.env.WEB_HOST;

    passport.use(new RedditStrategy({
        clientID: appId,
        clientSecret: appSecret,
        callbackURL: `http://${webHost}/auth/reddit/callback`,
        passReqToCallback: true
    }, (req, accessToken, refreshToken, profile, done) => {
        process.nextTick(async () => {
            try {
                let user = null;

                if (!req.user) {
                    const result = await db.oneOrNone(
                        'SELECT * FROM player WHERE name = $1', [
                            profile.name
                        ]
                    );

                    if (!result) {
                        const id = await db.one(
                            'INSERT INTO player (name) VALUES ($1) RETURNING id',
                            [profile.name]
                        );

                        // make first registered player an admin
                        if (id && id.id === 1) {
                            await db.none('INSERT INTO player_role (player_id, role_id) VALUES (1,3)');
                        }

                        user = {
                            id: id.id,
                            name: profile.name
                        };
                    } else {
                        user = {
                            id: result.id,
                            name: result.name,
                            discordId: result.discord_id,
                            discordName: result.discord_username
                        };
                    }
                } else {
                    user = {
                        id: req.user.id,
                        name: req.user.name,
                        discordId: req.user.discordId,
                        discordName: req.user.discordName
                    };
                }

                const roles = await db.any(
                    `
                        SELECT r.name
                        FROM role r
                            INNER JOIN player_role pr ON r.id = pr.role_id
                        WHERE pr.player_id = $1
                    `,
                    [user.id]
                );

                if (user.id === 1 && !roles.map(r => r.name).includes("mod")) {
                    roles.push({ name: 'mod' });
                    await db.none('INSERT INTO player_role (player_id, role_id) VALUES (1, 3)');
                }

                user.roles = roles.map((r) => r.name);

                const token = jwt.sign(user, process.env.JWT_SECRET, {
                    subject: user.name,
                });

                return done(null, token);
            } catch (err) {
                return done(err, null);
            }
        });
    }));
};
