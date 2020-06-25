const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');

route.post('/login', redirectHome, async function(req, res) {
    const {username, password} = req.body
    if(username && password)
    {
        const result = await LoginModel.findUser(username);
        var hash = result[0].password
        var validUser = bcrypt.compareSync(password, hash)
        if(result)
        {
            var {userId, name, role} = req.session
            req.session.userId = result[0].ID
            req.session.name = result[0].username
            req.session.role = result[0].role
            res.redirect('/')
        }
        else
        {
            res.render('login',{isLoginFalse: true});
        }
    }
})

app.get('/', redirectHome, function(req,res){
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