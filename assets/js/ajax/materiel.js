/* Ajax engine for matieriel */
$(document).ready(function(){
    $("#_select").chosen({width: "90%", no_results_text: "Veuillez choisir un niveau qui existe!"});
    $('#add-row').DataTable({});
    $('#user_tab').DataTable({});
    $('#select').hide();
    $('#alert').hide();
    $('#_alert').hide();
    $('.setting').hide();
    $("#radio_sce").attr('checked', false);
    
    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getMateriels();

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
                        let val = `<option value=${tabData[5]}>${tabData[6]}</option>`;
                        select.append(val);
                        $.each(data, (index, option) => {
                            nom = option[`${property}`];
                            if(option.id !== tabData[5]){
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
        $('#alert').fadeIn(600);
        $('#alert').fadeOut(2000);
    }

    function _showAlert(_class, _message) {
        $('#_alert').removeClass();
        $('#_alert').html(_message);
        $('#_alert').addClass(_class);
        $('#_alert').fadeIn(600)
        $('#_alert').fadeOut(2000)
    }

    //Init form

    function init(){
        $('#id_mat').val('');
        $('#marque_mat').val('');
        $('#config').val('');
        $('#etat').val('');
       // $('#_select').val('');
        $('#select').hide();
        setRadioButtonCk('radio_dir', false);
        setRadioButtonCk('radio_dep', false);
        setRadioButtonCk('radio_sce', false);
        $("#radio_printer").attr('checked', function(){
            this.checked = false
        });
        $("#radio_pc").attr('checked', function(){
            this.checked = false
        });
        $(".add_materiel").html("Ajouter");
    }

    $('#reset').click(()=>{
        init();
    })

    //get Type value
    function getTypevalue(id1, id2){
        let value='';
        let id = 'id';
        try {
            $(`#${id1}`).attr('checked', function(){
        
                if(this.checked === true){
                    value = this.value
                }else{
                    value = getTypevalue(id2, id);
                }
           });
        } catch (error) {
            value = '';
        }
        return value;
    }
    //Create & Update Materiel
    $(document).on('click', 'button.add_materiel', function(){
       let id = $('#id_mat').val();
       let marque = $('#marque_mat').val();
       let config = $('#config').val();
       let etat = $('#etat').val();
       let work_id= $('#_select').val();
       let type = getTypevalue('radio_printer', 'radio_pc');

       let btn = $(".add_materiel").html();

        console.log(`${marque} ${config} ${etat} ${work_id} ${type}`);
        if(marque === '' || config === '' || etat === '' || work_id === '' || type === '' || config === ""){
            showAlert(_error, "Veuillez remplir correctement tous les champs!");
        }else{
            if(isNaN(parseInt(marque)) === true){
                if(isNaN(parseInt(config)) === true){
                    if(btn === "Ajouter"){
                        //Ajax add
                        $.ajax({
                           url:'/new_materiel',
                           method:'post',
                           dataType:'json',
                           data: {'marque': marque, 'config': config, 'etat': etat, 'type': type, 'work_id': work_id},
                           success:(result)=>{
                                if(result.msg === "success"){
                                    showAlert(_success, "Matériel ajouté avec succès!");
                                    loadtab(20);
                                    init();
                                    $('#materielModal').modal('hide');
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
                        url:'/update_materiel',
                        method:'post',
                        dataType:'json',
                        data: {'id_mat': id, 'marque': marque, 'config': config, 'etat': etat, 'type': type, 'work_id': work_id},
                        success:(result)=>{
                            if(result.msg === "success"){
                                showAlert(_success, "Utilisateur modifié avec succès!");
                                loadtab(10);
                                init();
                                $('#materielModal').modal('hide');
                            }else{
                                showAlert(_error, result.msg);
                            }
                        },
                        error: ()=>{
                            alert('server error');
                        }
                    })
       
                   }
                }else{
                    showAlert(_error, `${config} est un chiffre!! Veuillez entrez une lettre`);
                }
            }else{
                showAlert(_error, `${marque} est un chiffre!! Veuillez entrez une lettre`);
            }
        }
    });

    //get all materiel
    function getMateriels(){
        $.ajax({
            url:'/get_materiels',
            method:'get',
            dataType:'json',
            success:(result)=>{
                let tableData = [];
                let materiels = result.materiels;
                let action = '';
                let state = '';
                console.log(materiels);
              if(materiels.length > 0){
                    $.each(materiels, (index, materiel)=>{
                        action =  `<div class="form-button-action"><button type="button"  data-toggle="tooltip" title="" class="btn btn-link btn-success show_info" data-original-title="voir" value="${materiel.id}/${materiel.type}/${materiel.marque}/${materiel.config}"><i class="fas fa-eye"></i></button><button type="button" value="${materiel.id}/${materiel.type}/${materiel.marque}/${materiel.config}/${materiel.etat}/${materiel.work_id}/${materiel.work_name}"  data-toggle="modal" data-target="#materielModal" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${materiel.id}/${materiel.type}/${materiel.marque}/${materiel.config}/${materiel.etat}/${materiel.work_id}/${materiel.work_name}" class="btn btn-link btn-secondary _set" data-toggle="tooltip" title="" data-original-title="settings"><i class="icon-settings"></i></button><button type="button" value="${materiel.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                        if(materiel.etat === '1'){
                            state = 'En marche'
                        }else  state = 'En panne';
                        tableData.push([materiel.id, materiel.type, materiel.marque, materiel.work_name, state, action]);
                    })
                }
                $("#add-row").DataTable().destroy();

                $("table#add-row").DataTable({
                    data: tableData,
                    pageLength: 5,
                    lengthMenu:[5, 10, 15],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
                })

            },
            error:()=>{
                alert('server error');
            }
        })
    }

    function loadtab (nb){
        for (let i = 0; i < nb; i++) {
           getMateriels();   
        }
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

    function setRadioButtonCk(id, state){
        $(`#${id}`).attr('checked', function(){
            this.checked = state;
        });
    }

    function getStateVal(data){
        let val ='';
        if(data[4] === '1'){
            val = `<option value="${data[4]}">En marche</option><option value="0">En panne</option>`
        }

        if(data[4] === '0'){
            val = `<option value="${data[4]}">En panne</option><option value="1">En marche</option>`
        }
        return val;
    }
    
    //update button

    $(document).on('click', 'button.upd', function(){
        //get the button's value
        let data = this.value.split('/');
        let select = $('#etat');
        let val = getStateVal(data);

        //data[5] is the material's work_id
        let _object = _lieuTravail(data[5]);
        
        console.log(data);
        
        $('#id_mat').val(data[0]);
        $('#marque_mat').val(data[2]);
        $('#config').val(data[3]);
        $('.add_materiel').html('Modifier');
        
        
        //checked the button's type
        if(data[1] === "Ordinateur"){
            setRadioButtonCk("radio_pc", true);
        }
        if(data[1] === "Imprimante"){
            setRadioButtonCk("radio_printer", true);
        }

        //Display the material's state
        select.html('');
        select.append(val);
        
        //display the materiel work id
        if(_object.place !== 'null'){
            setRadioButtonCk(_object.id, true);
            show_select(_object.url, _object.property, _object.place, data);
        }
    })

    /* About Setting */
 
    //Setting button
    $(document).on('click', 'button._set', function(){
        $(".setting").show();
        $(".tab_materiel").hide();
       
        //get the button's value
        let data = this.value.split('/');
        let id_mat = data[0];
        let work_id = data[5];

        /*------------------------------------------*/
                $("#_id_mat").val(data[0]);
                $("#_marque_mat").val(data[2]);
                $("#_type").val(data[1]);
                $("#_config").val(data[3]);

        /*------------------------------------------*/
        console.log(data);

        //to set the button
        $.ajax({
            url:'/check_utilisation',
            method:'post',
            dataType:'json',
            data: {'id_mat': id_mat, 'work_id': work_id},
            success:(result)=>{
                $(".mat_user").html(result.msg);
                
                try {
                    let user = result.data;
                    console.log(user);
                    $("#_id_user").val(user.user_id);
                    $("#_user").val(user.nom);
                    $("#debut").val(user.debut);
                    $("#fin").val(user.fin);
                } catch (error) {
                    $("#_id_user").val('');
                    $("#_user").val('');
                    $("#debut").val('');
                    $("#fin").val('');
                }

            },
            error: ()=>{
               // alert('server error');
            }
        })

        //to display all Utilisateur
        $.ajax({
            url:'/get_usersbyWork_id',
            method:'post',
            dataType:'json',
            data: {'work_id': work_id},
            success:(result)=>{
                let tableData = [];
               console.log(result.data)
               if(result.msg == 'success'){
                   if(result.data == null){
                       tableData = [];
                   }else{
                       let users  = result.data;
                       $.each(users, (index, user)=>{
                        let name = user.nom + ' ' + user.prenoms;
                        action =  `<div class="form-button-action"><button type="button"  data-toggle="tooltip" title="" class="btn btn-link btn-success display_user" data-original-title="voir" value="${user.user_id}/${name}"><i class="fa fa-plus"></i></button></div>`;
                        
                        tableData.push([user.user_id, name, user.fonction, action]);
                    })
                   }

                   $("#user_tab").DataTable().destroy();

                   $("table#user_tab").DataTable({
                       data: tableData,
                       pageLength: 5,
                       lengthMenu:[5, 10, 15],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
                   })
               }
            },
            error: ()=>{
                alert('server error');
            }
        })          
    })

    $('.add-').click(()=>{
        init();
    })

    //back button
    $("#back_btn").click(()=>{
        $(".setting").hide();
        $(".tab_materiel").show();
        init_UtilisationForm();
    })

    $("#_reset").click(()=>{
        $(".setting").hide();
        $(".tab_materiel").show();
        init_UtilisationForm();
    })

   $(document).on('click', 'button.display_user', function(){
       let data = this.value.split('/');
        $("#_id_user").val(data[0]);
        $("#_user").val(data[1]);
   })

    function init_UtilisationForm (){
        $("#_id_mat").val('');
        $("#_marque_mat").val('');
        $("#_type").val('');
        $("#_config").val('');
        $("#_id_user").val('');
        $("#_user").val('');
        $("#debut").val('');
        $("#fin").val('');
    }

    //add & update button (For utilisation table)
    $(document).on('click', 'button.mat_user', function(){
        let user_id =  $("#_id_user").val();
        let id_mat = $("#_id_mat").val();
        let debut =  $("#debut").val();
        let fin =  $("#fin").val();
        let btn = $('.mat_user').html();
        console.log(`${user_id}, ${id_mat}, ${debut}, ${fin}; ${btn}`)

        if(user_id === '' || debut === ''){
            _showAlert(_error, 'Veuillez remplir correctement tout les champs!')
        }else{
            if(btn === 'Ajouter'){
                //ajax add
                $.ajax({
                    url:'/new_utilisation',
                    method:'post',
                    dataType:'json',
                    data: {'id_mat': id_mat, 'user_id': user_id, 'debut': debut, 'fin': fin},
                    success:(result)=>{
                        if(result.msg === 'success'){
                            _showAlert(_success, 'Matériel attribué avec succès!');
                            init_UtilisationForm();
                        }else{
                            _showAlert(_error, result.msg);
                        }
                    },
                    error: ()=>{
                        alert('server error');
                    }        
                })
            }else{
                //ajax update
                $.ajax({
                    url:'/update_utilisation',
                    method:'post',
                    dataType:'json',
                    data: {'id_mat': id_mat, 'user_id': user_id, 'debut': debut, 'fin': fin},
                    success:(result)=>{
                        if(result.msg === 'success'){
                            _showAlert(_success, "L'attribution modifié avec succès!");
                            init_UtilisationForm();
                        }else _showAlert(_error, result.msg);
                    },
                    error: ()=>{
                        alert('server error');
                    }        
                })
            }
        }
    })

    //show info
    $(document).on('click', 'button.show_info', function(){
        $('#info').modal('show');
        let tab = this.value.split('/');
        console.log(tab);

        $.ajax({
            url:'/check_utilisation',
            method:'post',
            dataType:'json',
            data: {'id_mat': tab[0] },
            success:(result)=>{
              let user_name = '';
                
                try {
                    let user = result.data;
                    console.log(user);
                    user_name = user.nom;
                } catch (error) {
                    user_name = '-';
                }
            
            let tab_content = `<tr><td>${tab[1]}</td><td>${tab[2]}</td><td>${tab[3]}</td><td class="text-centered">${user_name}</td></tr>`;
            $('#info_body').html('');
            $('#info_title').html(`N°: ${tab[0]}`);
            $('#info_body').html(tab_content);
            $('#id').val(tab[0]);

            },
            error: ()=>{
                alert('server error1');
            }
        })
    })

    //delete materiel
    function delete_mat(id){
        $.ajax({
            url: '/delete_materiel',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
              loadtab(10);
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    $(document).on('click', 'button.del', function(){
        let id = this.value;

        Swal.fire({
            icon:'success',
            title: 'Materiel supprimé',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
            delete_mat(id);
       })  
    })
    $('#alert2').hide();
    function loadFilename(){
        $.ajax({
            url:'/loadPDF_fname',
            method:'post',
            dataType:'json',
            success:(result)=>{
                let fname = result.fname;
                $('#filename').val(fname);
            },
            error:()=>{
                alert('server error');
            }
        })
    }

    function generatePDF(url){
        $.ajax({
            url:url,
            method:'get',
            dataType:'json',
            success:(result)=>{
              if(result.msg==="error"){
                  alert('Aucun dépannage');
              }
            }
        })
    }
    function init(){
        $('#filename').val('');
    }

    $(document).on('click', 'button.pdf', function(){
        let filename = $('#filename').val();
        let materiel = $('#id').val()
        if(filename !== ""){
             generatePDF(`/pdfmake3/${filename}/${materiel}`)
             $('#modal_pdfSetup').modal('hide');
             $('#info').modal('hide');
             init()
        }else{
             showAlert(_error, "Veuillez Remplir correctement le champs!");
        }
     }) 

    $(document).on('click', 'button.Show_setup', function(){
        init();
        loadFilename();
    });
   
 })