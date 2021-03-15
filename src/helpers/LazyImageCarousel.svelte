<script>
    import { onMount } from 'svelte';
    import { Jumper } from 'svelte-loading-spinners'
    export let url = '';
    export let imageIndex;
    export let alt = 'image';
    export let placeholderWidth = '100%';
    export let placeholderHeight = '270px';
    export let styling = '';
    export let currentSlide = 0; 
    let image;
    let mounted = false;
    let imageCashed = false;
    onMount(()=>mounted=true);
    $: if(mounted&&image&&!image.src&&(currentSlide == imageIndex || currentSlide == imageIndex - 1 || currentSlide == imageIndex + 1)) {
        image.src = image.dataset.src;
        delete image.dataset.src;
    }
</script>

<style>
    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: -1;
        position: absolute;
        top: 0;
    }
    img {
        z-index: 0;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
{#if mounted}
    <img data-width="100%" data-height="270px" on:load={()=>imageCashed = true} data-src={url} alt="{alt}" style="{styling}" bind:this={image} />
    {#if !imageCashed}
    <div class="placeholder" style="width: {placeholderWidth}; height: {placeholderHeight};">
        <Jumper color="#6262DB" />
    </div>
    {/if}
{/if}