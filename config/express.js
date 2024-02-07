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
  app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // ACIONANDO A PASTA DE ROTAS DO SERVIDOR DA API
  require('../routes/routes')(app);

  return app;
};

