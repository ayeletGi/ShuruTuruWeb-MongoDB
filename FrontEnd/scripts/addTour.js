const PORT = 3001;
const LOCAL_HOST = "http://localhost:"
const URL = LOCAL_HOST+PORT;
const GUIDES_URL = URL+"/guides";

function getGuidesNames(){
  $.ajax({
    type: 'GET',
    url: GUIDES_URL,
    timeout: 5000,
    processData: false,
    success: function (data) {
      setGuidesNames(data);
    },
    error: function (request, status, error) {
        console.log("Error: data was not load properly."+ error);
    },
});
}

function setGuidesNames(data){
  if(data.length == 0){
    alert("There is no guide available. Please insert a guide first.");
    location.href = "/list";
  }
  $.each(data, function (i, guide) {
    $("#guide_name").append($('<option>', { 
        value: guide.name,
        text : guide.name 
    }));
    console.log("Adding this guide to the list: "+ guide.name);
  });
}

function valdiateForm(){
  $("form[name='tour_form']").validate({
    // Specify validation rules
    rules: {
      "tour_name":{
        required: true,
        minlength: 1
      },
      "start_date": {
        required: true,
      },
      "duration": {
        required: true,
      },
      "price": {
        required: true,
      },
      "guide_name":{
        required: true,
      },
    },

    // Specify validation error messages
    messages: {
      tour_id:{
        minlength: "Tour name must be at least 1 characters long"
      },
    },
  });
}

function submitForm(){
  $('#tour_form').submit(function (event) {
    let guideSelected = $("#guide_name").find(":selected").val().trim()+""
    console.log("guide selected: " +  guideSelected)
    if(!$("#tour_form").valid()) return;
    $.ajax({
        type: 'POST', 
        url: '/tour', 
        contentType: 'application/json',
        data: JSON.stringify({
            "name": $("#tour_name").val(),
            "start_date": $("#start_date").val().split("-").reverse().join("-"),
            "duration": $("#duration").val(),
            "price": $("#price").val(),
            "guide": guideSelected
        }),
        processData: false,
        encode: true,
        success: function( data){
          alert("Tour was added sucssefuly.");
          location.href = "/list";
        },
        error: function(request, status, error){
          if(error == "Bad Request"){
            alert("Tour with this name exists");
            console.log( "Error: Tour with this name already exists! " + error);
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
  getGuidesNames();
  valdiateForm();
  submitForm();
});
