var express = require('express');
var router = express.Router();

const {
  loadUsers,
  createUser,
} = require('./controller/userController');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/load-users', loadUsers);

router.post('/create-user', createUser);


module.exports = router;
