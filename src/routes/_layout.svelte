<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	export let segment;
</script>

<style>
	main {
		position: relative;
		min-height: 100vh;
		min-height: calc(100vh - 7.5em);
	}
	:global(main > section) {
		margin-top: 5em;
		max-width: 1650px;
        margin: 5em auto 0;
	}
	header {
		position: fixed;
		width: 100%;
		background-color: #fff;
		box-shadow: 0 2px 2px #7d7d7d63;
		z-index: 999;
		top: 0;
	}

</style>


<header>
	<Nav {segment}/>
</header>


<main>
	<slot></slot>
</main>

<Footer />
