<template>
  <header id="header" class="bg-white-200">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <router-link
        class="text-black font-bold uppercase text-2xl mr-4"
        :to="{name: 'home'}"
        exact-active-class="no-active"
        >
        Music
      </router-link>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li  v-if="!userLoggedIn">
            <a class="px-2 text-black" href="#" @click.prevent='toggleAuthModal'>
              {{$t('header.loginRegister')}}
            </a>
             <a
                @click.prevent="changeLocale"
                class=" text-black px-2"
                href="#">
                {{currentLocale}}
              </a>
          </li>
          <template v-else>
            <li>
              <router-link class="px-2 text-black" :to="{name: 'about'}">
                {{$t('header.aboutTab')}}
              </router-link>
            </li>
             <li>
              <router-link class="px-2 text-black" :to="{name: 'manage'}">
                {{$t('header.manageTab')}}
              </router-link>
            </li>
            <li>
              <a @click.prevent='signout' class="px-2 text-black" href="#">
              {{$t('header.signoutTab')}}
              </a>
            </li>
            <!-- <li v-if="!userLoggedIn">
              <a
                @click.prevent="changeLocale"
                class=" text-black px-2"
                href="#">
                {{currentLocale}}
              </a>
              </li> -->
             <!-- <ul class="flex flex-wrap">

             </ul> -->

          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'fr' ? 'English' : 'French';
    },
  },
  methods: {
    ...mapMutations(['toggleAuthModal']),
    signout() {
      this.$store.dispatch('signout', {
        router: this.$router,
        route: this.$route,
      });

      if (this.$route.name.requiresAuth) {
        this.$router.push({ name: 'home' });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'fr' ? 'en' : 'fr';
    },

    // toggleAuthModal() {
    //   this.$store.commit('toggleAuthModal');
    // },
  },
};
</script>

<style>

</style>
