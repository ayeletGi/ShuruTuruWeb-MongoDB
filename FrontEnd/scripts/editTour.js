//TODO - make sure to check
let tour_name = ""; 

function getTourId(){
    let url = window.location.href;
    let tour_index = url.lastIndexOf("/");
    tour_name = url.substring(tour_index+1);
}

function updateFormId(){
    $("#tour_name").text(tour_name);
}

function valdiateForm(){
    $("form[name='edit_form']").validate({
      // Specify validation rules
      "start_date": {
        required: true,
      },
      "duration": {
        required: true,
      },
      "price": {
        required: true,
      }
    });
}
  
function submitForm(){
    $('#edit_form').submit(function (event) {
      if(!$("#edit_form").valid()) return;
      $.ajax({
          type: 'PUT', 
          url: '/tours/'+tour_name, 
          contentType: 'application/json',
          data: parseData(),
          processData: false,
          encode: true,
          success: function( data){
            alert("Tour was updated sucssefuly.");
            location.href = "/list";
          },
          error: function(request, status, error){
              alert("Error: data was not load properly.");
              console.log( "Error: data was not load properly" + error);
          }
      })
  
      event.preventDefault();
  });
}
  
function parseData(){
    let data = {};
    let start_date = $("#start_date").val().split("-").reverse().join("-");
    let duration = $("#duration").val();
    let price = $("#price").val();

    if(start_date)
        data["start_date"] = start_date;
    if(duration)
        data["duration"] = duration;
    if(price)
        data["price"] = price;

    let result = JSON.stringify(data);
    return result;
}

$(document).ready(function () {
    getTourId();
    updateFormId();
    valdiateForm();
    submitForm();
});
  