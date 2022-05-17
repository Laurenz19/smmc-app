/* Ajax engine for pdr */

$(document).ready(function(){
    $('#add-row').DataTable({});
    $('#alert').hide();

    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    getAllPdr();
    function init(){
        $('#id_pdr').val('');
        $('#marque').val('');
        $('#description').val('');
        $('#nombre').val('');
        $('#dateArrivee').val('');
    }

    function showAlert(_class, _message) {
        $('#alert').removeClass();
        $('#alert').html(_message);
        $('#alert').addClass(_class);
        $('#alert').fadeIn(600)
        $('#alert').fadeOut(2000)
    }

    //reset button
    $(document).on('click', 'button.reset', function(){
        init();
    })

    //add & update button
    $(document).on('click', 'button.add_pdr', function(){
        let id_pdr = $('#id_pdr').val();
        let marque = $('#marque').val();
        let description = $('#description').val();
        let nombre = $('#nombre').val();
        let dateArrivee = $('#dateArrivee').val();
        let btn = $('.add_pdr').html();

        if(marque === '' || description === '' || nombre === '' || dateArrivee === ''){
            showAlert(_error, "Veuillez remplir correctement tous les champs!");
        }else{
           if(isNaN(parseInt(marque)) === true){
                if(isNaN(parseInt(description)) === true){
                   if(btn === 'Ajouter'){
                        //add pdr
                        $.ajax({
                            url:'/new_piece',
                            method:'post',
                            dataType:'json',
                            data: {'marque': marque, 'description': description, 'nombre': nombre, 'dateArrivee': dateArrivee},
                            success:(result)=>{
                                if(result.msg === "success"){
                                    showAlert(_success, "PDR ajoutée avec succès!");
                                    loadtab(15);
                                    init();
                                    $('#pdrModal').modal('hide');
                                }else{
                                    showAlert(_error, result.msg);
                                }
                            },
                            error: ()=>{
                                alert('server error');
                            }
                        })
                        
                   }else{
                       //update pdr
                       $.ajax({
                        url:'/update_piece',
                        method:'post',
                        dataType:'json',
                        data: {'id_pdr': id_pdr, 'marque': marque, 'description': description, 'nombre': nombre, 'dateArrivee': dateArrivee},
                        success:(result)=>{
                            console.log(result.msg)
                            if(result.msg === "success"){
                                showAlert(_success, "PDR modifiée avec succès!");
                                loadtab(15);
                                init();
                                $('#pdrModal').modal('hide');
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
                    showAlert(_error, `${description} est un chiffre!! Veuillez entrez une lettre`);
                }
           }else{
                showAlert(_error, `${marque} est un chiffre!! Veuillez entrez une lettre`);
           }
        }

    });

    //get all Materiel
    function getAllPdr(){
        $.ajax({
            url:'/get_pieces',
            method:'get',
            dataType:'json',
            success:(result)=>{
                let pieces = result.data;
                let tableData = [];

                $.each(pieces, (index, piece) => {
                    let button = `<div class="form-button-action"><button type="button" value="${piece.id_pdr}/${piece.marque}/${piece.description}/${piece.nombre}/${piece.dateArrivee1}" data-toggle="tooltip" title="" class="btn btn-link btn-info upd" data-original-title="modifier"><i class="fa fa-edit"></i></button><button type="button" value="${piece.id_pdr}" data-toggle="tooltip" title="" class="btn btn-link btn-warning del" data-original-title="supprimer"><i class="icon-trash"></i></button></div>`;
                    
                    //Push pdr inside tableData
                    tableData.push([piece.id_pdr, piece.marque, piece.description, piece.nombre, piece.dateArrivee, button])
                })

                $("#add-row").DataTable().destroy();

                //display all data on the table
                $("table#add-row").DataTable({
                    data: tableData
                })
            },
            error:()=>{
                alert('server error');
            }
        })
    }

    //load table
    function loadtab (nb){
        for (let i = 0; i < nb; i++) {
           getAllPdr();
        }
    }

    //Update button
    $(document).on('click', 'button.upd', function(){
        $('#pdrModal').modal('show');
        $('.add_pdr').html('Modifier');
        let data = this.value.split('/');
       
        /*------------------------------------------*/
                $('#id_pdr').val(data[0]);
                $('#marque').val(data[1]);
                $('#description').val(data[2]);
                $('#nombre').val(data[3]);
                $('#dateArrivee').val(data[4]);
        /*------------------------------------------*/
    })

    //delete PDR
    function delete_pdr(id){
        $.ajax({
            url: '/delete_piece',
            method: 'post',
            dataType: 'json',
            data: { 'id': id },
            success: (result) => {
              loadtab(15);
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
            title: 'PDR supprimée',
            showConfirmButton: false,
            timer: 1000,
       }).then(()=>{
            delete_pdr(id);
       }) 
    })
   
})