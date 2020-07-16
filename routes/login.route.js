const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const loginModel = require('../models/user.model');
const roleModel = require('../models/role.model');


const redirectLogin = (req, res, next)=>{
    if(!res.locals.isLoggedIn)
    {
        res.redirect('/');
    }
    else
    {
        next();
    }
}

const PermissionCheck = (req, res, next)=>{
    if(!res.locals.isLoggedIn )
    {
        res.redirect('/');
    }
    /*else
    {
      if(req.session.role != 1)
      {
        res.redirect('/')
      }
      else
      {
          
        next();
      }
        
    }*/
  }

const redirectHome = (req, res, next)=>{
    if(res.locals.isLoggedIn)
    {
        res.redirect('/');
    }
    else
    {
        next();
    }
}

route.get('/', redirectHome, function(req,res){
    res.render('login');
})

route.post('/', redirectHome, async function(req, res) {
    const {username, password} = req.body;
    if(username && password)
    {
        const result = await loginModel.byName(username);
        if(result[0])
        {
            var hashed = result[0].password
            const roleObj = await roleModel.single(result[0].roleId);
            var validUser = bcrypt.compareSync(password, hashed)
            if(validUser)
            {
                var {userId, name} = req.session;
                req.session.userId = result[0].id;
                req.session.role = roleObj[0].code;
                req.session.name = result[0].username;
                res.redirect('/');
            }
            else
            {
                res.render('login',{isLoginFalse: true});
            }
        }
        else
        {
            res.render('login',{isLoginFalse: true});
        }
        
    }
    else
    {
        res.render('login',{isLoginFalse: true});
    }
});


module.exports = route;