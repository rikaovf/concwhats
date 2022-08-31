const { MessageMedia } = require('whatsapp-web.js');
const iconv = require('iconv-lite');
const cl = require('../whats.js');


client = cl.iniciaClient();



module.exports = () => {
 
  const controller = {};

  controller.getAllMsgs = (req, res) => getAllMsgs(client, res);
  controller.getAllChats = (req, res) => getAllChats(client, res);
  controller.sendMsg = (req, res) => sendMsg(client, req, res);
  controller.getUser = (req, res) => getUser(client, res);
  controller.getMsgFromChat = (req, res) => getMsgFromChat(client, req, res);
  controller.deleteChat =  (req, res) => deleteChat(client, req, res);

  return controller;
}




/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// getUser //////////////////////////////////////////
/////////////// Função que retorna o numero utilizado pelo usuário //////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getUser(cli, res){

  let user = cli.info.wid.user;

  res.json(user);
  
  }








/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// getAllMsgs/ProcessChats ////////////////////////////////
//////// Função que retorna apenas as mensagens de todos os chats existentes ////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getAllMsgs(cli, res){

let result = await processChats(cli);

res.json(result);

}


async function processChats(cl, req){

/*let searchOptions = { 
  limit : req.body.limit ? req.body.limit : 5
}*/

let chatsMsgs = await cl.getChats().then((chat) => {

  let promisesMsg = chat.map((promise) => {
    return Promise.resolve(promise.fetchMessages(searchOptions).then((msgs) => {
      return msgs;
    }))
  })

  return Promise.all(promisesMsg).then((msg) => {
    return msg;
  })
    
})

return chatsMsgs;

}





////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// getAllChats /////////////////////////////////////
//////////////////// Função que retorna todos os Chats existentes //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function getAllChats(cl, res){

  let allChats = await cl.getChats().then((chats) => {
    return chats;      
  })
  
  res.json(allChats);
  
  }






/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// getMsgFromChat/ProcessChat ///////////////////////////////
//////////////// Função que retorna as mensagens de um chat específico //////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getMsgFromChat(cli, req, res){

  let arrMsg = [];
  let result = await processChat(cli, req);

  let promisesMsg = result.map((promise) => {
    if(promise.hasMedia){
      return Promise.resolve(promise.downloadMedia().then((media) => {
        promise.mediaDownloaded = media;
        return promise;
      }))  
    } else {
      return promise;
    }
  })
  
  let finalMsg = await Promise.all(promisesMsg).then((msg) => {
    return msg;
  })
  
  if (finalMsg !== undefined){
    cli.sendSeen(req.query.id);
  }

  //console.log(finalMsg);

  res.json(finalMsg);
  
}








////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// getMsgFromChat /////////////////////////////////////
///////////////// Função que retorna mensagens de um chat específico ///////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function processChat(cl, req){

  let searchOptions = { 
    limit : req.query.limit ? req.query.limit : 5
  }

  let chatMsgs = cl.getChatById(req.query.id).then((chat) => {
    let promisesMsg = chat.fetchMessages(searchOptions).then((msgs) => {
      return msgs;
    })
    return promisesMsg;
  })  
  return chatMsgs;
}


  
  










////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// sendTo ///////////////////////////// ///////////
/////////////////// Função que envia mensagem ao contato desejado //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function sendMsg(cl, req, res){

response = {
  id:req.body.id,
  text:req.body.text,
  type:req.body.type,
  media:req.body.media,
  sendseen:req.body.sendseen
};

if(req.body.media !== ''){
  response.media = MessageMedia.fromFilePath(response.media);
}

res.end(JSON.stringify(response));

cl.sendMessage(response.id, req.body.media !== '' ? response.media : response.text, { sendSeen: response.sendseen } ).then((result) => {
    return result;
  })

}










////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// DeleteChat ///////////////////////////////////////
////////////////////////////// Função para deletar o chat. /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function deleteChat(cl, req, res){
  
    response = {
      id:req.query.id
    };
    
    res.end(JSON.stringify(response));
    
    cl.getChatById(response.id).then((chat) => {
      chat.delete().then((result) =>{
        console.log(result);
      })    
    })
}
