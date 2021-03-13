import Estate from "../../models/estate";
import { estateValidation } from "../../validation_types/estate";
import send from '@polka/send-type';



export async function post(req, res) {

    /* Restore objects from request */
    for(let key in req.body){
        if(key === "adress" || key === "details" || key === "extras") req.body[key] = JSON.parse(req.body[key]);
    }
    if(req.body.leased) req.body.leased = req.body.leased.replace('"', "").replace('"', "");
    

    /* Input validation */
    const {error} = estateValidation(req.body);
    if(error){
        error.code = "VALIDATION_ERROR"
        send(res, 400, error);
        return;
    }

    const s3 = req.s3;
    const estate = new Estate({...req.body, images: req.files ? Object.values(req.files).map(el => el.name) :[]});

     /* Functions */
     const processToDO = () => Promise.all(Object.values(req.files).map(image => new Promise((resolve, reject) => {
        s3.upload({
            Bucket: "assets.rich-house.online",
            Key: `estates/${req.body.type}/${estate._id}/${image.name}`,
            Body: image.data,
            ContentType: image.mimetype,
            ACL: 'public-read',
            Tagging: `Type=${req.body.type}`
        }, (err, data) => {
            if(err) reject({err})
            else resolve(data);
        })
    })));
    
    const purgeUploadedImages = async () => {
        const {Contents: imagesToPurge} = await s3.listObjectsV2({
            Bucket: "assets.rich-house.online",
            Prefix: `estates/${req.body.type}/${estate._id}`
        }).promise();
        await s3.deleteObjects({
            Bucket: "assets.rich-house.online",
            Delete: { Objects: imagesToPurge.map(im=>({Key: im.Key})) }
        }).promise();
        await s3.deleteObject({
            Bucket: "assets.rich-house.online",
            Key: `estates/${req.body.type}/${estate._id}`
        })
    }

    /* Upload images to Digital Ocean Spaces */
    if(req.files) {
        try {
            await processToDO().then((uploadedImages)=>console.log(uploadedImages))
        } catch (error) {
            console.log(error);
            return send(res, 500, { error: "Image upload failed", code: "IMG_UPLOAD_FAIL" })
        }
    }

    /* Upload to MongoDB */
    try {
        await estate.save();
        return send(res, 200, `${estate.label} was succesfully created!`)
    } catch (error) {
        if(req.files) await purgeUploadedImages().catch(console.log);
        return send(res, 500, { error: `MongoDB upload failed${req.files&&", but images were uploaded with status code 200, will purge them"}.`, code: "MONGO_UPLOAD_FAIL" })
    }

}