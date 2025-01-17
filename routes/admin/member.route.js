const express = require('express');
const memberModel = require('../../models/subscriber.model');
const roleModel = require('../../models/role.model');
const userModel = require('../../models/user.model');
const catModel = require('../../models/category.model');
const editorModel = require('../../models/editor.model');
const regModel = require('../../models/user.model');
const DATE_FORMATER = require('dateformat');

const route = express.Router();

// Danh sách thành viên
route.get('/', async function(req, res) {
    const list = await memberModel.allMember();
    const listRole = await roleModel.all;
      for(var subscriber of list)
      {
            subscriber.dob = DATE_FORMATER(subscriber.dob, 'dd/mm/yyyy') // định dạng lại ngày
            subscriber.expired = DATE_FORMATER(subscriber.expired, 'HH:MM:ss - dd/mm/yyyy') // định dạng lại ngày giờ
            var role = await roleModel.single(subscriber.roleId)
            subscriber.role = role[0].name
            if(subscriber.userID == res.locals.userId)
            {
                subscriber.self = true
            }
            else
            {
                subscriber.self = false
            }
            
      }
    res.render('admin/member/home', { member: list, roleList: listRole, isEmpty: listRole.length === 0 });
});

// Thêm thành viên
route.get('/add', async function(req, res) {
    const list = await roleModel.all();
    res.render('admin/member/add', { role: list });
});

route.post('/add', async function(req, res) {
    const userEnity = {
        username: req.body.username,
        password: req.body.password,
        roleId: req.body.roleId,
        status: 0
    };
    const registed = await regModel.regAdd(userEnity);
    req.body.userId = registed.insertedId;
    const info = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        dob: req.body.dob,
        userId: registed.insertId,
        avatar: "default.png"
    };
    await memberModel.add(info);
    res.redirect('/admin/member');
});

// Xem chi tiết
route.get('/view/:id', async function(req, res) {
    const id = req.params['id'];
    const list = await memberModel.view(id);
    var userObj = {
        name: list[0].name,
        phone: list[0].phone,
        email: list[0].email,
        avatar: list[0].avatar,
        dob: DATE_FORMATER(list[0].dob, 'yyyy-mm-dd'),
    }
    res.render('admin/member/view', { user: userObj });
});

//delete
route.post('/delete/:id', async function(req, res) {
    await memberModel.del(req.params.id);
    res.redirect('/admin/member');
});

route.get('/editor', async function(req, res){
    const listEditor = await memberModel.findAllEditor();
    const listRole = await roleModel.all;
    
    res.render('admin/member/editor/home',  { 
        member: listEditor,
        roleList: listRole, 
        isEmpty: listRole.length === 0 
    });
});
route.get('/editor/:id', async function(req, res){
    // if(res.locals.isadmin){
        
    // }
    const id = req.params.id || -1;
    const resultEditor = await userModel.view(id);
    const editor = resultEditor[0];
    if(editor){
        const listCate = await catModel.allSubCategory();
        const listCategoryByEditor = await editorModel.findCatByEditor(editor.id);
        return res.render('admin/member/editor/edit',{
            editor: editor,
            categories: listCate,
            existsCate: listCategoryByEditor,
        });
    }
    return res.redirect('/admin/member/editor');
})
route.post('/editor/:id', async function(req, res){

    const id = req.params.id || -1;
    // get editor by id
    const resultEditor = await userModel.view(id);
    // check if exists editor
    if(resultEditor){
        const editor = resultEditor[0];
        const catArr = req.body.catId;
        // find category of editor
        const listCategory = await editorModel.findAllByEditor(editor.id);
        // if category is none
       if( listCategory.length == 0 ){
        //    add to database
            for(const catId of catArr){
                await editorModel.add(catId, editor.id);
            }
       }else{ 
            // get exists cateId
            const existArr = [];
            listCategory.forEach(category => {
                existArr.push(category.category.toString());
            });
            // Add to database
            const addCategory = catArr.filter( x => existArr.indexOf(x) == -1);
            if(addCategory.length != 0){
                for(const catId of addCategory){
                    await editorModel.add(catId, editor.id);
                }
            }
            // remove from database
            const removeCategory = existArr.filter( x => catArr.indexOf(x) == -1);          
            if(removeCategory.length != 0){
                for(const catId of removeCategory){
                    await editorModel.delete(catId, editor.id);
                }
            }
            
       }
       return res.redirect(`/admin/member/editor/${editor.id}`);
    }
    return res.redirect('/admin/member/editor');
});
module.exports = route;