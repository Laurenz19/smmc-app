/* Service Model */

const { addData, getAllData, deletebyId, getDataby_, updateDatabyId, checkIfExist } = require("../services/queries");

class Service {

    constructor(nom_sce, dep_id) {
        this.table = "service";
        this.fields = "nom_sce, dep_id";
        this.nom_sce = nom_sce;
        this.dep_id = dep_id;
    }

    async create() {
        const values = `"${this.nom_sce}", "${this.dep_id}"`;
        if (typeof(this.nom_sce) !== "undefined" && typeof(this.dep_id) !== "undefined") {
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
        const values = `nom_sce = "${this.nom_sce}", dep_id = "${this.dep_id}"`;
        const condition = `id = "${id}"`;
        let message = "";
        if (typeof(this.nom_sce) !== "undefined" && typeof(this.dep_id) !== "undefined") {

            if (id.slice(0, 3) == "SCE") {
                message = "success";
                updateDatabyId(this.table, values, condition);
            } else message = "Please check your id!";

        } else {
            message = "Can not update an undefined value!";
        }
        return next(message)
    }

    async delete(id) {
        const condition = `id = "${id}"`;
        deletebyId(this.table, condition);
    }

    async check(id, type, next) {
        let condition = ''
        if (type === 0) {
            condition = `nom_sce = "${this.nom_sce}"`;
        }
        if (type === 1) {
            condition = `nom_sce = "${this.nom_sce}" AND id = "${id}"`;
        }

        checkIfExist(this.table, condition, (exist) => {
            return next(exist);
        })
    }

}

let service = new Service();
module.exports = { Service, service }