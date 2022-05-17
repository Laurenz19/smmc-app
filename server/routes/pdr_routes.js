/* PDR Routes */
const router = require('express').Router();
const auth = require('../controllers/auth');
const { getAllPDR, postCreatePDR, postUpdatePDR, deletePDR, updateNombre } = require('../controllers/pdr');

//get the PDR Page
router.get('/pieces', auth.secureLog, (req, res)=>{
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/pdr/index', {
            title: "Pièce de rechange",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/pieces',
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
})

//get all pdrs
router.route('/get_pieces').get(getAllPDR);

//Create pdr
router.route('/new_piece').post(postCreatePDR);

//Update pdr
router.route('/update_piece').post(postUpdatePDR);

//delete a pdr
router.route('/delete_piece').post(deletePDR);

//ubpdate Nombre
router.route('/update_piece1').post(updateNombre);

module.exports = router;