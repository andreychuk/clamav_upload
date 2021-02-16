const uploadMimes = require('smart-config').get('uploadMimes');

module.exports = (file) => {
  return fileValidate(file);
};

const fileValidate = (file) => {
  return new Promise((resolve, reject) => {
    const mimesList = fileValidateGetMimes();

    if (mimesList === false) {
      return resolve(true);
    }
    fileValidateCheckMimeType(file.type, mimesList)
      .then(() => { return resolve(true); })
      .catch((error) => { return reject(error); });

  });
};

const fileValidateGetMimes = () => {
  if (uploadMimes === undefined || uploadMimes === '' || uploadMimes === 'UPLOAD_MIME_TYPES') {
    return false;
  }
  return uploadMimes.split(',');
};

const fileValidateCheckMimeType = async (mimetype, mimesList) => {
  if (mimetype === '') {
    throw new Error('Unable to detect MIME type');
  }

  if (mimesList.indexOf(mimetype) === -1) {
    throw new Error('MIME type not allowed');
  }
  return true;
};
