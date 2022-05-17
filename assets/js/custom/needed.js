$(document).ready(function(){
   $(document).on('click', 'a.profile', function(){
       window.location = '/profile'
   }) 
   let url =$(location).attr('href');
})