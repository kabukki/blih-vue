<template>
	<div class='container'>
		<div class='row'>
		    <div class='col s12'>
		        <h1 class='teal-text center-aligned'>Settings</h1>
		    </div>
		</div>
		<div class='row'>
		    <div class='col s12'>
		        <h4>Welcome page</h4>
		        <div class='divider'></div>
		    </div>
		</div>
		<div class='row setting-row'>
		    <div class='col s3'>
		        <div class='switch'>
		            <label>
		                Off<input type='checkbox' ng-model='welcome'/><span class='lever'></span>On
		            </label>
		        </div>
		    </div>
		    <div class='col s9'>
		        <span class='flow-text'>Show welcome page on startup</span>
		    </div>
		</div>
		<div class='row'>
		    <div class='col s12 center'>
		        <a class='waves-effect waves-light btn' ng-click='save()'><i class='material-icons left'>check</i>Save changes</a>
		    </div>
		</div>
		<v-radio-group v-model='theme'>
			<v-radio label='Light' value='light'></v-radio>
			<v-radio label='Dark' value='dark'></v-radio>
		</v-radio-group>
	</div>
</template>

<script>
	export default {
		computed: {
			theme: {
				get () {
					return this.$store.state.theme;
				},
				set (theme) {
					this.$store.dispatch('setTheme', theme);
				}
			}
		}
	}
</script>

<style lang="css">
</style>
