const express = require('express')
    require('../db/mongoose'),
    path = require('path'),
    routers =  require('./routes/routes.js');
   

const port = 3001;

const app=express();

//front end
app.use('/list', express.static(path.join(__dirname, '../FrontEnd/html/index.html')));
app.use('/add_tour', express.static(path.join(__dirname, '../FrontEnd/html/add_tour_form.html')));
app.use('/add_guide', express.static(path.join(__dirname, '../FrontEnd/html/add_guide_form.html')));
app.use('/add_site/:tour_id', express.static(path.join(__dirname, '../FrontEnd/html/add_site_form.html')));
app.use('/edit_tour/:tour_id', express.static(path.join(__dirname, '../FrontEnd/html/edit_tour_form.html')));
app.use('/scripts', express.static(path.join(__dirname, '../FrontEnd/scripts')));
app.use('/styles', express.static(path.join(__dirname, '../FrontEnd/styles')));
app.use('/data', express.static(path.join(__dirname, '../BackEnd/data')));

//restfull 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',  routers);


const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
