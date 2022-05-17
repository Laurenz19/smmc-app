/* Ajax Engine for user */
$(document).ready(function() {
    $("#_select").chosen({width: "90%", no_results_text: "Veuillez choisir un niveau qui existe!"});
    $("#user_table").DataTable({});
    $("#tech_table").DataTable({});
    $('#select').hide();
    $('#alert').hide();
    $('#div_1').hide();

    let _success = "alert alert-success";
    let _error = "alert alert-danger";
    let tab = [];
    getAllRole(tab);
   
    getUsers(1);

    //navigation on the page
   $("#new_User").click(()=>{
    $('#div_1').show();
    $('#div_2').hide();
    init();
   });

   $("#get_User").click(()=>{
    $('#div_1').hide();
    $('#div_2').show();
    $('#Table_title').html(`<strong>Utilisateurs</strong>`);
    getUsers(1);
    getUsers(1);
    getUsers(1);
    });
    
   $("#get_Tech").click(()=>{
    $('#div_1').hide();
    $('#div_2').show();
    $('#Table_title').html(`<strong>Techniciens</strong>`);
    getUsers(2);
    getUsers(2);
    getUsers(2);
    });
    
   
   $("#radio_sce").attr('checked', false);
  /* $("#radio_sce").attr('checked',function(){
    console.log(this.checked)
   })*/

    //display service select
    $("#radio_sce").click(() => {
        let work = $("#radio_sce").val();
        let url = "/get_services";
        let property = "nom_sce";
        let tab =[];
        show_select(url, property, work, tab);

        console.log(work);
    })

    //display department select
    $("#radio_dep").click(() => {
        let work = $("#radio_dep").val();
        let url = "/get_departements";
        let property = "nom_dep";
        let tab =[];
        show_select(url, property, work, tab);

        console.log(work);
    })

    //display direction select
    $("#radio_dir").click(() => {
        let work = $("#radio_dir").val();
        let url = "/get_directions";
        let property = "nom_dir";
        let tab =[];
        show_select(url, property, work, tab);

        console.log(work);
    })

    function show_select(url, property, label, tabData) {
        let select = $('#_select');
        let div = $('#select');
        let select_label = $('#select_label');
        let nom = '';
       
        select_label.html(label);
       
        $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let data = result.data;
              //  console.log(data);
                select.html('');

                if (data.length > 0) {
                    if(tabData.length > 0){
                        let val = `<option value=${tabData[6]}>${tabData[7]}</option>`;
                        select.append(val);
                        $.each(data, (index, option) => {
                            nom = option[`${property}`];
                            if(option.id !== tabData[6]){
                                select.append(`<option value=${option.id}>${nom}</option>`);
                            }
                        });

                    }else{
                        select.append("<option></option>");
                        $.each(data, (index, option) => {
                            nom = option[`${property}`];
                            select.append(`<option value=${option.id}>${nom}</option>`);
                        });
                    }
                } else {
                    select.append("<option></option>");
                }
                $('#_select').trigger("chosen:updated");
                div.show();
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    //show alert
    function showAlert(_class, _message) {
        $('#alert').removeClass();
        $('#alert').html(_message);
        $('#alert').addClass(_class);
        $('#alert').fadeIn(600)
        $('#alert').fadeOut(2000)
    }

   //get all roles
   function getAllRole(tab){
    let select = $('#select_role');
       $.ajax({
           url:'/get_roles',
           method:'get',
           dataType:'json',
           success:(result)=>{
               let roles = result.roles;
               console.log(roles);
               select.html('');

               if (roles.length > 0) {
                   if(tab.length > 0){
                    let val = `<option value=${tab[8]}>${tab[3]}</option>`;
                    select.append(val);
                    console.log(tab[8]);
                    $.each(roles, (index, option) => {
                        let _val2 = `<option value=${option.id_role}>${option.libelle}</option>`;
                        if( _val2 !== val){
                            select.append(_val2);
                        }
                    });
                   }else{
                        select.append("<option></option>");
                        $.each(roles, (index, option) => {
                            select.append(`<option value=${option.id_role}>${option.libelle}</option>`);
                        });
                   }
            } else {
                select.append("<option></option>");
            }

           },
           error: ()=>{
            alert('server error!');
           }
       })
   }

   //reset 
   $('#reset').click(()=>{
    let btn = $(".add_user").html();

        if(btn === 'Modifier'){
            $('#div_1').hide();
            $('#div_2').show();
            $('#Table_title').html('Utilisateurs');
        }
       init();
    })

    function init(){
        $('#name').val('');
        $('#firstname').val('');
        $('#fonction').val('');
        $('#email').val('');
        $('#tel').val('');
        $('#select_role').val('');
        $('#select').hide();
            setRadioButtonCk('radio_dir', false);
            setRadioButtonCk('radio_dep', false);
            setRadioButtonCk('radio_sce', false);
        $(".add_user").html('Ajouter');
    }

   //Add and update user
   $(document).on('click', 'button.add_user', function(){
    let id = $('#user_id').val();
    let nom= $('#name').val();
    let prenoms= $('#firstname').val();
    let fonction= $('#fonction').val();
    let email= $('#email').val();
    let tel= $('#tel').val();
    let role= $('#select_role').val();
    let work_id= $('#_select').val();

    let btn = $(".add_user").html();

    console.log(`${nom}, ${prenoms}, ${fonction}, ${email}, ${tel}, ${role}, ${work_id}`);
    if( nom ==='' || fonction ==='' || email ==='' || tel ==='' || work_id ==='' || work_id === null){
        showAlert(_error, "Veuillez remplir correctement tous les champs!")
    }else{
      if(check_Email(email) === false){
        showAlert(_error, "Veuillez vérifier au niveau du champs email !");
      }else{
        if(checkIf_notNumb(tel) === true){
            showAlert(_error, "Veuillez vérifier au niveau du champs numéro de Téléphone (au moins 5 chiffre et ne contient que des chiffre)!");
        }else{
            if(btn === "Ajouter"){
                 //Ajax add
                $.ajax({
                    url:'/new_user',
                    method:'post',
                    dataType:'json',
                    data: {'nom': nom, 'prenoms': prenoms, 'fonction': fonction, 'email': email, 'tel': tel, 'role': role, 'work_id': work_id},
                    success:(result)=>{
                    if(result.msg === "success"){
                            showAlert(_success, "Utilisateur ajouté avec succès!");
                            //remove
                            init();
                            //refresh tab
                           loadtab(10, 2);
                           loadtab(10, 1);
                        }else{
                            showAlert(_error, result.msg);
                        }
                    
                    },
                    error: ()=>{
                        alert('server error');
                    }
                })
            }else{
                //ajax update
                $.ajax({
                    url:'/update_user',
                    method:'post',
                    dataType: 'json',
                    data: {'id':id, 'nom': nom, 'prenoms': prenoms, 'fonction': fonction, 'email': email, 'tel': tel, 'role': role, 'work_id': work_id},
                    success:(result)=>{
                        console.log(result);
                        if(result.msg == 'success'){
                            showAlert(_success , "Utilisateur modifié avec succès");
                             //remove
                             init();
                           
                            if(result.role == 1){
                                $('#div_1').hide();
                                $('#div_2').show();
                                $('#Table_title').html('Téchniciens');
                                loadtab(9, 2);
                            }else{
                                $('#div_1').hide();
                                $('#div_2').show();
                                $('#Table_title').html('Utilisateurs');
                                loadtab(9, 1);
                            }

                        }else{
                            showAlert(_error, result.msg);
                        }
                       
                    },
                    error:()=>{
                        alert('server error');
                    }
                })
            }

        }
      }
    }
   });

   //Check your email
   function check_Email(email){
    let data = email.split('');
    let data1 = email.split('@');
    let data2 = email.split('.')
   // console.log(data);
    let n = 0;

   if(data.length>=5){
        $.each(data, (index, lettre) => {
            if(lettre == '@') n++;
            if(lettre == '.') n++;
        });
        console.log(n);
        if(n >=2){
            if(data1[0] === '' || data2[1] === ''){
                return false;
            }else return true;
        }
        else return false;
    }else{
        return false;
    }
   }
   

   //check value
   function checkIf_notNumb(val){
       let data = val.split('');
       let n=0;
       if(data.length>=5){
        $.each(data, (index, chiffre) => {
            if(isNaN(parseInt(chiffre)) === true) n++;
        });
        if(n>0) return true;
        else return false;

       }else{
           return true;
       }
   }

   //get all user function
   function getUsers(type){
    $.ajax({
        url:'/get_users',
        method:'get',
        dataType:'json',
        success:(result)=>{
            let tableData = [];
            let tableData1 = [];
            let tableData2 = [];
            let users = result.users;
            let button = '';
          //  console.log(users);

            if(users.length > 0){
                $.each(users, (index, user)=>{
                    button = `<div class="form-button-action"><button type="button" value="${user.id}/${user.nom}/${user.fonction}/${user.role}/${user.email}/${user.tel}/${user.work_id}/${user.work_name}/${user.id_role}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${user.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                    if(user.role == 'Simple utilisateur'){
                        tableData1.push([user.id, user.nom, user.fonction, user.work_name, user.email, user.tel, button]);
                    }else{
                        tableData2.push([user.id, user.nom, user.fonction, user.work_name, user.email, user.tel, button]);
                    }

                    tableData.push([user.id, user.nom, user.fonction, user.work_name, user.email, user.tel, button]);
                })
            }
           
            $("#user_table").DataTable().destroy();
            //display all data on the table
            if(type === 0){
                $("table#user_table").DataTable({
                    data: tableData,
                    pageLength: 5,
                    lengthMenu:[5, 10, 15],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
                })
            }
            if(type === 1){
                $("table#user_table").DataTable({
                    data: tableData1,
                    pageLength: 5,
                    lengthMenu:[5, 10, 15],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
                })
            }
            if(type === 2){
                $("table#user_table").DataTable({
                    data: tableData2,
                    pageLength: 5,
                    lengthMenu:[5, 10, 15],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
                })
            }
        },
        error:()=>{
            alert('server error');
        }
    })
   }

   //Redirection for update form
   $(document).on('click', 'button.upd', function(){
       //get the button's value
       let data = this.value.split('/');
       let data2 = data[1].split(' ');
       //data[6] is the user's work_id
       let _object = _lieuTravail(data[6]);
       let firstname=''

        if(data2.length >=2){
            for (let n = 1; n < data2.length; n++) {
               firstname += data2[n] + ' ';
            }
        }
       console.log(data);
       init();
       $("#user_id").val(data[0]);
       $("#name").val(data2[0]);
       $("#firstname").val(firstname);
       $("#fonction").val(data[2]);
       $("#email").val(data[4]);
       $("#tel").val(data[5]);
       $('.add_user').html('Modifier');
      
       
       //display all data from department/direction/service
       if(_object.place !== 'null'){
           console.log(_object.id);
            setRadioButtonCk(_object.id, true);
            show_select(_object.url, _object.property, _object.place, data);
       }else{
           $('#select').hide();
           setRadioButtonCk('radio_dir', false);
           setRadioButtonCk('radio_dep', false);
           setRadioButtonCk('radio_sce', false);
       }

       getAllRole(data);
       
       $('#div_1').show();
       $('#div_2').hide();
   })

   function setRadioButtonCk(id, state){
    $(`#${id}`).attr('checked', function(){
        this.checked = state;
    });
   }

   //Needed to execute show select action
   function _lieuTravail(work_id){
       let prefix = work_id;
       let place = '';
       let id ='';
       let url='';
       let property= '';

       switch (prefix.slice(0, 3)) {
        case "DIR":
            place = 'Directions';
            id = 'radio_dir';
            url ='/get_directions';
            property = 'nom_dir';
            break;
        case "DEP":
            place = 'Departements';
            id = 'radio_dep';
            url = '/get_departements';
            property = 'nom_dep';
            break;
        case "SCE":
            place = 'Services';
            id = 'radio_sce';
            url = '/get_services';
            property = 'nom_sce';
            break;
        default:
            place = 'null'
            break;
    }

        return {id, place, url, property};
   }

   function loadtab (nb, type){
       for (let i = 0; i < nb; i++) {
          getUsers(type);   
       }
   } 

    /* delete an user */
    //function
    function delete_user(id) {
        let title = $('#Table_title').html();
        $.ajax({
            url: '/delete_user',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
                if(title === 'Utilisateurs'){
                    loadtab(10, 1);
                }else{
                    loadtab(10, 2);
                }
            },
            error: () => {
                alert('server error!');
            }
        });
    }

   $(document).on('click', 'button.del', function(){
       //get the button's value
       let id = this.value;
       Swal.fire({
            icon:'success',
            title: 'Utilisateur supprimé',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
            delete_user(id);
       })  
   })

});