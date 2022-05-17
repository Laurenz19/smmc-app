/* Direction Routes */
const router = require("express").Router();
const {
    getDirectionList,
    postCreateDirection,
    postUpdateDirection,
    deleteDirection
} = require("../controllers/direction");
const auth = require('../controllers/auth');

//Get the direction Page
router.get('/directions', auth.secureLog, (req, res) => {
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/direction/index', {
            title: "Direction",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/directions',
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

//get all directions
router.route('/get_directions').get(getDirectionList);

//Create Direction
router.route('/new_direction').post(postCreateDirection);

//Update Direction
router.route('/update_direction').post(postUpdateDirection);

//delete a Direction
router.route('/delete_direction').post(deleteDirection);

module.exports = router;