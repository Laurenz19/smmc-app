/* Utilisation Route */
const router = require('express').Router();
const { getAllUtilisation, postCreateUtilisation, postUpdateUtilisation, deleteUtilisation, checkUtilisation } = require('../controllers/utilisation');

//get all utilisations
router.route('/get_utilisations').get(getAllUtilisation);

//create Utilisation
router.route('/new_utilisation').post(postCreateUtilisation);

//update Utilisation
router.route('/update_utilisation').post(postUpdateUtilisation);

//delete Utilisation
router.route('/delete_utilisation').post(deleteUtilisation)

//check Utilisation
router.route('/check_utilisation').post(checkUtilisation);

module.exports= router;