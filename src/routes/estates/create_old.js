import Estate from "../../models/estate";
import { estateValidation } from "../../validation_types/estate";
import send from '@polka/send-type';
//import dropboxV2Api from "dropbox-v2-api";
const { Readable } = require('stream');
const basePath = "/statics/estates/";
export async function post(req, res) {
    
    for(let key in req.body){
        if(key === "adress" || key === "details" || key === "extras"){
            req.body[key] = JSON.parse(req.body[key]);
        }
    }
    if(req.body.leased) {
        
        req.body.leased = req.body.leased.replace('"', "").replace('"', "")
        console.log(req.body.leased);
    }

    /* Input validation */
    const {error} = estateValidation(req.body);
    if(error){
        error.code = "VALIDATION_ERROR"
        send(res, 400, error);
        return;
    }

    if(req.files){
    
    
    /* DROPBOX AUTH */

    const dropbox = dropboxV2Api.authenticate({
        token: process.env.DROPBOX_TOKEN
    });


    /* 
    
    Upload to Dropbox
    maxRequests defines the maximum of opened connections to the Dropbox API.
    Note: don't go over 8 maxRequests to prevent "tooManyRequests" error.

    */
    const sharedLinks = [];
    const maxRequests = 4; 
    const sendToDropbox = async () => {
        for (let index = 0; index < Object.keys(req.files).length; index += maxRequests) {
            const requests = Object.keys(req.files).slice(index, index + maxRequests).map((img, i, arr) => { 
                return new Promise((resolve, reject) => {
                    dropbox({
                        resource: 'files/upload',
                        parameters: {
                            path:  basePath+`${req.body.type}/${req.body.label}/${img}.jpg`,
                            mode: 'overwrite',
                            autorename: true,
                            strict_conflict: false
                            },
                        readStream: new Readable({
                            read() {
                              this.push(req.files[img].data);
                              this.push(null);
                            }
                          })
                        }, (err, result, response) => {
                            if (err) {return reject(err)}
                            dropbox({
                               resource: 'sharing/create_shared_link_with_settings',
                               parameters: {
                                path: result.path_lower,
                                settings: {
                                 requested_visibility: "public",
                                 audience: "public",
                                 access: "viewer"
                             }
                               }
                              
                           }, (err, resp) => {
                            if (err) {
                                if(err.error[".tag"] === 'shared_link_already_exists'){
                                    dropbox({
                                        resource: 'sharing/list_shared_links',
                                        parameters: {
                                            path: result.id
                                        }
                                    }, (err, r) => {
                                        if(err){return console.log(err);}
                                        sharedLinks.push({url: r.links[0].url});
                                        resolve();
                                    })
                                } else return reject(err);
                             } else {sharedLinks.push({url: resp.url}); resolve();}
                             
                         
                           })
                        })
                })
                 
              })
            
            await Promise.all(requests)
            .catch(e =>Promise.reject(e))
            .then(() => console.log(index === 0 ? "First portion of images uploaded!" : "Another portion of images uploaded!"))
            
        }
    }

    sendToDropbox()
    .then(async ()=> {
        console.log(`All uploaded sir. Input length: ${Object.keys(req.files).length}, final length: ${sharedLinks.length}.`);
        const estate = new Estate({...req.body, images: sharedLinks.map(image => {
            return image.url.match(/s\/(.*)\?/)[1]
        })})
        try {
            await estate.save();
            send(res, 200, {id: estate._id, images: estate.images});
        } catch (error) {
            error.code = "DATABASE_ERROR";
            send(res, 400, error);
        }
    })
    .catch(err => send(res, 400, err))

} else {
    const estate = new Estate({...req.body, images: []})
    try {
        await estate.save();
        send(res, 200, {id: estate._id});
    } catch (error) {
        error.code = "DATABASE_ERROR";
        send(res, 400, error);
    }
}

  }
