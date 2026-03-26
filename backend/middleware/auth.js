const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from HTTP-Only cookies
  const token = req.cookies?.token;

  // Check if not token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;

    // 3. Implement token refresh (sliding session)
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // If token expires in less than 15 minutes, issue a new one
    if (decoded.exp - nowInSeconds < 900) {
      const payload = { user: { id: req.user.id } };
      const newToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
      });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
