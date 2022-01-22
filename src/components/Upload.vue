<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title text-xl">
       {{$t('manage.uploadTitle')}}
      </span>
      <i class="fas fa-upload float-right text-purple-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-purple-800 hover:border-purple-400 hover:border-solid"
        :class="{'bg-purple-400 border-purple-400 border-solid' : is_dragover}"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
          >
        <h5>{{$t('manage.dragBoxText')}}</h5>
      </div>
      <input type='file' multiple @change='upload($event)' />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <transition-group name='fade' mode='out-in'>
        <div v-show='!hide_uploaded_song' v-for="upload in uploads" :key="upload.name" class="mb-4">
          <!-- File Name -->
          <div
            class="font-bold text-sm"
            :class="upload.text_class"
            >
            <i :class='upload.icon'></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <!-- Inner Progress Bar -->
            <div
            class="transition-all progress-bar"
            :style="{width: upload.current_progress + '%' }"
            :class="upload.variant"
            >
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'Upload',
  data() {
    return {
      is_dragover: false,
      uploads: [],
      upload_success: false,
      hide_uploaded_song: false,
    };
  },
  props: ['addSong'],
  methods: {
    upload($event) {
      this.is_dragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400',
          });
          return;
        }

        const storageRef = storage.ref(); // music-dc876.appspot.com
        const songsRef = storageRef
          .child(`songs/${file.name}`); // music-dc876.appspot.com/songs/
        const task = songsRef.put(file);

        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;

        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploads[uploadIndex].current_progress = progress;
        }, (error) => {
        // callback function when get error
          this.uploads[uploadIndex].variant = 'bg-red-400';
          this.uploads[uploadIndex].icon = 'fas fa-times';
          this.uploads[uploadIndex].text_class = 'text-red-400';
          setTimeout(() => {
            this.hide_uploaded_song = false;
          }, 3000);
          console.error(error);
        },
        // callback function when success
        async () => {
          const song = {
            uid: auth.currentUser.uid,
            display_name: auth.currentUser.displayName,
            original_name: task.snapshot.ref.name,
            modified_name: task.snapshot.ref.name,
            genre: '',
            comment_count: 0,
            url: '',
          };

          song.url = await task.snapshot.ref.getDownloadURL();
          const songRef = await songsCollection.add(song);
          const songSnapshot = await songRef.get();

          this.addSong(songSnapshot);

          this.uploads[uploadIndex].variant = 'bg-green-400';
          this.uploads[uploadIndex].icon = 'fas fa-check';
          this.uploads[uploadIndex].text_class = 'text-green-400';

          setTimeout(() => {
            this.hide_uploaded_song = true;
          }, 6000);
        });
      });
    },
    /* call a hook before the app is unmounted to cancel tasks
      and free memory */
    beforeUnmount() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
    // cancelUpload() {
    //   this.uploads.forEach((upload) => {
    //     upload.task.cancel();
    //   });
    // },
  },

};
</script>

<style>
  .fade-enter-from {
    opacity: 0;
  }

  .fade-enter-active {
    transition: all 0.5s linear;
  }

  .fade-leave-to {
    transition: all 0.5s linear;
    opacity: 0;
  }
</style>
