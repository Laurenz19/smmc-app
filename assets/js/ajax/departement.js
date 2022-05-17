/* Ajax Engine for Department */
$(document).ready(function() {
    $('#add-row').DataTable({
        pageLength: 5,
        lengthMenu:[5, 10, 15],
        language: {
            search: '<i class="fas fa-search" aria-hidden="true"></i>',
            searchPlaceholder: 'Rechercher'
        }
    });

    $('#alert_dep').hide();
    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getDirections();
    getDepartements();
    $("#direction").chosen({width:"100%",no_results_text: "Veuillez choisir une direction qui existe!"})

    //reset
    function init_form(){
        $("#id_dep").val('');
        $("#new_departement").val('');
        $("#direction").val('');
        $("#add_dep").html('Ajouter');
        getDirections()
    }
    $('#reset').click(()=>{
       init_form()
    })

    //Add & update department
    $('#add_dep').click(() => {
        let id = $("#id_dep").val();
        let departement = $("#new_departement").val();
        let direction = $("#direction").val();
        let btn = $("#add_dep").html();


        console.log(`${id}, ${departement}, ${direction}`)

        if(departement === ''){
            showAlert(_error, "Veuillez remplir tous les champs!");
            init_form();
        }else{
            if (btn === "Ajouter") {
                $.ajax({
                    url: '/new_departement',
                    method: 'post',
                    dataType: 'json',
                    data: { 'departement': departement, 'direction': direction },
                    success: (result) => {
                        if (result.msg === "success") {
                            //custom alert
                            showAlert(_success, "Ajout éfféctué avec succès!");
                            loadtab(8);
                            init_form();
                        } else {
                            //custom alert
                            if(result.msg === "Ce département éxiste déjà!"){
                                init_form();
                            }
                            showAlert(_error, result.msg);
                        }
                    },
                    error: () => {
                        alert('server error!');
                    }
                });
            } else {
                $.ajax({
                    url: '/update_departement',
                    method: 'post',
                    dataType: 'json',
                    data: { 'id': id, 'departement': departement, 'direction': direction },
                    success: (result) => {
                        $('#add_dep').html('Ajouter');
                        if (result.msg === "success") {
                            //custom alert
                            showAlert(_success, "Mise à jour éfféctué avec succès!");
                            loadtab(8);
                            init_form();
                            
                        } else {
                            //custom alert
                            if(result.msg === "Ce département éxiste déjà!"){
                                init_form();
                            }
                            showAlert(_error, result.msg);
                        }
                    },
                    error: () => {
                        alert('server error!');
                    }
                });
            }
        }
      
    })

    /* Get directions from the database */
    function getDirections() {
        $.ajax({
            url: '/get_directions',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let directions = result.data;
                let select = $('#direction');
                select.html('');
                //select.append("<option>6</option>");
                if (directions.length > 0) {
                    select.append("<option></option>");
                    $.each(directions, (index, direction) => {
                        select.append(`<option value=${direction.id}>${direction.nom_dir}</option>`);
                    });
                } else {
                    select.append("<option></option>");  
                }
                $("#direction").trigger("chosen:updated")
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    /* Get all Department from the database */
    function getDepartements() {
        $.ajax({
            url: '/get_departements',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let tableData = [];
                let departements = result.data;
                let directions = result.directions;  
                let button = '';
                let dir = '';

                if (departements.length > 0) {
                    $.each(departements, (index, dep) => {
                        if (dep.dir_id === null) {
                            dir='';
                            button = `<div class="form-button-action"><button type="button" value="${dep.id}/${dep.nom_dep}/${dir}/${dir}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${dep.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                            tableData.push([dep.id, dep.nom_dep, dir, button]);
                        } else {
                            $.each(directions, (index, direction) => {
                                if (direction.id === dep.dir_id) {
                                    dir = direction.nom_dir;
                                    button = `<div class="form-button-action"><button type="button" value="${dep.id}/${dep.nom_dep}/${dir}/${direction.id}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${dep.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                                    tableData.push([dep.id, dep.nom_dep, dir, button]);
                                }
                            })
                        }
                    });
                }

                $("#add-row").DataTable().destroy();

                //display all data on the table
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
            error: () => {
                alert('server error!');
            }
        });
    }
    /* End get all data function */

    /* To display data on the form */
    $(document).on('click', 'button.upd', function() {
        //get the button's value
        let data = this.value.split('/');
        console.log(data);
        $("#id_dep").val(data[0]);
        $("#new_departement").val(data[1]);
        $("#add_dep").html("Modifier");

        $.ajax({
            url: '/get_directions',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let directions = result.data;
                let select = $('#direction');
                let val = `<option value=${data[3]}>${data[2]}</option>`;
                select.html('');

                if (directions.length > 0) {
                    select.append(val);
                    $.each(directions, (index, direction) => {
                        if (data[3] !== direction.id) {
                            select.append(`<option value=${direction.id}>${direction.nom_dir}</option>`);
                        }
                    });
                } else {
                    select.append("<option></option>");
                }
                $("#direction").trigger("chosen:updated")
            },
            error: () => {
                alert('server error!');
            }
        });
    })

    /* End display to the form */

    /* delete a departement */
    function delete_dep(id) {
        $.ajax({
            url: '/delete_departement',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
               loadtab(5);
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    //Action
    $(document).on('click', 'button.del', function() {
        //get the button's value
        let id = this.value;

        Swal.fire({
            icon:'success',
            title: 'Département supprimé',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
        delete_dep(id);
       }) 
    });
    /* En delete Dir */

    function showAlert(_class, _message) {
        $('#alert_dep').removeClass();
        $('#alert_dep').html(_message);
        $('#alert_dep').addClass(_class);
        $('#alert_dep').fadeIn(1000)
        $('#alert_dep').fadeOut(3000)
    }

    function loadtab (nb){
        for (let i = 0; i < nb; i++) {
            getDepartements(); 
        }
    }

})