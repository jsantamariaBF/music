<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <Upload
            :addSong='addSong'
          >
          </Upload>
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title text-xl">{{$t('manage.mySongTitle')}}</span>
              <i class="fa fa-compact-disc float-right text-purple-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <CompositionItem
                v-for='(song, index) in songs'
                :key='song.docID'
                :song='song'
                :updateSong='updateSong'
                :index='index'
                :removeSong="removeSong"
                :updateUnsavedFlag='updateUnsavedFlag'
              >
              </CompositionItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import store from '@/store';
import { songsCollection, auth } from '@/includes/firebase';
import Upload from '@/components/Upload.vue';
import CompositionItem from '@/components/CompositionItem.vue';

export default {
  name: 'Manage',
  components: {
    Upload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsaveFlag: false,
    };
  },
  async created() {
    const snapshot = await songsCollection
      .where('uid', '==', auth.currentUser.uid)
      .get();

    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modified_name = values.modified_name;
      this.songs[index].genre = values.genre;
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsaveFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsaveFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUpload();
  //   next();
  // },
//   beforeRouteEnter(to, from, next) {
//     if (store.state.userLoggedIn) {
//       next();
//     } else {
//       next({ name: 'home' });
//     }
//   },
};

</script>
