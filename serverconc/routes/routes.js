module.exports = app => {
  const controller = require('../controllers/controller')();

  app.route('/getchats')
    .get(controller.getchats);

  app.route('/getcontact')
    .get(controller.getcontact);

  app.route('/getmessages')
    .get(controller.getmessages);
    
  /*app.route('/getchats')
    .get(controller.listCustomerWallets);
    
  app.route('/getchats')
    .get(controller.listCustomerWallets);*/
}