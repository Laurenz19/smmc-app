/* Departement Routes */
const router = require('express').Router();
const {
    getAllDepartement,
    postCreateDepartement,
    postUpdateDepartement,
    deleteDepartement
} = require('../controllers/departement');
const auth = require('../controllers/auth');

//Get the Department Page
router.get('/departements', auth.secureLog, (req, res) => {
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/departement/index', {
            title: "Département",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/departements',
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

//get all departements
router.route('/get_departements').get(getAllDepartement);

//Create Departement
router.route('/new_departement').post(postCreateDepartement);

//Update Departement
router.route('/update_departement').post(postUpdateDepartement);

//delete a departement
router.route('/delete_departement').post(deleteDepartement);

module.exports = router;