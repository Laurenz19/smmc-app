/* Utilisation Model */
const query = require("../services/queries");

class Utilisation {

    constructor(user_id, id_mat, debut, fin){
        this.table = "utilisation";
        this.fields = "user_id, id_mat, debut, fin";
        this.user_id = user_id;
        this.id_mat = id_mat;
        this.debut = debut;
        this.fin = fin;
    }

    async create(){
        let values = `"${this.user_id}", "${this.id_mat}", "${this.debut}", "${this.fin}"`;
        if(typeof(this.user_id) !== "undefined" && typeof(this.id_mat) !== "undefined" && typeof(this.debut) !== "undefined" && typeof(this.fin) !== "undefined"){
            query.addData(this.table, this.fields, values);
        }else{
            console.error("can not add an undefined value!")
        }
    }

    async findAll(next){
        await query.getAllData(this.table, (data)=>{
            return next(data);
        })
    }

    async findbyId(user_id, id_mat, type, next) {
        let condition = '';
        let _data='';
        let table='';
        switch (type) {
            case 0:
                _data = 'utilisation.user_id as user_id, utilisation.id_mat as id_mat, utilisateur.nom, utilisateur.prenoms, utilisation.debut, utilisation.fin, utilisateur.work_id';
                table= `${this.table}, utilisateur`;
                condition = `utilisateur.user_id=utilisation.user_id AND utilisation.id_mat = "${id_mat}"  LIMIT 1`;
                break;
            case 1:
                _data = 'utilisateur.user_id as user_id, utilisation.id_mat as id_mat, utilisateur.nom, utilisateur.prenoms, utilisation.debut, utilisation.fin, materiel.type, materiel.marque, materiel.config';
                table= `${this.table}, materiel, utilisateur`;
                condition = `utilisateur.user_id=utilisation.user_id AND materiel.id_mat=utilisation.id_mat AND utilisation.user_id="${user_id}"`;
                break;
            case 3:
                _data = 'utilisation.user_id as user_id, utilisation.id_mat as id_mat, utilisateur.nom, utilisateur.prenoms, utilisation.debut, utilisation.fin, utilisateur.work_id';
                table= `${this.table}, utilisateur`;
                condition = `utilisateur.user_id=utilisation.user_id, utilisation.user_id = "${user_id}" AND utilisation.id_mat = "${id_mat}"`;
                break;
            default:
                console.log("Check Your type please")
                break;
        }
        await query.getDataby_(table, condition, _data, (data) => {
            console.log(data);
            return next(data);
        })
    }

    async update(user_id, id_mat, type, next){
        let values = `user_id = "${this.user_id}", id_mat = "${this.id_mat}", debut = "${this.debut}", fin = "${this.fin}"`;
        let condition = '';
        let message = '';

        switch (type) {
            case 0:
                condition = `id_mat = "${id_mat}"`;
                break;
            case 1:
                condition = `user_id = "${user_id}"`;
                break;
            case 3:
                condition = `user_id = "${user_id}" AND id_mat = "${id_mat}"`;
                break;
            default:
                console.log("Check Your type please")
                break;
        }

        if(typeof(this.user_id) !== "undefined" && typeof(this.id_mat) !== "undefined" && typeof(this.debut) !== "undefined" && typeof(this.fin) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            message = "Can not update an undefined value!";
        }

        return next(message);
    }

    async delete(user_id, id_mat, type){
        let condition = '';

        switch (type) {
            case 0:
                condition = `id_mat = "${id_mat}"`;
                break;
            case 1:
                condition = `user_id = "${user_id}"`;
                break;
            case 3:
                condition = `user_id = "${user_id}" AND id_mat = "${id_mat}"`;
                break;
            default:
                console.log("Check Your type please")
                break;
        }

        query.deletebyId(this.table, condition);
    }

}

let utilisation = new Utilisation();

module.exports = {Utilisation, utilisation};