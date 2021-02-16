const Promise = require('bluebird');
const fs = require('fs');
const httpError = require('http-errors');
const LocalDb = require('../db/')();

module.exports = async (key) => {
  return removeFile(key);
};

function removeFile(filekey) {
  return new Promise((resolve, reject) => {
    // Loading filename by key
    LocalDb.getFile(filekey).then((filename) => {
      // Deleting file
      fs.unlink(filename, (err) => {
        if (err) {
          return reject(httpError(err.statusCode, err.message));
        }
        LocalDb.deleteFile(filekey);
        resolve({ key: filekey });
      });
    }).catch((err) => {
      return reject(httpError(err.statusCode, err.message));
    });
  });
}
