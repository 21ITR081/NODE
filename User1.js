const mongoose=require("mongoose");

const Userdetails = new mongoose.Schema(
{
    fname:String,
    lname:String,
    email:{type:String, unique:true},
    number:String,
    text:String,
    date:String,
    info:String
},
{
    collection:"BookInfo",
}
);

mongoose.model("BookInfo",Userdetails);