const formidable = require('formidable');
const clamev = require('clamav.js');
const config = require('smart-config').get('clamav');
const fs=require('fs');

module.exports = async (req, res, next) => {
  const formData = new formidable.IncomingForm();
  formData.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
    } else {
      if (files.input?.path) {
        return new Promise((resolve, reject) => {
          const stream = fs.createReadStream(files.input.path);
          clamev.createScanner(config.port, config.host).scan(stream, function (err, object, malicious) {
            if (err) {
              return reject(err);
            } else if (malicious) {
              return reject(malicious);
            } else {
              return resolve(files);
            }
          });
        }).then((files) => {
          req.body.files = files;
          next();
        }).catch((err) => {
          next(err);
        });
      } else {
        next(Error('Need file to check.'));
      }
    }
  }).then(() => {
    next();
  }).on('error', (err) => {
    next(err);
  });
};
