<template>
    <div>
        <b-navbar toggleable="md">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="/">{{ this.title }}</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse" variant="dark">
                <b-navbar-nav v-if='profile'>
                    <b-nav-item to="/">Home</b-nav-item>
                    <b-nav-item v-if='profile.roles.includes("vetted")' to="/tallies">Tallies
                    </b-nav-item>
                    <b-nav-item v-if='profile.roles.includes("mod")' to='/assignments'>
                        Assignments
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    props: {
        profile: Object
    },
    computed: {
        title() {
            return `${this.$team} CFB Risk`;
        }
    }
};

</script>

<style lang="scss">
    $primary: #000001;
    $secondary: #FFFFFE;

    .navbar {
        background: $primary;

        .admin-button {
            background: $secondary;
            color: $primary;

            button {
                background: $secondary;
                color: $primary;
            }

            &:active {
                color: $secondary !important;
                background-color: $primary !important;
            }
        }

        .navbar-brand {
            color: $secondary;

            &:hover {
                color: white;
            }
        }

        .nav-link {
            color: white !important;

            &:hover {
                color: $secondary !important;
            }
        }

        .router-link-exact-active {
            color: $secondary !important;
        }

        .dropdown-menu {
            background-color: $secondary;

            .nav-link {
                color: $primary !important;

                &:hover {
                    color: white !important;
                }
            }

            .dropdown-item {

                &:active,
                &.active,
                &:focus,
                &:hover {
                    background-color: $primary !important;
                    color: $secondary !important;
                }
            }
        }

        .navbar-toggler {
            outline: $secondary;
        }
    }

</style>
