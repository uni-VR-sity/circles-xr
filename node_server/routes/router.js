'use strict';

const router     = require('express').Router();
const path       = require('path');
const controller = require('../controllers/controller');
const User       = require('../models/user');
const passport   = require('passport');

/**
 * Authenticated
 *
 * Using the `isAuthenticated()` check provided by PassportJS on the request
 * body, provide a middleware check for routes to ensrue they're authenticated
 * before proceeding.
 *
 */
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to the home page
  return res.redirect('/');
};

/**
 * Not Authenticated
 *
 * A check method to ensure that a route is only accessible when *not*
 * authenticated. For example, a user should only be able to get to the login
 * route if they're not already authenticated.
 */
const notAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/explore');
  }

  return next();
};

//general web
router.get('/', notAuthenticated, (req, res) => {
  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES'
  });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/explore', failWithError: true }), function(err, req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES',
    message: 'ERROR: Username and/ or password incorrect',
  });
});

router.get('/guestLogin', passport.authenticate('dummy', { successRedirect: '/explore', failWithError: true }), function(err, req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES',
    message: 'ERROR: Guest log in failed, please try again',
  });
});

//magic links for students
router.get('/get-magic-links', authenticated, controller.getMagicLinks);

//get list of worlds
router.get('/get-worlds-list', authenticated, controller.getWorldsList);

router.get('/magic-login', function(req, res, next) {
  passport.authenticate('jwt', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(req.query.route);
    });
  })(req, res, next);
});

// Ensure a user is authenticated before hitting logout
router.get('/logout', authenticated, (req, res, next) => {
  // Logout of Passport
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/'); // Redirect to home page
  });
});

router.get('/register', controller.serveRegister);
router.get('/profile', authenticated, controller.serveProfile);
router.get('/explore', authenticated, controller.serveExplore);

router.get('/editAccess/:world_id', authenticated, controller.serveAccessEdit);
router.get('/permitViewing/:world_id/:user_id', authenticated, controller.permitWorldViewing);
router.get('/removeViewing/:world_id/:user_id', authenticated, controller.removeWorldViewing);
router.get('/permitEditing/:world_id/:user_id', authenticated, controller.permitWorldEditing);
router.get('/removeEditing/:world_id/:user_id', authenticated, controller.removeWorldEditing);
router.get('/removeRestrictions/:world_id', authenticated, controller.removeWorldRestrictions);
router.get('/putRestrictions/:world_id', authenticated, controller.putWorldRestrictions);

//REST API (need to secure one day ... )
//inspired by https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
// router.route('/users/:username')
//   .get(controller.getUser)
//   .put(controller.updateUser)
//   .delete(controller.deleteUser);

// router.route('/users')
//   .get(controller.getAllUsers);

router.post('/registering', controller.registerUser, passport.authenticate('local', { successRedirect: '/explore', failWithError: true}), function(err, req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/register'), {
    title: `Register for Circles`,
    message: "User registered successfully but login failed, please login again"
  });
});
    
router.post('/update-user', controller.updateUserInfo);

/**
 * Room Exploration
 *
 * This route will look for and load worlds by folder name and use the shared
 * room name of "explore". This will be a public room.
 */
router.get('/w/:world_id', authenticated, controller.serveWorld);

// Serving relative links properly (this also means we can't use index.html) ...
router.get('/w/:world_id/*', authenticated, controller.serveRelativeWorldContent);

module.exports = router;
