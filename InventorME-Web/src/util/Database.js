import { Auth } from 'aws-amplify';
const fetch = require('node-fetch');

const urly = "https://secret-ocean-49799.herokuapp.com/https://3cv3j619jg.execute-api.us-east-2.amazonaws.com/test/inventorme-items"
const url = "https://3cv3j619jg.execute-api.us-east-2.amazonaws.com/test/inventorme-items"
export class Database{
    async get(){
        try{
            const data = await Auth.currentUserInfo();
            var email = data.attributes.email;
        }
        catch(error){
            console.log('could not find user :(', error);
        }
         let  queryURL = urly + "?userEmail='" + email +"'";
        return new Promise((resolve, reject)=>{
            fetch(queryURL,{method: 'GET'})
            .then(res => resolve(res.json()))
            .catch(err => reject(err))
        });
    }
    post(item){
        return new Promise((resolve, reject)=>{
            var postData = {
                method: 'POST',
                body: JSON.stringify(item),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch(url,postData)
            .then(res => resolve(res.json()))
            .catch(err => reject(err))
        });
    }
    put(item){
        return new Promise((resolve, reject)=>{
            var putData = {
                method: 'PUT',
                body: JSON.stringify(item),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch(url,putData)
            .then(res => resolve(res.json()))
            .catch(err => reject(err))
        });
    }
    deleteItem(id){
        return new Promise((resolve, reject)=>{
            var deleteData = {
                method: 'DELETE',
                body: JSON.stringify(id),
                headers: { 'Content-Type': 'application/json' }
            }
            fetch(url,deleteData)
            .then(res => resolve(res.json()))
            .catch(err => reject(err))
        });
    }
    async deleteUser(){
        try{
            const data = await Auth.currentUserInfo();
            var email = data.attributes.email;
        }
        catch(error){
            console.log('could not find user :(', error);
        }
        return new Promise((resolve, reject)=>{
            var deleteData = {
                method: 'DELETE',
                body: JSON.stringify(email),
                statusCode: 200,
                headers: { 
                    "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
                
                    'Content-Type': 'application/json' }
            }
            fetch(url,deleteData)
            .then(res => resolve(res.json()))
            .catch(err => reject(err))
        });
    }
}





//THIS IS FOR TESTING PURPOSES ONLY
// {
//     const db = new Database();

// var POSTitemFORMAT = {
//     userEmail: "'lukelmiller@icloud.com'",
//     itemCategory: "'Technology'",
//     itemName: "'Airpods'",
//     itemPhotoURL: "null",
//     itemSerialNum: "null",
//     itemPurchaseAmount: "249.99",
//     itemWorth: "200.00",
//     itemReceiptPhotoURL: "null",
//     itemManualURL: "null",
//     itemSellDate: "null",
//     itemBuyDate: "null",
//     itemLocation: "'mah Wrist'",
//     itemNotes: "'REALLY good for running and working out and such,Pro version'",
//     itemSellAmount: "null",
//     itemRecurringPaymentAmount: "null",
//     itemEbayURL: "'apple.com/airpods'",
//     itemTags: "'fitness apple headphones bluetooth'",
//     itemArchived: '0',
//     itemFolder: "'personal'"
// }
// // NOTE: the only thing extra attribute you need add for PUT (update) method is itemID
// var PUTitemFORMAT = {
//     userEmail: "'lukelmiller@icloud.com'",
//     itemID: "9",
//     itemCategory: "'Fitness'",
//     itemName: "'Airpods'",
//     itemPhotoURL: "null",
//     itemSerialNum: "null",
//     itemPurchaseAmount: "249.99",
//     itemWorth: "200.00",
//     itemReceiptPhotoURL: "null",
//     itemManualURL: "null",
//     itemSellDate: "null",
//     itemBuyDate: "null",
//     itemLocation: "'mah Wrist'",
//     itemNotes: "'REALLY good for running and working out and such,Pro version'",
//     itemSellAmount: "null",
//     itemRecurringPaymentAmount: "null",
//     itemEbayURL: "'apple.com/airpods'",
//     itemTags: "'fitness apple headphones bluetooth'",
//     itemArchived: '0',
//     itemFolder: "'personal'"
// }
// var DELETEitemFORMAT = {itemID: "7"}
// var DELETEuserFORMAT = {userEmail: "'lukelmiller@icloud.com'"}

// async function getter(){
//     try{
//         const items = await db.get("lukelmiller@icloud.com");
//         console.log(items);
//     } catch(error){
//         console.log(error);
//     }
// }
// async function poster(){
//     try{
//         const item = await db.post(POSTitemFORMAT);
//         console.log(item);
//     } catch(error){
//         console.log(error);
//     }
// }
// async function putter(){
//     try{
//         const item = await db.put(PUTitemFORMAT);
//         console.log(item);
//     } catch(error){
//         console.log(error);
//     }
// }
// async function deleter(){
//     try{
//         const item = await db.deleteItem(DELETEitemFORMAT);
//         console.log(item);
//     } catch(error){
//         console.log(error);
//     }
// }
// async function deleterUSER(){
//     try{
//         const item = await db.deleteUser(DELETEuserFORMAT);
//         console.log(item);
//     } catch(error){
//         console.log(error);
//     }
// }
// }