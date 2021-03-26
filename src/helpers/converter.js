

export const blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

export const kFormatter = (num) => {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) : Math.sign(num)*Math.abs(num)
}

export const currencyCalculator = (price, ccy, base_ccy, currencyRates) => {
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
            estateNumber: undefined
        },
        details: {
            floor: undefined,
            gfloor: undefined,
            sillings: undefined,
            fond: false,
            planning: undefined,
            communications: undefined,
            area: {
                g: undefined,
                l: undefined,
                k: undefined,
                whole: undefined
            },
            rooms: undefined,
            state: false,
            partly: undefined,
            purpose: undefined,
            zk: {
                ru: undefined,
                ua: undefined,
                en: undefined
            }
        },
        extras: {
            comment: {
                ru: undefined,
                ua: undefined,
                en: undefined
            },
            metro: {
                ru: undefined,
                ua: undefined,
                en: undefined,
                distance: undefined
            },
            included: undefined,
            top: false,
            fee: true
        }
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

