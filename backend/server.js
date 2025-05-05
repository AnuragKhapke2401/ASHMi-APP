require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const loginRoutesV2 = require('./routes/loginRoutesV2');
const userRoutes = require('./routes/userRoutes'); 
const logoutRoute = require('./routes/logoutRoute');
const viewProfileRoutes = require('./routes/viewProfileRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Body Parser & Cookies
app.use(express.json());
app.use(cookieParser());

// Rate Limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: {
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter only to login route
app.use('/api/auth/login', loginLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', loginRoutesV2);
app.use('/api/user', userRoutes); 
app.use('/api/auth', logoutRoute);
app.use('/api/user', viewProfileRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use('/api/auth', resetPasswordRoutes);

// Server Start
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
