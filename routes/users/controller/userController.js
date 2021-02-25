const bcrypt = require("bcryptjs");

module.exports = {
  
  loadUsers: async (req, res) => {
    res.send('this loads users')
    // console.log(req.body)
    // res.send(req.body)
  },

  createUser: async (req, res) => {
    res.send(req.body)
  },
  }