<script context="module">
	export async function preload({ params }, session) {
		const esatateId = params.estate && params.estate[1] ? params.estate[1] : params.estate && params.estate[0] ? params.estate[0] : 0;
		const resEstate = await this.fetch(`estates/${esatateId}`);
		const fetchedEstate = await resEstate.json();
		if(!fetchedEstate||fetchedEstate.reason) return this.error(404, "Not found");
		const resRieltor = await this.fetch(`user/${fetchedEstate.agent}`);
		let fetchedRieltor = await resRieltor.json();
		if(!fetchedRieltor) fetchedRieltor = {fullName: "Администратор", mobile: ""};
		const spravce = session&&session.token;
		const resChangeRates = await this.fetch(`/getCourses`);
        const { courses: changeRates } = await resChangeRates.json();
		return { fetchedEstate, fetchedRieltor, spravce, changeRates };
	}
</script>

<script>
	import { Swiper, SwiperSlide } from 'swiper/svelte';
	import SwiperCore, { Navigation, Pagination, Lazy, Autoplay, A11y } from 'swiper';
	import { onMount } from "svelte";
	import { countries1, kyivDistricts, landTypes, flatExtras, flatPlanning, communicationsList } from "../helpers/locations";
	import viewport from "../helpers/useViewPortAction";
	import { currencyOnPage } from "../helpers/parametres";
    import { currencyCalculator, formatPhoneNumber } from "../helpers/converter";
	import 'swiper/swiper-bundle.min.css';
	import { tooltip } from '../helpers/tooltip';
	import dayjs from "dayjs";
	export let spravce = false;
	export let fetchedEstate;
	export let fetchedRieltor;
	export let changeRates;
	const num = new Intl.NumberFormat("en-US");
	$: priceInWords = num.format(currencyCalculator(fetchedEstate.price, $currencyOnPage, fetchedEstate.currency, changeRates));
	const images = fetchedEstate.images && fetchedEstate.images[0] ? fetchedEstate.images.map((el,i) => ({id:i, src:`https://assets.rich-house.online/estates/${fetchedEstate.type}/${fetchedEstate._id}/${el}`})) : undefined;
	const checkForObject = (obj) => {return typeof obj === 'object' && obj !== null && Object.keys(obj).length>0}
	let mountedToDom = false;
	let swiper, imageCarousel;
	onMount(()=>mountedToDom=true)
	//console.log(fetchedEstate.adress);
    
	SwiperCore.use([Navigation, Pagination, Lazy, Autoplay, A11y]);
</script>

<style>
	.estate-label {
		margin: 0 auto;
		display: flex;
		box-shadow: 0 1px #888888;
	}
	.estate-label h2 {
		padding: 1em 0 0 0;
		margin: 0;
		color: black;
	}

	.estate-content-wrapper {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
		flex-direction: column;
	}
	.estate-content-wrapper > * {
		width: 100%;
	}
	.image-carousel {
		margin: 2em 0;
		--swiper-theme-color: #6262DB;
		/* --swiper-navigation-color: #333; */
		position: relative;
		max-width: 50%;
    	flex: 1 1 50%;
		border-radius: 8px;
    	background-color: white;
    	overflow: hidden;	
		transition: .7s;
		margin-right: 2em;
	}
	.estate-wrapper::before {
		content: "";
    	display: block;
    	position: absolute;
    	width: 200vw;
    	left: -100vw;
    	top: 50%;
    	transform: translateY(-50%);
    	height: 100%;
    	z-index: 0;
    	background-color: #efefef;
	}
	:global(.image-carousel .swiper-button-prev, .image-carousel .swiper-button-next) {
		opacity: 0;
		transition: .3s;
	}
	:global(.image-carousel:hover .swiper-button-prev, .image-carousel:hover .swiper-button-next) {
		opacity: 1;
	}
	.estate-image-lazy:not(div) {
		max-height: 500px;
    	max-width: 100%;
    	display: block;
    	border-radius: 8px;
		object-fit: cover;
		margin: auto;
	}
	.image-wrapper {
		padding: 2em;
    	background-color: white;
    	border-radius: 8px;
	}
	.estate-wrapper {
		display: flex;
    	flex-wrap: wrap;
		position: relative;
		justify-content: center;
	}
	.estate-info-wrapper > *:not(:first-child) {
		margin-top: 1.5em;
	}

	.estate-info-wrapper {
		background-color: transparent;
		flex: 0 1 47%;
		z-index: 1;
		display: flex;
		flex-direction: column;
		margin: 2em 0;
		max-width: 47%;
	}
	.estate-info {
		min-height: 10vh;
		padding: 1em;
    	background-color: white;
    	border-radius: 8px;
    	box-shadow: rgb(0 0 0 / 10%) 0px 1px 8px;
	}
	.h-wrapper {
    	display: inline-flex;
    	flex-direction: column;
    	margin: 0 auto;
		padding: 0 8px;
	}
	.type-deal-prop {
		margin-bottom: 1em;
		color: #888888;
		display: flex;
		flex-wrap: wrap;
	}
	.type-deal-prop > span:not(:last-child) {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.type-deal-prop > span:not(:last-child)::after{
		content: "";
		display: block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #888888;
		margin: 0 .7em;
	}
	.estate-price {
		padding: 1em;
		background-color: white;
		border-radius: 8px;
    	box-shadow: rgb(0 0 0 / 10%) 0px 1px 8px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}
	.estate-price.crossed > span.crossed {
		text-decoration: line-through;
	}
	.estate-price .price-realised {
		flex: 1 1 100%;
    	text-align: center;
	}
	.estate-price .price {
		color: black;
    	font-weight: 500;
    	font-size: 18px;
    	letter-spacing: 3px;
	}
	.extras-scroll-wrapper {
		display: flex;
		flex-wrap: wrap;
		overflow: auto;
		justify-content: center;
	}
	.extras-scroll-wrapper > * {
		margin: 0 .75em;
	}
	.extra-icon {
		background-size: contain;
		width: 40px;
		height: 40px;
	}
	.estate-info fieldset {
		opacity: 0;
		border-left: none;
    	border-bottom: none;
    	border-right: none;
    	border-top: 1px solid #888888;
		max-width: 400px;
		margin: 0 auto;
		transition: 1s;
		margin-top: 1em;
	}
	:global(.estate-info fieldset.inView) {
		opacity: 1 !important;
	}
	.estate-info fieldset legend {
		margin: 0 auto;
		padding: 0 2em;
	}
	.area-poperties, .estate-detailed-poperties {
		margin-top: .5em;
	}
	.estate-location-prop, .area-prop, .estate-detailed-prop {
    	display: flex;
    	margin: 0 auto;
    	align-items: baseline;
    	margin-top: 8px;
    	line-height: 19px;
	}
	span.label {
    	color: #888888;
    	margin-right: 5em;
    	flex: 1;
    	text-align: end;
	}
	span.value {
    	flex: 1;
		color: black;
	}
	.estate-comment-field {
    	flex: 1;
    	box-shadow: inset rgb(0 0 0 / 10%) 0px 1px 8px;
    	background-color: #fbfbfb;
    	max-width: 700px;
    	margin: 2em 1em;
    	border-radius: 8px;
		border: 1px solid rgb(221, 221, 221);
	}
	.estate-comment-field legend {
		padding: 0 1em;
    	z-index: 3;
    	background-color: white;
    	box-shadow: rgb(0 0 0 / 10%) 0px 1px 8px;
    	border-radius: 8px;
    	margin: 0 auto;
		border: 1px solid rgb(221, 221, 221);
	}
	.legend-content-wrapper {
		display: flex;
    	align-items: center;
		text-decoration: none;
		display: flex;
	}
	.estate-comment-field .avatar {
		width: 100px;
    	height: 100px;
    	background-size: contain;
    	background-repeat: no-repeat;
    	background-position: center;
	}
	.estate-comment-field .rieltor > span {
		display: block;
	}
	.estate-comment-field .rieltor > span:first-child {
		color: black;
	}
	.comment-wrapper {
		text-align: center;
		padding: 2em;
	}
	span.comment {
		line-height: 34px;
		letter-spacing: 1px;
	}
	.estate-comment-section {
		display: flex;
		flex-wrap: wrap-reverse;
		justify-content: center;
	}
	.email {
		font-size: 14px;
	}
	@media only screen and (max-width: 1650px) {
		.estate-wrapper {
			padding: 0 2em;
		}
	}
	@media only screen and (max-width: 1132px) {
		.image-carousel, .estate-info-wrapper {
			max-width: unset;
			margin-right: 0 !important;
		}
		.estate-info-wrapper {
			margin: 0 0 2em 0;
			flex: 1 1 100%;
		}
		.estate-image-lazy {
			max-height: 400px !important;
		}
	}
	@media only screen and (max-width: 580px) {
		.estate-wrapper {
			padding: 0;
		}
		.comment-wrapper {
			padding: 1em;
		}
		.estate-wrapper > *, .estate-info-wrapper > *{
			border-radius: 0;
		}
		.image-wrapper {
			padding: 1em .5em;
		}
		legend {
			padding: 0 0.5em;
		}
	}
	@media only screen and (max-width: 364px) {
		legend, .email {
			font-size: 12px;
		}
	}

</style>

<svelte:head>
	<title>{fetchedEstate.label}</title>
</svelte:head>

<section>
	
	<div class="estate-content-wrapper">
		<div class="estate-label">
			<div class="h-wrapper">
				<h2>{fetchedEstate.label && fetchedEstate.label}</h2>
				<div class="type-deal-prop">
					{#if fetchedEstate.type}
					<span>{fetchedEstate.type==="flat"?"Квартира":fetchedEstate.type==="house"?"Дом":fetchedEstate.type==="commersion"?"Коммерция":"Участок"}</span>
					{/if}
					{#if fetchedEstate.deal}
					<span>{fetchedEstate.deal==="buy"?"Продажа":"Аренда"}</span>
					{/if}
					{#if fetchedEstate.details.state!==undefined}
					<span>{fetchedEstate.details.state?fetchedEstate.type==="flat"||fetchedEstate.type==="commersion"?"Новая":"Новый":"Вторичка"}</span>
					{/if}
					{#if fetchedEstate.type && (fetchedEstate.type==="flat"||fetchedEstate.type==="commersion") && fetchedEstate.details.fond!==undefined}
					<span>{fetchedEstate.details.fond?"Жилой фонд":"Нежилой фонд"}</span>
					{/if}
				</div>
				{#if spravce}
				<div style="position: absolute;">
					<a target="_blank" rel="noopener" href="/adminka?mode=edit&id={fetchedEstate._id}">Редактировать объявление</a>
				</div>
				{/if}
			</div>
		</div>
		<div class="estate-wrapper">

			{#if mountedToDom && images && images.length === fetchedEstate.images.length}
			<div class="image-carousel" bind:this={imageCarousel} >
				<Swiper
					spaceBetween={10}
					slidesPerView={1}
					navigation
					speed={700}
					grabCursor
					a11y={{
						containerMessage: "Секция с изображениями объекта",
						firstSlideMessage: "Первое изображение",
						lastSlideMessage: "Последнее изображение",
						nextSlideMessage: "Следующее изображение",
						prevSlideMessage: "Предыдущее изображение",
						paginationBulletMessage: "Изменить слайд с изображением"

					}}
					freeMode
					freeModeSticky
					freeModeMomentumRatio={0.5}
					autoplay={{delay: 8000}}
					pagination={{ clickable: true, dynamicBullets: true }}
					lazy={{	
							loadPrevNext: true, elementClass: "estate-image-lazy",
							loadedClass: "estate-image-lazy-loaded", loadingClass: "estate-image-lazy-loading", preloaderClass: "estate-image-lazy-preloader"
						}}
					on:swiper={({detail}) => {swiper = detail[0]; if(imageCarousel)imageCarousel.style="display: flex; align-items: center;"}}
				>
					{#each images as estateImage}
					<SwiperSlide>
						<div class="image-wrapper">
							<img on:contextmenu|preventDefault data-src="{estateImage.src}" alt="{fetchedEstate.type&&fetchedEstate.type} image #{estateImage.id}" class="estate-image-lazy" />
						</div>
						<div class="estate-image-lazy-preloader"></div>
					</SwiperSlide>
					{/each}
				</Swiper>
			</div>
			{/if}
						
			<div style={images?!swiper?"opacity: 0;":"":""} class="estate-info-wrapper">
				<div class="estate-price" class:crossed={fetchedEstate.realised&&(isNaN(Date.parse(fetchedEstate.realised))||dayjs(fetchedEstate.realised).isAfter(dayjs()))} title={priceInWords}>
					<span class="price crossed">{currencyCalculator(fetchedEstate.price, $currencyOnPage, fetchedEstate.currency, changeRates)}</span><span class="price-currency crossed">&nbsp{$currencyOnPage === "USD" ? "$" : $currencyOnPage === "EUR" ? "€" : "₴"}{fetchedEstate.deal === "lease" ? " / месяц" : ""}</span>
					{#if !fetchedEstate.extras.fee}<span class="crossed">&nbspбез комиссии</span>{/if}
					{#if fetchedEstate.realised&&(isNaN(Date.parse(fetchedEstate.realised))||dayjs(fetchedEstate.realised).isAfter(dayjs()))}
					<span class="price-realised">{fetchedEstate.type==="flat"?"Квартира":fetchedEstate.type==="house"?"Дом":fetchedEstate.type==="commersion"?"Недвижимость":"Участок"}
					&nbsp;{fetchedEstate.type==="flat"||fetchedEstate.type==="commersion"?"сдана":"сдан"}{!isNaN(Date.parse(fetchedEstate.realised))?
						` до ${dayjs(fetchedEstate.realised).format('DD/MM/YYYY')}`:
						"."} 
					</span>
					{/if}
				</div>
				{#if fetchedEstate.extras.included&&fetchedEstate.extras.included[0]&&fetchedEstate.type!=="land"}
				<div class="extras-scroll-wrapper">
					{#each fetchedEstate.extras.included as extra}
						<div title={flatExtras.find(el=>el.value===extra)?flatExtras.find(el=>el.value===extra).label : extra==="hoz"?"Хоз. постройки" : extra==="bas"? "Бассейн":"Бог знает что"} use:tooltip class="extra-icon" style="background-image: url(https://assets.rich-house.online/extras-icos/{extra}.svg)" />
					{/each}
				</div>
				{/if}
				{#if fetchedEstate.details.communications&&fetchedEstate.details.communications[0]&&(fetchedEstate.type==="land"||fetchedEstate.type==="house")}
				<div class="extras-scroll-wrapper communications">
					{#each fetchedEstate.details.communications as extra}
						<div title={communicationsList.find(el=>el.value===extra)?.label} use:tooltip class="extra-icon" style="background-image: url(https://assets.rich-house.online/communications-icons/{extra}.svg)" />
					{/each}
				</div>
				{/if}
				<div class="estate-info">
					{#if fetchedEstate.details.area&&checkForObject(fetchedEstate.details.area)}
					<fieldset class="area-field" use:viewport on:enterViewport={({target}) => !target.className.includes("inView") ? target.className += " inView" : null} >
						<legend>Площадь</legend>
						<div class="area-poperties">
							{#each Object.keys(fetchedEstate.details.area) as areaProp}
								<div class="area-prop">
									<span class="label">{areaProp === "g"?"Общая":areaProp === "l"?"Жилая":areaProp === "whole"? "Участок":"Кухня"}</span>
									<span class="value">{fetchedEstate.details.area[areaProp]}{#if areaProp!=="whole"}м<sup>2</sup> {:else}&nbspсоток{/if}</span>
								</div>
							{/each}
						</div>
					</fieldset>
					{/if}
					{#if fetchedEstate.type && (fetchedEstate.details.floor || fetchedEstate.details.rooms || fetchedEstate.details.gfloor || fetchedEstate.details.sillings || fetchedEstate.details.purpose)}
					<fieldset class="estate-detailed-field" use:viewport on:enterViewport={({target}) => !target.className.includes("inView") ? target.className += " inView" : null} >
						<legend>{fetchedEstate.type==="flat"?"О квартире":fetchedEstate.type==="house"?"О доме":fetchedEstate.type==="commersion"?"О недвижимости":"Об участке"}</legend>
						<div class="estate-detailed-poperties">
							{#if fetchedEstate.details.floor || fetchedEstate.details.gfloor}
								<div class="estate-detailed-prop">
									<span class="label">{!fetchedEstate.details.floor && fetchedEstate.details.gfloor? "Этажность" : "Этаж"}</span>
									<span class="value">
										{fetchedEstate.details.floor && fetchedEstate.details.gfloor ? fetchedEstate.details.floor + " / " + fetchedEstate.details.gfloor :
										fetchedEstate.details.floor ? fetchedEstate.details.floor : fetchedEstate.details.gfloor ? fetchedEstate.details.gfloor : "не указано"
										}
									</span>
								</div>
							{/if}
							{#if fetchedEstate.details.rooms}
							<div class="estate-detailed-prop">
								<span class="label">Комнат</span><span class="value">{fetchedEstate.details.rooms}</span>
							</div>
							{/if}
							{#if fetchedEstate.details.sillings}
								<div class="estate-detailed-prop">
									<span class="label">Высота потолков</span><span class="value">{fetchedEstate.details.sillings}м</span>
								</div>
							{/if}
							{#if fetchedEstate.details.purpose}
								<div class="estate-detailed-prop">
									<span class="label">Назначение</span><span class="value">{landTypes.find(el=>el.value===fetchedEstate.details.purpose)?.label}</span>
								</div>
							{/if}
							{#if fetchedEstate.details.planning}
								<div class="estate-detailed-prop">
									<span class="label">Планировка</span><span class="value">{[{value: "open", label: "Открытого типа"}, {value: "close", label: "Закрытого типа"}, ...flatPlanning].find(el=>el.value===fetchedEstate.details.planning)?.label}</span>
								</div>
							{/if}
							{#if fetchedEstate.type==="land"}
            				<div class="estate-detailed-prop">
                				<span class="label">{fetchedEstate.deal==="lease"?"Аренда":"Покупка"}&nbsp;частями</span>
                				<span class="value">{fetchedEstate.details.partly?"Да":"Нет"}</span>
            				</div>
            				{/if}
						</div>
					</fieldset>
					{/if}
					<fieldset class="estate-location-field" use:viewport on:enterViewport={({target}) => !target.className.includes("inView") ? target.className += " inView" : null}>
						<legend>Расположение</legend>
						{#if fetchedEstate.adress.country}
						<div class="estate-location-prop">
							<span class="label">Страна</span><span class="value">{countries1.find(el=>el.value===fetchedEstate.adress.country)?.label}</span>
						</div>
						{/if}
						{#if fetchedEstate.adress.city && checkForObject(fetchedEstate.adress.city)}
						<div class="estate-location-prop">
							<span class="label">Город</span><span class="value">{fetchedEstate.adress.city.ru?fetchedEstate.adress.city.ru:fetchedEstate.adress.city[Object.keys(fetchedEstate.adress.city)[0]]}</span>
						</div>
						{/if}
						{#if fetchedEstate.adress.district}
						<div class="estate-location-prop">
							<span class="label">Район</span><span class="value">{kyivDistricts.find(el=>el.value===fetchedEstate.adress.district)?.label}</span>
						</div>
						{/if}
						{#if fetchedEstate.adress.street && checkForObject(fetchedEstate.adress.street)}
						<div class="estate-location-prop">
							<span class="label">Улица</span><span class="value">{fetchedEstate.adress.street.ru?fetchedEstate.adress.street.ru:fetchedEstate.adress.street[Object.keys(fetchedEstate.adress.street)[0]]}{fetchedEstate.adress.estateNumber?`, ${fetchedEstate.adress.estateNumber}`:""}</span>
						</div>
						{/if}
						{#if fetchedEstate.adress.zk && checkForObject(fetchedEstate.adress.zk)}
						<div class="estate-location-prop">
							<span class="label">Ж/К</span><span class="value">{fetchedEstate.adress.zk.ru?fetchedEstate.adress.zk.ru:fetchedEstate.adress.zk[Object.keys(fetchedEstate.adress.zk)[0]]}</span>
						</div>
						{/if}
						{#if fetchedEstate.adress.metro && checkForObject(fetchedEstate.adress.metro)}
						<div class="estate-location-prop">
							<span class="label">Метро</span><span class="value">{fetchedEstate.adress.metro.ru?fetchedEstate.adress.metro.ru:fetchedEstate.adress.metro[Object.keys(fetchedEstate.adress.metro)[0]]}{fetchedEstate.adress.metro.distance?` в ${fetchedEstate.adress.metro.distance} метрах`:""}</span>
						</div>
						{/if}
					</fieldset>
				</div>
			</div>
		</div>
		{#if fetchedEstate.extras.comment && checkForObject(fetchedEstate.extras.comment)}
			<section class="estate-comment-section" use:viewport on:enterViewport={({target}) => !target.className.includes("inView") ? target.className += " inView" : null}>
				<fieldset class="estate-comment-field">
					<legend>
						<a href="/contact" target="_blank" class="legend-content-wrapper">
							<div class="avatar" style="background-image: url(https://assets.rich-house.online/avatars/default_min.jpg);" />
							<div class="rieltor">
								<span>Комментарий риелтора</span>
								<span>{fetchedRieltor.fullName}, {formatPhoneNumber(fetchedRieltor.mobile)}</span>
								<span class="email">{fetchedEstate.agent==="MAR"?"marina@rich-house.online":"irina@rich-house.online"}</span>
							</div>
						</a>
					</legend>
					<div class="comment-wrapper">
						<span class="comment">{fetchedEstate.extras.comment.ru?fetchedEstate.extras.comment.ru:fetchedEstate.extras.comment[Object.keys(fetchedEstate.extras.comment)[0]]}</span>
					</div>
				</fieldset>
				{#if fetchedEstate.note}
				<fieldset class="estate-comment-field">
					<legend style="padding: 0 1em 0 0 !important;">
						<div class="legend-content-wrapper">
							<div class="avatar" style="display: flex;">
								<svg style="width: 50px;height: 50px;margin: auto;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
								</svg>
							</div>
							<div class="rieltor">
								<span>Ваша личная заметка</span>
							</div>
						</div>
					</legend>
					<div class="comment-wrapper">
						<span class="comment">{fetchedEstate.note}</span>
					</div>
				</fieldset>
				{/if}
			</section>
		{/if}
	</div>
</section>
