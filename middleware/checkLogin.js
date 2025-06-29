const jwt = require('jsonwebtoken')

const checkLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    let decode = jwt.verify(token, process.env.PRIVATE_KEY)
    
    if (!req.cookies.token || !decode) {
        return res.redirect('/')
    }
    next();
  }
  catch (error) {
    console.log(error)
    return res.redirect('/')
  }
}

module.exports = checkLogin