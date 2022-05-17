/* App Routes */
const router = require('express').Router();
const auth = require('../controllers/auth');
const moment = require('moment');

/* Authentication (signin & logout) */
router.get('/', auth.getAuthPage); 
router.get('/logout', auth.logout);
router.post('/check_auth', auth.checkAuth);

/* Acceuil */
router.get('/acceuil/:type', auth.secureLog, (req, res) => {
   // console.log(req.session.user);
    res.render("index.ejs", {
        title: `Bienvenue ${req.session.user.name}`,
        user:req.session.user,
        smmc:'Société de la Manutention des Marchandises Conventionnelles'
    });
});

router.post('/loadPDF_fname', (req, res)=>{
    let date = moment(new Date(Date.now())).format('DD-MM-YYYY') ;

    console.log(date)
    res.json({fname:`SMMC_info_dep${date}`});
})


module.exports = router;