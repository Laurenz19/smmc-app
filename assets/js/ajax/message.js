/* jquery for a private chat application inside SMMC Company */
$(document).ready(function(){
     //create a socket.io instance
   var socket = io.connect('http://localhost:8080');
   var days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
   var month = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
   let user_role = $('#_user_role').val();
   let user_id = $('#_user_id').val();
    getConnection();
   // getAllTechnicien(0);

    console.log($('.all_message').height());

    socket.on("user_connected", ()=>{
        displayUsers(user_id, user_role);
        NotifMessageNotSeen();
    })

    socket.on('get_user', ()=>{
        displayUsers(user_id, user_role);
    });

    function getConnection(){
        let data = $('#sender').html().split('/');
        let sender = {
            socketId: '',
            id: data[1],
            username: data[0],
        }
 
        console.log(data);
        socket.emit("user_connected", sender);
    }

   function get_users(id, role, cb){
       $.ajax({
        url:'/get_users',
        method:'get',
        dataType:'json',
        success:(result)=>{
            let users = result.users;
            let data = [];
            users.forEach(user => {
                if(id !== user.id){
                    if(role === "Technicien"){
                        data.push(user);
                    }else{
                        if(user.role === "Technicien"){
                            data.push(user);
                        }
                    }
                }
            });
            return cb(data);
        },
        error:()=>{
            alert('server error ~ get_users')
        }
       })  
   } 

   function getStatus(id, tab){
        let n = 0;
        let status = '';
        $.each(tab, (index, user)=>{
            if(user.id !== id){
                n++;
            }
        })

        if(n === tab.length){
            status = 'avatar-offline';
        }else status = 'avatar-online';

        return status;
    }

   function displayUsers(user_id, user_role){
       $('.tech_list').html('');
        get_users(user_id, user_role, (users)=>{
            if(users.length>0){
                $('.title_left').html(`${users[0].id} - ${users[0].nom}`);
                showMessageSR(user_id, users[0].id);
                let avatar = '';
                let status = '';
                let user_info = '';
                let content = '';
                let body = $('.tech_list');
                socket.emit("get_userConnected", (__users)=>{
                 
                    users.forEach(user => {
                        status = getStatus(user.id, __users);
                        
                        if(user.photo !== ''){
                            avatar = `
                            <div class="avatar ${status}">
                              <img src="/images/upload/${user.photo}" alt="..." class="avatar-img rounded-circle">
                            </div>`;
                        }else{
                            avatar = `
                            <div class="avatar ${status}">
                                <img src="/template/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                            </div>`;
                        }

                        user_info = `
                        <div class="info-user ml-3">
                            <div class="username" style="color: black;"><strong>${user.nom}</strong></div>
                            <div class="status">${user.fonction}</div>
                        </div>`;

                        if(users[0].id === user.id){
                            content = `
                            <div id="${user.id}" class="item-list chat_user chat_user_select curves-shadow">
                                ${avatar}
                                ${user_info}
                            </div>`;
                        }else{
                            content = `
                            <div id="${user.id}" class="item-list chat_user curves-shadow">
                                ${avatar}
                                ${user_info}
                            </div>`;
                        }
                        body.append(content);    
                    });
                
                });
            }
        })
   }

   function displayUsers2(user_id, user_role){
    $('.tech_list').html('');
     get_users(user_id, user_role, (users)=>{
         if(users.length>0){
             
             let avatar = '';
             let status = '';
             let user_info = '';
             let content = '';
             let body = $('.tech_list');
             socket.emit("get_userConnected", (__users)=>{
              
                 users.forEach(user => {
                     status = getStatus(user.id, __users);
                     
                     if(user.photo !== ''){
                         avatar = `
                         <div class="avatar ${status}">
                           <img src="/images/upload/${user.photo}" alt="..." class="avatar-img rounded-circle">
                         </div>`;
                     }else{
                         avatar = `
                         <div class="avatar ${status}">
                             <img src="/template/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                         </div>`;
                     }

                     user_info = `
                     <div class="info-user ml-3">
                         <div class="username" style="color: black;"><strong>${user.nom}</strong></div>
                         <div class="status">${user.fonction}</div>
                     </div>`;

                     content = `
                         <div id="${user.id}" class="item-list chat_user curves-shadow">
                             ${avatar}
                             ${user_info}
                         </div>`;
                    
                     body.append(content);    
                 });
             
             });
         }
     })
}


   $(document).on('click', 'div.chat_user', function(){
       console.log(this.id)
       $('.chat_user').removeClass('chat_user_select');
       $(`#${this.id}`).addClass('chat_user_select');

       userInfo(this.id, (user)=>{
            $('.title_left').html(`${user.user_id} - ${user.nom} ${user.prenoms}`);
            showMessageSR(user_id, this.id)
            loadnotif(3);

       })
   })
   

    //scroll to bottom
    function scrollToBottom(){
        $(".all_message").animate({ scrollTop: ($(".all_message")[0].scrollHeight)*10000}, 10);
    } 

    function getRole (id, tab){
        let role = '';

        $.each(tab, (index, user)=>{
                if(user.id === id){
                    role = user.role;
                }
        })
        return role;
    }

   //Update users connected after log out
   $(document).on('click', 'a.logout', function(){
        let data = $('#sender').html().split('/');
        let user = {
            id: data[1],
            username: data[0],
        }
        socket.emit('log_out', user);
    
        console.log('User logs out')
   })

   //send message
   function sendMessage(sender, receiver, content, date){
        $.ajax({
            url:'/new_message',
            method:'post',
            dataType:'json',
            data: {'id_sender': sender, 'id_receiver': receiver, 'content' : content, 'date': date},
            success:(result)=>{
               //vita ny ajout (normalement tsisy problème)
            },
            error: ()=>{
                alert('server error');
            }
        })
   }

   //set the message's status
   function setMessageStatus(id_sender, id_receiver, content, date, status, requete){
    $.ajax({
        url:'/update_message',
        method:'post',
        dataType:'json',
        data: {'id_sender': id_sender, 'id_receiver': id_receiver, 'content' : content, 'date' : date, 'status': status, 'type': requete},
        success:(result)=>{
          console.log(result);
        },
        error: ()=>{
            alert('server error');
        }
    })
   }

   //Get user Info by Id
   function userInfo(id, cb){
    $.ajax({
        url:'/get_userbyId',
        method:'post',
        dataType:'json',
        data: {'id': id,},
        success:(result)=>{
          return cb(result.user);
        },
        error: ()=>{
            alert('server error');
        }
    })
   }

   function getMessageSR(user1, user2, cb){
       let date = new Date(Date.now());
       let startdate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 00:00:00`;
       let currentDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
       
       $.ajax({
            url:'/get_messageSR',
            method:'post',
            dataType:'json',
            data: {'user1': user1, 'user2': user2, 'date2': currentDate, 'date1': startdate},
            success:(result)=>{
                let data = result.discussion;
                console.log(data);
                cb(data)
            },
            error:()=>{
                alert('Server error getMessageSR');
            }
        })

   }

   function showMessageSR(user1, user2){
        $('.all_message').html('');
        getMessageSR(user1, user2, (discussion)=>{
            userInfo(user1, (_user1)=>{
                
                let avatar = '';
                let message = '';
                let action = '';
                let flash_answer = '';
                let n =1;
    
                if(discussion.length>0){
                    $('.box_footer').hide();

                    discussion.forEach(message => {
                        //avatar
                        if(message.sender_photo !== ''){
                            avatar = `
                            <div class="avatar avatar-sm">
                                <img src="/images/upload/${message.sender_photo}" alt="..." class="avatar-img rounded-circle">
                            </div>`;
                        }else{
                            avatar = `
                            <div class="avatar avatar-sm">
                                <img src="/template/examples/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                            </div>`; 
                        }

                        if(n === discussion.length){
                            if((_user1.role === 1) && (_user1.role != message.sender_role)){
                            
                                flash_answer = `
                                <div class="btn-group">
                                    <button class="btn btn-secondary dropdown-toggle btn-sm" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Repondre
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item msg_flash" value="En cours de traitement">En cours de traitement</a>
                                        <a class="dropdown-item msg_flash" value="Vu">Vu</a>
                                    </div>
                                </div>    
                                <div class="btn-group">    
                                    <button class="btn btn-default dropdown-toggle btn-sm" id="intervention" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Depanner
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="intervention">
                                        <a class="dropdown-item mp" value="${_user1.user_id}-${_user1.nom}-${_user1.prenoms}-${message.sender_id}-${message.sender_work}-${message.sender_name}-${message.sender_firstname}">Matériel Personnel</a>
                                        <a class="dropdown-item mda" value="${_user1.user_id}-${_user1.nom}-${_user1.prenoms}-${message.sender_id}-${message.sender_work}-${message.sender_name}-${message.sender_firstname}">Matériel des Autres</a>
                                    </div>
                                </div>    
                                `;
                            }
                            action = `
                            <div id="action_msg" class="card-action">
                                <button class="btn btn-secondary btn-sm reply_msg">
                                    <i class="fas fa-reply"></i>
                                </button>
                                ${flash_answer}
                            </div>
                            `;
                        }

                        message = `
                        <div class="_message">
                            <div class="separator-dashed"></div>
                            <div class="d-flex __message">
                                ${avatar}
                                <div class="flex-1 ml-3 pt-1">
                                    <h6 class="text-uppercase fw-bold mb-1"><strong>${message.sender_name} ${message.sender_firstname}</strong></span></h6>
                                    <span class="text-muted m">${message.contenu_msg}</span>
                                </div>
                            </div>
                            ${action}
                        </div>`;
                            $('.all_message').append(message);

                            try {
                                scrollToBottom();
                                setMessageStatus(user2, user1, '', '', true, 1);
                                NotifMessageNotSeen();
                               } catch (error) {
                                   
                               }
                            n++;
                    });
                    
                }else{
                    $('.box_footer').show();
                }
            })  
        })
   }
   
   $(document).on('click', 'button.send_msg', function(){
       $('#action_msg').remove();
        
        /*---------------------------------------------------------------------*/
               
                let contenu = CKEDITOR.instances.content_msg.getData();
                let data = $('#sender').html().split('/');
                let data1 = $('.title_left').html().split(' - ');
                let sender = data[1];
                let receiver = data1[0];
                let date = new Date(Date.now());
                let message = '';
                let avatar = '';

        /*---------------------------------------------------------------------*/
        let currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        if(contenu !== ''){
            $('.box_footer').hide();
            socket.emit("send_message", {
                "sender": sender,
                "receiver": receiver,
                "message": contenu,
                "date": currentDate
            });
             //display message
            userInfo(sender, (user)=>{
                console.log(user);
                if(user.path_photo !== ''){
                    avatar = `
                    <div class="avatar avatar-sm">
                        <img src="/images/upload/${user.path_photo}" alt="..." class="avatar-img rounded-circle">
                    </div>`;
                }else{
                    avatar = `
                    <div class="avatar avatar-sm">
                        <img src="/template/examples/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                    </div>`; 
                }

                message = `
                <div class="_message">
                    <div class="separator-dashed"></div>
                    <div class="d-flex __message">
                        ${avatar}
                        <div class="flex-1 ml-3 pt-1">
                            <h6 class="text-uppercase fw-bold mb-1"><strong>${user.nom} ${user.prenoms}</strong></span></h6>
                            <span class="text-muted m">${contenu}</span>
                        </div>
                    </div>
                    <div id="action_msg" class="card-action">
                        <button class="btn btn-secondary reply_msg btn-sm">
                            <i class="fas fa-reply"></i>
                        </button>
                    </div>
                </div>`;
                //send the message to the database
                sendMessage(sender, receiver, contenu, currentDate);
                $('.all_message').append(message);
                scrollToBottom()
                initCkeditor()
            })
        }
        
   })

    $(document).on('click', 'a.msg_flash', function(){
        $('#action_msg').remove();
        let contenu = this.attributes["value"].value;
        let data = $('#sender').html().split('/');
        let data1 = $('.title_left').html().split(' - ');
        
        let sender = data[1];
        let receiver = data1[0];
        let date = new Date(Date.now());
        let avatar = '';

        let currentDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
       
       socket.emit("send_message", {
            "sender": sender,
            "receiver": receiver,
            "message": contenu,
            "date": currentDate
        });
         //display message
        userInfo(sender, (user)=>{
            console.log(user);
            if(user.path_photo !== ''){
                avatar = `
                <div class="avatar avatar-sm">
                    <img src="/images/upload/${user.path_photo}" alt="..." class="avatar-img rounded-circle">
                </div>`;
            }else{
                avatar = `
                <div class="avatar avatar-sm">
                    <img src="/template/examples/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                </div>`; 
            }

            message = `
            <div class="_message">
                <div class="separator-dashed"></div>
                <div class="d-flex __message">
                    ${avatar}
                    <div class="flex-1 ml-3 pt-1">
                        <h6 class="text-uppercase fw-bold mb-1"><strong>${user.nom} ${user.prenoms}</strong></span></h6>
                        <span class="text-muted m"><p>${contenu}</p></span>
                    </div>
                </div>
                <div class="separator-dashed"></div>
                <div id="action_msg" class="card-action">
                    <button class="btn btn-secondary reply_msg btn-sm">
                        <i class="fas fa-reply"></i>
                    </button>
                </div>
            </div>`;
            //send the message to the database
            sendMessage(sender, receiver, `<p>${contenu}</p>`, currentDate);
            $('.all_message').append(message);
            scrollToBottom()
            initCkeditor()
        })
    });

   function initCkeditor(){
    CKEDITOR.instances.content_msg.setData( '', function(){
        CKEDITOR.instances.content_msg.resetDirty();
    });
   }

    //in the receiver side, show the message in real time
    socket.on('new_message', (data)=>{
        
        if ($(location).attr('href') !=="http://localhost:8080/message") {
            console.log("test")
            userInfo(data.sender, (user)=>{
                let notification = `${user.nom} ${user.prenoms} vous a envoyé(e) un message`;
                displayNotify("success", "SMMC~Message", notification);
                loadnotif(3);
            })
        }else{
            
            let data1 = $('.title_left').html().split(' - ');
            let message = data.message;
            let status = true;
            let date = new Date(Date.now());
            console.log(data1);
            console.log(data1[0] + ' / ' + data.receiver);
            NotifMessageNotSeen();
            //show the message if the receiver's chat box is open
            if(data1[0] === data.sender){
                $('.box_footer').hide();
                $('#action_msg').remove();
                userInfo(data.sender, (user)=>{
                    console.log(user);
                    if(user.path_photo !== ''){
                        avatar = `
                        <div class="avatar avatar-sm">
                            <img src="/images/upload/${user.path_photo}" alt="..." class="avatar-img rounded-circle">
                        </div>`;
                    }else{
                        avatar = `
                        <div class="avatar avatar-sm">
                            <img src="/template/examples/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                        </div>`; 
                    }
    
                    userInfo(data.receiver, (user2)=>{
                        let action = '';
                        if(user2.role === 1){
                            action = `
                        <div class="btn-group">
                            <button class="btn btn-secondary dropdown-toggle btn-sm" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Repondre
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item msg_flash" value="En cours de traitement">En cours de traitement</a>
                                <a class="dropdown-item msg_flash" value="Vu">Vu</a>
                            </div>
                        </div>    
                        <div class="btn-group">    
                            <button class="btn btn-default dropdown-toggle btn-sm" id="intervention" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Depanner
                            </button>
                            <div class="dropdown-menu" aria-labelledby="intervention">
                            <a class="dropdown-item mp" value="${user2.user_id}-${user2.nom}-${user2.prenoms}-${user.user_id}-${user.work_id}-${user.nom}-${user.prenoms}">Matériel Personnel</a>
                            <a class="dropdown-item mda" value="${user2.user_id}-${user2.nom}-${user2.prenoms}-${user.user_id}-${user.work_id}-${user.nom}-${user.prenoms}">Matériel des Autres</a>
                            </div>
                        </div>  
                            `;
                        }else action = '';
                       
                       let _message = `
                        <div class="_message">
                            <div class="separator-dashed"></div>
                            <div class="d-flex __message">
                                ${avatar}
                                <div class="flex-1 ml-3 pt-1">
                                    <h6 class="text-uppercase fw-bold mb-1"><strong>${user.nom} ${user.prenoms}</strong></span></h6>
                                    <span class="text-muted m">${message}</span>
                                </div>
                                <div class="float-right pt-2">
                                    <small class="text-muted">${days[date.getDay()]} ${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()} à ${date.getHours()}:${date.getMinutes()}</small>
                                </div>
                            </div>
                            <div id="action_msg" class="card-action">
                                <button class="btn btn-secondary reply_msg btn-sm">
                                    <i class="fas fa-reply"></i>
                                </button>
                                ${action}
                            </div>
                        </div>`;
                        //set the message's status as read by the receiver
                        setMessageStatus(data.sender, data.receiver, message, data.date, status, 2);
                        $('.all_message').append(_message);
                        scrollToBottom()
                    })
    
                })
            }
            
            if(data1[0] !== data.sender){
                loadnotif(10);
                $('#action_msg').show();
                userInfo(data.sender, (user)=>{
                    let notification = `${user.nom} ${user.prenoms} vous a envoyé(e) un message`;
                    displayNotify("success", "SMMC~Message", notification); 
                })
            }
        }
    })
    
    $(document).on('click', 'button.reply_msg', function(){
        $('.box_footer').show();
        $('#action_msg').remove();
        scrollToBottom()
    });

    function loadnotif(d){
        for (let n = 0; n < d; n++) {
            NotifMessageNotSeen();
        }
    }
    $(document).on('click', 'button.cancel_msg', function(){
     initCkeditor();
    });

    function getMaterielbyUser(body, user_id, type){
        $.ajax({
            url: '/get_materielbyUser_id',
            method: 'post',
            dataType: 'json',
            data: { 'user': user_id },
            success: (result) => {
             let data = result.data;
             let row = "";
             let action = "";
             console.log(data)

             body.html("");
             if(type === 0){
                 if(data.length>0){
                    data.forEach(elem => {
                        //action = `<input type="checkbox" class="materiel" name="subscribe" value="${elem.id_mat}">`; 
                        action = `<div class="form-button-action"><button type="button" value="${elem.id_mat}" data-toggle="tooltip" title="" class="btn btn-info btn-sm dep" data-original-title="modifier"><i class="fas fa-wrench"></i></button></div>`;
                        row = `
                         <tr>
                            <td>${elem.type}</td>
                            <td>${elem.marque}</td>
                            <td>${elem.config}</td>
                            <td>${action}</td>
                         </tr>
                         `
                         body.append(row);
                     });
                 }
             }else{
                if(data.length>0){
                    data.forEach(elem => {
                        row = `
                         <tr>
                            <td>${elem.type}</td>
                            <td>${elem.marque}</td>
                            <td>${elem.config}</td>
                            <td>${action}</td>
                         </tr>
                         `
                         body.append(row);
                     });
                }
             }
               
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    function getMaterielbyWork_id(body, work_id){
        $.ajax({
            url: '/get_matbyWorkId',
            method: 'post',
            dataType: 'json',
            data: { 'work_id': work_id },
            success: (result) => {
                console.log(result.data);
                let data = result.data;
                let row = "";
                let action = "";
   
                body.html("");
                data.forEach(elem => {
                   action = `<div class="form-button-action"><button type="button" value="${elem.id_mat}" data-toggle="tooltip" title="" class="btn btn-info btn-sm dep" data-original-title="modifier"><i class="fas fa-wrench"></i></button></div>`;
                  
                    row = `
                    <tr>
                       <td>${elem.type}</td>
                       <td>${elem.marque}</td>
                       <td>${elem.nom} ${elem.prenoms}</td>
                       <td>${action}</td>
                    </tr>
                    `;                   
                    body.append(row);
                });
            
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    $(document).on('click', 'a.mda', function(){
       $(".mda-modal").modal('show')
       let data = this.attributes["value"].value.split("-");
        console.log(data);

        let data1 = data[6].split(' ');
        let data2 = data[2].split(' ');
        
        let nom1 = '';
        let nom = '';
       
        for (let n = 0; n < data1.length; n++) {
            const elem =$.trim(data1[n]);
            if(elem !== ""){
                if(nom1 === ""){
                    nom1 = elem;
                }else nom1 = nom1 + '*' + elem;
            }
        }

        for (let n = 0; n < data2.length; n++) {
            const elem =$.trim(data2[n]);
            if(elem !== ""){
                if(nom === ""){
                    nom = elem;
                }else nom = nom + '*' + elem;
            }
        }
        $("#backup-mda").html(`${data[0]}-${data[1]}-${nom}-${data[3]}-${data[4]}-${data[5]}-${nom1}`);
        let body = $('#mda-body');
        getMaterielbyWork_id(body,data[4]);
    });


    $(document).on('click', 'a.mp', function(){
        $(".mp-modal").modal('show')
        let data = this.attributes["value"].value.split("-");
        let data1 = data[6].split(' ');
        let data2 = data[2].split(' ');
        
        let nom1 = '';
        let nom = '';
       
        for (let n = 0; n < data1.length; n++) {
            const elem =$.trim(data1[n]);
            if(elem !== ""){
                if(nom1 === ""){
                    nom1 = elem;
                }else nom1 = nom1 + '*' + elem;
            }
        }

        for (let n = 0; n < data2.length; n++) {
            const elem =$.trim(data2[n]);
            if(elem !== ""){
                if(nom === ""){
                    nom = elem;
                }else nom = nom + '*' + elem;
            }
        }

        $("#mp-modal-title").html(`${data[5]} ${data[6]}`);
        $("#backup-mp").html(`${data[0]}-${data[1]}-${nom}-${data[3]}-${data[4]}-${data[5]}-${nom1}`);
        let body = $('#mp-body');
        getMaterielbyUser(body, data[3],0);
     });

  $(document).on('click', 'button.dep', function(){
        let backup =  $("#backup-mp").html();
        window.location=`/depannage/${backup},${this.value}`
  })
  
  getMatforProfile();
  
  function getMatforProfile(){
    if($(location).attr('href')==="http://localhost:8080/profile"){
        try {
            let data = $('#sender').html().split('/');
            let body = $('#tab-profile');
            getMaterielbyUser(body, data[1],1);
           
        } catch (error) {
            
        }   
    }
  }
 // notify('success', "test", "Mise en place de notify")
  function displayNotify(type, titre, message,){
    $.notify({
        // options
        icon: 'flaticon-alarm-1',
        title: titre,
		message: message,
    },{
        // settings
        element: 'body',
        position: null,
        type: type,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
            from: "top",
            align: "right"
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        delay: 5000,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        onShow: null,
        onShown: null,
        onClose: null,
        onClosed: null,
        icon_type: 'class',
        template:  '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
			'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<div class="row">'+
                '<div class="col-md-1">'+
                '<span data-notify="icon"></span> ' +
                '</div>'+
                '<div class="col-md-11">'+
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '</div>'+
            '</div>'+    
			'<div class="progress" data-notify="progressbar">' +
			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
			'</div>' +
			'</div>' 
    });
  }
  
  function NotifMessageNotSeen(){
    let data = $('#sender').html().split('/');
    $.ajax({
        url: '/messages',
        method: 'post',
        dataType: 'json',
        data:{'user':data[1]},
        success: (result) => {
           let boite = $('.notif');
           let notif_center = $('.notif-center');
           let small = $('.small-n');
           let nb = result.nb;
           let tab = result.tab;
           let avatar = '';
           boite.html('');
           notif_center.html('');
           small.html('');

           if(nb>0){
               boite.append(`<span class="notification nb_msg">${nb}</span>
               <i class="fa fa-envelope"></i>`);

               tab.forEach(elem => {
                   if(elem.photo === ""){
                     avatar = ` <div class="notif-img">
                     <img src="/template/assets/img/jm_denis.jpg" alt="Img Profile">
                 </div>`
                   }else{
                       avatar = ` <div class="notif-img">
                       <img src="/images/upload/${elem.photo}" alt="Img Profile">
                   </div>`
                   }
                notif_center.append(`
                    <a class="not_seen">
                        ${avatar}
                        <div class="notif-content">
                            <span class="subject">${elem.user}</span>
                            <span class="block">
                               vous a laissez un message 
                            </span>
                            <span class="time">il y a quelques instants</span>
                        </div>
                    </a>
                `);
               });

           }else{
                boite.append(`<i class="fa fa-envelope"></i>`);
                small.append("Vide");
           }

        },
        error: () => {
            alert('server error!');
        }
    });
  }

  $(document).on('click', "a.show_mess", function(){
   // displayUsers(user_id, user_role);
    
  })

  $(document).on('click', "a.see-all", function(){
        displayUsers(user_id, user_role);
        window.location="/message";
  })
  
    function search(val, role, id, cb){
        if(val !== ""){
            $.ajax({
                url:'/search_user',
                method:'post',
                dataType:'json',
                data: {'user': val},
                success:(result)=>{
                    let users = result.data;
                    let data = [];
                    users.forEach(user => {
                        if(id !== user.user_id){
                            if(role === "Technicien"){
                                data.push(user);
                            }else{
                                if(user.role === 1){
                                    data.push(user);
                                }
                            }
                        }
                    });

                return cb(data);
                    
                },
                error:()=>{
                    alert('Server error haha');
                }
            })
        }else{
            displayUsers2(user_id, user_role)
        }
    }
  
    function search_2(val, role, id){
        $('.tech_list').html('');
        search(val, role, id, (users)=>{
            if(users.length>0){
                let avatar = '';
                let status = '';
                let user_info = '';
                let content = '';
                let body = $('.tech_list');
                
                socket.emit("get_userConnected", (__users)=>{
                 
                    users.forEach(user => {
                        status = getStatus(user.user_id, __users);
                        
                        if(user.path_photo !== ''){
                            avatar = `
                            <div class="avatar ${status}">
                              <img src="/images/upload/${user.path_photo}" alt="..." class="avatar-img rounded-circle">
                            </div>`;
                        }else{
                            avatar = `
                            <div class="avatar ${status}">
                                <img src="/template/assets/img/jm_denis.jpg"  alt="..." class="avatar-img rounded-circle">   
                            </div>`;
                        }

                        user_info = `
                        <div class="info-user ml-3">
                            <div class="username" style="color: black;"><strong>${user.nom} ${user.prenoms}</strong></div>
                            <div class="status">${user.fonction}</div>
                        </div>`;

                        content = `
                        <div id="${user.user_id}" class="item-list chat_user curves-shadow">
                            ${avatar}
                            ${user_info}
                        </div>`;

                        body.append(content);    
                    });
                
                });
            }
        })
    }

  $('input[name=searchText]').keydown(function(){
     let val = this.value;
     console.log(event.keyCode)
    
     search_2(val, user_role, user_id)
     console.log(user_id)
     console.log(user_role)
     console.log(event.keyCode)
     if(event.keyCode === '8' || event.keyCode === '13' || event.keyCode === '32'){
        search_2(val, user_role, user_id)
     }
  })
})