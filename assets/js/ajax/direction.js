/* Ajax Engine for direction */
$(document).ready(function() {
    $('#add-row').DataTable({
        pageLength: 5,
        lengthMenu:[5, 10, 15],
        language: {
            search: '<i class="fas fa-search" aria-hidden="true"></i>',
            searchPlaceholder: 'Rechercher'
        }
    });

    $('#alert_dir').hide();
    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getAll_Directions();

    //reset
    $('#reset').click(()=>{
        $("#id_dir").val('');
        $("#new_direction").val('');
        $('#add_dir').html('Ajouter');
        
    })

    /* Create & Update Direction */
    $('#add_dir').click(() => {

        //Get the input's value and the button's innerHTML
        let id = $("#id_dir").val();
        let direction = $("#new_direction").val();
        let btn = $('#add_dir').html();

        //Delete the input's value
        $("#new_direction").val('');
        $("#id_dir").val('');
        if(direction === ""){
            showAlert(_error, "Veuillez remplir tous les champs !");
        }else{
            if (btn === "Ajouter") {
                $.ajax({
                    url: '/new_direction',
                    method: 'post',
                    dataType: 'json',
                    data: { 'direction': direction },
                    success: (result) => {
                     
                        if (result.msg === "success") {
                            
                            //custom alert
                            showAlert(_success, "Ajout éfféctué avec succès!");
                            loadtab(20);
                        } else {
                            //custom alert
                            showAlert(_error, result.msg);
                        }
                    },
                    error: () => {
                        alert('server error!');
                    }
                });
            } else {
                $.ajax({
                    url: '/update_direction',
                    method: 'post',
                    dataType: 'json',
                    data: { 'id': id, 'direction': direction },
                    success: (result) => {
                        $('#add_dir').html('Ajouter');
                        if (result.msg === "success") {
                            //custom alert
                            showAlert(_success, "Mise à jour éfféctué avec succès!");
                            loadtab(10);
                        } else {
                            //custom alert
                            showAlert(_error, result.msg);
                        }
                    },
                    error: () => {
                        alert('server error!');
                    }
                });
            }
    
        }
       
    });
    /* End create */

    /* Get all data from the database */
    function getAll_Directions() {
        $.ajax({
            url: '/get_directions',
            method: 'get',
            dataType: 'json',
            success: (result) => {
                let directions = result.data;
                let tableData = [];

                $.each(directions, (index, direction) => {
                    let button = `<div class="form-button-action"><button type="button" value="${direction.id}/${direction.nom_dir}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${direction.id}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                    let id = direction.id;
                    let nomDir = direction.nom_dir;

                    //Push direction inside tableData
                    tableData.push([id, nomDir, button])
                })

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
            $("#id_dir").val(data[0]);
            $("#new_direction").val(data[1]);
            $("#add_dir").html("Modifier");
    })
    
    /* End of Update Direction */

    /* delete a direction */
    //function
    function delete_dir(id) {
        $.ajax({
            url: '/delete_direction',
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
            title: 'Direction supprimée',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
        delete_dir(id);
       }) 
    });
    /* En delete Dir */

    function showAlert(_class, _message) {
        $('#alert_dir').removeClass();
        $('#alert_dir').html(_message);
        $('#alert_dir').addClass(_class);
        $('#alert_dir').fadeIn(1000)
        $('#alert_dir').fadeOut(3000)
    }

    function loadtab (nb){
        for (let i = 0; i < nb; i++) {
            getAll_Directions(); 
        }
    }
})