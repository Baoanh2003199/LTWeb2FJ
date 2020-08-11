const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const loginModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const subModel = require('../models/subscriber.model');


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

            var validUser = bcrypt.compareSync(password, hashed)
            if(validUser)
            {
                var {userId, name} = req.session;
                req.session.userId = result[0].id;
                req.session.name = result[0].username;
                const sub = await subModel.byUserId(result[0].id);
                const roleObj = await roleModel.single(result[0].roleId);
                if(sub[0].expired < new Date(Date.now()) && roleObj[0].code == 'SUBSCRIBER')
                {
                    const roleOnChange = await roleModel.byCode('CASUAL');
                    const updatedUser={
                        id: result[0].id,
                        username: result[0].username, 
                        password: result[0].password,
                        roleId: roleOnChange[0].id,
                        status: 0 
                    }
                    loginModel.update(updatedUser);
                    req.session.role = 'CASUAL';
                    res.render('notification');
                }
                else
                {
                    req.session.role = roleObj[0].code;
                    res.redirect('/');
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
        
    }
    else
    {
        res.render('login',{isLoginFalse: true});
    }
});


module.exports = route;