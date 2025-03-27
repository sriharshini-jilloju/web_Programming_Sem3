const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
  },
  contact: {
    phone: { type: String, required: true },
    alternatePhone: String,
  },
  preferences: {
    color: String,
    hobbies: [String],
  },
}, {
  collection: 'PeopleInfo' 
});

module.exports = mongoose.model("Person", personSchema);
