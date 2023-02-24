const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
    msg:{
        username:String,
        text:String
    }
})

const Msg = mongoose.model('msg',msgSchema);
module.exports = Msg;