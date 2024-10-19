<script>
  const year = new Date().getFullYear()
</script>

<div class="footer-content">
  <a href="https://www.country.ua/" target="_blank" class="country-ua-link"
    ><img
      src="https://www.country.ua/img/logo.svg"
      height="25"
      border="0"
      alt="country.ua"
    /></a
  >
  <span>© {year} Все права защищены.</span>
</div>

<style>
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #7d7d7d;
  }
  .country-ua-link {
    padding: 5px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 3px;
    display: flex;
  }
</style>
