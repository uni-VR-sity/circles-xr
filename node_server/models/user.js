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
    trim:       false,
  },
  gltf_head_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HEAD
  },
  gltf_hair_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HAIR
  },
  gltf_body_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_GLTF_BODY
  },
  color_head: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
  },
  color_hair: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_HAIR_COLOUR
  },
  color_body: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_BODY_COLOUR
  },
  color_hand_left: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
  },
  color_hand_right: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true,
    default:    CIRCLES.CONSTANTS.DEFAULT_SKIN_COLOUR
  }
});

// Verify password for this user
UserSchema.methods.validatePassword = function (password, next) {
  // NOTE: "Function" method here is *needed* to ensure "this" is the current
  // user object, not the global context when within the compare callback. This
  // is a good example of when to use function vs fat arrows.
  console.log(password);
  bcrypt.compare(password, this.password, (err, result) => {
    if (result === true) {
      return next(null, this);
    } else {
      return next(err);
    }
  })
};

// Comparing passwords
// If they match, return true
// If they don't, return false
UserSchema.methods.comparePasswords = function(password) 
{
  return bcrypt.compareSync(password, this.password);
};

// Hashing a password before saving it to the database
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

// Hashing a password before updating it in the database
// https://github.com/Automattic/mongoose/issues/4575 
UserSchema.pre('findOneAndUpdate', async function () 
{
  if (this._update)
  {
    if (this._update.password)
    {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    }
  }
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
