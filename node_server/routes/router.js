'use strict';

const router     = require('express').Router();
const path       = require('path');
const viewController = require('../controllers/viewController');
const circleController = require('../controllers/circleController');
const centralServerController = require('../controllers/centralServerController');
const User       = require('../models/user');
const passport   = require('passport');
const express    = require('express');
const session    = require('express-session');
const app      = express();

// General Routes ----------------------------------------------------------------------------------------------------------------------------------

// Authenticated
// Using the `isAuthenticated()` check provided by PassportJS on the request body, provide a middleware check for routes to ensrue they're authenticated before proceeding
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to the home page
  return res.redirect('/');
};

// Not Authenticated
// A check method to ensure that a route is only accessible when *not* authenticated
// For example, a user should only be able to get to the login route if they're not already authenticated
const notAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/explore');
  }

  return next();
};

// Homepage Routes ---------------------------------------------------------------------------------------------------------------------------------

router.get('/', centralServerController.serveHomepage);

// Login Routes ------------------------------------------------------------------------------------------------------------------------------------

router.get('/login', notAuthenticated, viewController.serveLogin);

router.post('/login-user', passport.authenticate('local', { successRedirect: '/get-display-name', failWithError: true }), function(err, req, res, next) {
  req.session.errorMessage = 'Username and/ or password incorrect';
  return res.redirect('/');
});

router.get('/get-display-name', authenticated, function(req, res)
{
  req.session.sessionName = req.user.displayName;
  return res.redirect('/');
});

router.get('/guest-login', passport.authenticate('dummy', { successRedirect: '/get-display-name', failWithError: true }), function(err, req, res, next) {
  req.session.errorMessage = 'Guest log in failed, please try again';
  return res.redirect('/login');
}); 

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

      return res.redirect('/login'); 
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

router.get('/logout', authenticated, (req, res, next) => {
  // Logout of Passport
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/'); // Redirect to home page
  });
});

// Register Routes ---------------------------------------------------------------------------------------------------------------------------------

router.get('/register', notAuthenticated, viewController.serveRegister);

router.post('/register-user', viewController.registerUser, passport.authenticate('local', { successRedirect: '/', failWithError: true}), function(err, req, res, next)
{
  res.render(path.resolve(__dirname + '/../public/web/views/register'), {
    message: "User registered successfully but login failed, please login again"
  });
});

// Explore Page Routes -----------------------------------------------------------------------------------------------------------------------------

router.get('/explore', authenticated, viewController.serveExplore);
router.post('/update-session-display-name', authenticated, viewController.updateSessionName);
router.post('/create-magic-link', authenticated, viewController.createMagicLink);

// Manage Groups Page Routes -----------------------------------------------------------------------------------------------------------------------

router.post('/create-group', authenticated, viewController.createGroup);
router.post('/create-subgroup', authenticated, viewController.createSubgroup);
router.post('/delete-group', authenticated, viewController.deleteGroup);
router.post('/delete-subgroup', authenticated, viewController.deleteSubgroup);

// Manage Circle Page Routes -----------------------------------------------------------------------------------------------------------------------

router.get('/manage-circle/:circle_id', authenticated, viewController.serveManageCircle);
router.post('/update-access-restriction', authenticated, viewController.updateAccessRestriction);
router.post('/update-user-viewing', authenticated, viewController.updateUserViewing);
router.post('/update-user-editing', authenticated, viewController.updateUserEditing);

// Update Circle Group Page Routes -----------------------------------------------------------------------------------------------------------------

router.post('/update-circle-group', authenticated, viewController.updateCircleGroup);

// Profile Page Routes -----------------------------------------------------------------------------------------------------------------------------

router.get('/profile', authenticated, viewController.serveProfile);
router.post('/update-user-profile', authenticated, viewController.updateUserProfile);

// Manage Users Page Routes -----------------------------------------------------------------------------------------------------------------------

router.get('/manage-users', authenticated, viewController.serveManageUsers);
router.post('/create-user', authenticated, viewController.createUser);
router.post('/bulk-create-users', authenticated, viewController.bulkCreateUsers);
router.post('/update-usertype', authenticated, viewController.updateUsertype);

router.get('/sample-upload-file', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../public/web/views/sampleUserUpload.txt'));
});

// Your Magic Links Page Routes -------------------------------------------------------------------------------------------------------------------

router.get('/your-magic-links', authenticated, viewController.serveYourMagicLinks);
router.post('/renew-magic-link', authenticated, viewController.renewMagicLink);
router.post('/delete-magic-link', authenticated, viewController.deleteMagicLink);

// Uploaded Content Page Routes -------------------------------------------------------------------------------------------------------------------

router.get('/uploaded-content', authenticated, viewController.serveUploadedContent);
router.post('/upload-content', authenticated, viewController.uploadContent);
router.get('/uploads/:file_name', authenticated, viewController.serveUploadedFile);
router.post('/set-file-dimensions', authenticated, viewController.setFileDimensions);
router.post('/delete-uploaded-content', authenticated, viewController.deleteContent);

// Accessing Circles Routes -----------------------------------------------------------------------------------------------------------------------

// Room Exploration
// This route will look for and load worlds by folder name and use the shared room name of "explore". This will be a public room.
router.get('/w/:world_id', authenticated, circleController.serveWorld);

// Serving relative links properly (this also means we can't use index.html) ...
router.get('/w/:world_id/*', authenticated, circleController.serveRelativeWorldContent);

// Whiteboard Routes ------------------------------------------------------------------------------------------------------------------------------

router.get('/whiteboard-file/:file_name', authenticated, circleController.serveWhiteboardFile);
router.get('/get-user-uploaded-content', authenticated, circleController.getUserFiles);
router.post('/insert-whiteboard-file', authenticated, circleController.insertWhiteboardFile);
router.post('/remove-whiteboard-file', authenticated, circleController.removeWhiteboardFile);
router.post('/get-whiteboard-files', authenticated, circleController.getWhiteboardFiles);
router.post('/update-whiteboard-file-position', authenticated, circleController.updateFilePosition);

// Wardrobe Routes ------------------------------------------------------------------------------------------------------------------------------

router.post('/update-user-model', authenticated, circleController.updateUserModel);
router.post('/update-user-colour', authenticated, circleController.updateUserColour);

// CENTRAL SERVER ONLY ROUTES ----------------------------------------------------------------------------------------------------------------------

// More Circles Page Routes -----------------------------------------------------------------

router.get('/more-circles', centralServerController.serveMoreCircles);
router.post('/add-server', authenticated, centralServerController.addCirclesServer);
router.post('/deactivate-circles-server', authenticated, centralServerController.deactivateCirclesServer);
router.post('/activate-circles-server', authenticated, centralServerController.activateCirclesServer);
router.post('/delete-circles-server', authenticated, centralServerController.deleteCirclesServer);

router.get('/get-servers', centralServerController.getServersList); // This is requested from outside servers and can not have authenticated access only

// Prototyping Routes -----------------------------------------------------------------------

router.get('/prototyping', centralServerController.servePrototyping);
router.post('/create-new-prototype', centralServerController.createNewPrototype);
router.post('/update-prototype', centralServerController.updatePrototype);

// Museum Games Page Routes -----------------------------------------------------------------

router.get('/museum-games', centralServerController.serveMuseumGames);

// Magic Link Routes ------------------------------------------------------------------------------------------------------------------------------

// For forwarding magic links
// (Has to be last or routes below it will not work)
router.get('/:forwarding_name', viewController.forwardMagicLink);

module.exports = router;