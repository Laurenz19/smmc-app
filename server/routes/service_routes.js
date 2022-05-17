/* Service Routes */
const router = require("express").Router();
const {
    getAllService,
    postCreateService,
    deleteService,
    postUpdateService
} = require("../controllers/service");
const auth = require('../controllers/auth');

//Get the Service Page
router.get('/services', auth.secureLog, (req, res) => {
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/_service/index', {
            title: "Service",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/services',
            user
    
        })
    }else{
        res.status(404).render("404.ejs", {
            description: "Vous n'êtes pas autorisé à y acceder!",
            url: "/acceuil",
            title: "404",
            label: "Acceuil"
        });
    }
});

//Get all Service
router.route('/get_services').get(getAllService);

//Create Service
router.route('/new_service').post(postCreateService);

//Update Service
router.route('/update_service').post(postUpdateService);

//delete a Service
router.route('/delete_service').post(deleteService);

module.exports = router;