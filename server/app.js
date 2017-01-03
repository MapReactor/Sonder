const express = require('express');
const app = express();
const port = 3000;

require('./middleware.js')(app, express);

app.listen(port, function() {
  console.log('Now listening on port', port);
});

module.exports = app;
