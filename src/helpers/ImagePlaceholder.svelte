<script>
    import { onMount } from 'svelte';
    import { Jumper } from 'svelte-loading-spinners'

    export let url = '';
    export let imageIndex;
    export let alt = 'image';
    export let imageWidth = 'unset';
    export let imageHeight = '';
    export let imageMaxWidth = 'unset';
    export let imageMaxHeight = '';
    export let placeholderWidth = '100%';
    export let placeholderHeight = '270px';
    export let styling = '';
    export let currentSlide = 0; 
    let image;
    let mounted = false;
    $: if(mounted&&!image.src&&(currentSlide == imageIndex || currentSlide == imageIndex - 1 || currentSlide == imageIndex + 1)){
        image.style.cssText = `width:${imageWidth}; height:${imageHeight}; max-height:${imageMaxHeight}; max-width:${imageMaxWidth};` + styling;
        image.src = url;
        delete image["data-src"];
    }
    onMount(()=>mounted=true)
</script>

<style>
    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: -1;
    }
    img {
        z-index: 2;
    }
</style>

<img data-src={url} alt="{alt}" style="display: none;" bind:this={image} >
{#if !image || !image.src}
<div class="placeholder" style="width: {placeholderWidth}; height: {placeholderHeight};">
    <Jumper color="#6262DB" />
</div>
{/if}


