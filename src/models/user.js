const mongoose = require("../database");
const bcrypt = require("bcrypt");
const authConfig = require("../config/auth");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if(await User.exists({email: this.email})) {
    const err = new Error("User already exists");
    err.name = "UniqueError";
    return next(err);
  } else {
    const hash = await bcrypt.hash(this.password, authConfig.salts);
    this.password = hash;
    return next();
  }
})

const User = mongoose.model("User", UserSchema);

module.exports = User;