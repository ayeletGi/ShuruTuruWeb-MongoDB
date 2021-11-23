const Guide = require('../models/guides')

/* ***************CRUD METHODS*************** */

module.exports = { 
    /* ***************READ*************** */

    /**  
     * Returns all availbale guides.
     */ 
    getGuides: function (req, res) {
        Guide.find().then(guides =>
            res.status(200).send(guides)
        ).catch(e => res.status(500).send("Error in finding the guide. " + e))
    },
    
    /** 
     * Returns a given guide details.
     */
    getGuide: function (req, res) {
        const guideName = req.params["guide_name"];
        Guide.findOne({ 'name':  guideName}).then(guide =>
            res.status(200).send(guide)
        ).catch(e => res.status(500).send("Error in finding the guide. " + e))
    },

    /* ***************CREATE*************** */
    /** 
     * This method gets:
     * Guide details- name, email, cellular. 
     * All fields are required to create a guide.
     * After adding the guide, the status is returns.
     */
    createGuide: function (req, res) {
        const guideName = req.body.name;
        if(!guideName){
            res.status(400).send("Guide name required.")
            return;
        }

        //checking if a guy with this name exist
        Guide.exists({ 'name':  guideName}, function(err, result) {
            if (err) {
                res.status(500).send("Error in checking if the guide exist. " + err)
                console.log("Error in checking if the guide exist. " + err)
            }
            else {
                if(result){
                    res.status(400).send("Guide with this name exist.")
                    console.log("Guide with this name exist. ")
                }
                else{
                //adding the new guide
                const guide = new Guide(req.body)

                guide.save()
                    .then(guide => 
                        res.status(200).send()
                    ).catch(e => {
                        res.status(500).send("Error in saving guide. " + e)
                        console.log("Error in saving guide. " + e)
                });
                }
            
            }
        })
      

    },

};
