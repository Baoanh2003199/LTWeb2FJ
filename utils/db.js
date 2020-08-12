const mysql = require('mysql');
const config = require('../config/default.json');

const pool = mysql.createPool(config.mysql);

module.exports = {
  load: function (sql) {
    return new Promise(function (fn_done, fn_fail) {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          
          return fn_fail(error);
        }
        fn_done(results);
      });
    });
  },
  insert: function (table, entity) {
    return new Promise(function (resolve, reject) {
      const sql = `insert into ${table} set ?`;
      pool.query(sql, entity, function (error, results) {
        if (error) {
          
          return reject(error);
        }

        resolve(results);
      });
    });
  },

  update: function (table, entity, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `update ${table} set ? where ?`;
      pool.query(sql, [entity, condition], function (error, results) {
        if (error) {
         
          return reject(error);
        }

        resolve(results);
      });
    });
  },

  delete: function (table, condition) {
    return new Promise(function (resolve, reject) {
      const sql = `delete from ${table} where ?`;
      pool.query(sql, condition, function (error, results, fields) {
        if (error) {
          
          return reject(error);
        }

        resolve(results);
      });
    });
  },
};
