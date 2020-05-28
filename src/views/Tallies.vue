<template>
    <b-container>
        <b-card class='tally-card' title='Tallies'>
            <b-row>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>Players</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{players}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>*</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{ones}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>**</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{twos}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>***</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{threes}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>****</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{fours}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>*****</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{fives}}
                    </b-row>
                </b-col>
                <b-col>
                    <b-row class='justify-content-center'>
                        <h5>Star Power</h5>
                    </b-row>
                    <b-row class='justify-content-center'>
                        {{starPower}}
                    </b-row>
                </b-col>
            </b-row>
        </b-card>
    </b-container>
</template>

<script>
    export default {
        data() {
            return {
                players: 0,
                ones: 0,
                twos: 0,
                threes: 0,
                fours: 0,
                fives: 0,
                starPower: 0
            };
        },
        methods: {
            refreshData() {
                this.$axios.get('/api/tallies').then((result) => {
                    this.players = result.data.players;
                    this.ones = result.data.ones;
                    this.twos = result.data.twos;
                    this.threes = result.data.threes;
                    this.fours = result.data.fours;
                    this.fives = result.data.fives;
                    this.starPower = result.data.stars;
                });
            }
        },
        created() {
            this.refreshData();
        },
        socket: {
            events: {
                player_assigned() {
                    this.refreshData();
                },
                assignment_created() {
                    this.refreshData();
                },
                assignment_updated() {
                    this.refreshData();
                }
            }
        }
    };

</script>

<style lang='scss'>
    .tally-card {
        margin: 3em 0;
        padding: 3em;
    }

</style>
