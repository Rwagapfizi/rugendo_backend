const express = require('express');
const bodyParser = require('body-parser');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const checkUserRole = require('../middlewares/checkUserRole.middleware');
const app = express();
const router = express.Router();
app.use(bodyParser.json());

router.post('/users/add', UserController.createUser);
router.get('/users/getUsers', checkUserRole(['WORKER']), UserController.getAllUsers);
router.post('/users/login', UserController.login);
router.get('/users/details', authMiddleware, UserController.getUserDetails);
router.delete('/users/delete/:id', UserController.deleteUserById);
router.get('/users/logout', UserController.logoutUser);

module.exports = router;
