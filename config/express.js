const express    = require('express')
const bodyParser = require('body-parser')
const config     = require('config')

//const whats = require('../whats.js')

module.exports = () => {
  
  const app = express();

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // MIDDLEWARES
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({limit: 1000000}));

  // ACIONANDO A PASTA DE ROTAS DO SERVIDOR DA API
  require('../routes/routes')(app);

  return app;
};

