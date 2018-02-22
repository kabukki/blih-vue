<template>
    <div>
        <div :style='style' @click='clickOnFile'>
            <v-icon :style='`color: ${color}`'>{{ icon }}</v-icon> {{ file.name }}
        </div>
        <file-tree v-if='open' v-for='(child, index) in file.children' :key='`file${index}`' :file='child' :depth='depth + 1'></file-tree>
		<dialog-file :name='dialogFile.name' :blob='dialogFile.blob'
			v-model='dialogFile.show' v-if='dialogFile.show'>
		</dialog-file>
    </div>
</template>
<script>
import { getFileLanguage } from '../helpers';

import DialogFile from './Dialogs/DialogFile';

import colors from 'vuetify/es5/util/colors';

export default {
	name: 'file-tree',
	components: { DialogFile },
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
			/* Dialogs */
			dialogFile: {
				show: false,
				name: null,
				blob: null
			},
			/* Data */
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
	methods: {
		clickOnFile () {
			if (this.file.type === 'tree') {
				this.open = !this.open;
			} else if (this.file.type === 'blob') {
				this.dialogFile.name = this.file.name;
				this.dialogFile.blob = this.file.blob;
				this.dialogFile.show = true;
			}
		}
	},
	computed: {
		style () {
			return {
				transform: `translate(${this.depth * 25}px)`,
				cursor: (this.file.type === 'tree' || this.file.type === 'blob') ? 'pointer' : 'auto'
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
