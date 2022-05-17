/* Service Controller */
const { service, Service } = require("../models/service");
const { departement } = require("../models/departement");
const { checkValue_String, setNullWork_id, setNullWork_id1 } = require("../services/useful");

/* Add a new service */
//post
exports.postCreateService = (req, res) => {
    let departement = req.body.departement;
    let id = '';
    let add = 0;

    if (departement === "") {
        res.json({ msg: 'Veuillez selectionner un département!' });
    } else {
        checkValue_String(req.body.service, (message, sce) => {
            if (sce !== null) {
                //check if a service is already exist
                let new_sce = new Service(sce, departement);
                new_sce.check(id, add, (exist) => {
                    if (exist === true) {
                        res.json({ msg: "Ce cervice éxiste déjà!" });
                    } else {
                        //check if the service's name exist in departement table
                        new_sce.create();
                        res.json({ msg: message });
                    }
                })
            } else {
                res.json({ msg: message });
            }
        })
    }

}

/* End add Service */

/* Get all Services */
exports.getAllService = (req, res) => {
    service.findAll((services) => {
        departement.findAll((departements) => {
            res.json({ msg: "success", departements, data: services })
        })
    })
}

/* Update a Service */
//post
exports.postUpdateService = (req, res) => {
    let departement = req.body.departement;
    let id = req.body.id;
    let add = 0;
    let update = 1;

    if (departement === "") {
        res.json({ msg: 'Veuillez selectionner un département!' });
    } else {
        checkValue_String(req.body.service, (message, sce) => {
            if (sce !== null) {
                service.nom_sce = sce;
                service.dep_id = departement;
                service.check(id, update, (exist) => {
                    if (exist === false) {
                        service.check(id, add, (_exist) => {
                            if (_exist === true) {
                                res.json({ msg: 'Ce service éxiste déjà!' })
                            } else {
                                //check if the name exist in departement
                                service.update(id, (message) => {
                                    res.json({ msg: message });
                                })
                            }
                        })
                    } else {
                        //check if the name exist in departement
                       
                        service.update(id, (message) => {
                            //on update with the user table
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
exports.deleteService = (req, res) => {
    let id = req.body.id;

    setNullWork_id(id, 'utilisateur');
    setNullWork_id1(id, 'materiel');

    service.delete(id);
    res.json({ msg: 'success' });
}