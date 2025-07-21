const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  profileImage: {
    type: String,
    default: "",
  },

  contactNumber: {
    type: String,
    default: "",
  },

  address: {
    type: String,
    default: "",
  },

  profession: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing the password before saving is recommended in production
userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash if password is modified or new
  if (!user.isModified("password")) {
    return next();
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// match password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = new model("User", userSchema);

module.exports = User;
