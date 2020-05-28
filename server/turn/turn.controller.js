const axios = require('axios');

module.exports = () => ({
    getTurns: async (req, res) => {
        const result = await axios.get('https://collegefootballrisk.com/api/turns');

        const years = Array.from(new Set(result.data.map((r) => r.season)))
            .sort((a, b) => a > b ? 1 : -1) // eslint-disable-line
            .map((y) => ({
                season: parseInt(y), // eslint-disable-line
                turns: result.data
                    .filter((r) => r.season === y)
                    .map(w => parseInt(w.day)) // eslint-disable-line
                    .sort((a, b) => a > b ? -1 : 1) // eslint-disable-line
            }));

        res.send(years);
    }
});
