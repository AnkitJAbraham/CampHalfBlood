const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

// Handle registration routes
router.route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

// Handle login routes
router.route('/login')
  .get(users.renderLogin)
  .post(
    storeReturnTo, // Middleware to store returnTo value
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
      req.flash('success', 'Welcome back!');
      const redirectUrl = res.locals.returnTo || '/campgrounds';
      res.redirect(redirectUrl);
    }
  );

// Handle logout route
router.get('/logout', (req, res, next) => {
  console.log('Logout endpoint hit'); // Debugging: Check if the route is being called

  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return next(err);
    }
    console.log('Logout successful');

    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return next(err);
      }
      res.clearCookie('connect.sid');
      console.log('Session cleared and cookie removed');
      req.flash('success', 'Goodbye!');
      res.redirect('/campgrounds');
    });
  });
});

module.exports = router;
