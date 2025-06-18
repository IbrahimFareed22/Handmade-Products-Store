const express = require('express');
const router = express.Router();
const userController=require('../controllers/usercontroller')

// RESTful routes
router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)


// Auth routes
router.post('/register', userController.userregister);
router.post('/login', userController.userlogin);


module.exports = router;