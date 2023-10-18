const mongoose=require("mongoose");

const Userdetails = new mongoose.Schema(
{
    fname:String,
    lname:String,
    email:{type:String, unique:true},
    pass:String,
},
{
    collection:"UserInfo",
}
);

mongoose.model("UserInfo",Userdetails);