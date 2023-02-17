const mongoose = require("mongoose");
const msgSchema = new mongoose.Schema({
    msg:{
        username:String,
        type:String,
        require:true
    }
})

const Msg = mongoose.model('msg',msgSchema);
module.exports = Msg;