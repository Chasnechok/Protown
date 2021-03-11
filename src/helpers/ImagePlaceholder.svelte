<script>
    import { onMount } from 'svelte';
    import { Jumper } from 'svelte-loading-spinners'

    export let url = '';
    export let alt = 'image';
    export let imageWidth = 'unset';
    export let imageHeight = '';
    export let imageMaxWidth = 'unset';
    export let imageMaxHeight = '';
    export let placeholderWidth = '100%';
    export let placeholderHeight = '400px';
    export let styling = '';
    let image, placeholder;
    let loaded = false;

    // $: {
    //     if (loaded) {
    //         image.src = url;
    //     }
    // }

    // onMount(() => {
    //     image.src = url;
    // });
</script>

<style>
    .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
    }
    img {
        z-index: 2;
    }
</style>


<img on:load={()=>{
    loaded = true;
    image.style.cssText = `width: ${imageWidth}; height: ${imageHeight}; max-height: ${imageMaxHeight}; max-width: ${imageMaxWidth};` + styling;
}} src={url} alt="{alt}" bind:this={image} style="width:{imageWidth}; height:{imageHeight}; max-height:{imageMaxHeight}; max-width:{imageMaxWidth};" />

{#if !loaded}
    <slot>
        <div bind:this={placeholder} class="placeholder" style="width: {placeholderWidth}; height: {placeholderHeight};">
            <Jumper color="#6262DB" />
        </div>
    </slot>
{/if}


