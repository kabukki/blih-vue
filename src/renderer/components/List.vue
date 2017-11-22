<template>
	<div v-if='data.length > 0'>
		<v-text-field label='Search' prepend-icon='search' v-model='filter' />
		<v-expansion-panel v-if='filtered.length > 0'>
			<v-expansion-panel-content v-for="elem in filtered" :key="elem.name">
				<div slot='header' class='primary--text'>
					{{ elem.name }}
				</div>
				<v-card class='grey lighten-3'>
					<v-card-text>
						<div v-for="prop in props(elem)">
							<b>{{ prop.name }}</b> : {{ prop.value }}
						</div>
					</v-card-text>
					<v-card-actions>
						<v-spacer/>
						<v-btn flat outline :to="{ name: 'blih.repository', params: { name: elem.name } }">Details</v-btn>
						<v-btn flat outline disabled>Clone</v-btn>
						<v-btn color='error'><v-icon left>delete</v-icon>Delete</v-btn>
					</v-card-actions>
				</v-card>
			</v-expansion-panel-content>
		</v-expansion-panel>
		<div class='text-xs-center' v-else>
			No {{ type ? type : 'item' }} matches your query.
		</div>
	</div>
	<div class='col s12' v-else>
		<div class='text-xs-center'>
			No {{ type ? type : 'item' }} was found.
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				default: _ => []
			},
			type: String
		},
		data: () => ({
			filter: ''
		}),
		computed: {
			filtered () {
				return this.data.filter(e => e.name.toLowerCase().includes(this.filter.toLowerCase()));
			}
		},
		methods: {
			sort () {
				this.data.sort((a, b) => {
					if (a < b) return 1;
					else if (b < a) return -1;
					else return 0;
				});
			},
			props (object) {
				return Object.keys(object)
					.filter(p => p != 'name')
					.map(p => ({
						name: p,
						value: object[p]
					}));
			}
		}
	}
</script>

<style>
	a {
		cursor: pointer;
	}
</style>
