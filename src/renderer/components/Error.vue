<template>
    <div>
        <v-icon x-large color='error'>error</v-icon>
        <p class='promo-caption'>Oops!</p>
		<p class='center light mb-0'>An error occurred: {{ message }}</p>
		<p class='center light mb-0' v-if='description'>
			<b>Details:</b><br>
			<pre>{{ description }}</pre>
		</p>
    </div>
</template>

<script>
	export default {
	  props: ['message', 'description']
	};
</script>

<style lang="css">
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
</style>
