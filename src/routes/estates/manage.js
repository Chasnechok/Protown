import Estate from "../../models/estate";
import { estateValidation } from "../../validation_types/estate";
import send from '@polka/send-type';


const handleValidate = (body) => {
    delete body._id; delete body.__v;
    
    for(let key in body){
        if(key === "adress" || key === "details" || key === "extras" || key === "images") body[key] = JSON.parse(body[key]);
        if(key === "realised" && !isNaN(Date.parse(body[key]))) body[key] = new Date(body[key]);
        if(key === "realised" && (body[key]===null)) body[key] = false;
        if(key === "realised"  && isNaN(Date.parse(body[key]))) body[key] = JSON.parse(body[key]);
    }
    // clean estate object
    if(body.type==="land") {
        ["g","k","l"].forEach(prop => delete body.details&&body.details.area[prop]);
        ["gfloor", "floor", "sillings", "rooms", "fond"].forEach(prop=>body.details&&delete body.details[prop]);
    }
    if(body.type!=="land") ["partly", "purpose"].forEach(prop=>body.details&&delete body.details[prop]);
    if(body.type==="house") ["fond", "planning"].forEach(prop=>body.details&&delete body.details[prop]);
    if(body.type==="flat") ["whole"].forEach(prop=>body.details&&body.details.area&&delete body.details.area[prop]);
    // validate 
    const { error } = estateValidation(body);
    if(error){
        error.code = "VALIDATION_ERROR"
        return error;
    }
    return body;
}

/* Functions */
const processToDO = (s3, body, id, files) => Promise.all(Object.values(files).map(image => new Promise((resolve, reject) => {
    s3.upload({
        Bucket: "assets.protown.in.ua",
        Key: `estates/${body.type}/${id}/${image.name}`,
        Body: image.data,
        ContentType: image.mimetype,
        ACL: 'public-read',
        Tagging: `Type=${body.type}`
    }, (err, data) => {
        if(err) reject({err})
        else resolve(data);
    })
})));

const purgeUploadedImages = async (s3, body, id, mode, toCompare) => {
    let {Contents: imagesToPurge} = await s3.listObjectsV2({
        Bucket: "assets.protown.in.ua",
        Prefix: `estates/${body.type}/${id}`
    }).promise();
    imagesToPurge = mode !== "some" ? imagesToPurge.map(im=>({Key: im.Key})) : imagesToPurge.filter(el=>!toCompare.images.includes(el.Key.match(/\/(?:.(?!\/))+$/)[0].slice(1))).map(im=>({Key: im.Key}));
    if(mode === "move") {
        // body = from, toCompare = to
        await imagesToPurge.forEach(image => {
            s3.copyObject({
                Bucket: "assets.protown.in.ua",
                CopySource: encodeURI(`assets.protown.in.ua/${image.Key}`),
                Key: image.Key.replace(body.type, toCompare.type),
                ACL: 'public-read'
            }, (copyErr, copyData) => {
                if (copyErr) {
                  console.log(copyErr);
                }
              }).promise().catch(err => console.log(err));
        })
    }
    await s3.deleteObjects({
        Bucket: "assets.protown.in.ua",
        Delete: { Objects: imagesToPurge }
    }).promise();
    if(mode!=="some"||!toCompare?.images[0]) {
        await s3.deleteObject({
            Bucket: "assets.protown.in.ua",
            Key: `estates/${body.type}/${id}`
        })
    }
}

export async function post(req, res) {

    /* Restore objects from request and input validation */
    const validated = handleValidate(req.body);
    if(validated.code==="VALIDATION_ERROR") return send(res, 400, validated);
    const estate = new Estate({...validated, createdAt: new Date()});

    /* Upload images to Digital Ocean Spaces */
    if(req.files) {
        try {
            await processToDO(req.s3, estate, estate._id, req.files).then((uploadedImages)=>console.log(uploadedImages))
        } catch (error) {
            console.log(error);
            return send(res, 500, { error:true, message: "Image upload failed", code: "IMG_UPLOAD_FAIL" })
        }
    }

    /* Upload to MongoDB */
    try {
        await estate.save();
        return send(res, 200, {message: `Добавили ${estate.label} в список объявлений!`, link: `/${estate.type}/${estate._id}`})
    } catch (error) {
        if(req.files) await purgeUploadedImages(req.s3, estate, estate._id).catch(console.log);
        return send(res, 500, {error: true, message: `MongoDB upload failed${req.files&&", but images were uploaded with status code 200, will purge them"}.`, code: "MONGO_UPLOAD_FAIL" })
    }

}

export async function put(req, res) {

    const id = req.body._id;

    /* Restore objects from request and input validation */
    const estate = handleValidate(req.body);
    if(estate.code==="VALIDATION_ERROR") return send(res, 400, estate);

    /* Check if there are images to purge from DO */
    const estateToUpdate = await Estate.findOne({_id: id});
    if(estateToUpdate.images.some(img => !estate.images.includes(img))) {
        try {
            await purgeUploadedImages(req.s3, estateToUpdate, id, "some", estate);
        } catch (error) {
            console.log(error);
            return send(res, 500, { error:true, message: "Image upload failed", code: "IMG_UPLOAD_FAIL" })
        }
    }

    /* Check if estate type has changed => move images to appropriate folder on DO */
    if(estate.type !== estateToUpdate.type) {
        try {
            await purgeUploadedImages(req.s3, estateToUpdate, id, "move", estate);
        } catch (error) {
            console.log(error);
            return send(res, 500, { error:true, message: "Image upload failed", code: "IMG_UPLOAD_FAIL" })
        }
    }
    

    /* Upload images to Digital Ocean Spaces */
    if(req.files) {
        try {
            await processToDO(req.s3, estate, id, req.files).then((uploadedImages)=>console.log(uploadedImages))
        } catch (error) {
            console.log(error);
            return send(res, 500, { error:true, message: "Image upload failed", code: "IMG_UPLOAD_FAIL" })
        }
    }

    /* Upload to MongoDB */
    try {
        console.log(estate.images);
        await Estate.findOneAndUpdate({_id: id},{$set: estate});
        return send(res, 200, {message: `Обновили ${estate.label} в списке объявлений!`, link: `/${estate.type}/${id}`})
    } catch (error) {
        if(req.files) await purgeUploadedImages(req.s3, estate, id).catch(console.log);
        return send(res, 500, {error: true, message: `MongoDB upload failed${req.files&&", but images were uploaded with status code 200, will purge them"}.`, code: "MONGO_UPLOAD_FAIL" })
    }

}

export async function del(req, res) {
    const id = req.body._id;
    if(!id) return send(res, 500, {error: true, message: "No id provided", code: "ID_NOT_PROVIDED"});
    const estateToDelete = await Estate.findOne({_id: id});

    if(estateToDelete.images&&estateToDelete.images[0]){
        await purgeUploadedImages(req.s3, estateToDelete, id).catch(console.log);
    }

    /* Remove from MongoDB */
    try {
        await Estate.findOneAndDelete({_id: id});
        return send(res, 200, {message: `Удалили ${estateToDelete.label} из списка объявлений!`});
    } catch (error) {
        return send(res, 500, {error: true, message: `MongoDB deletion failed.`, code: "MONGO_DELETE_FAIL" })
    }

}