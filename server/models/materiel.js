/* Materiel Model*/
const query = require('../services/queries');

class Materiel {
    constructor(type, marque, config, Etat, work_id){
        this.table = "materiel";
        this.fields = "type, marque, config, Etat, work_id";
        this.type = type;
        this.marque = marque;
        this.config = config;
        this.Etat = Etat;
        this.work_id = work_id;
    }

    async create(){
        let values = `"${this.type}", "${this.marque}", "${this.config}", "${this.Etat}", "${this.work_id}"`;
        if(typeof(this.type) !== "undefined" && typeof(this.marque) !== "undefined" && typeof(this.config) !== "undefined" && typeof(this.Etat) !== "undefined" && typeof(this.work_id) !== "undefined"){
            query.addData(this.table, this.fields, values);
        }else{
            console.error("can not add an undefined value!")
        }
    }

    async findAll(type, next){
        if(type === 0){
            await query.getAllData(this.table, (data)=>{
                return next(data);
            })
        }else{
            let condition = `utilisation.user_id = utilisateur.user_id AND utilisation.id_mat = materiel.id_mat`;
            let table = `${this.table}, utilisation, utilisateur`;
            let _data = `materiel.id_mat, materiel.type, materiel.marque, materiel.config, materiel.Etat, materiel.work_id, utilisateur.nom, utilisateur.prenoms, utilisateur.user_id`;

            await query.getDataby_(table, condition, _data, (data) => {
                return next(data);
            })
        }
       
    }

    async findbyId(id, next) {
        const condition = `id_mat = "${id}"`;
        const type='*';
        await query.getDataby_(this.table, condition, type, (data) => {
            return next(data[0]);
        })
    }

    async findMaterielbyWorkId(work_id, next){
        let condition = '';
        let _data = '';
        let table = '';
        switch (work_id.slice(0, 3)) {
            case "DIR":
              
               _data = `materiel.id_mat, materiel.type, materiel.config, materiel.Etat, utilisateur.nom, utilisateur.prenoms, direction.nom_dir, materiel.marque`;
               condition = `materiel.id_mat = utilisation.id_mat AND utilisateur.user_id = utilisation.user_id AND direction.id = materiel.work_id AND materiel.work_id = "${work_id}"`;
               table = `${this.table}, utilisateur, direction, utilisation`;
               
               await query.getDataby_(table, condition, _data, (data) => {
                return next(data);
               })
               
               break;
            case "DEP":
                
                _data = `materiel.id_mat, materiel.type, materiel.config, materiel.Etat, utilisateur.nom, utilisateur.prenoms, departement.nom_dep, materiel.marque`;
                condition = `materiel.id_mat = utilisation.id_mat AND utilisateur.user_id = utilisation.user_id AND departement.id = materiel.work_id AND materiel.work_id = "${work_id}"`;
                table = `${this.table}, utilisateur, departement, utilisation`;
                
                await query.getDataby_(table, condition, _data, (data) => {
                    return next(data);
                })
                
                break;
            case "SCE":
                
                _data = `materiel.id_mat, materiel.type, materiel.config, materiel.Etat, utilisateur.nom, utilisateur.prenoms, service.nom_sce, materiel.marque`;
                condition = `materiel.id_mat = utilisation.id_mat AND utilisateur.user_id = utilisation.user_id AND service.id = materiel.work_id AND materiel.work_id = "${work_id}"`;
                table = `${this.table}, utilisateur, service, utilisation`;
               
                await query.getDataby_(table, condition, _data, (data) => {
                    return next(data);
                })
               
                break;
            default:
                console.log("Check Your Id Please!")
                break;
        }
    }

    async update(id, next){
        let values = `type = "${this.type}", marque = "${this.marque}", config = "${this.config}", Etat = "${this.Etat}", work_id = "${this.work_id}"`;
        const condition = `id_mat = "${id}"`;
        let message = '';
        if(typeof(this.type) !== "undefined" && typeof(this.marque) !== "undefined" && typeof(this.config) !== "undefined" && typeof(this.Etat) !== "undefined" && typeof(this.work_id) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            console.error("can not update an undefined value!")
        }
        return next(message);
    }

    async delete(id){
        const condition = `id_mat = "${id}"`;
        query.deletebyId(this.table, condition);
    }
}

var materiel = new Materiel();
module.exports = {Materiel, materiel};