const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');


route.get('/', redirectHome, function(req,res){
    res.render('login');
})

const redirectLogin = (req, res, next)=>{
    if(!req.session.userId)
    {
        res.redirect('/login')
    }
    else
    {
        next();
    }
}


const PermissionCheck = (req, res, next)=>{
    if(!req.session.userId )
    {
  
        res.redirect('/login')
    }
    else
    {
      if(req.session.role != 1)
      {
        res.redirect('/Error')
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

module.exports = route;