<template>
    <b-card id='AssignmentCard' title="Today's Assignment">
        <b-row class='justify-content-center' v-if="!assignment">
            <b-button variant="primary" @click="getAssignment">
                Get An Assignment
            </b-button>
        </b-row>
        <b-row class='justify-content-center' v-if='imageSource'>
            <img id='AssignmentImage' alt="assignment" :src="imageSource">
        </b-row>
        <b-row class='justify-content-center' v-if='assignment'>
            <h1>{{assignment}}</h1>
        </b-row>
        <b-row class='justify-content-center' v-if='assignment'>
            <b-link href="https://collegefootballrisk.com" target='_blank'>Put in your move for today</b-link>
        </b-row>
        <b-row class='justify-content-center mt-2' v-if='assignment'>
            <b-checkbox v-model='reminder' @input='toggleReminders'>Send me daily reminders</b-checkbox>
        </b-row>
    </b-card>
</template>

<script>
    export default {
        prop: {
            profile: Object
        },
        data() {
            return {
                assignment: null,
                imageSource: null,
                reminder: false
            }
        },
        methods: {
            getAssignment() {
                this.$axios.post('/api/player/assignment').then(result => {
                    this.assignment = result.data.territory;
                    this.imageSource = result.data.img;
                    this.reminder = result.data.reminder;
                }).catch(err => {
                    // nothing for now
                });
            },
            toggleReminders() {
                this.$axios.post('/api/reminders', {
                    enabled: this.reminder
                }).catch((err) => {
                    console.error(err);
                });
            }
        },
        created() {
            this.$axios('/api/player/assignment').then(result => {
                this.assignment = result.data.territory;
                this.imageSource = result.data.img;
                this.reminder = result.data.reminder;
            }).catch(err => {
                // nothing for now
            })
        }
    }

</script>

<style lang='scss'>
    #AssignmentCard {
        height: 30em;

        .card-title {
            margin-bottom: 2.5em;
        }

        #AssignmentImage {
            height: 150px;
            margin-bottom: 2em;
        }
    }

</style>
