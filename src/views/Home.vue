<template>
    <div class="home">
        <b-container>
            <b-row class='title-row justify-content-center'>
                <b-col sm="12">
                    <b-card>
                        <b-row v-if='isLoading' class='loading-screen justify-content-center'>
                            <grid-loader color='#000001'></grid-loader>
                        </b-row>
                        <div v-else-if='profile'>
                            <h1>Welcome to {{ this.$team }} Risk!</h1>
                        </div>
                        <div class='login' v-else>
                            <h1>
                                {{ this.$team }} Risk
                            </h1>
                            <h3 class='lead'>
                                Login using Reddit:
                            </h3>
                            <b-link href='/auth/reddit' class='text-danger'>
                                <font-awesome-icon :icon="['fab', 'reddit']" size='3x'></font-awesome-icon>
                            </b-link>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-if='!isLoading && profile' id='UserData'>
                <b-col lg='12'>
                    <assignment-card :profile='profile'></assignment-card>
                </b-col>
            </b-row>
            <b-row class='bottom-row'>
                <b-col lg='12'>
                    <b-card title='Leaderboard'>
                        <leaderboard :turns='turns'></leaderboard>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import AssignmentCard from '@/components/AssignmentCard.vue';
import Leaderboard from '@/components/Leaderboard.vue';

export default {
    name: 'home',
    components: {
        AssignmentCard,
        Leaderboard
    },
    props: ['profile', 'isLoading', 'turns']
};

</script>

<style lang="scss">
    .login {
        h1 {
            color: #000001;
        }

        h3 {
            color: #FFFFFE;
        }
    }

    .home {
        .card {
            padding: 1em;
        }

        .title-row {
            margin-top: 2em;
        }

        .bottom-row {
            margin-top: 2em;
            margin-bottom: 2em;

            .card {
                margin-top: 0;
                height: 40em;
            }

            iframe {
                height: 40em;
                width: 100%;
            }
        }
    }

    #UserData {
        margin-top: 2em;
    }

    .discord-icon {
        color: #7289da;
    }

</style>
