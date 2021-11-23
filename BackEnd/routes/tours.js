const Tours = require('../models/tours'),
Tour = Tours.Tour,
Site = Tours.Site,
Guide = require('../models/guides');

/* ***************CRUD METHODS*************** */

module.exports = {
    /* ***************READ*************** */

    /**  
     * Returns all availbale tours,    
     * sorted in ascending order by the tour's name.
     */
    getTours: function (req, res) {
        Tour.find().populate('guide').sort({name:1}).then(tours =>{
            res.status(200).send(tours)
        }
        ).catch(e => res.status(500).send("Error in finding the Tours. " + e))
        
    },
    
    /** 
     * Returns a given tour details, including all the tours sites.
     */
    getTour: function (req, res) {
        const tourName = req.params["tour_name"];
        Tour.findOne({ 'name':  tourName}).populate('guide').then(tour =>
            res.status(200).send(tour)
        ).catch(e => res.status(400).send("Tour "+tourName+ "doesn't exist. " + e))
    },
  
    /* ***************CREATE*************** */

    /** 
     * This method gets:
     * Tour details- tour id, starting date, duration, price.
     * GuideId - the guide name. 
     * The function will find the guide Id from the guide collection. 
     * All fields are required to create a tour.
     * After adding the tour, the status is returns.
     */
    createTour: function (req, res) {

        const guideName = req.body.guide;
        if(!guideName){
            res.status(400).send("Guide name required.")
            return;
        }
        //getting the guide id by his name
        Guide.findOne({ 'name':  guideName}).then(guide =>{

            //found thhis guide in the db - updating the guide field to the guide id
            let guideId = guide._id.toString();
            req.body.guide = guideId;
            console.log("guide id was found")
            
            const tourName = req.body.name;
            if(!tourName){
                res.status(400).send("Tour name required.")
                return;
            }
            //checking if a tour with this name exist
            Tour.exists({ 'name':  tourName}, function(err, result) {
                
                if (err) {
                    res.status(500).send("Error in checking if the Tour exists. " + err)
                    console.log("Error in checking if the Tour exists. " + err)
                }
                else {
                    if(result){
                        //found a tour with this name already!
                        res.status(400).send("A Tour with this name already exists.")
                        console.log("A Tour with this name already exists. ")
                    }
                    else{
                        //no tour with this name - creating the new tour
                        const tour = new Tour(req.body); //also validate other required fields

                        tour.save()
                            .then(tour => 
                            res.status(200).send()
                        ).catch(e => {
                            console.log("error in save tour: " + e)
                            res.status(500).send("Error in saving the tour. " + e)
                        });
                    }
                
                }
            });
        
        }).catch(e => {
            console.log("error in getting guide: " + e)
            res.status(400).send("Guide with this name don't exist.")
        });
    
    },

  

   /* ***************UPDATE*************** */

    /**
     * Updates a given tour details- tour id, starting date, duration, price.
     * Or/and a guide details- name, email, cellular. 
     */
     updateTour: function (req, res) {

        const tourName = req.params["tour_name"];
        const updates = Object.keys(req.body)
        const allowedUpdates = ['start_date', 'duration', 'price']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        //checking for valid update fields
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }

        //updating the tour document
        Tour.updateOne( { name: tourName }, req.body, { new: true, runValidators: true }).then(user => {
                if (!user) {
                    return res.status(400).send("Tour doesn't exist.")
                }
                else {
                    res.status(200).send(user)
                }
            }).catch(e => res.status(500).send(e))
    },

    /**
     * Updates a given tour sites. 
     */
    createSiteInPath: function (req, res) {
        const tourName = req.params["tour_name"];
        
        //checking if we got a valid site name
        const siteName = req.body.name;
        if(!siteName){
            res.status(400).send("Site name required.");
            return;
        }
        
        //checking if we got a valid country
        if(!req.body.country){
            res.status(400).send("Site country required.");
            return;
        }

        //checking if a tour with this name exist
        Tour.exists({'name': tourName}, function(err, result) {
            if (err) {
                res.status(500).send(e);
                console.log("Error in checking if tour exist" + err);
            }
            else {
                if(result){
                     //found a this tour
                    //checking if a site with this name allready exist
                    Tour.exists({'name': tourName, "path.name": siteName}, function(err, result) {
                        if (err) {
                            res.status(500).send(e);
                            console.log("Error in checking if site exist" + err);
                        }
                        else {
                            if(result){
                                //found a site in this tour with the same name
                                    console.log("In this tour, site with this name already exist.")
                                    res.status(400).send("In this tour, site with this name already exist.")
                            }
                            else{
                                //didnt find a site with the same name in the tour
                                //creating the new site
                                const site = new Site(req.body);
                                
                                Tour.updateOne( { name: tourName }, 
                                    { '$addToSet': { 'path': site } }
                                    ).then(user => {
                                        console.log("updated succssefuly")
                                        res.status(200).send()
                                    }).catch(e => {
                                        console.log("ERROR IN UPDATE: " +e);
                                        res.status(500).send("Error in update the new site. " + e)
                                    })
                            }
                        }
                    
                    }) 
                }
                else{
                    //didn't find this tour
                    console.log("This tour don't exist.")
                    res.status(400).send("This tour don't exist.")
                }
            }
        })

    },
    /* ***************DELETE*************** */

    /**
     * Deletes a given tour site.
     */
    deleteSite: function (req, res) {

        const tourName = req.params["tour_name"];
        const siteName = req.params["site_name"];

         //checking if a tour with this name exist
         Tour.exists({'name': tourName}, function(err, result) {
            if (err) {
                res.status(500).send(e);
                console.log("Error in checking if tour exist" + err);
            }
            else {
                if(result){
                    //found a this tour
                    //checking if a site with this name allready exist
                    Tour.exists({'name': tourName, "path.name": siteName}, function(err, result) {
                        if (err) {
                            res.status(500).send(e);
                            console.log("Error in checking if site exist" + err);
                        }
                        else {
                            if(result){
                                //found this site in this tour 
                                //delete it
                                Tour.updateOne( { name: tourName }, { $pull: { 'path': { name: siteName} }}
                                    ).then(user => {
                                        console.log("updated succssefuly")
                                        res.status(200).send()
                                    }).catch(e => {
                                        console.log("ERROR IN DELETE: " +e);
                                        res.status(500).send(e)
                                    })
                            }
                            else{
                                //didnt find a site with this name in the tour
                                console.log("This site don't exist in this tour.")
                                res.status(400).send("This site don't exist in this tour.")
                            }
                        }
                    
                    }) 
                }
                else{
                    //didn't find this tour
                    console.log("This tour don't exist.")
                    res.status(400).send("This tour don't exist.")
                }
            }
        })
    },

    /**
     * Deletes a given tour.
     */
    deleteTour: function (req, res) {
     
        const tourName = req.params["tour_name"];
        
        //making sure we got the tour name
        if(!tourName){
            res.status(400).send("Tour name required.")
            return;
        }
        
        //checking if a tour with this name exist
        Tour.exists({ 'name':  tourName}, function(err, result) {
            
            if (err) {
                res.status(500).send(e);
                console.log("Error in checking if tour exist" + err);
            }
            else {
                if(result){
                     //found the tour - delete it
                    Tour.deleteOne( { name: tourName }).then(t => {
                        console.log(tourName +" deleted successfully")
                        res.status(200).send()
                    }).catch(e => res.status(500).send(e));
                }
                else{
                    //didnt find a tour with this name
                    res.status(400).send("A Tour with this name don't exists.")
                    console.log("A Tour with this name don't exists. ")
                }
            }
        })   
    }
};