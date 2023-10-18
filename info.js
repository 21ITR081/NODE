const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const mongoUrl = "mongodb+srv://praneshkangeyanse21it:sepk2003@cluster0.uyh6rjw.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true

})
    .then(() => {
        console.log("Connected to database");
    })
    .catch((e) => console.log(e));

require("./User1");

const User = mongoose.model("BookInfo");

app.post("/register", async (req, res) => {
    const { fname, lname, email,number,text,date,info } = req.body;

    try {
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.send({ error: "User Exists" });
        }
        await User.create({
            fname,
            lname, email,
            number,
            text,
            date,
            info
        });
        res.send({ status: "ok" });
    } catch (error) {
        res.send({ status: "error" });
    }

});

app.listen(5001, () => {
    console.log("server started");
});



