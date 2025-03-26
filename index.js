
const express = require('express');
const User = require('./User');
const bodyParser = require('body-parser');
const cors=require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;
let  otpValue=0;
// Middleware to parse JSON requests
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


  // const userSchema = new mongoose.Schema({
  //   firstName: {
  //     type: String,
  //     required: true
  //   },
  //   lastName: {
  //     type: String,
  //     required: true
  //   },
  //   email: {
  //     type: String,
  //     required: true,
  //     // unique: true, // Ensures no two users can have the same email
  //     lowercase: true
  //   },
  //   password: {
  //     type: String,
  //     required: true
  //   },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now
  //   }
  // });
  // const model= mongoose.model('std5',userSchema);

app.get('/',(req,res)=>{
  try {
    User.create({
      firstName:"sri",lastName:'jashuva',email:"jashuva@gmail.com",password:'2w3w2'
    }
        );
       
  } catch (error) {
    console.log(error);  
  }
  res.send('hello');
})
// app.get('/submit',(req,res)=>{
 
//   console.log(req.query);
//   res.send(req.query.fname);
//   try {
//     User.create({
//       firstName:userName,email:email,password1:pass1,password2:pass2,
//     }
//         );    
//   } catch (error) {
//     console.log(error);  
//   }
  
// })
app.post('/submit',async(req,res)=>{
  console.log('hhh');
  // console.log(req.body);
  
  const {userName,password1,password2,email}=req.body;

   // Check if the request body is empty
const dataObject ={
  userName:userName,password1:password1,password2:password2,email:email
};
console.log(dataObject);

    try {
      const newUser=  new User( dataObject );   
      await newUser.save(); 
      res.status(201).json({ message: 'User registered successfully' }); 

    } catch (error) {
      console.log(error);  
      res.status(500).json({ message: 'Error registering user' });
    }
    // console.log(req.body);
 })

// Handle POST request to /login
app.post('/login', async (req, res) => {
  try {
      const { username, password } = req.body;

      // Find the user in the database
      const user = await User.findOne({ userName: username });

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      // Validate the password (plain text comparison for demonstration)
      if (user.password1 !== password) {
          return res.status(400).json({ message: 'Invalid password' });
      }

      // Login successful
      res.status(200).json({ message: 'Login successful' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'An error occurred during login' });
  }
});
// User Registration
// app.post('/register', async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   try {
//     // const existingUser = await User.findOne({ email });
//     // if (existingUser) {
//     //   return res.status(400).json({ message: 'Email already in use.' });
//     // }

//     const newUser = new User({ firstName, lastName, email, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error registering user.' });
//   }
// });

// User Login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found.' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials.' });
//     }

//     res.status(200).json({ message: 'Login successful!' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error logging in.' });
//   }
// });


// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  port:465,
  host:'smtp.gmail.com',
 
  auth: {
      user: '226m1a05b4@bvcr.edu.in',
      pass: '',
  },
});

app.post('/send-otp', (req, res) => {
  const { email } = req.body;

  const user = User.findOne({email:email});


  if (!user) {
      return res.status(404).json({ message: 'Email not found.' });
  }

   otpValue = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  // Send OTP via email
  const mailOptions = {
      from: '226m1a05b4@bvcr.edu.in',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otpValue}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Failed to send OTP.' });
      }

      console.log('Email sent:', info.response);
      res.json({ message: 'OTP sent successfully.' });
  });
});

// Reset Password Route
app.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  console.log('reset password log recieved');
  console.log(email,otp,newPassword);
    
  

  try {
      // Find the user by email
      const user = await User.findOne({ email: email });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }
      const userOtp=parseInt(otp,10);
      // Validate OTP  || user.otpExpires < Date.now()
      if (otpValue !== userOtp ) {
        console.log(otpValue,otp );
        console.log(typeof(otpValue),typeof(userOtp));
        
        
          return res.status(400).json({ message: 'Invalid or expired OTP.' });
      }

      // Hash the new password
      // const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password and clear the OTP
      user.password1 = newPassword;
      user.password2 = newPassword;
      // user.otp = null;
      // user.otpExpires = null;
      await user.save();
    
      res.json({ message: 'Password reset successful!' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


