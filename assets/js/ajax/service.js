/* Ajax Engine for Service */
$(document).ready(function() {
    $("#add-row").DataTable({
        pageLength: 5,
        lengthMenu:[5, 10, 15]
    });

    $("#alert_sce").hide();

    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getDepartements();
    getServices();
    $("#departement").chosen({width:'100%', no_results_text: "Veuillez choisir une departement qui existe!"})

    //reset
    function init_form(){
        $("#id_sce").val('');
        $("#new_service").val('');
        $("#departement").val('');
        $("#add_sce").html('Ajouter');
        getDepartements();
    }
    $('#reset').click(()=>{
       init_form();
    })

    $('#add_sce').click(() => {
            let id = $("#id_sce").val();
            let service = $("#new_service").val();
            let departement = $("#departement").val();
            let btn = $("#add_sce").html();

            console.log(`${id}, ${service}, ${departement}`);

            if(service === ""){
                showAlert(_error, "Veuillez remplir tous les champs !")
                init_form();
            }else{
                if (btn === "Ajouter") {
                    $.ajax({
                        url: '/new_service',
                        method: 'post',
                        dataType: 'json',
                        data: { 'departement': departement, 'service': service },
                        success: (result) => {
                            if (result.msg === "success") {
                                //custom alert
                                showAlert(_success, "Ajout éfféctué avec succès!");
                                loadtab(20);
                                init_form();
                            } else {
                                //custom alert
                                if(result.msg === "Ce service éxiste déjà!"){
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
                        url: '/update_service',
                        method: 'post',
                        dataType: 'json',
                        data: { 'id': id, 'departement': departement, 'service': service },
                        success: (result) => {
                            $('#add_sce').html('Ajouter');
                            console.log(result.msg);
                            if (result.msg === "success") {
                                //custom alert
                                showAlert(_success, "Mise à jour éfféctué avec succès!");
                                loadtab(20);
                                init_form();
                            } else {
                                //custom alert
                                if(result.msg === "Ce service éxiste déjà!"){
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

    /* End add and update */

    /* Get Departments Services & from the database */
    //department
    function getDepartements() {
        $.ajax({
            url: '/get_departements',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let departements = result.data;
                let select = $('#departement');
                select.html('');
                //select.append("<option>6</option>");
                if (departements.length > 0) {
                    select.append("<option></option>");
                    $.each(departements, (index, departement) => {
                        select.append(`<option value=${departement.id}>${departement.nom_dep}</option>`);
                    });
                } else {
                    select.append("<option></option>");
                }

                $('#departement').trigger("chosen:updated");
            },
            error: () => {
                alert('server error!');
            }
        });
    }

    //service
    function getServices() {
        $.ajax({
            url: '/get_services',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let departements = result.departements;
                let services = result.data;
                let tableData = [];
                let button = '';
                let dep = '';

                if (services.length > 0) {
                    $.each(services, (index, sce) => {
                        if (sce.dep_id === null) {
                            dep='';
                            button = `<div class="form-button-action"><button type="button" value="${sce.id}/${sce.nom_sce}/${dep}/${dep}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${sce.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                            tableData.push([sce.id, sce.nom_sce, dep, button]);
                        } else {
                            $.each(departements, (index, departement) => {
                                if (departement.id === sce.dep_id) {
                                    dep = departement.nom_dep;
                                    button = `<div class="form-button-action"><button type="button" value="${sce.id}/${sce.nom_sce}/${dep}/${departement.id}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${sce.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                                    tableData.push([sce.id, sce.nom_sce, dep, button]);
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
                    lengthMenu:[5, 10, 15]
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
        $("#id_sce").val(data[0]);
        $("#new_service").val(data[1]);
        $("#add_sce").html("Modifier");

        $.ajax({
            url: '/get_departements',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let dep = result.data;
                let select = $('#departement');

                let val = `<option value=${data[3]}>${data[2]}</option>`;
                select.html('');
                console.log(dep);
                if (dep.length > 0) {
                    select.append(val);
                    $.each(dep, (index, departement) => {
                        if (data[3] !== departement.id) {
                            select.append(`<option value=${departement.id}>${departement.nom_dep}</option>`);
                        }
                    });
                } else {
                    select.append("<option></option>");
                }
                $('#departement').trigger("chosen:updated");
            },
            error: () => {
                alert('server error!');
            }
        });
    })

    /* End display to the form */

    /* delete a departement */
    function delete_sce(id) {
        $.ajax({
            url: '/delete_service',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
               loadtab(20);
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
            title: 'PDR supprimée',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
        delete_sce(id);
       }) 
    });
    /* En delete Dir */


    function showAlert(_class, _message) {
        $('#alert_sce').removeClass();
        $('#alert_sce').html(_message);
        $('#alert_sce').addClass(_class);
        $('#alert_sce').fadeIn(1000)
        $('#alert_sce').fadeOut(3000)
    }

    function loadtab (nb){
        for (let i = 0; i < nb; i++) {
            getServices();  
        }
    }
})