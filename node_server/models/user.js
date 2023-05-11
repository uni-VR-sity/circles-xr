'use strict';

//database
const mongoose = require('mongoose');

const bcrypt   = require('bcrypt');
const dotenv   = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({});
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

env = dotenvParseVariables(env.parsed);

const UserSchema = new mongoose.Schema({
  username: {
    type:       String,
    unique:     true,
    required:   true,
    trim:       true
  },
  usertype: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  password: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       false
  },
  worldAccess: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'worlds' 
  }],
  gltf_head_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  gltf_hair_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  gltf_body_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_head: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hair: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_body: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hand_left: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hand_right: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  }
});

// Verify password for this user
UserSchema.methods.validatePassword = function (password, next) {
  // NOTE: "Function" method here is *needed* to ensure "this" is the current
  // user object, not the global context when within the compare callback. This
  // is a good example of when to use function vs fat arrows.
  bcrypt.compare(password, this.password, (err, result) => {
    if (result === true) {
      return next(null, this);
    } else {
      console.log('authentication FAILED');
      return next(err);
    }
  })
};

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('users', UserSchema);

const addSuperUser = async function()
{
  let count = await User.countDocuments();

  if (count > 0)
  {
    console.log('Superuser already added to database');
  }
  else
  {
    const userData = {
      username: 'superuser',
      usertype: CIRCLES.USER_TYPE.SUPERUSER,
      password: env.DEFAULT_PASSWORD,
      gltf_head_url: CIRCLES.CONSTANTS.DEFAULT_GLTF_HEAD,
      gltf_hair_url: CIRCLES.CONSTANTS.DEFAULT_GLTF_HAIR,
      gltf_body_url: CIRCLES.CONSTANTS.DEFAULT_GLTF_BODY,
      color_head: CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR,
      color_hair: CIRCLES.CONSTANTS.DEFAULT_HAIR_COLOUR,
      color_body: CIRCLES.CONSTANTS.DEFAULT_BODY_COLOUR,
      color_hand_right: CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR,
      color_hand_left: CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR,
    };

    let user = null;
    let error = null;

    async function createNewUser(newUser) 
    {
      try {
        user = await User.create(newUser);
      } 
      catch(err) 
      {
        error = err;
      }
    }

    createNewUser(userData).then(function() {
      if (error) 
      {
        throw "Superuser creation error: " + error.message;
      } 
      else 
      {
        console.log('Added superuser to database');
      }
    });
  }
}

addSuperUser();

module.exports = User;
