/* Depannage classe */
const query = require("../services/queries");

class Depannage{
    constructor(tech_id, id_mat, date_dep, diagnostique, liste_piece, tech_name, mat_user, mat_info){
        this.table = "depannage";
        this.fields = "tech_id, id_mat, date_dep, diagnostique, liste_piece, tech_name, mat_user, mat_info";
        this.tech_id = tech_id;
        this.id_mat = id_mat;
        this.date_dep = date_dep;
        this.diagnostique = diagnostique;
        this.liste_piece = liste_piece;
        this.tech_name = tech_name;
        this.mat_user = mat_user;
        this.mat_info = mat_info;
    }

    async create(){
        let values = `"${this.tech_id}", "${this.id_mat}", "${this.date_dep}", "${this.diagnostique}", "${this.liste_piece}", "${this.tech_name}", "${this.mat_user}", "${this.mat_info}"`;
        if(typeof(this.tech_id) !== "undefined" && typeof(this.id_mat) !== "undefined" && typeof(this.date_dep) !== "undefined" && typeof(this.diagnostique) !== "undefined"  && typeof(this.liste_piece) !== "undefined" && typeof(this.tech_name) !== "undefined" && typeof(this.mat_user) !== "undefined" && typeof(this.mat_info) !== "undefined"){
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

    async findby(tech_id, id_mat, date, year, month, requete, next){
        let condition = "";
        const type='*';
        
        switch (requete) {
            case 0:
                //by year
                condition = `Year(date_dep)=${year}`;
                break;
            case 1:
                //by month
                if(month === "Tout"){
                    condition = `Year(date_dep)=${year}`;
                }else{
                    condition = `Month(date_dep)=${month} AND Year(date_dep)=${year}`;
                }
                break;
            case 2:
                //tech id
                condition = `tech_id="${tech_id}"`;
                break;
            case 3:
                //id_mat
                condition = `id_mat="${id_mat}"`;
                break;
            case 4:
                //date
                condition = `date_dep="${date}"`;
                break;
            case 5:
                //ref_dep
                //supposons que tech_id = ref_dep
                condition = `ref_dep=${tech_id}`;
                break;
            case 6:
                //recherche entre 2 dates
                //supposons que date1=mounth et date2=year
                condition = `date_dep between "${month}" and "${year}"`;
                break;
            default:
                console.log("Something went wrong!")
                break;
        }
        
        await query.getDataby_(this.table, condition, type, (data) => {
            return next(data);
        })
    }

    async update(id, next){
        const condition = `ref_dep = ${id}`;
        let values = `tech_id = "${this.tech_id}", id_mat = "${this.id_mat}", date_dep = "${this.date_dep}", diagnostique = "${this.diagnostique}", liste_piece = "${this.liste_piece}", tech_name = "${this.tech_name}", mat_user = "${this.mat_user}", mat_info = "${this.mat_info}"`;
        let message = "";

        if(typeof(this.tech_id) !== "undefined" && typeof(this.id_mat) !== "undefined" && typeof(this.date_dep) !== "undefined" && typeof(this.diagnostique) !== "undefined"  && typeof(this.liste_piece) !== "undefined" && typeof(this.tech_name) !== "undefined" && typeof(this.mat_user) !== "undefined" && typeof(this.mat_info) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            message = "can not add an undefined value!";
        }
        return next(message);
    }

    async delete(id){
        const condition = `ref_dep = ${id}`;
        query.deletebyId(this.table, condition);
    }

}

let depannage = new Depannage();

module.exports = {Depannage, depannage};