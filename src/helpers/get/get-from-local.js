const Promise = require('bluebird');
const fs = require('fs');
const httpError = require('http-errors');
const LocalDb = require('../db/')();
const resize = require('../resize');


module.exports = async (key, params) => {
  return getFile(key, params);
};

function getFile(key, params) {
  return new Promise((resolve, reject) => {
    LocalDb.getFile(key).then((fileName) => {
      if (fileName === false) {
        return reject(httpError(404));
      }
      fs.open(fileName, 'r', (err) => {
        if (err) {
          return reject(httpError(err.statusCode, err.message));
        }

        let resizeParams = resize.paramsParse(params.query);
        resizeParams = resize.paramsValidate(resizeParams);

        resize.process(fileName, fileName, resizeParams)
          .then((data) => {
            return resolve(data);
          })
          .catch((err) => {
            return reject(err);
          });
      });
    }).catch((err) => {
      return reject(httpError(err.statusCode, err.message));
    });
  });
}
