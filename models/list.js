// NMKRSPVLIDATA is a Node.js application that uses Mongoose to interact with MongoDB.
// The list model has two required string fields: title and description.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const list = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});
const ListModel = mongoose.model('Lists', list);
module.exports=ListModel;
// This code defines a Mongoose schema for a list model with two fields: title and description.