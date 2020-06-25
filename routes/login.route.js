const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');

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

module.exports = route;