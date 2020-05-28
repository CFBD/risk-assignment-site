<template>
    <b-container id='assignmentsContainer'>
        <b-card>
            <h1 class='display-4'>Assignments</h1>
            <h3>Season {{turn.season}}, Turn {{turn.day}}</h3>
            <h4><span>{{ needed }}</span> stars until quotas are met</h4>
        </b-card>
        <b-card>
            <b-table hover small responsive foot-clone="true" :items='items' :fields="fields"
                sort-by="weight" sort-desc="true">
                <template v-slot:cell(minMax)='row'>
                    {{row.item.minStars}}/{{row.item.maxStars}}
                </template>
                <template v-slot:cell(actions)="row">
                    <div>
                        <b-button size="sm" @click.stop="edit(row.item, $event.target)" class="mr-1">
                            Edit
                        </b-button>
                        <b-button size="sm" @click.stop="removeAssignment(row.item, row.index, $event.target)"
                            class="mr-1" variant='danger' :disabled="row.item.weight === 0">
                            Remove
                        </b-button>
                    </div>
                </template>
                <!-- eslint-disable -->
                <template v-slot:foot(territory)="data">
                    <strong>Total</strong>
                </template>
                <template v-slot:foot(weight)="data">
                    <strong>{{items.map(i => i.weight).reduce((a,c) => a + c, 0)}}</strong>
                </template>
                <template v-slot:foot(stars)="data">
                    <strong>{{items.map(i => i.stars).reduce((a,c) => a + c, 0)}}</strong>
                </template>
                <template v-slot:foot(players)="data">
                    <strong>{{items.map(i => i.players).reduce((a,c) => a + c, 0)}}</strong>
                </template>
                <template v-slot:foot(breakdown)="data">
                    <strong>{{totalBreakdown}}</strong>
                </template>
                <template v-slot:foot(actions)="data">
                </template>
                <template v-slot:foot(minMax)="data">
                </template>
                <!-- eslint-enable -->
            </b-table>
        </b-card>
        <b-card>
            <b-row>
                <b-col class='text-left'>
                    <b-button size="sm" v-b-modal.createAssignmentModal class="assignment-button mr-1"
                        variant='primary'>
                        Add Assignment
                    </b-button>
                </b-col>
                <b-col auto></b-col>
                <b-col class='text-right'>
                </b-col>
            </b-row>
            <b-modal ref='editModal' id='editAssignmentModal' :title='editModal.title' @hide='hideEditModal()'
                @ok='updateAssignment'>
                <b-form @submit.stop.prevent="handleEditSubmit">
                    <b-form-group label="Weight">
                        <b-form-input v-model="editModal.item.weight" type='number'></b-form-input>
                    </b-form-group>
                    <b-form-group label="Min Stars:">
                        <b-form-input v-model="editModal.item.minStars" type='number' min='1' max='5'></b-form-input>
                    </b-form-group>
                    <b-form-group label="Max Stars:">
                        <b-form-input v-model="editModal.item.maxStars" type='number' min='1' max='5'></b-form-input>
                    </b-form-group>
                    <b-form-group label="MVP Farm:">
                        <b-form-checkbox v-model="editModal.item.mvpFarm"></b-form-checkbox>
                    </b-form-group>
                </b-form>
            </b-modal>
            <b-modal ref='createModal' id='createAssignmentModal' title='Create New Assignment'
                @hide='hideCreateModal()' @ok='createAssignment'>
                <b-form @submit.stop.prevent="handleCreateSubmit">
                    <b-form-group label="Territory">
                        <autocomplete :items='availableTerritories' displayProp='territory' @selection='createModal.territory = $event.territory'
                            required></autocomplete>
                    </b-form-group>
                    <b-form-group label="Weight">
                        <b-form-input v-model="createModal.weight" type='number'></b-form-input>
                    </b-form-group>
                    <b-form-group label="Min Stars:">
                        <b-form-input v-model="createModal.minStars" type='number' min='1' max='5'></b-form-input>
                    </b-form-group>
                    <b-form-group label="Max Stars:">
                        <b-form-input v-model="createModal.maxStars" type='number' min='1' max='5'></b-form-input>
                    </b-form-group>
                    <b-form-group label="MVP Farm:">
                        <b-form-checkbox v-model="createModal.mvpFarm"></b-form-checkbox>
                    </b-form-group>
                </b-form>
            </b-modal>
        </b-card>
    </b-container>
</template>

<script>
import Autocomplete from '@/components/Autocomplete.vue';

export default {
    components: {
        Autocomplete
    },
    data() {
        return {
            fields: [{
                key: 'territory',
                label: 'Territory',
                sortable: true
            },
            {
                key: 'weight',
                label: 'Weight',
                sortable: true,
                sortDirection: 'desc'
            },
            {
                key: 'stars',
                label: 'Stars',
                sortable: true
            },
            {
                key: 'breakdown',
                label: 'Star Breakdown'
            },
            {
                key: 'players',
                label: 'Players',
                sortable: true
            },
            {
                key: 'minMax',
                label: 'Min/Max'
            },
            {
                key: 'mvpFarm',
                label: 'MVP Farm'
            },
            {
                key: 'actions',
                label: 'Actions'
            }
            ],
            items: [],
            editModal: {
                title: '',
                item: {
                    weight: 0,
                    minStars: 1,
                    maxStars: 5,
                    mvpFarm: false
                }
            },
            createModal: {
                territory: '',
                weight: 0,
                minStars: 1,
                maxStars: 5,
                mvpFarm: false
            },
            moves: [],
            turn: {
                season: null,
                turn: null
            }
        };
    },
    methods: {
        edit(item, target) {
            this.editModal.title = item.territory;
            this.editModal.item = item;
            this.$root.$emit('bv::show::modal', 'editAssignmentModal', target);
        },
        handleEditSubmit(evt) {
            evt.preventDefault();
            this.updateAssignment();
        },
        updateAssignment() {
            // eslint-disable-next-line no-unused-vars
            this.$axios.post('/api/assignment/update', this.editModal.item).then((result) => {
                this.hideEditModal();
            });
        },
        // eslint-disable-next-line no-unused-vars
        removeAssignment(item, target) {
            this.$axios.post('/api/assignment/update', {
                id: item.id,
                weight: 0,
                minStars: item.minStars,
                maxStars: item.maxStars,
                mvpFarm: item.mvpFarm
            });
        },
        createAssignment(evt) {
            evt.preventDefault();
            this.handleCreateSubmit();
        },
        handleCreateSubmit() {
            this.$axios.post('/api/assignment', {
                // eslint-disable-next-line max-len
                territory: this.moves.find((m) => m.territory === this.createModal.territory).territory_id,
                weight: this.createModal.weight,
                minStars: this.createModal.minStars,
                maxStars: this.createModal.maxStars,
                turn: this.turn.id,
                mvpFarm: this.createModal.mvpFarm
            // eslint-disable-next-line no-unused-vars
            }).then((res) => {
                this.$refs.createModal.hide();
            });
        },
        hideEditModal() {
            this.$refs.editModal.hide();
            this.editModal = {
                title: '',
                item: {
                    weight: 0,
                    minStars: 1,
                    maxStars: 5,
                    mvpFarm: false
                }
            };
        },
        hideCreateModal() {
            this.createModal = {
                territory: null,
                weight: 0,
                minStars: 1,
                maxStars: 5,
                mvpFarm: falses
            };
        },
        refreshData() {
            this.$axios
                .get('/api/assignments', {
                    params: {
                        turn: this.turn.id
                    }
                })
                .then((response) => {
                    this.items = response.data.map((d) => {
                        let rowVariant = '';

                        // eslint-disable-next-line no-param-reassign,max-len
                        d.stars = parseInt(d.ones, 10) + parseInt(d.twos, 10) * 2 + parseInt(d.threes, 10) * 6 + parseInt(d.fours, 10) * 12 + parseInt(d.fives, 10) * 24;

                        if (parseFloat(d.stars) >= parseFloat(d.weight)) {
                            rowVariant = 'danger';
                        } else if ((parseFloat(d.stars) / parseFloat(d.weight))
                                >= 0.9) {
                            rowVariant = 'warning';
                        }

                        return {
                            id: d.id,
                            territory: d.territory,
                            weight: parseInt(d.weight, 10),
                            stars: d.stars ? parseInt(d.stars, 10) : 0,
                            breakdown: `${d.ones ? d.ones : 0}/${d.twos ? d.twos : 0}/${d.threes ? d.threes : 0}/${d.fours ? d.fours : 0}/${d.fives ? d.fives : 0}`,
                            players: parseInt(d.players, 10),
                            minStars: d.min_stars,
                            maxStars: d.max_stars,
                            mvpFarm: d.mvp_farm,
                            _rowVariant: rowVariant
                        };
                    });
                });
        },
        refreshTurnData() {
            this.$axios.get('/api/turns/current').then((result) => {
                this.turn = result.data;

                this.$axios.get('/api/moves', {
                    params: {
                        game: this.turn.season,
                        turn: this.turn.turn,
                        team: this.$team
                    }
                // eslint-disable-next-line no-return-assign
                }).then((res) => this.moves = res.data);

                this.refreshData();
            });
        }
    },
    computed: {
        availableTerritories() {
            return Array.from(new Set(this.moves
                .filter((t) => this.items.find((a) => a.territory === t.territory) == null)))
                .sort((a, b) => (a.territory < b.territory ? -1 : 1));
        },
        totalBreakdown() {
            const sums = this.items
                .map((i) => i.breakdown.split('/').map((s) => s * 1.0))
                .reduce((a, c) => a.map((n, i) => n + c[i]), [0, 0, 0, 0, 0]);
            return `${sums[0]}/${sums[1]}/${sums[2]}/${sums[3]}/${sums[4]}`;
        },
        needed() {
            return this.items
                .filter((i) => i.stars < i.weight)
                .map((i) => i.weight - i.stars)
                .reduce((a, c) => a + c, 0);
        }
    },
    created() {
        this.refreshTurnData();
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
    #assignmentsContainer {
        .card {
            margin-top: 1em;
            margin-bottom: 1em;
        }
    }

    .assignment-button {
        padding: 1em;
    }

</style>
