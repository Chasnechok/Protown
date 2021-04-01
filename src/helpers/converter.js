

export const blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) : Math.sign(num)*Math.abs(num)
}
export const formatPhoneNumber = (phoneNumberString) => {
    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]+ '-' + match[4];
    }
    return null;
  }

export const currencyCalculator = (price, ccy, base_ccy, currencyRates) => {
    //console.log(base_ccy, "TO", ccy);
    if(base_ccy === ccy || !currencyRates) return price;
    if(base_ccy === "UAH"){
        return Math.round((price / currencyRates.filter(el=>el.ccy === ccy)[0].sale).toFixed(2))
    } else {
        return ccy === "UAH" ? Math.round((price * currencyRates.filter(el=>el.ccy === base_ccy)[0].buy).toFixed(2)) : Math.round((price * currencyRates.filter(el=>el.ccy === base_ccy)[0].buy / currencyRates.filter(el=>el.ccy === ccy)[0].sale).toFixed(2))
    }
    
}

export const createBlankEstate = () => {
    return {
        label: undefined,
        type: 'flat',
        deal: 'buy',
        price: undefined,
        realised: false,
        currency: "UAH",
        adress: {
            country: "UA",
            city: {
                ru: undefined,
                ua: undefined,
                en: undefined
            },
            district: undefined,
            street: {
                ru: undefined,
                ua: undefined,
                en: undefined
            },
            estateNumber: undefined,
            metro: {
                ru: undefined,
                ua: undefined,
                en: undefined,
                distance: undefined
            },
            // жилой комплекс
            zk: {
                ru: undefined,
                ua: undefined,
                en: undefined
            }
        },
        details: {
            floor: undefined,
            gfloor: undefined,
            sillings: undefined,
            // true - жилой
            fond: true,
            planning: undefined,
            // включенные коммуникации (только для land и house)
            communications: undefined,
            area: {
                g: undefined,
                l: undefined,
                k: undefined,
                whole: undefined
            },
            rooms: undefined,
            // false - вторичка
            state: false,
            partly: undefined,
            // Назначение земли
            purpose: undefined
        },
        extras: {
            comment: {
                ru: undefined,
                ua: undefined,
                en: undefined
            },
            included: undefined,
            top: false,
            fee: true
        },
        images: []
    }
}

export const daysOfWeek = [
    ['Воскресенье', 'Sun'],
    ['Понедельник', 'Mon'],
    ['Вторник', 'Tue'],
    ['Среда', 'Wed'],
    ['Четверг', 'Thu'],
    ['Пятница', 'Fri'],
    ['Суббота', 'Sat']
  ];
  
  export const monthsOfYear = [
    ['Январь', 'Jan'],
    ['Февраль', 'Feb'],
    ['Март', 'Mar'],
    ['Апрель', 'Apr'],
    ['Май', 'May'],
    ['Июнь', 'Jun'],
    ['Июль', 'Jul'],
    ['Август', 'Aug'],
    ['Сентябрь', 'Sep'],
    ['Октябрь', 'Oct'],
    ['Ноябрь', 'Nov'],
    ['Декабрь', 'Dec']
  ]; 

