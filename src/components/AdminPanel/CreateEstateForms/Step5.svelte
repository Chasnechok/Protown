<script>
    import DragDropList from "svelte-dragdroplist";
    import Compressor from 'compressorjs';
    import Dropzone from "svelte-file-dropzone";
    import { ArrowDownIcon, ArrowUpIcon } from "svelte-feather-icons";
    export let images, carousel, createNewEstate;
    let expanded = false;

    const handleLoadImages = (imgs) => {
        Object.keys(imgs).map(async (img, i, arr) => {
        new Compressor(imgs[img], {
					quality: 0.7,
					convertSize: 100000,
					mimeType: "image/jpg",
					maxWidth: 1920,
					maxHeight: 1080,
					drew(context, canvas) {
						context.fillStyle = 'rgb(255,255,255, 0.9)';
						context.font = '1rem serif';
						context.fillText('Rich-House.net', 20, canvas.height - 20);
					}, 
					success(result) {
                        images = [{id: result.lastModified, image: result, html: `<img width="250px" style="display: block;padding: 0 1.6em;" height="200px" src=${URL.createObjectURL(result)} alt=${result.lastModified} />` }, ...images]
					},
					error(err) {
					console.log(err.message);
					}
				});
      })
    }
</script>

<style>
    .fifth-step{
        justify-content: space-between;
    }
    
    .prev-button, .next-button {
        position: relative !important;
    }
    .fifth-step :global(.dropzone > p){
        display: none;
    }
    .fifth-step :global(.dropzone.nocontent::after){
        content: "Перетащите сюда изображения объекта или кликнете что бы выбрать"
    }
    .fifth-step :global(.dropzone.hascontent::after){
        content: "Можете добавить еще изображений"
    }
    .fifth-step :global(.dropzone:focus){
        border-color: rgb(98, 98, 219, 0.7);
    }
    .images-wrapper{
        display: none;
        opacity: 0;
        visibility: hidden;
    }
    .images-wrapper :global(.item){
        border-radius: 10px;
    }
    .images-wrapper :global(.item .buttons){
        z-index: 10;
    }
    .reorganize {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        color: white;
        background-color: rgb(127, 127, 226);
    }
    .reorganize:hover{
        cursor: pointer;
    }
    .reorganize.expanded{
     border-radius: 10px 10px 0 0;
    }
    .images-wrapper.expanded{
        display: flex;
        justify-content: center;
        padding: 2em 0;
        border-radius: 0 0 1em 1em;
        background-color: #e5e5e5;
        visibility: visible;
        opacity: 1;
    }


</style>

<div class="fifth-step step">
    <div style={`flex: ${!images[0] ? "3": "0"};display: ${!images[0] ? "flex;": "block;"};`}>
        <div class="prop" style={`flex: ${!images[0] ? "1": "0"}`}>
            <span class="prop-header" style="margin-bottom: .5em;">Загрузите изображения</span>
            <Dropzone containerClasses={images[0] ? "hascontent" : "nocontent"} on:drop={({detail: {acceptedFiles: imgs}})=> handleLoadImages(imgs)} accept="image/*" />
        </div>
    
        {#if images[0]}
        <div class="reorganize" on:click={()=> expanded = !expanded} class:expanded>
            <span>Реорганизуйте {images.length} {images.length ==1 ? "загруженное" : "загруженных"} 
                {images.length == 1 ? "изображение" : images.length <= 4 ? "изображения" : "изображений"}
            </span>
            {#if !expanded}
            <ArrowDownIcon size="24" />
            {:else}
            <ArrowUpIcon size="24" />
            {/if}
        </div>
        <div class="images-wrapper" class:expanded>
            <DragDropList removesItems bind:data={images} />
        </div>
        {/if}
    </div>
    
    <div class="controls">
        <div class="prev-button" on:click={()=> {expanded = false;carousel.go(3)}}>
            <span>Предыдущий шаг</span>
        </div>
        <div class="next-button" on:click={()=> {createNewEstate()}}>
            <span>Создать объявление</span>
        </div>
    </div>
    
</div>