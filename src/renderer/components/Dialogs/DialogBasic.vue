<template>
	<v-dialog :scrollable='scrollable' max-width='500px' :value='value' @input='close'>
		<v-card>
			<v-card-title>
				<slot name="header"></slot>
			</v-card-title>
			<v-divider v-show='scrollable'></v-divider>
			<v-card-text>
				<slot></slot>
			</v-card-text>
			<v-divider v-show='scrollable'></v-divider>
			<v-card-actions>
				<slot name="footer"></slot>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat :disabled='loading' @click.stop='close'>{{ closeText }}</v-btn>
				<v-btn color="primary" flat :disabled='loading' @click.stop='submit' :loading='loading' v-if='action'>{{ action }}</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
	  props: {
	    value: Boolean,
	    action: String,
	    scrollable: Boolean
	  },
	  data () {
	    return {
	      loading: false
	    };
	  },
	  methods: {
	    close () {
	      this.$emit('input', false);
	    },
	    submit () {
	      this.loading = true;
	      this.$emit('submit', this.success, this.failure);
	    },
	    /* Submit callbacks */
	    success () {
	      this.close();
	      this.loading = false;
	      console.log('ok bye!');
	    },
	    failure () {
	      this.loading = false;
	      console.log('too bad');
	    }
	  },
	  computed: {
	    closeText () {
	      return this.action ? 'Cancel' : 'Close';
	    }
	  }
	};
</script>
