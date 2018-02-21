<template>
  <div>
    <v-icon x-large color='error'>error</v-icon>
    <p class='promo-caption'>Oops!</p>
		<p class='center light'>
			An error occured.<br>
			If you believe this behaviour is not expected, please report it at <a @click.stop="openIssues">github.com/kabukki/blih-vue/issues</a>
		</p>
		<div class='title'>Details</div>
		<p>
			<pre>({{ error.name }}) {{ error.message }}</pre>
		</p>
		<div class='title'>Stack trace</div>
		<p class='text-xs-left'>
			<pre>{{ error.stack }}</pre>
		</p>
  </div>
</template>

<script>
	import { shell } from 'electron';

	export default {
		props: ['error'],
		data () {
			return {
				issuesURL: 'https://github.com/kabukki/blih-vue/issues'
			};
		},
		methods: {
			openIssues () {
				// Open in browser
				shell.openExternal(`${this.issuesURL}/new?title=${this.error.message}`);
			}
		}
	};
</script>

<style scoped lang="css">
	.promo {
	    width: 100%;
	}
	.promo i {
	    margin: 40px 0;
	    color: #ee6e73;
	    font-size: 7rem;
	    display: block;
	}
	.promo-caption {
	    font-size: 1.7rem;
	    font-weight: 500;
	    margin-top: 5px;
	    margin-bottom: 0;
	}
	pre {
		user-select: auto;
	}
</style>
