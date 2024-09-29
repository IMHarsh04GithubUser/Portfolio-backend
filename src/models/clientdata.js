const mongoose = require('mongoose')

const UserData = mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,require:true},
    textarea:{type:String,require:true}
})

const UserModel = mongoose.model('Client Data',UserData)

module.exports = {UserModel}