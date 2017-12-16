<template>
	<v-avatar :color='color' :tile='tile' :size='size'>
		<img :src="src" v-if='src'>
		<span class='white--text display-3' v-else>{{ letter }}</span>
	</v-avatar>
</template>

<script>
	import { mapGetters } from 'vuex';

	export default {
		props: ['name', 'tile', 'size'],
		computed: {
			...mapGetters(['collaborators', 'colorOf']),
			letter () {
				return (this.name && this.name.length) && this.name[0].toUpperCase() || '?';
			},
			color () {
				return this.colorOf(this.name);
			},
			src () {
				const c = this.collaborators.find(c => c.name == this.name);
				return c && c.picture || false;
			}
		}
	}
</script>
