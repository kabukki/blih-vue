<template>
	<v-avatar :color='color' :tile='tile'>
		<img :src="src" v-if='src'>
		<span class='white--text headline' v-else>{{ letter }}</span>
	</v-avatar>
</template>
<script>
	import { mapGetters } from 'vuex';

	export default {
		props: ['name', 'tile'],
		computed: {
			...mapGetters(['colorOf']),
			letter () {
				return (this.name && this.name.length) && this.name[0].toUpperCase() || '?';
			},
			color () {
				return this.colorOf(this.name);
			},
			src () {
				return false;
				//return (this.name.includes('@') && 'https://cdn.local.epitech.eu/userprofil/profilview/' + this.name.split('@')[0] + '.jpg' || false);
			}
		}
	}
</script>
