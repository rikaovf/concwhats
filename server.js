//const cl = require('./whats.js');
const app = require('./config/express')();

const port = app.get('port');


//cl.iniciaClient();

//INICIANDO SERVIDOR
app.listen(port, () => {
  console.log("API operante na URL http://localhost:${port}")
});


module.exports = app;
