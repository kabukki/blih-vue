<template>
	<v-dialog max-width='500px' :value='value' @input='close'>
		<v-form v-model='valid' @submit.prevent='submit'>
			<v-card>
				<v-card-title>
					<slot name="header"></slot>
				</v-card-title>
				<v-card-text>
					<template v-for='(field, key) in fields'>
						<div :is='field.is' :type='field.type' v-model='data[key]'
							:prepend-icon='field.icon'
							:label='field.label' :hint='field.hint'
							:rules='field.rules' :required='field.required' :disabled='loading'
						/>
					</template>
				</v-card-text>
				<v-card-actions>
					<slot name="footer"></slot>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat :disabled='loading' @click.stop='close'>Cancel</v-btn>
					<v-btn color="primary" flat type='submit' :disabled='loading || !valid' :loading='loading' v-if='action'>{{ action }}</v-btn>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script>
	export default {
		props: {
			value: Boolean,
			action: String,
			fields: {
				type: Object,
				default: _ => {},
				required: true
			}
		},
		data () {
			return {
				data: this.fieldsToDefault(),
				loading: false,
				valid: false
			};
		},
		methods: {
			fieldsToDefault () {
				return Object.keys(this.fields)
					.reduce((obj, field) => ({
						...obj,
						[field]: this.fields[field].default
					}), {});
			},
			close () {
				this.$emit('input', false);
			},
			submit () {
				this.loading = true;
				this.$emit('submit', this.data, this.success, this.failure);
			},
			/* Submit callbacks */
			success () {
				this.close();
				this.loading = false;
				this.data = this.fieldsToDefault();
				console.log('ok bye!');
			},
			failure () {
				this.loading = false;
				console.log('too bad');
			}
		},
		created () {
			console.log(this.data);
		}
	};
</script>
