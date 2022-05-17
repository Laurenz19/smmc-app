/* PDR (stands for Pièce de rechange) Controller */
const { PDR, piece } = require('../models/pdr');
const { checkValue_String } = require('../services/useful');
const moment = require('moment');
const { message } = require('../models/message');


/* Add a new pdr */
//post
exports.postCreatePDR = (req, res)=>{
   let marque = req.body.marque;
   let description = req.body.description;
   let nombre = req.body.nombre;
   let dateArrivee = req.body.dateArrivee;

   checkValue_String(description, (message, _description)=>{
       if(_description !== null){
           let new_piece = new PDR(marque, _description, nombre, dateArrivee);
            new_piece.create();          
           res.json({msg: 'success'});
       }else{
        res.json({msg: message});
       }
   })
}

/* End add pdr*/

/* Get all Pdr */
exports.getAllPDR = (req, res)=>{
    let tab = [];
    piece.findAll((pieces)=>{
        try {
            pieces.forEach(piece => {  
                tab.push({
                    id_pdr : piece.id_pdr,
                    marque: piece.marque,
                    description: piece.description,
                    nombre : piece.nombre,
                    dateArrivee : moment(piece.dateArrivee).format('DD-MM-YYYY'),
                    dateArrivee1 : moment(piece.dateArrivee).format('YYYY-MM-DD'),
                })
            });
        } catch (error) {
            tab = []
        }
        res.json({data: tab, msg: "success"});
    })
}

/* Update a pdr */
//post
exports.postUpdatePDR = (req, res)=>{
    let id_pdr = req.body.id_pdr;
    let marque = req.body.marque;
    let description = req.body.description;
    let nombre = req.body.nombre;
    let dateArrivee = req.body.dateArrivee;
 
    checkValue_String(description, (message, _description)=>{
        if(_description !== null){
            
            /*----------------------------------------*/
                    piece.marque = marque;
                    piece.description = _description;
                    piece.nombre = nombre;
                    piece.dateArrivee = dateArrivee;
             /*----------------------------------------*/
             piece.update(id_pdr, (message)=>{
                res.json({msg: message});
             })
        }else{
         res.json({msg: message});
        }
    })
}

/* End Update Pdr */

/* Delete Pdr */
exports.deletePDR = (req, res)=>{
    piece.delete(req.body.id)
    res.json({msg:'success'});
}

exports.updateNombre = (req, res)=>{
    let id = req.body.data;
    let type = parseInt(req.body.type);
    piece.findbyId(id, (pdr)=>{
    /*---------------------------------------------*/    
        piece.marque = pdr.marque;
        piece.description = pdr.description;
        if(type === 0){
            piece.nombre = parseInt(pdr.nombre) - 1;
        }else  piece.nombre = parseInt(pdr.nombre) + 1;
        piece.dateArrivee =moment(piece.dateArrivee).format('YYYY-MM-DD'),
    /*---------------------------------------------*/
        
        piece.update(id, (message)=>{
            res.json({msg:message});
        })
    })
}