/* Ajax engine for login */
$(document).ready(function(){
    $('#alert_log').hide();
    let _success = "alert alert-success";
    let _error = "alert alert-danger";

    $("#conn").click(()=>{
        let email = $("#email").val();
        let password = $("#mdp").val();
        console.log(`${email} et ${password}`);
        if(email =='' || password ==''){
            showAlert(_error, "Veuillez remplir tout les champs!")
        }else{
            getConnection(email, password);
        }
    })

    function getConnection(email, password){
        $.ajax({
            url: '/check_auth',
            method:'post',
            dataType:'json',
            data:{'email': email, 'password': password},
            success:(result)=>{
               if(result.msg !== 'success'){
                showAlert(_error, result.msg);
               }else{
                //redirection
                window.location ='/acceuil/SMMC';
               }
            },
            error:()=>{
                alert('server error!');
            }
        })
    }

    function showAlert(_class, _message) {
        $('#alert_log').removeClass();
        $('#alert_log').html(_message);
        $('#alert_log').addClass(_class);
        $('#alert_log').fadeIn(500)
        $('#alert_log').fadeOut(3000)
    }

});