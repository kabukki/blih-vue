<template>
	<v-app>
		<v-content>
			<v-container fill-height fluid id='welcome'>
			    <v-layout row align-center>
					<v-flex class='text-xs-center'>
						<div class='display-3 white--text wide-letters'>BLIH</div>
						<div class='subheading white--text'>Bocal Lightweight Interface for Humans</div>
						<v-btn round large color='primary' :to="{name: 'login'}">Get started</v-btn>
					</v-flex>
			    </v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	export default {
	}
</script>

<style lang="css">
	.wide-letters {
	    letter-spacing: 50px !important;
	    /* Fix for letter-spacing center alignment */
	    text-indent: 50px;
	}

	#welcome {
		min-height: 100vh;
	    background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
	    background-size: 400% 400%;
	    animation: GradientAnimation 15s ease infinite;
	}

	@keyframes GradientAnimation {
	    0% { background-position:0% 50% }
	    50% { background-position:100% 50% }
	    100% { background-position:0% 50% }
	}

</style>
