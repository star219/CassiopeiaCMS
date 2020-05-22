const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema for Post
const PostSchema = new Schema({

  cid: {
    type: Number,
    required: [true, 'Post ID needed'],
    maxlength: 1000,
  },
  
  imageurl: {
    type: String,
    required: [true, 'Image URL required'],
    maxlength: 300,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 80
  },

  date: {
    type: String,
    required: [true, 'Date is required'],
    maxlength: 20,
  },

  tag: {
    type: String,
    required: [true, 'tag is required'],
    maxlength: 16
  },
  
  content: {
    type: String,
    required: [true, 'String is required'],
    maxlength: 100000,
  },

  cimages: {
    type: Array,
    maxlength: 10000,
  },

  vcount: {
    type: Number,
    default: 0,
    maxlength: 10
  }

})


//create model for posts
const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
