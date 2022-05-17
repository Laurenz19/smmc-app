const router = require("express").Router();
const { postCreateDepannage, getAllDepannage, postUpdateDepannage, deleteDepannage, generatepdf, redirectAfterGeneratePDF, generatepdf1, generatepdf2, generatepdfbyMateriel } = require("../controllers/depannage");
const auth = require('../controllers/auth');

//Get the depannage page
router.get('/depannage/:data', auth.secureLog, (req, res)=>{
    let user = req.session.user;
    if(user.role === "Technicien" || user.role ==="Admin"){
        res.render('admin/depannage/index', {
            title: "Dépannage",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/depannage',
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
});

//Get The Log Page
router.get('/log', auth.secureLog, (req, res)=>{
    res.render('admin/depannage/log', {
        title: "Log",
        _title: "Historisation des tâches",
        smmc: "Société de Manutention des Marchandises Conventionnelles",
        url: '/log',
        user: req.session.user
    })
});

//get all Depannage
router.route('/get_depannages').get(getAllDepannage);

//Add new Depannage
router.route('/new_depannage').post(postCreateDepannage);

//update depannage
router.route('/update_depannage').post(postUpdateDepannage);

//delete a depannage
router.route('/delete_depannage').post(deleteDepannage);

router.route('/pdfmake/:filename').get(generatepdf);
router.route('/pdfmake1/:filename/:annee/:mois').get(generatepdf1);
router.route('/pdfmake2/:filename/:date1/:date2').get(generatepdf2);
router.route('/pdfmake3/:filename/:idmat').get(generatepdfbyMateriel);

module.exports = router;