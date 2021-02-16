const upload = require('../../helpers/uploads');

module.exports = {
  uploadLocal: (body, params) => {
    return upload.uploadLocal(body.files, params);
  }
};
