function requireUser(req, res, next) {
    const user = req.get('x-user')
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = user
    next()
  }
  
  module.exports = requireUser
  