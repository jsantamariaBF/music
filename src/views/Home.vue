<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="bg-gradient-to-r from-purple-500 to-pink-500
      absolute inset-0 w-full h-full bg-contain introduction-bg"
      >
      </div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{$t('home.listen')}}</h1>
          <h3 class="w-full md:w-8/12 mx-auto text-2xl">
            {{$t('home.subText')}}
          </h3>
        </div>
      </div>
    </section>
    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <i class="fa fa-headphones-alt float-right text-purple-600 text-2xl"></i>
          <span class="card-title text-xl">
          {{$t('home.songTitle')}}</span>
          <!-- Icon -->
        </div>
        <!-- Playlist -->
    <!-- <div class="flex flex-wrap w-full overflow-hidden"> -->
        <ol class="text-center flex-wrap justify-between" id="playlist">
          <SongItem
            v-for='song in songs'
            :key='song.docID'
            :song='song'
          >
          </SongItem>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import SongItem from '@/components/SongItem.vue';

export default {
  name: 'Home',
  data() {
    return {
      songs: [],
      maxPerPage: 15,
      pendingRequest: false,
    };
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  components: {
    SongItem,
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (bottomOfWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }
      this.pendingRequest = true;

      let snapshots;

      if (this.songs.length) {
        const lastDoc = await songsCollection
          .doc(this.songs[this.songs.length - 1].docID)
          .get();
        snapshots = await songsCollection
          .orderBy('modified_name')
          .startAfter(lastDoc)
          .limit(this.maxPerPage)
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy('modified_name')
          .limit(this.maxPerPage)
          .get();
      }

      snapshots.forEach((document) => {
        this.songs.push({
          docID: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
  },
};
</script>
