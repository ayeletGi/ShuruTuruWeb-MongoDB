/* Define URL */
const PORT = 3001;
const LOCAL_HOST = "http://localhost:"
const URL = LOCAL_HOST+PORT;
const TOURS_URL = URL+"/tours";
const TOUR_URL = URL+"/tours/";
const SITES_URL = URL+"/sites/";
const ADD_TOUR_URL = URL+"/add_tour";
const ADD_GUIDE_URL = URL+"/add_guide";
const EDIT_TOUR_URL = URL+"/edit_tour/";
const ADD_SITE_URL = URL+"/add_site/";

/* HTTP Methods */
const GET = "get";
const POST = "post";
const PUT = "put";
const DELETE = "delete";

/* Global variables */
let tours_data;
let table;

const createButton = function(btn_class, text){
    return "<button class=\""+btn_class+"\">"+text+"</button>";
}

const createButtonWithId = function(btn_class, btn_id, text, onClick){
        return "<button onClick=\"" + onClick+"\" class=\""+btn_class+"\"id = \"" + btn_id +
        "\">"+text+"</button>";
}

function ajaxCall(http_method, url, success_func) {
    $.ajax({
        type: http_method,
        url: url,
        timeout: 5000,
        processData: false,
        success: function (data) {
            success_func(data);
        },
        error: function (request, status, error) {
            console.log("Error: data was not load properly."+ error);
        },
    });
}
 
function createTable (){

        table = $('#toursTable').DataTable( {
        data: tours_data,
        columns: [
          { data:"name"},
          { data:"start_date"},
          { data:"duration"},
          { data:"price"},
          {
            data:           null,
            className:      'show',
            orderable:      false,
            defaultContent:  createButton("tableBtn showBtn", '<i class="fas fa-plus-circle"></i>')
          },
          {
              data: null,
              className: "dt-center edit",
              orderable: false,
              defaultContent: createButton("tableBtn editBtn", '<i class="fa fa-pencil-alt"></i>')
          },
          {
              data: null,
              className: "dt-center delete",
              orderable: false,
              defaultContent: createButton("tableBtn deleteBtn", '<i class="fa fa-trash"></i>')
          }
          ],   
      
      order: [[0, 'asc']]
    });

}

function format ( d ) {
    sites = '';
    tour_name = d.name;
    for(let site of d.path){
          deleteButton = createButtonWithId("tableBtn delSiteBtn",site.name +'/' + tour_name,'<i class="far fa-minus-square"></i>',"deleteSite(this.id)");
            sites += '<td>'+'Site name: ' + site.name + 
                            ', Country: '+ site.country + '.' +  
                            deleteButton +'</td>';
    }
    addButton = createButtonWithId("tableBtn addSiteBtn", tour_name ,'<i class="far fa-plus-square"></i>',"addSite(this.id)");

  // `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
      '<tr>'+
          '<td>Guide Name:</td>'+
          '<td>'+d.guide.name+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Guide Email:</td>'+
          '<td>'+d.guide.email+'</td>'+
      '</tr>'+
      '<tr>'+
          '<td>Guide Cellular:</td>'+
          '<td>'+d.guide.cellular+'</td>'+
      '</tr>'+
      '<tr>'+
      '<td>Full Path:</td>' +sites+ 
      '<td>' + addButton+'</td>'+
        '</tr>'+
  '</table>';
}

function showMore(){
    let tr = $(this).closest('tr');
    let row = table.row(tr);
    let data = table.row( $(this).parents('tr') ).data();

    if ( row.child.isShown() ) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        // Open this row
        row.child(format(data)).show();
        tr.addClass('shown');
    }
}

function addTour(){
    window.location.replace(ADD_TOUR_URL);
}

function addGuide(){
    window.location.replace(ADD_GUIDE_URL);
}
function editTour(){
    let tour_name = table.row( $(this).parents('tr') ).data().name;
    window.location.replace(EDIT_TOUR_URL+tour_name);
}

function addSite(clicked_id){
    window.location.replace( ADD_SITE_URL+clicked_id);
}

function deleteSite(clicked_id){
    ajaxCall(DELETE, SITES_URL+clicked_id, reloadPage);
}

function deleteTour(){
    let tour_name = table.row( $(this).parents('tr') ).data().name;
    ajaxCall(DELETE, TOUR_URL+tour_name, reloadPage);
}

function reloadPage(){
    alert("Delete ended successfully");
    location.reload();
}

function setData(data){
    tours_data = data;
    console.log(tours_data);
    createTable();
}

$(document).ready(function() {
    ajaxCall(GET, TOURS_URL, setData);
    $('#toursTable').on( 'click', '.showBtn', showMore);
    $('#toursTable').on( 'click', '.editBtn', editTour);
    $('#toursTable').on( 'click', '.deleteBtn', deleteTour);
    $('.addButton').click(addTour);
    $('.addGButton').click(addGuide);
  } );