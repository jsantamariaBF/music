<template>
  <main>
      <!-- Music Header -->
      <section class="w-full mb-8 py-14 text-center text-white relative">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500
          absolute inset-0 w-full h-full bg-contain introduction-bg"
        >
        </div>
        <div class="container mx-auto flex items-center">
          <!-- Play/Pause Button -->
          <button
            @click.prevent='playSong(song)'
            type="button"
            class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
            focus:outline-none hover:bg-gray-200"
          >
            <i class="fas fa-play"></i>
          </button>
          <div class="z-50 text-left ml-8">
            <!-- Song Info -->
            <div class="text-3xl font-bold">
                {{ song.modified_name }}
            </div>
            <div>
                {{ song.genre }}
            </div>
            <!-- <div class="song-price">{{$n(1, 'currency', 'en')}}</div> -->
            <div class="song-price">{{$t('song.uploadedBy')}} {{song.display_name}}</div>
          </div>
        </div>
      </section>
      <!-- Form -->
      <section class="container mx-auto mt-6" id="comments">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <!-- Comment Count -->
            <span class="card-title">
              <!-- Comments ({{ comments.length }}) -->
              {{$t('song.comment.count', {count: comments.length})}}
            </span>
            <i class="fa fa-comments float-right text-purple-400 text-2xl"></i>
          </div>
          <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if='comment_show_alert'
            :class='comment_alert_variant'
            >
            {{ comment_alert_message }}
          </div>
            <vee-form
              @submit='addComment'
              :validation-schema='commentSchema'
              v-if='userLoggedIn'
            >
              <vee-field
                as="textarea"
                name='comment'
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                  duration-500 focus:outline-none focus:border-black rounded mb-4"
                placeholder="Write your comment here">
              </vee-field>
              <div class="mb-3">
                <ErrorMessage class="text-red-600" name='comment' />
              </div>
              <button
                :disabled='comment_in_submission'
                type="submit"
                class="py-1.5 px-3 rounded text-white bg-purple-600 hover:bg-purple-800 block"
              >
                {{$t('song.submitButton')}}
              </button>
            </vee-form>
            <!-- Sort Comments -->
            <select
              v-model='sort'
              class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded">
              <option value="1">{{$t('song.latestSelect')}}</option>
              <option value="2">{{$t('song.oldestSelect')}}</option>
            </select>
          </div>
        </div>
      </section>
      <!-- Comments -->
      <ul class="container mx-auto">
        <li
          v-for='comment in sortedComments'
          :key='comment.docID'
          class="p-6 bg-gray-50 border border-gray-200">
          <!-- Comment Author -->
          <div class="mb-5">
            <div class="font-bold">{{ comment.name }}</div>
            <time>{{ comment.datePosted }}</time>
          </div>
          <p>
            {{ comment.content }}
          </p>
        </li>
      </ul>
  </main>
</template>

<script>
import { songsCollection, commentsCollection, auth } from '@/includes/firebase';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      sort: '1',
      commentSchema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_message: 'Please wait! Your comment is being submitted.',
      comments: [],
    };
  },
  computed: {
    ...mapState(['userLoggedIn']),

    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const docSnapshot = await songsCollection
      .doc(this.$route.params.id)
      .get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    const { sort } = this.$route.query;

    this.srt = sort === '1' || sort === '2' ? sort : '1';

    this.song = docSnapshot.data();

    this.getComments();
  },
  methods: {
    ...mapActions(['playSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_message = 'Please wait! Your comment is being submitted.';

      this.getComments();

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id, // song id
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid, // user id
      };

      await commentsCollection.add(comment);

      this.comment_in_submission = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_message = 'The comment was added succesfully!.';

      setTimeout(() => {
        this.comment_show_alert = false;
      }, 3000);

      resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection
        .where('sid', '==', this.$route.params.id)
        .get();

      this.comments = [];

      snapshots.forEach((doc) => [
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        }),
      ]);
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
