const express = require('express'),
    tourRoutes = require('./tours'),
    guideRoutes = require('./guide');


var router = express.Router();

router.get('/tours', tourRoutes.getTours);
router.get('/guides', guideRoutes.getGuides);
router.get('/guide/:guide_name', guideRoutes.getGuide);
router.get('/tours/:tour_name', tourRoutes.getTour);
router.post('/tour', tourRoutes.createTour);
router.post('/guide', guideRoutes.createGuide);
router.put('/tours/:tour_name', tourRoutes.updateTour);
router.put('/sites/:tour_name', tourRoutes.createSiteInPath); 
router.delete('/sites/:site_name/:tour_name', tourRoutes.deleteSite);
router.delete('/tours/:tour_name', tourRoutes.deleteTour);

module.exports = router;