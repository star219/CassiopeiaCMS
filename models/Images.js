const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for UnusedImages
const ImageSchema = new Schema({
  images: {
    type: Array,
    unique: true,
    index: true
  },
})

//create model for UnusedImages
const ImageModel = mongoose.model('unusedimage', ImageSchema);

module.exports = ImageModel;
