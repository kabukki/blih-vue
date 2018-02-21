<template>
    <div>
        <div :style='style' @click='open = !open'>
            <v-icon :style='`color: ${color}`'>{{ icon }}</v-icon> {{ file.name }}
        </div>
        <file-tree v-if='open' v-for='(child, index) in file.children' :key='`file${index}`' :file='child' :depth='depth + 1'></file-tree>
    </div>
</template>
<script>
import colors from 'vuetify/es5/util/colors';

import { getFileLanguage } from '../helpers';

export default {
	name: 'file-tree',
	props: {
		file: {
			type: Object,
			required: true
		},
		depth: {
			type: Number,
			default: 0
		}
	},
	data () {
		return {
			open: false,
			language: null,
			typeIcons: {
				data: 'description',
				markup: 'code',
				programming: 'code',
				prose: 'description'
			}
		};
	},
	computed: {
		style () {
			return {
				transform: `translate(${this.depth * 25}px)`,
				cursor: this.file.children ? 'pointer' : 'auto'
			};
		},
		color () {
			const blobColor = (this.language && this.language.color) ? this.language.color : colors.grey.lighten1;
			switch (this.file.type) {
				case 'unreadable': return colors.red.base;
				case 'tree': return colors.blue.base;
				case 'blob': return blobColor;
				case 'executable': return colors.green.base;
				case 'link': return colors.teal.base;
				case 'commit': return colors.orange.base;
				default: return colors.grey.lighten1;
			}
		},
		icon () {
			const blobIcon = (this.language && this.language.type) ? this.typeIcons[this.language.type] : 'insert_drive_file';
			switch (this.file.type) {
				case 'unreadable': return 'clear';
				case 'tree': return this.open ? 'folder_open' : 'folder';
				case 'blob': return blobIcon;
				case 'executable': return 'settings';
				case 'link': return 'insert_link';
				case 'commit': return 'check';
				default: return 'help';
			}
		}
	},
	created () {
		this.language = getFileLanguage(this.file.name);
	}
};
</script>
