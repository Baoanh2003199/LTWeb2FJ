const hbs_sections = require('express-handlebars-sections');
const moment = require('moment');

module.exports = {
    // section in view
    section: hbs_sections(),
    // if equal
    eq: function ( a, b, options){
        if( a == b){
            return options.fn(this);
        }
        return options.inverse(this);
    },
    // if not equal
    ne: function ( a, b, options){
        if( a != b){
            return options.fn(this);
        }
        return options.inverse(this);
    },
    formatDate: function(date, format){
       const mMoMent = moment(date);
       return mMoMent.format(format);
    },
   
};