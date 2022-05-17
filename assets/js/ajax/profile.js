$(document).ready(function(){

    $('#alert').hide()
    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    $(document).on('click', 'button#init', function(){
        window.location = '/profile'
    })

    $('.box-setting-profile').hide();

    $(document).on('click', 'button.change-pdp', function(){
        $('.box-setting-profile').show();
        $('.pdp-div-upd').show();
        $('.mdp-div-upd').hide();
    })

    $(document).on('click', 'button.change-pwd', function(){
        $('.box-setting-profile').show();
        $('.mdp-div-upd').show();
        $('.pdp-div-upd').hide();
    })
    function reset(){
        $('#mdp1').val('');
        $('#mdp2').val('');
    }
    function showAlert(_class, _message) {
        $('#alert').removeClass();
        $('#alert').html(_message);
        $('#alert').addClass(_class);
        $('#alert').fadeIn(1000)
        $('#alert').fadeOut(3000)
    }
    $(document).on('click', 'button#mdp-cancel', function(){
      reset();
    })
    
    $('#file').change(function(){
        console('hoho')
    })


    $(document).on('click', 'button#mdp-upd', function(){
      let mdp1 =   $('#mdp1').val();
      let mdp2 =   $('#mdp2').val();
      let data = $('#sender').html().split('/');

      if(mdp1 === "" || mdp2 === ""){
          showAlert(_error, "Veuillez remplir correctement tous les champs!");
      }else{
          if(mdp1 === mdp2){
              if(mdp1.length>5){
                $.ajax({
                    url: '/upd_pwd',
                    method: 'post',
                    dataType: 'json',
                    data: { 'mdp1': mdp1, 'user': data[1]},
                    success: (result) => {
                        if(result.msg==="success"){
                            reset();
                            showAlert(_success, "Mot de passe mis à jour avec succès!")
                        }
                    },
                    error: () => {
                        alert('server error!');
                    }
                });
              }else{
                showAlert(_error, "Votre mot de passe est moin de 5 lettres")
              }
          }else{
              showAlert(_error, "Les mots de passe ne sont pas identiques")
          }
      }
    })

})