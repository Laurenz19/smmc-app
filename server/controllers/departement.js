/* Departement Controller */
const { departement, Departement } = require("../models/departement");
const { direction } = require("../models/direction");
const { checkValue_String, setNullWork_id, setNullWork_id1 } = require("../services/useful");

/* Add a new department */
//post
exports.postCreateDepartement = (req, res) => {
    let direction = req.body.direction;
    let id = '';
    let add = 0;

    if (direction === '') {
        res.json({ msg: 'Veuillez selectionner une direction!' });
    } else {
        checkValue_String(req.body.departement, (message, dep) => {
            if (dep !== null) {
                // check if a departement is already exist
                let new_dep = new Departement(dep, direction);
                new_dep.check(id, add, (exist) => {
                    if (exist === true) {
                        res.json({ msg: "Ce département éxiste déjà!" });
                    } else {
                        //check if the name is a direction 
                        new_dep.create();
                        res.json({ msg: message });
                    }
                })
            } else {
                res.json({ msg: message });
            }

        })
    }
}

/* End add departement */

/* Get all Departements */
exports.getAllDepartement = (req, res) => {
        departement.findAll((departements) => {
                direction.findAll((directions) => {
                   // console.log(departements);
                    res.json({ msg: "success", data: departements, directions });
                })
        })
}

/* Update a Departement */
//post
exports.postUpdateDepartement = (req, res) => {
    let direction = req.body.direction;
    let id = req.body.id;
    let add = 0;
    let update = 1;

    if (direction === '') {
        res.json({ msg: 'Veuillez selectionner une direction!' });
    } else {
        checkValue_String(req.body.departement, (message, dep) => {
            if (dep !== null) {
                // check if a departement is already exist
                departement.nom_dep = dep;
                departement.dir_id = direction;
                departement.check(id, update, (exist) => {
                    if (exist === false) {
                        departement.check(id, add, (_exist) => {
                            if (_exist === true) {
                                res.json({ msg: 'Ce département éxiste déjà!' })
                            } else {
                                departement.update(id, (message) => {
                                    //On update with Utilisateur table
                                    res.json({ msg: message });
                                })
                            }
                        })
                    } else {
                        departement.update(id, (message) => {
                            //On update with Utilisateur table
                            res.json({ msg: message });
                        })
                    }
                })
            } else {
                res.json({ msg: message });
            }
        })
    }
}

/* End Update Departement */

/* Delete Departement */
exports.deleteDepartement = (req, res) => {
    let id = req.body.id;
    setNullWork_id(id, 'utilisateur');
    setNullWork_id1(id, 'materiel');
    departement.delete(id);
    res.json({ msg: 'success' });
}