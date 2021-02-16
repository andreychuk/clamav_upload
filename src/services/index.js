const upload = require('./upload/file-upload');
const getFile = require('./get/get-file');
const removeFile = require('./remove/file-remove');
const downloadFile = require('../middleware/file-download');
const jwtAuth = require('../middleware/jwt-auth');
const clamav = require('../middleware/clamev');



module.exports = function (app) {
  app.use('/upload',
    jwtAuth,
    clamav,
    { create: upload.uploadLocal }
  );
  app.use('/remove', jwtAuth, { remove: removeFile.removeLocal });
  app.use('/get', { get: getFile.getLocal }, downloadFile);
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world from Express middleware'
    });
  });

};
