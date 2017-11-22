var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title_e: {
    type: String,
    default: '',
    // 공백 trim
    trim: true,
    required: ''
  },
  iotaction: {
    type: String,
    default: '',
    // 공백 trim
    trim: true,
    required: ''
  },
  iotevent: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  iotaction2: {
    type: String,
    default: '',
    // 공백 trim
    trim: true,
    required: ''
  },
  iotevent2: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  iotaction3: {
    type: String,
    default: '',
    // 공백 trim
    trim: true,
    required: ''
  },
  iotevent3: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  iotaction4: {
    type: String,
    default: '',
    // 공백 trim
    trim: true,
    required: ''
  },
  iotevent4: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  input_number: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  output_number: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  emailtext: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  emailaddr: {
    type: String,
    default: '',
    trim: true,
    required: ''
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Connects',connectSchema);
