const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const { storeReturnTo } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    
router.post('/login',
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
storeReturnTo,
// passport.authenticate logs the user in and clears req.session
passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
// Now we can use res.locals.returnTo to redirect the user after login
(req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    console.log('Logout endpoint hit'); // Debugging: Check if the route is being called

    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err); // Log the error if req.logout fails
            return next(err); // Pass the error to Express error handler
        }
        console.log('Logout successful'); // Confirm successful logout
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err); // Log if session destruction fails
                return next(err);
            }
            res.clearCookie('connect.sid'); // Clear the session cookie
            console.log('Session cleared and cookie removed'); // Confirm successful session clearing
            req.flash('success', 'Goodbye!');
            res.redirect('/campgrounds'); // Redirect the user
        });
    });
});


module.exports = router;