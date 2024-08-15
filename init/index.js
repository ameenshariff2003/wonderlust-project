const mongoose = require("mongoose");
//exporting the data from data.js
const initData = require("./data.js")
//requiring the listing.js from the models
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

//calling the main fn 

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

//connecting to the db
async function main(){
    await mongoose.connect(MONGO_URL);
}

//initializeing the db with async fn
 const initDB = async () =>{
    //deleting the existing data
    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj)=>({...obj,owner : "66b9e84991f79db32697f61f"}))
    //inserting the data.js into the DB
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
 };

 //calling the fn
 initDB();

