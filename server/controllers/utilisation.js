/* Utilisation Controller */
const { utilisation, Utilisation } = require('../models/utilisation');
const moment = require('moment');

/* Add a new utilisation */
//post
exports.postCreateUtilisation = (req, res)=>{
    let id_mat = req.body.id_mat;
    let user_id = req.body.user_id;
    let fin = req.body.fin;
    let debut = req.body.debut;
    if(fin === ''){
        fin = '00-00-0000';
    }
    
    let new_utilisation = new Utilisation(user_id, id_mat, debut, fin);
    new_utilisation.create();
    res.json({msg: 'success'})
}

/* End add Utilisation */

/* Get All utilisation */
exports.getAllUtilisation = (req, res)=>{

}

/* Update utilisation */
exports.postUpdateUtilisation = (req, res)=>{
    let id_mat = req.body.id_mat;
    let user_id = req.body.user_id;
    let fin = req.body.fin;
    let debut = req.body.debut;
    if(fin === ''){
        fin = '00-00-0000';
    }

    /*---------------------------------------------*/
            utilisation.user_id = user_id;
            utilisation.id_mat = id_mat;
            utilisation.debut = debut;
            utilisation.fin = fin;
    /*---------------------------------------------*/

    utilisation.update(user_id, id_mat, 3, (message)=>{
        res.json({msg: message});
    })
}
/* End Update */

/* Delete Utilisation */
exports.deleteUtilisation = (req, res)=>{

}

/* Check The utilisation by matieriel's id */
exports.checkUtilisation = (req, res)=>{
   let user_id = '';
   let id_mat = req.body.id_mat;
   //let work_id = req.body.work_id;
   let type = 0;
   let user={};
   console.log(id_mat)
    utilisation.findbyId(user_id, id_mat, type, (data)=>{
        if(data === null){
            res.json({msg:'Ajouter'});
        }else{
            if(data.length > 0){
                user = {
                    user_id: data[0].user_id,
                    nom: `${data[0].nom} ${data[0].prenoms}`,
                    id_mat: data[0].id_mat,
                    debut: moment(data[0].debut).format('YYYY-MM-DD'),
                    fin: moment(data[0].fin).format('YYYY-MM-DD')
                }
                res.json({msg:'Modifier', data: user});
               
            }else{
                user = {
                    user_id: '',
                    nom: '',
                    id_mat: id_mat,
                    debut:'',
                    fin: ''
                }
                res.json({msg:'Ajouter', data: user});
            }
        }
    })
}