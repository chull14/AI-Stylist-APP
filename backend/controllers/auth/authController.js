import User from '../../models/User.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';

const handleLogin = async (req, res) => { // handle login of user
  const { username, pwd } = req.body;
  if (!username || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

  const foundUser = await User.findOne({ username: username.trim() }).select('+password').exec();

  if (!foundUser) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles);
    // create JWTs
    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "id": foundUser._id,
          "username": foundUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    ); 
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Saving refresh token with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);


    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }); 
    res.json({ 
      accessToken,
      user: {
        id: foundUser._id,
        username: foundUser.username,
        roles: foundUser.roles
      }
     });
  } else {
    res.sendStatus(401);
  }
}

const handleLogout = async (req, res) => { // handle logout of user
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie('jwt', { 
      httpOnly: true, 
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 
    });
    return res.sendStatus(204);
  }
  
  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie('jwt', { 
    httpOnly: true, 
    sameSite: 'None',
    secure: true,
  });
  res.sendStatus(204);
}

const handleNewUser = async (req, res) => { // register new user
  const { username, pwd, email } = req.body;
  if (!username || !pwd || !email) return res.status(400).json({ message: 'Username, email, and password required.' });

  // check for duplicate usernames in db
  const duplicateUsername = await User.findOne({ username: username }).exec(); 
  const duplicateEmail = await User.findOne({ email: email }).exec();

  if (duplicateUsername) return res.status(409).json({ "message": "Account with this username already exists" }); 
  if (duplicateEmail) return res.status(409).json({ "message": "Account with this email already exists" }); 

  try {
    // encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    // create and store the new user
    const newUser = await User.create({
      "username": username.trim(), 
      'email': email.trim().toLowerCase(),
      "password": hashedPwd,
    });
    console.log(newUser);

    // Create tokens for the new user
    const roles = Object.values(newUser.roles);
    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "id": newUser._id,
          "username": newUser.username,
          "roles": roles
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30m' }
    ); 
    const refreshToken = jwt.sign(
      { "username": newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    // Save refresh token with new user
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // Set refresh token cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    }); 

    res.status(201).json({ 
      accessToken,
      user: {
        id: newUser._id,
        username: newUser.username,
        roles: newUser.roles
      }
    });
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
}

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        { 
          "UserInfo": {
            "id": foundUser._id,
            "username": foundUser.username,
            "roles": roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );
      res.json({ 
        accessToken,
        user: {
          id: foundUser._id,
          username: foundUser.username,
          roles: foundUser.roles
        }
      });
    }
  );
}

export default { 
  handleLogin,
  handleLogout,
  handleNewUser,
  handleRefreshToken
 }