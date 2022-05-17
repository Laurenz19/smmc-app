/* Message controller */
const { message, Message } = require("../models/message");
const { _utilisateur } = require("../models/user");

function getLastMessage(discu, user1, user2){
    let tab= [];
    discu.forEach(d => {
        if(d.id_sender === user1 && d.id_receiver === user2){
            tab.push(d);
        }

        if(d.id_sender === user2 && d.id_receiver === user1){
            tab.push(d);
        }
    });

    if(tab.length>0){
        return tab[tab.length-1]
    }else{
        return '';
    }
}

exports.postAddMessage = (req, res)=>{
    let description = '-';
    let content = req.body.content;
    let id_sender = req.body.id_sender;
    let id_receiver = req.body.id_receiver;
    let date_msg = req.body.date;
    let status = false;
    console.log(date_msg);

    let new_message = new Message(description, content, status, id_sender, id_receiver, date_msg);
    new_message.create();
    res.json({msg:'success'});
}

exports.getLastMessagebyUser = (req, res)=>{
   let user = req.body.user;
   let tabUser1 = [];
   let tabUser2 = [];
   let data = [];
   let lastMess = [];
   _utilisateur.findAll((users)=>{
       message.getDiscubyUser(user, (discussions)=>{
       
                users.forEach(_user => {

                    //Admin id
                    if(_user.id !== '400017'){
                        if(_user.id !== user){
                            if(getLastMessage(discussions, user, _user.id) !== ''){
                                data.push(getLastMessage(discussions, user, _user.id).id_message);

                                tabUser1[getLastMessage(discussions, user, _user.id).id_message] = {
                                    user: _user, message: getLastMessage(discussions, user, _user.id)
                                }
                            }else{
                                tabUser2.push(_user);
                            }
                        }   
                   }
                });
              
                //make the last message on the top
                data = data.reverse();
                data.forEach(elem => {
                    lastMess.push(tabUser1[elem]);
                });
                console.log(data)
                console.log(data.reverse())
                console.log(data.sort())
                console.log(lastMess);
               /* console.log(lastMess);
                console.log(tabUser2);*/
        
            res.json({msg: 'success', last: lastMess, NoMess: tabUser2, users: users});
       })
   })
}

exports.getMessagesSR = (req, res)=>{
    let user1 = req.body.user1;
    let user2 = req.body.user2;
    let date2 = req.body.date2;
    let date1 = req.body.date1;
    
    let data = [];
    let _messages = [];
    let discussion = [];
    message.findbyIds(user1, user2, date1, date2, 1, (data1)=>{
        message.findbyIds(user2, user1, date1, date2, 1, (data2)=>{
            
            //store data1 & data2 in _message and id_message into data 
            data1.forEach( elem1 => {
                data.push(elem1.id_message);
                _messages[elem1.id_message] = elem1;
            });

            data2.forEach(elem2 => {
                data.push(elem2.id_message);
                _messages[elem2.id_message] = elem2;
            });
            
            //Sorts the element of data (Ranger les élements de data par ordre alphabetique)
            data = data.sort();

            data.forEach(idMessage => {
                discussion.push(_messages[idMessage]);
            });

            res.json({msg:'success', discussion});
        })
    })
}

//update the status of the message 
/**
 * faire une mise à jour lorsque le message est déja
 * vu ou pas par le récépteur
 * cette fonction est nécessaire au moment de l'envoie du message
 * et au moment où le recepteur ouvre la discussion entre lui et l'emeteur
 * du message
 * "Saika very zaho"
 */
exports.postUpdateMessage = (req, res)=>{
    let id_sender = req.body.id_sender;
    let id_receiver = req.body.id_receiver;
    let description = '-';
    let content = req.body.content;
    let date = req.body.date;
    let status = req.body.status;
    let type = parseInt(req.body.type);

    if(status === 'true'){
        status = true;
    }
    if(status === 'false'){
        status = false;
    }
    
    /*---------------------------------------------------------*/
                message.description_msg = description;
                message.contenu_msg = content;
                message.id_receiver = id_receiver;
                message.id_sender = id_sender;
                message.date_msg = date;
                message.status = status;
    /*---------------------------------------------------------*/

    message.update(id_sender, id_receiver, content, date, type, (_message)=>{
        res.json({msg: _message});
    })
   
}

exports.deleteMessage = (req, res)=>{
    
}

exports.getAllMessage = (req, res)=>{
    let date = new Date(Date.now());
    let startdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 00:00:00`;
    let currentDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let nb = 0;
    let tab = [];
    console.log(req.body.user)
    message.findbyIds('', req.body.user, startdate, currentDate, 2, (sms)=>{
        sms.forEach(elem => {
            if(elem.status === 0){
                nb ++;
                if(tab.length>0){
                    if(tab[tab.length-1].id !== elem.id_sender){
                        tab.push({
                            id: elem.id_sender,
                            user: elem.sender_name,
                            photo: elem.sender_photo
                        })
                    }
                }else{
                    tab.push({
                        id: elem.id_sender,
                        user: elem.sender_name,
                        photo: elem.sender_photo
                    })
                }
            }
        });

        console.log(tab);
        console.log(nb);
        res.json({msg:'success', nb, tab})
    })
}