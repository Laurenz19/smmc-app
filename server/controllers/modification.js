/* Controller */

const { modification } = require("../models/modification");
const { getLastId } = require("../services/queries");

exports.postCreateModification = (req, res)=>{
    let data= req.body.data;
    let ref_dep = req.body.ref_dep;

    if(ref_dep !== ''){
        
        ref_dep = parseInt(ref_dep);
        modification.ref_dep = ref_dep;
        if(data.length>0){
            data.forEach(id_pdr => {
                modification.id_pdr = id_pdr;
                modification.create();
            });
        }
        res.json({msg:"success"});

    }else{
       
        getLastId('depannage', 'ref_dep', (id)=>{

            if(id === null){
                this.postCreateModification();
            }else{
                modification.ref_dep = id.val;
            
                if(data.length>0){
                    data.forEach(id_pdr => {
                        modification.id_pdr = id_pdr;
                        modification.create();
                    });
                }
                res.json({msg:"success"});
            }
        })
    } 
}

exports.postUpdateModification = (req, res)=>{

}

exports.deleteModification = (req, res)=>{
    let data = req.body.data;
    let ref_dep = parseInt(req.body.ref_dep);

    console.log(data);
    if(data.length>0){
        data.forEach(id_pdr => {
            modification.delete(ref_dep, id_pdr, 2);
        });
    }
    res.json({msg:"success"})

}