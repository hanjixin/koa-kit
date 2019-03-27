const {connect , initSchemas} = require('./dataBaseInit');
(async function () {
  await connect()
  initSchemas()
})();