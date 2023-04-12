module.exports = app => {
  const controller = require('../controllers/controller')();

  app.route('/getallmsgs')
    .get(controller.getAllMsgs);

  app.route('/getallchats')
    .get(controller.getAllChats);

  app.route('/getmsgfromchat')
    .get(controller.getMsgFromChat);
  
  app.route('/getmsgbyid')
    .get(controller.getMsgById);

  app.route('/getuser')
    .get(controller.getUser);

  app.route('/getstatus')
    .get(controller.getStatus);    
  
    app.route('/sendmsg')
    .post(controller.sendMsg);
      
  app.route('/deletechat')
    .post(controller.deleteChat);
}
