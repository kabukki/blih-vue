<template>
	<v-dialog scrollable :value='value' @input='close'>
		<v-card>
			<v-card-title>
				<div class='title'>{{ name }}</div>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
				<v-container grid-list-md>
					<v-layout row wrap>
						<template v-for='(line, index) in lines'>
							<v-flex xs1 class='text-xs-right secondary--text line-number'>{{ index }}</v-flex>
							<v-flex xs11 class='line-contents'>{{ line }}</v-flex>
						</template>
					</v-layout>
				</v-container>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<div>{{ lines.length }} lines &mdash; {{ size }} bytes</div>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click.stop='close'>Close</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script>
import { Blob } from 'nodegit';

export default {
	props: {
		value: Boolean,
		name: {
			type: String,
			required: true
		},
		blob: {
			type: Blob,
			required: true
		}
	},
	methods: {
		close () {
			this.$emit('input', false);
		}
	},
	computed: {
		lines () {
			return this.blob.toString().split('\n');
		},
		size () {
			return this.blob.rawsize();
		}
	}
};
</script>
<style scoped>
.line-number {
	padding-right: 10px !important;
	border-right: 1px solid #9E9E9E;
	font-family: 'Monaco';
}
/* TODO: use data-attribute with before. Currently does not work because of v-for */
.line-number::before {
	content: attr(data-line-number);
}
.line-contents {
	padding-left: 10px !important;
	padding-right: 10px !important;
	font-family: 'Monaco';
	white-space: pre;
	word-wrap: normal;
	overflow: visible;
	user-select: auto;
}
</style>
