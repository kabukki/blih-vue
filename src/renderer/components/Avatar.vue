<template>
	<v-avatar :color='color' :tile='tile'>
		<img :src="src" alt="" v-if='src'>
		<span class='white--text headline' v-else>{{ letter }}</span>
	</v-avatar>
</template>
<script>
	export default {
		props: ['src', 'name', 'tile'],
		data () {
			return {
				a: 'red', b: 'pink', c: 'purple', d: 'deep-purple',
				e: 'indigo', f: 'blue', g: 'light-blue', h: 'cyan',
				i: 'teal', j: 'green', k: 'light-green', l: 'lime',
				m: 'yellow', n: 'amber', o: 'orange', p: 'deep-orange',
				q: 'brown', r: 'blue-grey', s: 'grey', t: 'red lighten-2',
				u: 'pink lighten-2', v: 'purple lighten-2',w: 'deep-purple lighten-2', x: 'indigo lighten-2',
				y: 'blue lighten-2', z: 'light-blue lighten-2', '0': 'cyan lighten-2', '1': 'teal lighten-2',
				'2': 'green lighten-2', '3': 'light-green lighten-2', '4': 'lime lighten-2', '5': 'yellow lighten-2',
				'6': 'amber lighten-2', '7': 'orange lighten-2', '8': 'deep-orange lighten-2', '9': 'brown lighten-2',
			}
		},
		computed: {
			letter () {
				return (this.name && this.name.length) && this.name[0].toUpperCase() || '?';
			},
			color () {
				const lower = this.letter.toLowerCase();
				return this[lower] || 'black';
			}
		}
	}
</script>
