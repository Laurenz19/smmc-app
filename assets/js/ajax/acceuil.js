$(document).ready(function(){
   let splide = new Splide('.splide',{
    
   }).mount();


    $(document).on("click", "div.choix", function(){
        window.location = `/${this.id}`
    })
})