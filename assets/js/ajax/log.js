$(document).ready(function(){
    $('#log').dataTable({
        lengthMenu:[25,50,100],
        language: {
            search: '<i class="fas fa-search" aria-hidden="true"></i>',
            searchPlaceholder: 'Rechercher'
        }
    })

    $("#_annee").chosen({width: "50%", no_results_text: "Veuillez choisir une année qui existe!"});
    $("#_mois").chosen({width: "50%", no_results_text: "Veuillez choisir une année qui existe!"});
    let _success = "alert alert-success";
    let _error = "alert alert-danger";
    $('#alert').hide();

    getAllDepannage();
    init()

    $("#tout").click(() => {
        $('.byAnnee').hide();
        $('.betweenDates').hide();
    });

    $("#1date").click(() => {
        $('.byAnnee').show();
        $('.betweenDates').hide();
    });

    $("#2dates").click(() => {
        $('.byAnnee').hide();
        $('.betweenDates').show();
    });

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

    function setRadioButtonCk(id, state){
        $(`#${id}`).attr('checked', function(){
            this.checked = state;
        });
    }

    function init(){
        $("#radio_printer").attr('checked', function(){
            this.checked = false
        });

        setRadioButtonCk('tout', true);
        setRadioButtonCk('1date', false);
        setRadioButtonCk('2dates', false);

        $('.byAnnee').hide();
        $('.betweenDates').hide();

        $('#date1').val('');
        $('#date2').val('');
        $('#filename').val('');
    }
    
    function getAllDepannage(){
        $.ajax({
            url:'/get_depannages',
            method:'get',
            dataType:'json',
            success:(result)=>{
               let data = result.data;
               let tableData = [];
               if(data.length>0){
                   $.each(data, (index, d)=>{
                        tableData.push([d.ref_dep, d.date_dep, d.tech_name, d.id_mat, d.info_mat, d.mat_user, d.diagnostique, d.pieces]);
                   })
               }

               $("#log").DataTable().destroy();

               //display all data on the table
               $("table#log").DataTable({
                    data: tableData,
                    lengthMenu:[25,50,100],
                    language: {
                        search: '<i class="fas fa-search" aria-hidden="true"></i>',
                        searchPlaceholder: 'Rechercher'
                    }
               })
            },
            error: ()=>{
                alert('server error');
            }
        })
    }
    function showAlert(_class, _message) {
        $('#alert').removeClass();
        $('#alert').html(_message);
        $('#alert').addClass(_class);
        $('#alert').fadeIn(600);
        $('#alert').fadeOut(2000);
    }

    function generatePDF(url){
        $.ajax({
            url:url,
            method:'get',
            dataType:'json',
            success:(result)=>{
              
            }
        })
    }

    //get Type value
    function getTypevalue(id1, id2, id3){
        let value='';
        let id = 'id';
        try {
            $(`#${id1}`).attr('checked', function(){
        
                if(this.checked === true){
                    value = this.value
                }else{
                    value = getTypevalue(id2, id3, id);
                }
           });
        } catch (error) {
            value = '';
        }
        return value;
    }

    $(document).on('click', 'button.pdf', function(){
       let filename = $('#filename').val();
       let requestType = getTypevalue('tout', '1date', '2dates');

       if(filename !== ""){
            if(requestType === 'tout'){
                generatePDF(`/pdfmake/${filename}`);
            }

            if(requestType === "1date"){
                let annee= $('#_annee').val();
                let mois = $('#_mois').val();
               if(annee === "" || mois === ""){
                    showAlert(_error,"Veuillez Remplir correctement le champs!")
               }else{
                    generatePDF(`/pdfmake1/${filename}/${annee}/${mois}`);
               }
            }

            if(requestType === "2dates"){
                let date1 = $('#date1').val();
                let date2 = $('#date2').val();
                if(date1 === "" || date2 === ""){
                    showAlert(_error,"Veuillez Remplir correctement le champs!")
               }else{
                    generatePDF(`/pdfmake2/${filename}/${date1}/${date2}`);
               }
            }

            $('#modal_pdfSetup').modal('hide');
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