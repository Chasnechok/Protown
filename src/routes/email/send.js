import send from '@polka/send-type';
import striptags from "striptags";
import { emailValidation } from "../../validation_types/email";
import { formatPhoneNumber } from "../../helpers/converter";

// validate and clean html tags
const handleValidate = (body) => {
    for(let key in body) {
        body[key] = striptags(body[key]);
        if(body[key].length<1) delete body[key];
    }
    const { error } = emailValidation(body);
    if(error){
        error.code = "VALIDATION_ERROR"
        return error;
    }
    return body;
}

export async function post(req, res) {
    const transporter = req.transporter;
    const validated = handleValidate(req.body);
    if(validated.code==="VALIDATION_ERROR") return send(res, 400, validated);
    
    try {
        await transporter.sendMail({
            from: '"Notifications Bot" <notifications@rich-house.online>',
            replyTo: validated.sender,
            to: "marina@rich-house.online",
            subject: "Rich House связь",
            text: validated.senderName+validated.senderMobile?` ( +38 ${formatPhoneNumber(validated.senderMobile)} ) `:""+"написал(а) "+validated.message,
            html: `<h4>${validated.senderName} ${validated.senderMobile?`, +38 ${formatPhoneNumber(validated.senderMobile)} `:""} написал(а):</h4><br>
            <span>${validated.message}</span>
            `
        });
        return send(res, 200, {message: "Сообщение отправлено, спасибо!"})
    } catch (error) {
        error.code = "Ошибка сервера";
        error.error = true;
        if(error.responseCode === 554) error.code = "Не отправлено ввиду подозрения на спам";
        return send(res, 500, error);
    }
}