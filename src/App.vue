<template>
  <AppHeader />
  <router-view></router-view>
  <Player />
  <AuthModal />
</template>

<script>
import AppHeader from './components/Header.vue';
import AuthModal from './components/Auth.vue';
import Player from './components/Player.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthModal,
    Player,
  },
  created() {
    this.$store.dispatch('init_login');
  },
};
</script>
<style>

</style>
