<script>
    export let user;
    export let changeRates;
    export let agentIdentifier;
</script>

<p>Идентификатор агента: {agentIdentifier}</p>
<p>Настройки пока в разработке, вскоре все перечисленное ниже можно будет редактировать</p>
<p>Имя: {user.fullName}</p>
<p>Телефон: {user.mobile}</p>
<p>Пароль: храниться в бд в зашифрованном виде</p>
<p>Курсы, используемые на сайте, обновляются каждые 6 часов автоматически</p>
<p>{JSON.stringify(changeRates, null, 2)}</p>