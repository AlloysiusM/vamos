const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
       // ref user
       user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',required: true
       },

       sender: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',required: true
    },

    message:{
        type: String,required: true
    },
    type:{
        type: String,required: true
    },

    createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Notification', notificationSchema);