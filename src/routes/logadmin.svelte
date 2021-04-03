<script context="module">
	export async function preload(page, session) {
		const { agentIdentifier } = session;
        if(agentIdentifier) {
            return this.redirect(302, 'adminka');
        }
	}
</script>

<script>
    import LoginForm from "../components/AdminPanel/LoginForm.svelte";
</script>
<svelte:head>
	<title>Admin login 🤫</title>
</svelte:head>
<LoginForm />