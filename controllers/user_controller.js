//const { response } = require('express');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}
module.exports.update = async function (req, res) {
    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //     });
    // } else {
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }

    try{
     let user = await User.findById(req.params.id);
     User.uploadedAvatar(req,res,function(err){
         if(err){
             console.log(err);
             return; }

            // console.log(req.file);
            user.name = req.body.name;
            user.email = req.body.email;
            if(req.file){
                console.log(user.avatar);
                if (user.avatar){
                    if (fs.existsSync(path.join(__dirname, '..', user.avatar))) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                   
                }

                user.avatar = User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
     })
    }catch(err){
        req.flash('error', err);
    return res.redirect('back');
    }
}

module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: "signUp"
    });
}

module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "signIn"
    });
}

module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            // console.log("error in finding user in signup");
            req.flash('error', err);
            return;
        }
        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) {
                    // console.log("error in finding user in signup");
                    req.flash('error', err);
                    return;
                }

                return res.redirect('/users/sign-in');
            })
        } else {
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }


    })
}

// module.exports.createSession = function(req,res){

// User.findOne({email:req.body.email},function(err,user){
//     if(err){
//         console.log("error in finding user in signuin");
//         return;
//     }

//  if(user){
//   // authentcate password
// if(user.password != req.body.password){
//     return res.redirect('back');
// }

//   res.cookie('user_id',user.id);
//   return res.redirect('/users/profile');

//  }else{
//  return res.redirect('back');

//  }


// })

// }

module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    return res.redirect('/');
}