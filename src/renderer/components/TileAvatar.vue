<template>
	<v-list-tile-avatar :color='color'>
		<img :src="src" v-if='src'>
		<span class='white--text headline' v-else>{{ letter }}</span>
	</v-list-tile-avatar>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
	  props: ['name'],
	  computed: {
	    ...mapGetters(['collaborators', 'colorOf']),
	    letter () {
	      return (this.name && this.name.length) ? this.name[0].toUpperCase() : '?';
	    },
	    color () {
	      return this.colorOf(this.name);
	    },
	    src () {
	      const c = this.collaborators.find(c => c.name === this.name || c.aliases.includes(this.name));
	      return c ? c.picture : false;
	    }
	  }
	};
</script>
