<template>
    <router-link
    :to="{ name: 'song', params: { id: song.docID }}"
    >
        <li
        id="listSongs"
        class="flex justify-between items-center cursor-pointer
        ml-2 mr-2 mb-4 py-5 p-10 shadow-2xl"
        :style="{backgroundColor: random_bg_color()}"
        >
            <div class="text-center py-5 font-bold text-white text-md">
                {{ nameFormated() }} <br><br>
                <span class="text-white text-md">
                    {{ song.display_name }}
                </span>
                <router-link
                custom
                :to="{ name: 'song', params: {id: song.docID}, hash: '#comments'}"
                v-slot="{ navigate }">
                    <div
                    @click.prevent='navigate'
                    class="text-white text-xl text-center"
                    >
                    <br>
                        <span class="comments">
                            <i class="fa fa-comments text-white "></i>
                            {{ song.comment_count }}
                        </span>
                    </div>
                </router-link>
            </div>
        </li>
    </router-link>
</template>

<script>
export default {
  name: 'SongItem',
  props: ['song'],
  methods: {
    random_bg_color() {
      const x = Math.floor(100 + Math.random() * 155);
      const y = Math.floor(100 + Math.random() * 50);
      const z = Math.floor(150 + Math.random() * 50);
      const bgColor = `rgb(${x},${y},${z}`;

      return bgColor;
    },
    nameFormated() {
      const getName = this.song.modified_name;
      const name = getName.split('.');
      return name[0].toUpperCase();
    },
  },
};
</script>
