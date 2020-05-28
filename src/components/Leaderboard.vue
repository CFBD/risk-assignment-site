<template>
    <div>
        <b-table v-if='!loading' small responsive :items='items' :fields="fields"
            sort-by='territories' sort-desc :busy='!items || !items.length' per-page="15">
        </b-table>
        <b-row v-if='loading' class='justify-content-center'>
            <grid-loader color='#000001'></grid-loader>
        </b-row>
    </div>
</template>

<script>

export default {
    props: {
        turns: Array
    },
    data() {
        return {
            items: null,
            fields: [{
                key: 'rank',
                label: 'Rank'
            }, {
                key: 'team',
                label: 'Team',
                class: 'text-left'
            }, {
                key: 'territories',
                label: 'Territories'
            // }, {
            //     key: 'trend',
            //     label: 'Trend'
            }],
            loading: true
        };
    },
    methods: {
        refreshData(season, turn) {
            this.loading = true;
            this.$axios.get('/api/leaderboard', {
                params: {
                    season,
                    turn
                }
            })
                .then((result) => {
                    this.items = result.data
                        .map((d) => {
                            // eslint-disable-next-line no-underscore-dangle,no-param-reassign
                            d._cellVariants = {
                                trend: ''
                            };

                            if (d.diff > 0) {
                                // eslint-disable-next-line no-param-reassign
                                d.trend = `+${d.diff}`;
                                // eslint-disable-next-line no-underscore-dangle,no-param-reassign
                                d._cellVariants.trend = 'success';
                            } else if (d.diff === 0) {
                                // eslint-disable-next-line no-param-reassign
                                d.trend = '-';
                            } else {
                                // eslint-disable-next-line no-param-reassign
                                d.trend = `${d.diff}`;
                                // eslint-disable-next-line no-underscore-dangle,no-param-reassign
                                d._cellVariants.trend = 'danger';
                            }

                            return d;
                        });
                }).finally(() => {
                    this.loading = false;
                });
        }
    },
    watch: {
        // eslint-disable-next-line no-unused-vars
        turns(newValue, oldValue) {
            if (newValue && newValue.length) {
                this.refreshData(this.turns[0].season, this.turns[0].turns[0]);
            }
        }
    },
    created() {
        if (this.turns && this.turns.length) {
            this.refreshData(this.turns[0].season, this.turns[0].turns[0]);
        }
    }
};

</script>

<style>

</style>
