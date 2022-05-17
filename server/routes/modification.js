const router = require('express').Router();
const { postCreateModification, postUpdateModification, deleteModification } = require('../controllers/modification');

//add modification
router.route('/new_modification').post(postCreateModification);

//update modification
router.route('/update_modification').post(postUpdateModification);

//delete Modification
router.route('/delete_modification').post(deleteModification)

module.exports= router;