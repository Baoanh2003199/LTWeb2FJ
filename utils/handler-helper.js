const hbs_sections = require('express-handlebars-sections');


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
};