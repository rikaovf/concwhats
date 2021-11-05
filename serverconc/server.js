const app = require('./config/express')();

const port = app.get('port');


//INICIANDO SERVIDOR
app.listen(port, () => {
  console.log(`API operante na URL http://localhost:${port}`)
});


module.exports = app;