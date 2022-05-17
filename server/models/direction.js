const { addData, getAllData, deletebyId, getDataby_, updateDatabyId, checkIfExist } = require("../services/queries");

class Direction {

    constructor(nom_dir) {
        this.table = "direction";
        this.fields = "nom_dir";
        this.nom_dir = nom_dir;
    }

    async create() {
        const values = `"${this.nom_dir}"`;
        if (typeof(this.nom_dir) !== "undefined") {
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
        await getDataby_(this.table, condition,type, (data) => {
            return next(data[0]);
        })
    }

    async update(id, next) {
        const values = `nom_dir = "${this.nom_dir}"`;
        const condition = `id = "${id}"`;
        let message = "";
        if (typeof(this.nom_dir) !== "undefined") {

            if (id.slice(0, 3) == "DIR") {
                message = "success";
                updateDatabyId(this.table, values, condition);
            } else {
                message = "Please check your id!";
            }

        } else {
            message = "Can not update an undefined value!";
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
            condition = `nom_dir = "${this.nom_dir}"`;
        }
        if (type === 1) {
            condition = `nom_dir = "${this.nom_dir}" AND id = "${id}"`;
        }

        checkIfExist(this.table, condition, (exist) => {
            return next(exist);
        })
    }
}

let direction = new Direction();
module.exports = { Direction, direction };