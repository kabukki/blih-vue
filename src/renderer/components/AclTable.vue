<template>
	<table v-if="acl.length > 0">
		<thead>
			<tr>
				<th>Name</th>
				<th>Rights</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for='collaborator in acl'>
				<td>{{ collaborator.name }}</td>
				<td>{{ collaborator.rights }}</td>
			</tr>
		</tbody>
	</table>
	<p class='flow-text' v-else>
		No ACL is set for this repository.
	</p>
</template>

<script>
	export default {
		props: ['acl']
	}
</script>
