let tour_name = "";

function getTourId(){
  let url = window.location.href;
  let tour_index = url.lastIndexOf("/");
  tour_name = url.substring(tour_index+1);
}

function updateFormId(){
  $("#tour_id").text(tour_name);
}

function valdiateForm(){
    $("form[name='site_form']").validate({
      // Specify validation rules
      rules: {
        "site_name":{
          required: true,
          minlength: 2
        },
        "country": {
          required: true,
          minlength: 2
        }
      },
  
      // Specify validation error messages
      messages: {
        site_name: {
            minlength: "Site name must be at least 2 characters long"
          },
        country:{
          minlength: "Country name must be at least 2 characters long"
        }
      },
    });
}

function submitForm(){
     // process the form
     $('#site_form').submit(function (event) {
      if(!$("#site_form").valid()) return;
      $.ajax({
          type: 'PUT', 
          url: '/sites/'+tour_name, 
          contentType: 'application/json',
          data: JSON.stringify({
              "name": $("#site_name").val(),
              "country":  $("#country").val(),
          }),
          processData: false,
          encode: true,
          success: function( data){
            alert("Site was added sucssefuly.");
            location.href = "/list";
          },
          error: function(request, status, error){
            if(error == "Bad Request"){
              alert("Site with this name exists");
              console.log( "Error: Site with this name already exists! " + error);
            }
            else{
              alert("Error in  the server, maybe validation error. Check the fields and try again.");
              console.log( "Error in the server. " + error);
            }
          }
      })
  
      event.preventDefault();
  });
}
  
$(document).ready(function () {
    getTourId();
    updateFormId();
    valdiateForm();
    submitForm();
});
  