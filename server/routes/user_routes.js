/* Utilisateur Route */
const router = require('express').Router();
const {
    getAllUser,
    postCreateUser,
    postUpdateUser,
    deleteUser,
    getAllRole,
    getUserbyWorkId,
    getUserbyId,
    changePdp,
    updatePwd,
    searchUser
} = require("../controllers/utilisateur");
const auth = require('../controllers/auth');
const multer = require('multer');
const path = require('path');

//Get the User Page
router.get('/utilisateurs', auth.secureLog, (req, res) => {
    let user = req.session.user;
    if(user.role === "Technicien"){
        res.render('admin/utilisateur/index', {
            title: "Tiers",
            smmc: "Société de Manutention des Marchandises Conventionnelles",
            url: '/utilisateurs',
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

//Get the Profile Page

router.get('/profile', auth.secureLog, (req, res) => {
    res.render('admin/utilisateur/profile', {
        title: `${req.session.user.name}`,
        smmc: "Société de Manutention des Marchandises Conventionnelles",
        url: '/profile',
        user:req.session.user
    });
})

//Get all Users
router.route('/get_users').get(getAllUser);

//Get user by id
router.route('/get_userbyId').post(getUserbyId);

//Get all Roles
router.route('/get_roles').get(getAllRole);

//Create User
router.route('/new_user').post(postCreateUser);

//Update User
router.route('/update_user').post(postUpdateUser);

//delete a User
router.route('/delete_user').post(deleteUser);

//get User by work_id
router.route('/get_usersbyWork_id').post(getUserbyWorkId);

router.route('/upd_pwd').post(updatePwd);

router.route('/search_user').post(searchUser);


/* Set the image stockage */
const storage = multer.diskStorage({
    destination: "./assets/images/upload",
    filename: (req, smmc_upload, cb) => {
        cb(null, smmc_upload.fieldname + '-' + Date.now() + path.extname(smmc_upload.originalname));
    }
});

const upload = multer({
    storage: storage
}).single('file');

//Upload image
router.route('/file-upload/:user').post(upload, changePdp);

module.exports = router;