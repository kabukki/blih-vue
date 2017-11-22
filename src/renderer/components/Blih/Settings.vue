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
	</div>
</template>

<script>
	export default {
	}
</script>

<style lang="css">
</style>
