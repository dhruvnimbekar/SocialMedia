const express = require("express");
const passport = require('passport');
const router = express.Router();

const userController = require('../controllers/user_controller');
//middleware
// router.get('/users',userController.user);
// router.get('/users/sign-in',userController.signIn);
// router.get('/users/sign-up',userController.signUp);
// router.post('/users/create',userController.create);
router.get('/profile/:id',passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);


router.post('/create', userController.create);
//router.post('/create-session', userController.createSession);
//use passport as middle ware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),userController.createSession);

 

router.get('/sign-out',userController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);

module.exports = router;