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
  controller.getStatus = (req, res) => getStatus(client, res);
  controller.getMsgFromChat = (req, res) => getMsgFromChat(client, req, res);
  controller.getMsgById = (req, res) => getMsgById(client, req, res);
  controller.deleteChat =  (req, res) => deleteChat(client, req, res);

  return controller;
}







async function getStatus(cli, res){

  if ( cli.ready !== true ) return;

  let status = await cli.getState();

  res.json(status);
  
}





/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// getUser //////////////////////////////////////////
/////////////// Função que retorna o numero utilizado pelo usuário //////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getUser(cli, res){

  if ( cli.ready !== true ) return;

  let user = cli.info.wid.user;

  res.json(user);
  
  }








/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// getAllMsgs/ProcessChats ////////////////////////////////
//////// Função que retorna apenas as mensagens de todos os chats existentes ////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getAllMsgs(cli, res){

if ( cli.ready !== true ) return;

let result = await processChats(cli);

res.json(result);

}


async function processChats(cli, req){

/*let searchOptions = { 
  limit : req.body.limit ? req.body.limit : 5
}*/

let chatsMsgs = await cli.getChats().then((chat) => {

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

async function getAllChats(cli, res){

  if ( cli.ready !== true ) return;
  
  let allChats = await cli.getChats().then((chats) => {
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

  /*let promisesMsg = result.map((promise) => {
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
  })*/
  
  if (result !== undefined){
    if(req.query.sendseen == 'S'){
      cli.sendSeen(req.query.id);
    }
  }

  //console.log(finalMsg);

  res.json(result);
  
}









/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// getMsgById ////////////////////////////////////////
///////////////// Função que retorna a mensagem de um chat específico ///////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getMsgById(cli, req, res){

  let message = await cli.getMessageById(req.query.id).then((msg) => {
    //console.log(msg);
    return msg;
  })

  let mediaDownloaded = await message.downloadMedia().then( (media) => {
    return media;
  })
  
  //console.log(mediaDownloaded);

  res.json(mediaDownloaded);
  
}








////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// getMsgFromChat /////////////////////////////////////
///////////////// Função que retorna mensagens de um chat específico ///////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function processChat(cli, req){

  if ( cli.ready !== true ) return;

  let searchOptions = { 
    limit : req.query.limit ? req.query.limit : 5
  }

  let chatMsgs = cli.getChatById(req.query.id).then((chat) => {
    let promisesMsg = chat.fetchMessages(searchOptions).then((msgs) => {
      //console.log(msgs);
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

async function sendMsg(cli, req, res){

if ( cli.ready !== true ) return;

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

let idmsg = await ReturnIdMessage(cli, req, response);

res.json(idmsg.id.id);

//res.end(JSON.stringify(response));

}










////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// DeleteChat ///////////////////////////////////////
////////////////////////////// Função para deletar o chat. /////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function deleteChat(cli, req, res){
    
    if ( cli.ready !== true ) return;

    response = {
      id:req.query.id
    };
    
    res.end(JSON.stringify(response));
    
    cli.getChatById(response.id).then((chat) => {
      chat.delete().then((result) =>{
        //console.log(result);
      })    
    })
}









async function ReturnIdMessage(cli, req, response){

let msg = cli.sendMessage(response.id, req.body.media !== '' ? response.media : decodeURI( response.text ), { sendSeen: response.sendseen } ).then((result) => {
    return result;
  })

return msg;

}
