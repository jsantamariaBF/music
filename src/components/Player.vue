<template>
     <!-- Player -->
  <div class="fixed bottom-0 left-0 bg-white p-5 pb-4 text-left align-top w-full h-15">
    <div class="relative">
      <!-- Play/Pause Button -->
      <div class="float-left w-7 h-7 leading-3 mt-2">
        <button
            @click.prevent='toggleAudio'
            type="button">
          <i
            :class="{'fa-play' : !playing, 'fa-pause': playing}"
            class="fa text-gray-500 text-xl hover:text-gray-800"></i>
        </button>
      </div>
      <!-- Current Position -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-5 mt-4">
        <span class="player-currenttime">{{ seek  }}</span>
      </div>
      <!-- Scrub -->
      <div class="float-left w-7 h-7 leading-3 ml-7 mt-0 player-scrub py-2">
        <div
        class="absolute left-0 right-0 text-lg text-center
                mx-auto player-song-info"
        v-if="currentSong.modified_name"
        >
          <span class="song-title">{{ currentSong.modified_name }} - Uploaded by </span>
          <span class="song-artist">{{ currentSong.display_name }}</span>
        </div>
        <!-- Scrub Container  -->
        <span
            @click.prevent="updateSeek"
            class="block w-full h-2 rounded m-1 mt-2 bg-gray-200
                    relative cursor-pointer"
        >
          <!-- Player Ball -->
          <span
            class="absolute top-neg-8 text-blue-800 text-lg"
            :style="{ left: playerProgress }"
          >
            <i class="fas fa-circle"></i>
          </span>
          <!-- Player Progress Bar-->
          <span class="block h-2 rounded bg-gradient-to-r from-blue-500 to-purple-400"
            :style="{ width: playerProgress }"></span>
        </span>
      </div>
      <!-- Duration -->
      <div class="float-left w-7 h-7 leading-3 text-gray-400 mt-0 text-lg w-14 ml-8 mt-4">
        <span class="player-duration">{{ duration}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'Player',
  props: ['song'],
  computed: {
    ...mapGetters(['playing']),
    ...mapState(['seek', 'duration', 'playerProgress', 'currentSong']),
  },
  methods: {
    ...mapActions(['toggleAudio', 'updateSeek']),
  },
};
</script>

<style>

</style>
