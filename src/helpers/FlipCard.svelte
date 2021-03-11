<script>
	let flipped = false
	
	function turn(node, {
		delay = 0,
		duration = 500
	}) {
		return {
			delay,
			duration,
			css: (t, u) => `
				transform: rotateY(${1 - (u * 180)}deg);
				opacity: ${1 - u};
			`
		};
  }
  
  export function flip () {
    flipped = !flipped
  }
</script>

<style>
	.card-container {
		position: relative;
		height: 100%;
		width: 100%;
		display: flex;
    	justify-content: center;
	}
	
	.card {
		height: 100%; 
		width: 100%;
		/* position: fixed;*/
		perspective: 600;
	}
	
	.side {
		position: absolute;
		height: 100%;
		width: 100%;
		overflow: hidden;
		color: #fff;
		display: flex;
		justify-content: center;
		/*align-items: center;*/
	}
</style>

<div class="card-container">
	<div class="card">
		{#if flipped}
		<div class="side" transition:turn>
			<slot name="front"></slot>
		</div>
		{:else}
		<div class="side back" transition:turn>
			<slot name="back"></slot>
		</div>
		{/if}
	</div>
</div>