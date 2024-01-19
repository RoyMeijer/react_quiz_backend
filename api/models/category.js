const mongoose = require('mongoose');
const question = require('./team');

const categorySchema = new mongoose.Schema({
  name: {type: String, required:true},
  questions: [question]
});

mongoose.model('Category',categorySchema);

module.export = categorySchema;