/* Ajax engine for depannage */

$(document).ready(function(){
    $('#mat_tab').dataTable({});
    $('#depannage_tab').dataTable({})
    $('#_alert').hide();
    $('.add_depannage').hide();
    let url = $(location).attr('href');

    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getAllDepannage();
   

    $('#id_pdr').multiselect({
        enableFiltering: true,
        filterPlaceholder: 'Rechercher',
        selectedClass: "active multiselect-active-item-fallback"
    });

    function loadtab(n){
        for (let i = 0; i < n; i++) {
            getAllDepannage();
        }
    }
   

    function setRadioButtonCk(id, state){
        $(`#${id}`).attr('checked', function(){
            this.checked = state;
        });
    }

    
    function showAlert(_class, _message) {
        $('#_alert').removeClass();
        $('#_alert').html(_message);
        $('#_alert').addClass(_class);
        $('#_alert').fadeIn(600)
        $('#_alert').fadeOut(2000)
    }

    setRadioButtonCk("radio_sce1", false);
    setRadioButtonCk("radio_dep1", false);
    setRadioButtonCk("radio_dir1", true);
    display_data("/get_directions", "nom_dir", $("radio_dir1").val(), $("#dd_menu1"));

    /*$("#radio_all").click(() => {
        displayAllMateriel();
    })*/

     //display service select
     $("#radio_sce").click(() => {
        let work = $("#radio_sce").val();
        let url = "/get_services";
        let property = "nom_sce";
        let menu = $('#dd_menu');
        display_data(url, property, work, menu);

        console.log(work);
    })

    //display department select
    $("#radio_dep").click(() => {
        let work = $("#radio_dep").val();
        let url = "/get_departements";
        let property = "nom_dep";
        let menu = $('#dd_menu');
        display_data(url, property, work, menu);

        console.log(work);
    })

    //display direction select
    $("#radio_dir").click(() => {
        let work = $("#radio_dir").val();
        let url = "/get_directions";
        let property = "nom_dir";
        let menu = $('#dd_menu');
        display_data(url, property, work, menu);

        console.log(work);
    })

     //display service select
     $("#radio_sce1").click(() => {
        let work = $("#radio_sce1").val();
        let url = "/get_services";
        let property = "nom_sce";
        let menu = $('#dd_menu1');
        display_data(url, property, work, menu);
        console.log(work);
    })

    //display department select
    $("#radio_dep1").click(() => {
        let work = $("#radio_dep1").val();
        let url = "/get_departements";
        let property = "nom_dep";
        let menu = $('#dd_menu1');
        display_data(url, property, work, menu);

        console.log(work);
    })

    //display direction select
    $("#radio_dir1").click(() => {
        let work = $("#radio_dir1").val();
        let url = "/get_directions";
        let property = "nom_dir";
        let menu = $('#dd_menu1');
        display_data(url, property, work, menu);

        console.log(work);
    })
    depannageInProcess(url);
    function display_data(url, property, label, menu) {
        let div = $('.dd_1');
        let dd_label =  $('#work_id');
        let nom = '';
       
      //  dd_label.html(label);
        div.show();
        console.log(menu)
       
        $.ajax({
            url: url,
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let data = result.data;
                //console.log(data);
                menu.html('');

                if (data.length > 0) {
                    //<a class="dropdown-item"><option value="">Action</option></a>
                    $.each(data, (index, option) => {
                        nom = option[`${property}`];
                       // console.log(option);
                        menu.append(`<option class="option" value=${option.id}>${nom}</option>`);
                    });
                        
                }
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    function displayMateriel(id){
        $.ajax({
            url: '/get_matbyWorkId',
            method: 'post',
            dataType: 'json',
            data:{'work_id': id},
            success: (result) => {
                let materiels = result.data;
                let action = '';
                let tableData = [];

                if(materiels.length>0){
                    $.each(materiels, (index, materiel)=>{
                      action =  `<div class="form-button-action"><button type="button"  data-toggle="tooltip" title="" class="btn btn-link btn-success display_mat" data-original-title="voir" value="${materiel.id_mat}"><i class="fa fa-plus"></i></button></div>`;
                      let user = `${materiel.nom} ${materiel.prenoms}`;  
                      tableData.push([materiel.id_mat, materiel.type, materiel.config, user, action]);
                    })
                }

                $("#mat_tab").DataTable().destroy();

                $("table#mat_tab").DataTable({
                    data: tableData
                })
               
            }
        });
    }

    $('input[name=typelist]').keypress(function(){
        let work_id = $(this).val();
        if(event.keyCode == '13'){
           //I code here
           if(work_id !== ''){
            displayMateriel(work_id);
           }else{
            displayAllMateriel();
           }
        }
    })

    function reset(){
        $('#id_mat').val('');
        $('#diagnostique').val('');
        $('#date_dep').val('');
    }

    $('#add_btn').click(()=>{
        $('.tab_dep').hide();
        $('.add_depannage').show();

        setRadioButtonCk("radio_sce", false);
        setRadioButtonCk("radio_dep", false);
        setRadioButtonCk("radio_dir", true);
        display_data("/get_directions", "nom_dir", $("radio_dir").val(), $("#dd_menu"));
        displayAllMateriel();
        let tech = '';
        let tab=[];
        loadTech(tech);
        getAllPdr(tab);
    })

    $('#back_btn').click(()=>{
        $('.add_depannage').hide();
        $('.tab_dep').show();
        $('.add_dep').html('Ajouter');
        reset();
        setRadioButtonCk("radio_sce1", false);
        setRadioButtonCk("radio_dep1", false);
        setRadioButtonCk("radio_dir1", true);
        display_data("/get_directions", "nom_dir", $("radio_dir1").val(), $("#dd_menu1"));
        loadtab(2);
    })

    $('#_reset').click(()=>{
        reset();
        let tech = '';
        let tab=[];
        loadTech(tech);
        getAllPdr(tab);
    })

    function displayAllMateriel(){
        $.ajax({
            url: '/get_materiels1',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let materiels = result.data;
                let action = '';
                let tableData = [];

                if(materiels.length>0){
                    $.each(materiels, (index, materiel)=>{
                      action =  `<div class="form-button-action"><button type="button"  data-toggle="tooltip" title="" class="btn btn-link btn-success display_mat" data-original-title="voir" value="${materiel.id}"><i class="fa fa-plus"></i></button></div>`;
                     
                      tableData.push([materiel.id, materiel.type, materiel.config, materiel.user, action]);
                    })
                }

                $("#mat_tab").DataTable().destroy();

                $("table#mat_tab").DataTable({
                    data: tableData
                })
               
            },
            error: () => {
                alert('server error!');
            }
        });
    }
   
    function loadTech(tech){
        let select = $('#tech_id');
        $.ajax({
            url: '/get_users',
            method: 'get',
            dataType: 'json',
            success: (result) => {
               console.log(result.users);
               let users = result.users;
               select.html('');
               if(users.length>0){
                   if(tech !== ''){
                    $.each(users, (index, user)=>{
                        if(user.role === 'Technicien'){
                            if(user.id === tech){
                                select.append(`<option value=${user.id}>${user.nom}</option>`)
                            }
                        }
                    })

                    $.each(users, (index, user)=>{
                        if(user.role === 'Technicien'){
                            if(user.id !== tech){
                                select.append(`<option value=${user.id}>${user.nom}</option>`)
                            }
                        }
                    })
                   }else{
                    select.append('<option value = "null" ></option>')
                    $.each(users, (index, user)=>{
                        if(user.role === 'Technicien'){
                            select.append(`<option value=${user.id}>${user.nom}</option>`)
                        }
                    })
                   }
               }

               
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    $(document).on('click', 'button.display_mat', function(){
        let id = this.value;
        $('#id_mat').val(`${id}`);  
    })
    
    //This function is needed to select all pdr already selected
    function arranger(table1, table2, _data3){
        let data1 = [];
        let data2 = [];
        let data3 = _data3;
        let options = [];

        console.log(table1);
        console.log(table2);
       
          table1.forEach(piece => {
            if(table2[0] !== piece.id_pdr){
                data1.push(piece);
                if(piece.nombre>0){
                    options.push({label: `${piece.marque} / ${piece.description}`, title: `${piece.marque}`, value: piece.id_pdr, selected: false})
                }
            }else{
                data3.push(piece);
            }
          });      
          
          table2.forEach(element => {
            if(table2[0] !== element){
                data2.push(element);
            }
          });

        if(table2.length>0){
            arranger(data1, data2, data3);
        }else{
            $.each(data3, (index, piece)=>{
                options.push({label: `${piece.marque} / ${piece.description}`, title: `${piece.marque}`, value: piece.id_pdr, selected: true})
            })
            $('#id_pdr').multiselect('dataprovider', options);
        }
      
        
    }

    function getAllPdr(tab){
        $.ajax({
            url: '/get_pieces',
            method: 'get',
            dataType: 'json',
            success: (result) => {
             //  console.log(result.data);
               let pieces = result.data;
               let options = [];
               let current_id = '';
               let data = [];
               
               if(pieces.length>0){
                   if(tab.length>0){
                    arranger(pieces, tab, data);
                   }else{
                        $.each(pieces, (index, piece)=>{
                            if(piece.nombre > 0){
                                options.push({label: `${piece.marque} / ${piece.description}`, title: `${piece.marque}`, value: piece.id_pdr, selected: false})
                            }
                        })
                        $('#id_pdr').multiselect('dataprovider', options);
                   }
               }  
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    /*************************/
     //   CRUD Depannage 
    /*************************/

    function addModification(ref_dep, data){
        if(data.length>0){
            $.ajax({
                url:'/new_modification',
                method:'post',
                dataType:'json',
                data: {'data': data, 'ref_dep': ref_dep},
                success:(result)=>{
    
                    if(data.length>0){
                        $.each(data, (index, elem)=>{
                            updatePdr(elem, 0);
                        })
                    }
                },
                error: ()=>{
                    alert('server error4');
                }
            })
        }
    }
    
    function deleteModification(ref_dep, data){
        console.log("deleteModification")
        console.log(data);
        if(data.length>0){
            $.ajax({
                url:'/delete_modification',
                method:'post',
                dataType:'json',
                data: {'ref_dep': ref_dep ,'data': data},
                success:(result)=>{
                    
                    if(data.length>0){
                        $.each(data, (index, elem)=>{
                            updatePdr(elem, 1);
                        })
                    }
                },
                error: ()=>{
                    alert('server error3');
                }
            })
        }
    }

    function updatePdr(data, type){
        $.ajax({
            url:'/update_piece1',
            method:'post',
            dataType:'json',
            data: {'data': data, 'type': type},
            success:(result)=>{
                console.log('pdr updated')
            },
            error: ()=>{
                alert('server error2');
            }
        })
    }

    function afterDepannageUpdate(table1, table2, table3, ref_dep){
        let data1 = [];
        let data2 = [];
        let data3 = table3;
        let id = ref_dep;

        console.log(table2[0]);
        table1.forEach(elem1 => {
            if(elem1 !== table2[0]){
                data1.push(elem1);
            }
        });

        if(data1.length === table1.length){
            if(typeof(table2[0]) !== "undefined"){
                data3.push(table2[0]);
            }
        }

        table2.forEach(elem2 => {
            if(elem2 !== table2[0]){       
                data2.push(elem2);
            }
        });

        if(table2.length>0){
            afterDepannageUpdate(data1, data2, data3, id);
        }else{
            console.log(table1);
            console.log(table3);
            //Table1 est le tableau contenant les modifications à supprimer
            deleteModification(ref_dep, table1);
            //Table3 est le tableau contenant les modifications à ajouter
            addModification(ref_dep, table3);

        }
    }

    //afterDepannageUpdate([1,2,3,4,5,6], [1,2,3,4,6,7,8], []);
    
    $(document).on('click', 'button.add_dep', function(){
        let technicien = $('#tech_id').val();
        let materiel = $('#id_mat').val();
        let diagnostique = $('#diagnostique').val();
        let pdr = $('#id_pdr').val();
        let date_dep = $('#date_dep').val();
        let btn = $('.add_dep').html();
       
        if(technicien === '' || materiel === '' || diagnostique === '' || date_dep === ''){
            showAlert(_error, "Veuillez remplir correctement tous les champs");
        }else{
            if(btn === 'Ajouter'){
                //add depannage
                if(typeof(pdr) === "undefined"){
                    pdr = [];
                }
    
                $.ajax({
                    url:'/new_depannage',
                    method:'post',
                    dataType:'json',
                    data: {'technicien': technicien, 'materiel': materiel, 'diagnostique': diagnostique, 'pdr': pdr, 'date_dep': date_dep},
                    success:(result)=>{
                        if(result.msg === "success"){
                            let id = "";
                            if(pdr.length>0){
                                addModification(id, pdr);
                            }
                            showAlert(_success, 'Dépannage ajouté avec succés');
                            reset();
                            loadtab(2);
                        }else{
                            showAlert(_error, result.msg);
                        }
                    },
                    error: ()=>{
                        alert('server error');
                    }
                })
            }else{
                //update depannage
                let backup = $('#backup').val();
                let data = backup.split('/');
                let pieces =[];
                console.log(backup);
                console.log(data);
                if(data[1] === ""){
                    pieces = [];
                }else{
                    pieces = data[1].split(',');
                }
                console.log(pieces);

                $.ajax({
                    url:'/update_depannage',
                    method:'post',
                    dataType:'json',
                    data: {'ref_dep':data[0],'technicien': technicien, 'materiel': materiel, 'diagnostique': diagnostique, 'pdr': pdr, 'date_dep': date_dep},
                    success:(result)=>{
                        if(result.msg === "success"){
                            let id = "";
                            console.log(result.msg)
                            afterDepannageUpdate(pieces, pdr, [], data[0])
                            showAlert(_success, 'Dépannage modifié avec succés');
                            reset();
                            loadtab(2);
                            $('.add_dep').html('Ajouter');
                        }else{
                            showAlert(_error, result.msg);
                        }
                       
                    },
                    error: ()=>{
                        alert('server error1');
                    }
                })
            }
        }
    })
    
    function getAllDepannage(){
        $.ajax({
            url:'/get_depannages',
            method:'get',
            dataType:'json',
            success:(result)=>{
               let data = result.data;
               let tableData = [];
               let action = '';

               if(data.length>0){
                   $.each(data, (index, d)=>{
                      
                       action = `<div class="form-button-action"><button type="button" value="${d.ref_dep}/${d.id_mat}/${d.tech_id}/${d.date_dep1}/${d.diagnostique}/${d.pieces_id}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${d.ref_dep}/${d.pieces_id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                        tableData.push([d.ref_dep, d.date_dep,d.tech_name, d.id_mat, d.info_mat, d.diagnostique, d.pieces, action]);
                   })
               }

               $("#depannage_tab").DataTable().destroy();

               //display all data on the table
               $("table#depannage_tab").DataTable({
                   data: tableData
               })
            },
            error: ()=>{
                alert('server error');
            }
        })
    }

    $(document).on('click', 'button.upd', function(){
        $('.add_depannage').show();
        $('.tab_dep').hide();
        setRadioButtonCk("radio_sce", false);
        setRadioButtonCk("radio_dep", false);
        setRadioButtonCk("radio_dir", true);
        display_data("/get_directions", "nom_dir", $("radio_dir").val(), $("#dd_menu"));
        displayAllMateriel();


        $('.add_dep').html('Modifier');

        let data = this.value.split('/');
        let data1 = [];
        console.log(data)
        $('#backup').val(`${data[0]}/${data[5]}`);
        $('#id_mat').val(data[1])
        $('#date_dep').val(data[3])
        $('#diagnostique').val(data[4]);
        let tech = data[2];
        loadTech(tech);
       
        if(data[5] !== ''){
            data1 = data[5].split(',');
        }else{
            data1 = [];
        }
        getAllPdr(data1);
        console.log(data[5]);
                     
    })


    //Delete depannage
    function deleteDepannage(id, tab){
        $.ajax({
            url: '/delete_depannage',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
               loadtab(10);
               if(tab.length>0){
                   $.each(tab, (index, elem)=>{
                    updatePdr(elem, 1);
                   })
               }
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    $(document).on('click', 'button.del', function(){
        let data = this.value.split('/');
        let id = parseInt(data[0]);
        let tab = [];
        console.log(id);
        if(data[1] === ""){
            tab = [];
        }else{
            tab = data[1].split(',')
        }

        Swal.fire({
            icon:'success',
            title: 'Depannage supprimé',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
        deleteDepannage(id, tab);
       }) 
    })

    function depannageInProcess(url){
        if(url !== "http://localhost:8080/depannage/direct"){
            let data = url.split('/');
            let data1 = data[4].split(',')
            $('.add_depannage').show();
            $('.tab_dep').hide();
            $('#id_mat').val(data1[1]);

        setRadioButtonCk("radio_sce", false);
        setRadioButtonCk("radio_dep", false);
        setRadioButtonCk("radio_dir", true);
        display_data("/get_directions", "nom_dir", $("radio_dir").val(), $("#dd_menu"));
        displayAllMateriel();
        let tech = '';
        let tab=[];
        loadTech(tech);
        getAllPdr(tab);
            

        }
    }
    
})