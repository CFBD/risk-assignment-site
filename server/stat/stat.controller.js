const axios = require('axios');

module.exports = () => ({
    getTerritoryCounts: async (req, res) => {
        const response = await axios.get('https://collegefootballrisk.com/api/stats/leaderboard');

        const results = response.data.map((r) => ({
            team: r.name,
            territories: r.territoryCount,
            diff: 0,
            rank: r.rank
        }));

        res.send(results);
    }
});
