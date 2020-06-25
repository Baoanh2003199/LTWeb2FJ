const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const loginModel = require('../models/login.model')

const redirectLogin = (req, res, next)=>{
    if(!req.session.userId)
    {
        res.redirect('/')
    }
    else
    {
        next();
    }
}

const PermissionCheck = (req, res, next)=>{
    if(!req.session.userId )
    {
  
        res.redirect('/')
    }
    else
    {
      if(req.session.role != 1)
      {
        res.redirect('/')
      }
      else
      {
          
        next();
      }
        
    }
  }

const redirectHome = (req, res, next)=>{
    if(req.session.userId)
    {
        res.redirect('/')
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
    res.send(req.body)
    /*const {username, password} = req.body
    if(username && password)
    {
        
        const result = await loginModel.byName(username);
        var hashed = result[0].password
        //var validUser = bcrypt.compareSync(password, hashed)
        if(password == hashed)
        {
            console.log(req.body)
            /*var {userId, name, role} = req.session
            req.session.userId = result[0].ID
            req.session.username = result[0].username
            req.session.role = result[0].role
            res.local.userId = result[0].ID
            res.local.username = result[0].username
            res.local.role = result[0].role
            res.redirect('/home')
            res.render('login',{isLoginSuccess: true});
        }
        else
        {
            res.render('login',{isLoginFalse: true});
        }
    }*/
});

module.exports = route;