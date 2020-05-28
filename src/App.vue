<template>
    <div id="app">
        <navigation :profile='profile'></navigation>
        <router-view :profile='profile' :is-loading='isLoading' :seasons='seasons' :turns='turns' :teams='teams' />
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';

export default {
    components: {
        Navigation
    },
    data() {
        return {
            profile: null,
            isLoading: false,
            seasons: [],
            turns: [],
            teams: []
        };
    },
    created() {
        this.isLoading = true;
        this.$axios.get('/api/me').then((result) => {
            this.profile = result.data;
            this.isLoading = false;
        }).catch(() => {
            this.profile = null;
            this.isLoading = false;
        })
        .finally(() => {
            this.isLoading = false;
        });

        this.$axios.get('/api/turns').then((result) => {
            this.turns = result.data;
            this.seasons = result.data.map(d => d.season);
        });

        this.$axios.get('/api/teams').then(res => {
            this.teams = res.data.map(t => t.name).sort();
        });
    }
};
</script>


<style lang="scss">
    $primaryColor: #000001;
    $secondaryColor: #FFFFFE;

    body {
        background: #dedede;
    }

    #app {
        font-family: "Avenir", Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }

</style>
