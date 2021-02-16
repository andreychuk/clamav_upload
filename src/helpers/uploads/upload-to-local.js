const config = require('smart-config').get('local');
const Promise = require('bluebird');
const httpError = require('http-errors');
const LocalDb = require('../db/')();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const validateUpload = require('../validate_upload');
const mv = require('mv');

module.exports = async ({
  input
}) => {
  return upload(input);
};

function upload(file) {
  return new Promise((resolve, reject) => {
    const tmpFileName = getTargetFileName(file.name);
    const tmpFullName = getTargetFullName(tmpFileName);
    mv(file.path, tmpFullName, (err) => {
      if (err) {
        return reject(err);
      }
      validateUpload(file)
        .catch((err) => {
          return reject(httpError(400, err));
        }).then(() => {
          LocalDb.saveFile(tmpFullName)
            .then((fileKey) => {
              const fileUrl = config.files_baseurl + 'get/' + fileKey;
              return resolve({
                key: fileKey,
                url: fileUrl
              });
            }).catch((err) => {
              return reject(err);
            });
        });
    });
  });
}

function getTargetFullName(fileName) {
  return path.join(config.files_path, '/', fileName);
}

function getTargetFileName(fileName) {
  return '' + uuidv4() + '-' + fileName;
}
