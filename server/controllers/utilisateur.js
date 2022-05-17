/* Utilisateur Controller */
const {_utilisateur, Utilisateur} = require("../models/user");
const { checkValue_String, _checkValueString, generate_id} = require("../services/useful");
const { getAllData } = require("../services/queries");
const { service } = require("../models/service");
const { departement } = require("../models/departement");
const { direction } = require("../models/direction");
const { utilisation } = require('../models/utilisation');


/* Add a new user */
//post
exports.postCreateUser = (req, res) => {
    let id='';
    let add=0;
    let default_psswd = 'smmc_password';
    let photo = '';
    let tel = req.body.tel;
    let email = req.body.email;
    let role = req.body.role;
    let work_id = req.body.work_id;

    console.log(req.body);
    _checkValueString(req.body.prenoms, (__message, _prenoms)=>{
        if(_prenoms !== null){
            console.log(_prenoms);
           // res.json({msg:__message});
           checkValue_String(req.body.nom, (message, _nom)=>{
            if(_nom !== null){
                console.log(_nom);
                checkValue_String(req.body.fonction, (_message, _fonction)=>{
                    if(_fonction !== null){
                        console.log(_fonction);

                        let new_user = new Utilisateur(_nom, _prenoms, _fonction, tel, email, default_psswd, work_id, role, photo);
                        
                        //Verify if user's email is already exist
                         /* The code Here*/
                        new_user.check(id, add, (exist)=>{
                            if(exist === true){
                                res.json({msg: `Cet email "${email}" appartient dejà à un autre utilisateur!`})
                            }else{
                                new_user.create();
                                res.json({msg: _message});
                            }
                        })
                       
                       
                    }else res.json({msg:_message});
                })
            }else res.json({msg:message});
        })
        }else res.json({msg:__message});
    })
  

}

/* End add User */

/* Get all User */
exports.getAllUser = async(req, res) => {
    let tab = [];
    _utilisateur.findAll((users)=>{
        service.findAll((sces)=>{
            departement.findAll((deps)=>{
                direction.findAll((dirs)=>{
                    users.forEach(user => {
                        
                        //direction
                        dirs.forEach( dir => {
                            if(dir['id'] === user.work_id){
                                tab.push({
                                    id: user.id,
                                    nom: `${user.nom} ${user.prenoms}`,
                                    fonction: user.fonction,
                                    role: user.role,
                                    id_role: user.id_role,
                                    email: user.email,
                                    tel: user.tel,
                                    work_id: user.work_id,
                                    work_name: dir['nom_dir'],
                                    photo: user.path_photo
                                })
                            }
                        });

                        //departement
                        deps.forEach(dep => {
                            if(dep['id'] === user.work_id){
                                tab.push({
                                    id: user.id,
                                    nom: `${user.nom} ${user.prenoms}`,
                                    fonction: user.fonction,
                                    role: user.role,
                                    id_role: user.id_role,
                                    email: user.email,
                                    tel: user.tel,
                                    work_id: user.work_id,
                                    work_name: dep['nom_dep'],
                                    photo: user.path_photo
                                })
                            }
                        });

                        //service
                        sces.forEach(sce => {
                            if(sce['id'] === user.work_id){
                                tab.push({
                                    id: user.id,
                                    nom: `${user.nom} ${user.prenoms}`,
                                    fonction: user.fonction,
                                    role: user.role,
                                    id_role: user.id_role,
                                    email: user.email,
                                    tel: user.tel,
                                    work_id: user.work_id,
                                    work_name: sce['nom_sce'],
                                    photo: user.path_photo
                                })
                            }
                        });

                        if(user.work_id === 'null'){
                            tab.push({
                                id: user.id,
                                nom: `${user.nom} ${user.prenoms}`,
                                fonction: user.fonction,
                                role: user.role,
                                id_role: user.id_role,
                                email: user.email,
                                tel: user.tel,
                                work_id: '',
                                work_name: '',
                                photo: user.path_photo
                            })
                        }
                    });
                    //console.log(tab);
                    res.json({users: tab});
                })
            })
        })
      //  console.log(users);
    })
}

/* Get all User Role */
exports.getAllRole = (req, res)=>{
    const table="role";
    getAllData(table, (roles)=>{
        res.json({roles: roles});
    })
}

/* Update a user */
//post 
exports.postUpdateUser = (req, res) => {
    let id=req.body.id;
    let add=0;
    let update = 1;
    let tel = req.body.tel;
    let email = req.body.email;
    let role = req.body.role;
    let work_id = req.body.work_id;
    let new_id= generate_id(id, work_id);

    _checkValueString(req.body.prenoms, (__message, _prenoms)=>{
        if(_prenoms !== null){
            console.log(_prenoms);
    
           checkValue_String(req.body.nom, (message, _nom)=>{
            if(_nom !== null){
                console.log(_nom);
                checkValue_String(req.body.fonction, (_message, _fonction)=>{
                    if(_fonction !== null){
                        console.log(_fonction);

                        /* Get user by id */
                        _utilisateur.findbyId(id, (user)=>{

                            /*----------------------------------------------------*/
                                    _utilisateur.nom = _nom;
                                    _utilisateur.prenoms = _prenoms;
                                    _utilisateur.fonction = _fonction;
                                    _utilisateur.role = role;
                                    _utilisateur.tel = tel;
                                    _utilisateur.email = email;
                                    _utilisateur.work_id = work_id;
                                    _utilisateur.password= user.password;
                                    _utilisateur.path_photo = user.path_photo;

                            /*----------------------------------------------------*/
                        


                            _utilisateur.check(id, update, (exist)=>{
                                if(exist === false){
                                    _utilisateur.check(id, add, (_exist)=>{
                                        if (_exist === true) {
                                            res.json({ msg: 'Email appartient à un autre utilisateur!' })
                                        } else {
                                            //check if the name exist in departement
                                            _utilisateur.update(id, new_id, 2, (message)=>{
                                                res.json({msg: message, role});
                                            }) 
                                        }
                                    })
                                }else{
                                    /*if(id !== new_id){
                                        let id_mat='';
                                        utilisation.delete(id, id_mat, 1);
                                    }*/
                                    _utilisateur.findbyId(id, (userinfo)=>{
                                        if(userinfo.work_id !== work_id){
                                            let id_mat='';
                                            utilisation.delete(id, id_mat, 1);
                                        }
                                        _utilisateur.update(id, new_id, 2, (message)=>{
                                            res.json({msg: message, role});
                                        })   
                                    })
                                                             
                                }
                            })
                        })
        
                    }else res.json({msg:_message});
                })
            }else res.json({msg:message});
        })
        }else res.json({msg:__message});
    })
}

//set my profile
exports.setProfile = (req, res)=>{

}

/* End Update User */

//delete User
exports.deleteUser = (req, res) => {
    let id = req.body.id;
    let id_mat='';
    utilisation.delete(id, id_mat, 1);
    _utilisateur.delete(id);
    res.json({msg: 'success'});
}

// get user by Work id
exports.getUserbyWorkId = (req, res)=>{
    let work_id = req.body.work_id;
    _utilisateur.findbyWorkId(work_id, (data)=>{
        res.json({msg: 'success', data: data});
    })   
}

exports.getUserbyId = (req, res)=>{
    let id = req.body.id;
    _utilisateur.findbyId(id, (user)=>{
        //console.log(user)
        res.json({user : user});
    })
}

exports.changePdp = (req, res)=>{
   //console.log(req.params.user)
   let user_id= req.params.user;
   let user = req.session.user;
   user.photo = req.file.filename;
   console.log(req.file.filename)
   console.log(user)
   let user1 = new Utilisateur('','','','','','','','',req.file.filename);
   user1.update(user_id, '', 3, (message)=>{
    res.redirect('/profile');
    console.log(message);
   })
}

exports.updatePwd = (req, res)=>{
    let mdp1= req.body.mdp1;
    let user= req.body.user;
    let user1 = new Utilisateur('','','','','',mdp1,'','','');
    
    user1.update(user, '', 1, (message)=>{
        res.json({msg:message})
    })
}

exports.searchUser = (req, res)=>{
    let val = req.body.user;
    _utilisateur.search(val, (data)=>{
        console.log(data);
        res.json({data});
    })
}

