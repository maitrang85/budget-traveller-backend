'use strict';

const httpError = (message, status) => {
  const err = new Error(message, status);
  err.status = status;
  return err;
};

module.exports = {
  httpError,
};
