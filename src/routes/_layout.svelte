<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	export let segment;
</script>

<style>
	main {
		position: relative;
		min-height: calc(100vh - 7.5em);
		background-color: var(--main-bg);
		box-shadow: 0 -100px var(--main-bg);
		overflow: hidden;
		min-height: 95vh;
	}
	:global(main > section) {
		max-width: 1650px;
        margin: 6.5em auto 5em auto;
	}
	header {
		position: fixed;
		width: 100%;
		background-color: #fff;
		z-index: 999;
		top: 0;
		box-shadow: rgb(0 0 0 / 8%) 0px 1px 12px;
	}
	footer {
        width: 100%;
        background-color: #efefef;
        padding: .5em 0;
    }

</style>


<header>
	<Nav {segment}/>
</header>


<main style={!segment&&2==1 ? "--main-bg: #efefef;" : "--main-bg: #fff;"}>
	<slot></slot>
</main>
<footer>
	<Footer />
</footer>

