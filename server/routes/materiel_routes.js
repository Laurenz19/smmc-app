/* Materiel Routes */
const router = require('express').Router();
const auth = require('../controllers/auth');
const { getAllMateriel, postCreateMateriel, postUpdateMateriel, deleteMateriel, getMaterielbyWork_id, findAllMateriels, getMaterielbyUserId } = require('../controllers/materiel');

//get the Materiel Page
router.get('/materiels', auth.secureLog, (req, res)=>{
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/materiel/index', {
            title: "Matériel",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/materiels',
            user
        });
    }else{
        res.status(404).render("404.ejs", {
            description: "Vous n'êtes pas autorisé à y acceder!",
            url: "/acceuil",
            title: "404",
            label: "Acceuil"
        });
    }
})

//get all materiels
router.route('/get_materiels').get(getAllMateriel);

//Create materiel
router.route('/new_materiel').post(postCreateMateriel);

//Update Materiel
router.route('/update_materiel').post(postUpdateMateriel);

//delete a materiel
router.route('/delete_materiel').post(deleteMateriel);

//Get materiel by work_id
router.route('/get_matbyWorkId').post(getMaterielbyWork_id)

//Get all materiels (custom request)
router.route('/get_materiels1').get(findAllMateriels);

//get Materiel by User
router.route('/get_materielbyUser_id').post(getMaterielbyUserId)


module.exports = router;