/* Departement Model */
const { addData, getAllData, deletebyId, getDataby_, updateDatabyId, checkIfExist } = require("../services/queries");

class Departement {

    constructor(nom_dep, dir_id) {
        this.table = "departement";
        this.fields = "nom_dep, dir_id";
        this.nom_dep = nom_dep;
        this.dir_id = dir_id;
    }

    async create() {
        const values = `"${this.nom_dep}", "${this.dir_id}"`;
        if (typeof(this.nom_dep) !== "undefined" && typeof(this.dir_id) !== "undefined") {
            addData(this.table, this.fields, values);
        } else {
            console.error("Can not add an undefined value!");
        }
    }

    async findAll(next) {
        await getAllData(this.table, (data) => {
            return next(data);
        })
    }

    async findbyId(id, next) {
        const condition = `id = "${id}"`;
        const type='*';
        await getDataby_(this.table, condition, type, (data) => {
            return next(data[0]);
        })
    }

    async update(id, next) {
        const values = `nom_dep = "${this.nom_dep}", dir_id = "${this.dir_id}"`;
        const condition = `id = "${id}"`;
        let message = "";
        if (typeof(this.nom_dep) !== "undefined" && typeof(this.dir_id) !== "undefined") {

            if (id.slice(0, 3) == "DEP") {
                message = "success";
                updateDatabyId(this.table, values, condition);
            } else {
                message = "Please check your id!"
            }

        } else {
            message = "Can not add an undefined value!"
        }

        return next(message);
    }

    async delete(id) {
        const condition = `id = "${id}"`;
        deletebyId(this.table, condition);
    }

    async check(id, type, next) {
        let condition = ''
        if (type === 0) {
            condition = `nom_dep = "${this.nom_dep}"`;
        }
        if (type === 1) {
            condition = `nom_dep = "${this.nom_dep}" AND id = "${id}"`;
        }

        checkIfExist(this.table, condition, (exist) => {
            return next(exist);
        })
    }

}

let departement = new Departement();
module.exports = { Departement, departement };