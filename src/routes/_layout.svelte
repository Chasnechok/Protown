<script>
	import Nav from '../components/Nav.svelte';
	import Footer from '../components/Footer.svelte';
	//export let segment;
</script>

<style>
	main {
		position: relative;
		min-height: calc(100vh - 3em);
		background-color: #fff;
		overflow: hidden;
	}
	:global(main > section) {
		max-width: 1650px;
        margin: 6.5em auto 5em auto;
		position: relative;
	}
	header {
		position: fixed;
		width: 100%;
		background-color: #fff;
		z-index: 999;
		top: 0;
		box-shadow: rgb(0 0 0 / 18%) 0px 1px 12px;
    	border-bottom: rgb(0 0 0 / 18%);
	}
	footer {
        width: 100%;
        background-color: #efefef;
        padding: .5em 0;
    }

</style>


<header>
	<Nav />
</header>


<main>
	<slot></slot>
</main>
<footer>
	<Footer />
</footer>

