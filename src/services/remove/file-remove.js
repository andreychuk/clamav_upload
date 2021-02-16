const remove = require('../../helpers/remove');

module.exports = {
  removeLocal: (id, params) => {
    return remove.removeLocal(id, params);
  }
};
