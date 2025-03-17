const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Connect to MongoDB   mongodb://localhost:27017/
mongoose.connect('mongodb://localhost:27017/movie').then(() => {
    console.log('Connected to MongoDB');

  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });


// Define the schema for the User model
const addUserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },

  password1: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique: true, // Ensures no two users can have the same email
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash the password before saving the user document
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next(); // Only hash if password is modified
//   try {
//     const salt = await bcrypt.genSalt(10); // Generate salt
//     this.password = await bcrypt.hash(this.password, salt); // Hash password
//     next();
//   } catch (error) {
//     next(error); // If there's an error during hashing
//   }
// });

// Method to compare password during login
// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Create a model using the schema
const User = mongoose.model('userDetailse', addUserSchema);
User.create({
  userName:'sri jashuva',password1:'123',password2:'123',email:'saipallavi5484@gmail.com'
}

)

module.exports = User;
