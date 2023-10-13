'use strict';

const router     = require('express').Router();
const path       = require('path');
const controller = require('../controllers/controller');
const User       = require('../models/user');
const passport   = require('passport');
const express    = require('express');
const session    = require('express-session');
const app      = express();

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

  let errorMessage = null;

  if (req.session.errorMessage)
  {
    errorMessage = req.session.errorMessage;
    req.session.errorMessage = '';
  }

  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES',
    message: errorMessage
  });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/get-display-name', failWithError: true }), function(err, req, res, next) {
  req.session.errorMessage = 'Username and/ or password incorrect';
  return res.redirect('/');
});

router.get('/get-display-name', authenticated, function(req, res)
{
  req.session.sessionName = req.user.displayName;
  return res.redirect('/explore');
});

router.get('/guest-login', passport.authenticate('dummy', { successRedirect: '/get-display-name', failWithError: true }), function(err, req, res, next) {
  req.session.errorMessage = 'Guest log in failed, please try again';
  return res.redirect('/');
});

router.post('/create-magic-link', authenticated, controller.createMagicLink);

router.get('/magic-login', function(req, res, next) {
  passport.authenticate('jwt', function(err, user, info) 
  {
    if (err) 
    { 
      return next(err); 
    }

    if (!user) 
    { 
      if (info.message.includes('jwt expired') === true)
      {
        req.session.errorMessage = 'This magic link is expired';
      }
      else
      {
        req.session.errorMessage = 'This magic link is invalid';
      }

      return res.redirect('/'); 
    }

    req.logIn(user, function(err) 
    {
      if (err) 
      { 
        return next(err); 
      }

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

// DELETE ----------------------------------------------------------------------------------------------------------------------------
router.get('/template', function(req, res, next) {
  var user = req.user;

  const userInfo = {
    username: user.username,
    usertype: user.usertype,
    email: user.email,
    displayName: user.displayName,
    headUrl: user.gltf_head_url,
    hairUrl: user.gltf_hair_url,
    bodyUrl: user.gltf_body_url,
    headColor: user.color_head,
    hairColor: user.color_hair,
    bodyColor: user.color_body,
    handLeftColor: user.color_hand_left,
    handRightColor: user.color_hand_right,
  }

  res.render(path.resolve(__dirname + '/../public/web/views/template'), {
    userInfo: userInfo,
  });
});
// DELETE ----------------------------------------------------------------------------------------------------------------------------

router.post('/update-session-name', authenticated, controller.updateSessionName);
router.post('/get-user-info', authenticated, controller.getUser);

router.get('/register', controller.serveRegister);
router.get('/profile', authenticated, controller.serveProfile);
router.get('/explore', authenticated, controller.serveExplore);

router.get('/delete-group/:group_name', authenticated, controller.deleteGroup);
router.post('/create-group', authenticated, controller.createGroup);
router.get('/delete-subgroup/:group_name/:subgroup_name', authenticated, controller.deleteSubgroup);
router.post('/create-subgroup', authenticated, controller.createSubgroup);
router.post('/update-world-group', authenticated, controller.updateWorldGroup);

router.get('/manage-users', authenticated, controller.serveUserManager);
router.get('/more-circles', authenticated, controller.serveMoreCircles);
router.get('/uploaded-content', authenticated, controller.serveUploadedContent);
router.get('/uploads/:file_name', authenticated, controller.serveUploadedFile);
router.get('/whiteboard-file/:file_name', authenticated, controller.serveWhiteboardFile);
router.get('/delete-uploaded-content/:file_name', authenticated, controller.deleteUploadedFile);
router.get('/get-user-uploaded-content', authenticated, controller.getUserFiles);

router.get('/your-magic-links', authenticated, controller.serveMagicLinks);
router.get('/delete-magic-link/:magic_link', authenticated, controller.deleteMagicLink);
router.post('/renew-magic-link/:magic_link', authenticated, controller.renewMagicLink);

router.post('/upload-content', authenticated, controller.newContent);
router.post('/insert-whiteboard-file', authenticated, controller.insertWhiteboardFile);
router.post('/remove-whiteboard-file', authenticated, controller.removeWhiteboardFile);
router.post('/get-whiteboard-files', authenticated, controller.getWhiteboardFiles);
router.post('/set-file-dimensions', authenticated, controller.setFileDimensions);
router.post('/update-whiteboard-file-position', authenticated, controller.updateFilePosition);

router.post('/create-user', authenticated, controller.createUser);
router.post('/bulk-create-users', authenticated, controller.createUsersByFile);
router.post('/change-usertype', authenticated, controller.updateUsertype);

router.get('/sample-upload-file', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../public/web/views/sampleUserUpload.txt'));
})

router.get('/edit-access/:world_id', authenticated, controller.serveAccessEdit);
router.get('/permit-viewing/:world_id/:user_id', authenticated, controller.permitWorldViewing);
router.get('/remove-viewing/:world_id/:user_id', authenticated, controller.removeWorldViewing);
router.get('/permit-editing/:world_id/:user_id', authenticated, controller.permitWorldEditing);
router.get('/remove-editing/:world_id/:user_id', authenticated, controller.removeWorldEditing);
router.get('/remove-restrictions/:world_id', authenticated, controller.removeWorldRestrictions);
router.get('/put-restrictions/:world_id', authenticated, controller.putWorldRestrictions);

//REST API (need to secure one day ... )
//inspired by https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
// router.route('/users/:username')
//   .get(controller.getUser)
//   .put(controller.updateUser)
//   .delete(controller.deleteUser);

// router.route('/users')
//   .get(controller.getAllUsers);

router.post('/register-user', controller.registerUser, passport.authenticate('local', { successRedirect: '/explore', failWithError: true}), function(err, req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/register'), {
    title: `Register for Circles`,
    message: "User registered successfully but login failed, please login again"
  });
});
    
router.post('/update-user', authenticated, controller.updateUserInfo);

/**
 * Room Exploration
 *
 * This route will look for and load worlds by folder name and use the shared
 * room name of "explore". This will be a public room.
 */
router.get('/w/:world_id', authenticated, controller.serveWorld);

// Serving relative links properly (this also means we can't use index.html) ...
router.get('/w/:world_id/*', authenticated, controller.serveRelativeWorldContent);

// For forwarding magic links
// (Has to be last or routes below it will not work)
router.get('/:forwarding_name', controller.forwardMagicLink);

module.exports = router;
