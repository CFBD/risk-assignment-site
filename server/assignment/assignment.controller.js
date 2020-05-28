const axios = require('axios');

module.exports = async (db, io) => {
    this.team = process.env.TEAM;

    this.weights = [1,2,6,12,24];

    this.teams = (await axios.get('https://collegefootballrisk.com/api/teams')).data;
    this.territories = (await await axios.get(
        'https://collegefootballrisk.com/api/territories')).data;

    const getCurrentAssignment = async (username, turnId) => db.oneOrNone(`
        SELECT p.name as player, ter.name as territory, COALESCE(p.reminder, false) AS reminder
        FROM player AS p
            LEFT JOIN player_assignment AS pa ON p.id = pa.player_id
            LEFT JOIN assignment AS a ON pa.assignment_id = a.id AND a.turn_id = $2
            LEFT JOIN territory ter ON a.territory_id = ter.id
        WHERE p.name = $1
        ORDER BY ter.name
        LIMIT 1
        `, [username, turnId]);

    const getTerritoryImage = (territory) => {
        const team = this.teams.find((t) => t.name === territory);
        return `https://collegefootballrisk.com${team ? team.logo : ''}`;
    };

    return {
        getAssignments: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes('mod')) {
                const assignments = await db.any(
                    `
                    SELECT 	a.id,
                            t.name as territory,
                            a.weight,
                            a.min_stars,
                            a.max_stars,
                            a.mvp_farm,
                            COUNT(pa.id) as players,
                            COUNT(pa.stars) FILTER(WHERE pa.stars = 1) as ones,
                            COUNT(pa.stars) FILTER(WHERE pa.stars = 2) as twos,
                            COUNT(pa.stars) FILTER(WHERE pa.stars = 3) as threes,
                            COUNT(pa.stars) FILTER(WHERE pa.stars = 4) as fours,
                            COUNT(pa.stars) FILTER(WHERE pa.stars = 5) as fives
                    FROM "assignment" a
                        INNER JOIN territory t on a.territory_id = t.id
                        LEFT JOIN player_assignment pa ON a.id = pa.assignment_id
                    WHERE a.turn_id = $1
                    GROUP BY a.id, t.name, a.weight, a.min_stars, a.max_stars, a.mvp_farm
                `,
                    [req.query.turn]
                );

                res.send(assignments);
            } else {
                res.sendStatus(401);
            }
        },
        addAssignment: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes('mod')) {
                await db.none(
                    `
                                INSERT INTO assignment (turn_id, territory_id, weight, min_stars, max_stars, mvp_farm)
                                VALUES ($1, $2, $3, $4, $5, $6)
                            `,
                    [
                        req.body.turn,
                        req.body.territory,
                        req.body.weight,
                        req.body.minStars,
                        req.body.maxStars,
                        req.body.mvpFarm
                    ]
                );

                io.emit('assignment_created');

                res.sendStatus(201);
            } else {
                res.sendStatus(401);
            }
        },
        updateAssignment: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes('mod')) {
                await db.none(
                    `
                    UPDATE assignment
                    SET weight = $1,
                        min_stars = $2,
                        max_stars = $3,
                        mvp_farm = $5
                    WHERE id = $4
                `,
                    [req.body.weight, req.body.minStars, req.body.maxStars, req.body
                        .id, req.body.mvpFarm
                    ]
                );

                io.emit('assignment_updated');

                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        },
        getTeams: async (req, res) => {
            res.send(this.teams);
        },
        getCurrentTurn: async (req, res) => {
            const result = await axios.get('https://collegefootballrisk.com/api/turns');
            const current = result.data.find((d) => d.active && !d.completed);

            res.send(current);
        },
        getTallies: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes(
                'vetted')) {
                const results = await axios.get(
                    'https://collegefootballrisk.com/api/turns');
                const current = results.data.find((d) => d.active && !d.completed);

                const tallies = await db.one(
                    `
                    SELECT COUNT(pa.id) as players,
                        SUM(CASE WHEN pa.stars = 5 THEN 24 WHEN pa.stars = 4 THEN 12 WHEN pa.stars = 3 THEN 6 ELSE pa.stars END) as stars,
                        COUNT(pa.id) FILTER(WHERE pa.stars = 1) as ones,
                        COUNT(pa.id) FILTER(WHERE pa.stars = 2) as twos,
                        COUNT(pa.id) FILTER(WHERE pa.stars = 3) as threes,
                        COUNT(pa.id) FILTER(WHERE pa.stars = 4) as fours,
                        COUNT(pa.id) FILTER(WHERE pa.stars = 5) as fives
                    FROM assignment a
                        INNER JOIN player_assignment pa ON a.id = pa.assignment_id
                    WHERE a.turn_id = $1
                `,
                    [current.id]
                );

                res.send(tallies);
            } else {
                res.sendStatus(401);
            }
        },
        getPossibleMoves: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes(
                'vetted')) {
                const currentTerritories = (await axios.get(
                    'https://collegefootballrisk.com/api/territories')).data;

                const unbuffered = currentTerritories
                    .filter((t) => t.owner === this.team && t.neighbors.filter((n) => n
                        .owner !== this.team).length)
                    .map((t) => ({
                        territory_id: t.id,
                        territory: t.name,
                        owned: true
                    }));

                let neighbors = currentTerritories
                    .filter((t) => t.owner === this.team)
                    .map((t) => t.neighbors.filter((n) => n.owner !== this.team).map((
                        n) => ({
                            territory_id: n.id,
                            territory: n.name,
                            owned: false
                        })))
                    .flat();

                neighbors = Array.from(new Set(neighbors));

                const moves = [
                    ...unbuffered.map((u) => ({
                        territory_id: u.territory_id,
                        territory: u.territory,
                        owned: u.owned
                    })),
                    ...neighbors.map((n) => ({
                        territory_id: n.territory_id,
                        territory: n.territory,
                        owned: n.owned
                    }))
                ];

                const uniqueTerritories = Array.from(new Set(moves.map((m) => m.territory_id)));
                const results = uniqueTerritories.map((u) => moves.find((m) => m.territory_id === u));

                res.send(results);
            } else {
                res.sendStatus(401);
            }
        },
        getOrCreateUserAssignment: async (req, res) => {
            if (req.isAuthenticated() && req.user && !req.user.roles.includes(
                    'blacklisted')) {
                const results = await axios.get(
                    'https://collegefootballrisk.com/api/turns');
                const currentTurn = results.data.find((d) => d.active && !d.completed);

                let current = await getCurrentAssignment(req.user.name, currentTurn.id);

                if (!current || !current.territory) {
                    const responses = await Promise.all([axios.get(
                            'https://collegefootballrisk.com/api/player', {
                                params: {
                                    player: req.user.name
                                }
                            }),
                        db.any(`
                            SELECT p.name AS player, CASE WHEN pr.id IS NULL THEN false ELSE true END as blacklisted, (a.turn_id - 66) AS day, t.name AS territory
                            FROM player AS p
                                INNER JOIN player_assignment AS pa ON p.id = pa.player_id
                                INNER JOIN assignment AS a ON pa.assignment_id = a.id
                                INNER JOIN territory AS t ON a.territory_id = t.id
                                LEFT JOIN player_role AS pr ON p.id = pr.player_id AND pr.role_id = 5
                            WHERE p.name = $1 AND a.turn_id > 66
                            ORDER BY a.turn_id DESC
                    `, [req.user.name])
                    ]);

                    if (responses[1] && responses[1].length && responses[1][0].blacklisted) {
                        current = {
                            territory: 'Blacklisted for alt creation',
                            img: null
                        };
                    } else {
                        const stars = responses[0].data && responses[0].data && responses[0].data.ratings.overall ? responses[0].data.ratings.overall : 1;
                        const mvps = parseInt(responses[0].data && responses[0].data.stats.mvps ? responses[0].data.stats.mvps : 0, 10);
                        const weight = this.weights[stars - 1];

                        let priorities = 'ORDER BY priority, a.mvp_farm, a.weight DESC';
                        if (mvps === 0 || mvps === 4 || mvps === 9 || mvps === 24) {
                            priorities = 'ORDER BY priority, a.mvp_farm DESC, a.weight DESC';
                        }

                        await db.none(`
                            WITH next_assignment AS (
                                SELECT 	a.id,
                                        a.weight,
                                        (COALESCE(SUM(CASE WHEN pa.stars = 5 THEN 24 WHEN pa.stars = 4 THEN 12 WHEN pa.stars = 3 THEN 6 ELSE pa.stars END), 0) + $5) / weight as priority
                                FROM assignment AS a
                                    LEFT JOIN player_assignment AS pa ON a.id = pa.assignment_id
                                WHERE a.weight > 0 AND a.min_stars <= 4 AND a.max_stars >= 4 AND a.turn_id = $2
                                GROUP BY a.id, a.weight, a.mvp_farm
                                ${priorities}
                                LIMIT 1
                            )
                            INSERT INTO player_assignment (assignment_id, player_id, stars, mvps)
                                SELECT na.id, p.id, $3, $4
                                FROM next_assignment AS na
                                    INNER JOIN player AS p ON p.name = $1
                                LIMIT 1;
                        `, [req.user.name, currentTurn.id, stars, mvps, weight]);

                        current = await getCurrentAssignment(req.user.name, currentTurn.id);
                    }
                }

                res.send({
                    territory: current ? current.territory : null,
                    img: current && current.territory !== 'LOL GTFO' ?
                        getTerritoryImage(current.territory) : null,
                    reminder: current ? current.reminder : false
                });
            } else if (req.user.roles.includes('blacklisted')) {
                res.send({
                    territory: 'Blacklisted for non-compliance or being flagged for alt creation',
                    img: null
                });
            } else {
                res.sendStatus(401);
            }
        },
        getCurrentUserAssignment: async (req, res) => {
            if (req.isAuthenticated() && req.user && !req.user.roles.includes(
                    'blacklisted')) {
                const results = await axios.get(
                    'https://collegefootballrisk.com/api/turns');
                const currentTurn = results.data.find((d) => d.active && !d.completed);

                const current = await getCurrentAssignment(req.user.name, currentTurn
                    .id);

                res.send({
                    territory: current && current.territory ? current
                        .territory : null,
                    img: current && current.territory ? getTerritoryImage(
                        current.territory) : null,
                    reminder: current ? current.reminder : false
                });
            } else {
                res.sendStatus(401);
            }
        },
        updateReminders: async (req, res) => {
            if (req.isAuthenticated() && req.user) {
                await db.none('UPDATE player SET reminder = $1 WHERE name = $2', [req
                    .body.enabled, req.user.name
                ]);
                res.sendStatus(200);
            }
        },
        getReminderList: async (req, res) => {
            if (req.isAuthenticated() && req.user && req.user.roles.includes('mod')) {
                const reminders = await db.any(`
                    select name
                    from player
                    where reminder = true
                `);

                res.send(reminders.map((r) => r.name).join("<br />"));
            }
        }
    };
};
