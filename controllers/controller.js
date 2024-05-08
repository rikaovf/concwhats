const { MessageMedia } = require('whatsapp-web.js');
const iconv = require('iconv-lite');
const cl = require('../whats.js');
const { response } = require('express');


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
  controller.sendSeen =  (req, res) => sendSeen(client, req, res);

  return controller;
}



/*try {
       
      } catch (e) {
          console.log(e);
          console.log('ERRO => getStatus');
      }*/



async function getStatus(cli, res){

  if ( cli.ready !== true ) return;

  try {
          let status = await cli.getState();

          res.json(status);
      } catch (e) {
          console.log(e);
          console.log('ERRO => getStatus');
      }
  
}





/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// getUser //////////////////////////////////////////
/////////////// Função que retorna o numero utilizado pelo usuário //////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getUser(cli, res){

  if ( cli.ready !== true ) return;

  try {
        let user = cli.info.wid.user;

        res.json(user);     
      } catch (e) {
          console.log(e);
          console.log('ERRO => getUser');
      }

  
  
  }








/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// getAllMsgs/ProcessChats ////////////////////////////////
//////// Função que retorna apenas as mensagens de todos os chats existentes ////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getAllMsgs(cli, res){

if ( cli.ready !== true ) return;

try {
      let result = await processChats(cli);

      res.json(result);
       
      } catch (e) {
          console.log(e);
          console.log('ERRO => getAllMsgs');
      }


}


async function processChats(cli, req){

try {
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
      } catch (e) {
          console.log(e);
          console.log('ERRO => processchats');
      }


}





////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// getAllChats /////////////////////////////////////
//////////////////// Função que retorna todos os Chats existentes //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function getAllChats(cli, res){

  if ( cli.ready !== true ) return;
  
try {
      let allChats = await cli.getChats().then((chats) => {
        return chats;      
      })
      
      res.json(allChats); 
      } catch (e) {
          console.log(e);
          console.log('ERRO => getAllChats');
      }
  
  }






/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// getMsgFromChat/ProcessChat ///////////////////////////////
//////////////// Função que retorna as mensagens de um chat específico //////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getMsgFromChat(cli, req, res){

  try {
      let arrMsg = [];
      let result = await processChat(cli, req);
      
      if (result !== undefined){
        if(req.query.sendseen == 'S'){
          cli.sendSeen(req.query.id);
        }
      }

      res.json(result);
      } catch (e) {
          console.log(e);
          console.log('ERRO => getMsgFromChat');
      }

  
  
}









/////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// getMsgById ////////////////////////////////////////
///////////////// Função que retorna a mensagem de um chat específico ///////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function getMsgById(cli, req, res){

  try {
       let message = await cli.getMessageById(req.query.id).then((msg) => {
          //console.log(msg);
          return msg;
        })

        let mediaDownloaded = await message.downloadMedia().then( (media) => {
          return media;
        })
        
        //console.log(mediaDownloaded);

        res.json(mediaDownloaded);
      } catch (e) {
          console.log(e);
          console.log('ERRO => getMsgByID');
      }
  
}








////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// getMsgFromChat /////////////////////////////////////
///////////////// Função que retorna mensagens de um chat específico ///////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function processChat(cli, req){

  if ( cli.ready !== true || req.query.id.indexOf('g.us') > 0) return;

  try {

      var idValid = cli.isRegisteredUser(req.query.id).then((isValid) => {
        return isValid;
      })
      
      if(idValid){
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
      } else{
        console.log(`invalid WID: ${req.query.id}`)
        return [new Object()];
      }
             
      } catch (e) {
          console.log(e);
          console.log('ERRO => ProcessChat');
      }

  
}


  
  










////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// sendTo ///////////////////////////// ///////////
/////////////////// Função que envia mensagem ao contato desejado //////////////////////
////////////////////////////////////////////////////////////////////////////////////////

async function sendMsg(cli, req, res){

if ( cli.ready !== true ) return;

try {
      console.log(req.body)    

       var response = {
        id:req.body.id,
        text:req.body.text,
        type:req.body.type,
        media:req.body.media,
        sendseen:req.body.sendseen,
        objMedia:req.body.obj,
      };

      
      if(typeof(req.body.obj) != 'undefined'){
          response.media = new MessageMedia(req.body.obj.mimetype, req.body.obj.data, req.body.obj.filename)
      }else if(req.body.media !== undefined && req.body.media !== ''){
          response.media = MessageMedia.fromFilePath(response.media);
      }

      let idmsg = await ReturnIdMessage(cli, req, response);

      res.json(idmsg.id.id);

      } catch (e) {
          console.log(e);
          console.log('ERRO => SendMsg');
      }



//res.end(JSON.stringify(response));

}










////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// DeleteChat ///////////////////////////////////////
////////////////////////////// Função para deletar o chat. /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function deleteChat(cli, req, res){
    
    if ( cli.ready !== true ) return;

    try {
      var response = {
        id:req.query.id
      };
      
      res.end(JSON.stringify(response));
      
      cli.getChatById(response.id).then((chat) => {
        chat.delete().then((result) =>{
          //console.log(result);
        })    
      })
       
      } catch (e) {
          console.log(e);
          console.log('ERRO => deleteChat');
      }

    
}









async function ReturnIdMessage(cli, req, response){

try {  
      var msg = cli.sendMessage(response.id, (req.body.media !== undefined && req.body.media !== '') ? response.media : decodeURI( response.text ), { sendSeen: response.sendseen } ).then((result) => {
        console.log(result);
        return result;
      })

    } catch (e) {
        console.log(e);
        console.log('ERRO => ReturnIdMessage')  
        
        var msg = cli.sendMessage(response.id, (req.body.media !== undefined && req.body.media !== '') ? response.media : response.text, { sendSeen: response.sendseen } ).then((result) => {
          console.log(result); 
          return result;
        })
    } finally {
        return msg;
    }


}









/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// getMsgFromChat/ProcessChat ///////////////////////////////
//////////////// Função que retorna as mensagens de um chat específico //////////////////
/////////////////////////////////////////////////////////////////////////////////////////

async function sendSeen(cli, req, res){

  try {
        response = {
          id:req.body.id,
        };

        res.end(JSON.stringify(response));

        if(req.body.id !== ''){
          cli.sendSeen(req.body.id);
        }         
      } catch (e) {
          console.log(e);
          console.log('ERRO => sendSeen');
      }
}

