/* Direction Controller */
const { Direction, direction } = require("../models/direction");
const { checkValue_String, setNullWork_id, setNullWork_id1 } = require("../services/useful");


/* Add a new Direction */
//post
exports.postCreateDirection = (req, res) => {
    let id = '';
    let add = 0;

    checkValue_String(req.body.direction, (message, _direction) => {
        if (_direction !== null) {
            //check if a direction is already exist
            let new_direction = new Direction(_direction);
            new_direction.check(id, add, (exist) => {
                if (exist === true) {
                    res.json({ msg: "la direction éxiste déjà!" });
                } else {
                    new_direction.create();
                    res.json({ msg: message });
                }
            })
        } else {
            res.json({ msg: message });
        }
    })

}

/* End add Direction */

/* Get the directions list */
exports.getDirectionList = (req, res) => {
    direction.findAll((dirs) => {
        res.json({ data: dirs, msg: "success" });
    })
}

/* Update a Direction */
//post
exports.postUpdateDirection = (req, res) => {

    let id = req.body.id;
    let add = 0;
    let update = 1;

    checkValue_String(req.body.direction, (_message, _direction) => {

        if (_direction !== null) {
            //check if a direction is already exist
            direction.nom_dir = req.body.direction;
            direction.check(id, update, (exist) => {
                if (exist === false) {
                    direction.check(id, add, (_exist) => {
                        if (_exist === true) {
                            res.json({ msg: 'la direction éxiste déjà!' })
                        } else {
                            direction.update(id, (message) => {
                                //On update with Utilisateur table
                                res.json({ msg: message })
                            });
                        }
                    })
                } else {
                    direction.update(id, (message) => {
                        //On update with Utilisateur table
                        res.json({ msg: message })
                    });
                }
            })
        } else {
            res.json({ msg: _message });
        }

    })

}

/* End update Direction */

/* Delete a Direction */
exports.deleteDirection = (req, res) => {
    let id = req.body.id;
    setNullWork_id(id, 'utilisateur');
    setNullWork_id1(id, 'materiel');
    direction.delete(id);
    res.json({ msg: 'success' })
}