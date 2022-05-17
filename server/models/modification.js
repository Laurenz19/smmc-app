/* Table Assoiation between depannage and Materiel */

const query = require('../services/queries');

class Modification {

    constructor(ref_dep, id_pdr){
        this.table = "modification";
        this.fields = "ref_dep, id_pdr";
        this.ref_dep = ref_dep;
        this.id_pdr = id_pdr;
    }

    async create(){
        let values = `${this.ref_dep}, "${this.id_pdr}"`;
        if(typeof(this.id_pdr) !== "undefined" || typeof(this.ref_dep) !== "undefined"){
            query.addData(this.table, this.fields, values);
        }else{
            console.error("can not add an undefined value!")
        }
    }

    async findAll(next) {
        await query.getAllData(this.table, (data) => {
            return next(data);
        })
    }

    async update(ref_dep, id_pdr, type, next){
        let values = `ref_dep= ${this.ref_dep}, id_pdr= "${this.id_pdr}"`;
        let condition = `ref_dep= ${ref_dep} AND id_pdr = "${id_pdr}"`;
        let message = '';

        if(typeof(this.id_pdr) !== "undefined" || typeof(this.ref_dep) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            message = "Can not update an undefined value!";
        }
        return next(message);
    }

    async delete(ref_dep, id_pdr, type){
        let condition = '';

        switch (type) {
            case 0:
                condition = `ref_dep = ${ref_dep}`;
                break;
            case 1:
                condition = `id_pdr = "${id_pdr}"`;
                break;
            case 2:
                condition = `ref_dep = ${ref_dep} AND id_pdr = "${id_pdr}"`;
                break;
            default:
                console.log("Check Your type please")
                break;
        }

        query.deletebyId(this.table, condition);
    }
}

let modification = new Modification();
module.exports = {Modification, modification};