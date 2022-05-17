/* Authentification */
const { departement } = require("../models/departement");
const { direction } = require("../models/direction");
const { service } = require("../models/service");
const {_utilisateur, Utilisateur} = require("../models/user");
const {} = require("../services/useful");


/* get Authentication Page */
exports.getAuthPage = (req, res)=>{
    _utilisateur.findAll((users) => {

        if (users !== null) {
            let admin = new Utilisateur("admin", "", "smmc app admin", "", "admin@gmail.com", "smmc_admin2021", "admin", 1, "");
            //this user allow us to initiate our app
            admin.create();
            console.log(`Admin account created! (email : ${admin.email}, password : ${admin.password})`);
        }

        res.render('auth/signin', {
            title:'Login'
        })
    })
}

/* Check authentication */
exports.checkAuth = (req, res, next)=>{
    let email = req.body.email;
    let pwd = req.body.password;
    let userLoged = {};
    let id=''; 
    let type= 0;
    _utilisateur.email= email;
    //check the email
    _utilisateur.check(id, type, (exist)=>{
        if(exist === true){
            //check password
            _utilisateur.check_pwd(email, pwd, (authenticated)=>{
                if(authenticated === false){
                    res.json({msg:"Veuillez véfifier votre mot de passe!"});
                }else{
                    //get user by email
                  _utilisateur.findbyEmail((user)=>{
                      direction.findAll((dirs)=>{
                          departement.findAll((deps)=>{
                              service.findAll((sces)=>{
                                  let local = '';

                                  dirs.forEach(element => {
                                    if(element.id === user.work_id){
                                        local = element.nom_dir;
                                    }
                                  });

                                  deps.forEach(element => {
                                    if(element.id === user.work_id){
                                        local = element.nom_dep;
                                    }  
                                  });

                                  sces.forEach(element => {
                                    if(element.id === user.work_id){
                                        local = element.nom_sce;
                                    }
                                  });

                                userLoged={
                                    id: user.user_id,
                                    name: `${user.nom} ${user.prenoms}`,
                                    work: user.fonction,
                                    email: user.email,
                                    photo: user.path_photo,
                                    role: user.libelle,
                                    local: local
                                }
                                req.session.user = userLoged;
                                console.log(userLoged);
                                res.json({msg:"success"});
                              })
                          })
                      })
                    })
                }
            })
        }else {
            res.json({msg:"Cet email n'est pas associé à un utilisateur!"});
        }
    })
}

/*Secure the Page*/
exports.secureLog = (req, res, next) => {
    if (req.session.user) next();
    else {
        res.redirect('/');
    }
}

/*LogOut function*/
exports.logout = (req, res) => {
    req.session.destroy(() => console.log("User logged out"));
    res.redirect('/')
}