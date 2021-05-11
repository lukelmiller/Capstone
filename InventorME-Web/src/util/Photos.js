import { Auth } from 'aws-amplify';
const fetch = require('node-fetch');
const dateFormat = require('dateformat');

var urly = "https://9zulviqkd0.execute-api.us-east-2.amazonaws.com/v1/imager";
var url2 = "https://secret-ocean-49799.herokuapp.com/https://9zulviqkd0.execute-api.us-east-2.amazonaws.com/v1/imager"
export class Photo {
    get(url) {
        let queryURL = url2 + "?url=" + url;
        // console.log("qurl: ", queryURL);
        return new Promise((resolve, reject) => {
            fetch(queryURL)
                .then(res => resolve(res.text()))
                .catch(err => reject(err))
        });
    }

    post(url, binary, fileType) {
        return new Promise((resolve, reject) => {
            let queryURL = urly + "?url=" + url;
            var postData = {
                method: 'POST',
                body: binary,
                mode: 'no-cors',
                headers: { 'Content-Type': fileType }
            }
            fetch(queryURL, postData)
                .then(res => resolve(res.text()))
                .catch(err => reject(err))
        });
    }
    encodeImage(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        })
    };
    async uploadFile(file, fileName, type) {
        try {
            const b64 = await this.encodeImage(file);
            var dirt = "data:" + type + ";base64,"
            const clean = b64.replace(dirt, "");
            await this.post(fileName, clean, type);
        } catch (error) {
            console.log(error);
        }
    }
    async generateProfilePicName(type){
        try{
            const data = await Auth.currentUserInfo();
            var url = data.attributes.email;
            url += "."+type;
            return Promise.resolve(url);
        }
        catch(error){
            return Promise.reject(error);
        }
    }
    async generateNewItemName(type){
        try{
            const data = await Auth.currentUserInfo();
            var url = data.attributes.email;
            var now = new Date();
            now = dateFormat(now,"ddMMyymmss");
            url += now;
            url += "."+type;
            return Promise.resolve(url);
        }
        catch(error){
            return Promise.reject(error);
        }
    }

}




// import {Photos} from "../../util/Photos"
// const photos = new Photo();

//TO UPLOAD PHOTOS:

//Upload input tag:
/* <input type="file" onChange={(e) => this.submitFile(e.target.files)} /> */ 

//On submit event:
// submitFile(event) {
//     const file = event[0];
//     const name = "green.jpg";
//     photos.uploadFile(file, name, file.type);
// }


//TO DOWNLOAD PHOTOS:

// function getter(fileName, fileType){
//     try {
//         const image = await photos.get(fileName);
//         console.log(image);
//         //To display said image (this function doesn't quite work but its <img> tag does):
//         renderImage(fileType, image);
//     } catch (error) {
//         console.log(error);
//     }
// }
// function renderImage(type, data){
//     return <img alt="item" src={`data:${type};base64,${data}`} />
// }
