/* Materiel Controller*/
const { departement } = require('../models/departement');
const { direction } = require('../models/direction');
const { materiel, Materiel } = require('../models/materiel');
const { service } = require('../models/service');
const { utilisation } = require('../models/utilisation');
const { checkValue_String } = require('../services/useful');


/* Add a new materiel */
//post
exports.postCreateMateriel = (req, res)=>{
  let type = req.body.type;
  let marque = req.body.marque;
  let etat = req.body.etat;
  let work_id = req.body.work_id;
  let config = req.body.config;
  
 // checkValue_String(req.body.config, (message, _config)=>{
     // if(_config !== null){
         // console.log(_config);
          let new_mat = new Materiel(type, marque, config, etat, work_id);
          new_mat.create(); 
          res.json({msg: "success"})
    //  }else{
       // res.json({ msg: message });
     // }
   
  //})
}

/* End add materiel*/

/* Get all Materiels */
exports.getAllMateriel = (req, res)=>{
    let tab = [];
    materiel.findAll(0, (materiels)=>{
        service.findAll((sces)=>{
            departement.findAll((deps)=>{
                direction.findAll((dirs)=>{

                    try {
                        materiels.forEach(materiel => {
                            //direction
                            dirs.forEach(dir => {
                                if(dir['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: dir['nom_dir']
                                    })
                                }
                            });
                            
                            //departement
                            deps.forEach(dep => {
                                if(dep['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: dep['nom_dep']
                                    })
                                }
                            });
    
                            //service
                            sces.forEach(sce => {
                                if(sce['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: sce['nom_sce']
                                    })
                                }
                            });
    
                            if(materiel.work_id === ''){
                                tab.push({
                                    id: materiel.id_mat,
                                    type: materiel.type,
                                    marque: materiel.marque,
                                    config: materiel.config,
                                    etat: materiel.Etat,
                                    work_id: '',
                                    work_name: ''
                                })
                            }
                        });
                    } catch (error) {
                        tab = [];
                    }
                  
                    res.json({materiels: tab});
                })
            })
        })
    })
}

/* Update a materiel */
//post
exports.postUpdateMateriel = (req, res)=>{
   let id_mat = req.body.id_mat;
   let type = req.body.type;
   let marque = req.body.marque;
   let etat = req.body.etat;
   let work_id = req.body.work_id;
   let user_id = ''; 
   let _type = 0;

    //checkValue_String(req.body.config, (message, _config)=>{
        /*if(_config !== null){
            console.log(_config);*/
            //Check if user's work_id and the materiel's work_id are the same or not
            utilisation.findbyId(user_id, id_mat, _type, (data)=>{
                
                /*------------------------------------------*/
                        materiel.type = type;
                        materiel.marque = marque;
                        materiel.config = req.body.config;
                        materiel.Etat = etat;
                        materiel.work_id = work_id;
                /*------------------------------------------*/
                try {
                    let user = data[0];
                    if(user.work_id !== work_id){
                        //delete utilisation
                        utilisation.delete(user.user_id, id_mat, 3);
                    }
                    //update
                    materiel.update(id_mat, (_message)=>{
                        res.json({msg: _message})
                    });

                } catch (error) {
                    //update
                    materiel.update(id_mat, (__message)=>{
                        res.json({msg: __message})
                    });
                }
            })
       /* }else{
            res.json({ msg: message });
        }*/
    
   // })
}

/* End Update Materiel */

/* Delete Materiel */
exports.deleteMateriel = (req, res)=>{
    let id_mat = req.body.id;
    let user_id = '';
    utilisation.delete(user_id, id_mat, 0);
    materiel.delete(id_mat);
    res.json({msg: 'success'})
}

/* Get Materiel by workid*/
exports.getMaterielbyWork_id = (req, res)=>{
    let work_id = req.body.work_id;
    materiel.findMaterielbyWorkId(work_id, (materiels)=>{
        console.log(materiels);
        res.json({msg:"success", data: materiels});
    })
}

/* Get all Materiel with user */
exports.findAllMateriels = (req, res)=>{
    let tab = [];

    materiel.findAll(2, (materiels)=>{
        direction.findAll((dirs)=>{
            departement.findAll((deps)=>{
                service.findAll((sces)=>{
                    try {
                        materiels.forEach(materiel => {
                            //direction
                            dirs.forEach(dir => {
                                if(dir['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: dir['nom_dir'],
                                        user: `${materiel.nom} ${materiel.prenoms}`
                                    })
                                }
                            });
                            
                            //departement
                            deps.forEach(dep => {
                                if(dep['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: dep['nom_dep'],
                                        user: `${materiel.nom} ${materiel.prenoms}`
                                    })
                                }
                            });
    
                            //service
                            sces.forEach(sce => {
                                if(sce['id'] === materiel.work_id){
                                    tab.push({
                                        id: materiel.id_mat,
                                        type: materiel.type,
                                        marque: materiel.marque,
                                        config: materiel.config,
                                        etat: materiel.Etat,
                                        work_id: materiel.work_id,
                                        work_name: sce['nom_sce'],
                                        user: `${materiel.nom} ${materiel.prenoms}`
                                    })
                                }
                            });
    
                            if(materiel.work_id === ''){
                                tab.push({
                                    id: materiel.id_mat,
                                    type: materiel.type,
                                    marque: materiel.marque,
                                    config: materiel.config,
                                    etat: materiel.Etat,
                                    work_id: '',
                                    work_name: '',
                                    user: `${materiel.nom} ${materiel.prenoms}`
                                })
                            }
                        });
                    } catch (error) {
                        tab = [];
                    }
                    console.log(tab);
                    res.json({msg:'success', data: tab});
                })
            })
        })
    })
}

/* Get Materiel by user_id */
exports.getMaterielbyUserId = (req, res)=>{
    let user = req.body.user;
    let id_mat= "";
    let type = 1;
    utilisation.findbyId(user, id_mat, type,(data)=>{
        console.log(data);
        res.json({msg:"success", data})
    })
}