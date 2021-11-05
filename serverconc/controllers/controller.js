const whats = require('../whats.js')

const cl = whats.iniciaClient();

module.exports = () => {
 
  const controller = {};

  controller.getchats = (req, res) => res.status(200).json(console.log("teste"));
  controller.getcontact = (req, res) => res.status(200).json(cl.getcontact);
  controller.getmessages = (req, res) => res.status(200).json(cl.getmessages);

  return controller;
}
