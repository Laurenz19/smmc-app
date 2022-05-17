/* Utilisateur Model */
const query = require("../services/queries");

class Utilisateur {

    constructor(nom, prenoms, fonction, tel, email, password, work_id, role, path_photo) {
        this.table = "utilisateur";
        this.fields = "user_id, nom, prenoms, fonction, tel, email, password, path_photo, work_id, role";
        this.nom = nom;
        this.prenoms = prenoms;
        this.fonction = fonction;
        this.tel = tel;
        this.email = email;
        this.password = password;
        this.work_id = work_id;
        this.role = role;
        this.path_photo = path_photo;
    }

    async create() {
        let user_id = '0';
        let prefixe = this.work_id;
        let values = "";

        if (typeof(this.nom) !== "undefined" && typeof(this.prenoms) !== "undefined" && typeof(this.fonction) !== "undefined" && typeof(this.tel) !== "undefined" && typeof(this.email) !== "undefined" && typeof(this.password) !== "undefined" && typeof(this.work_id) !== "undefined" && typeof(this.role) !== "undefined" && typeof(this.path_photo) !== "undefined") {

            if (this.work_id === "admin") {
                //needed for the first connection on this application
                user_id = '4';
            } else {
                switch (prefixe.slice(0, 3)) {
                    case "DIR":
                        user_id = '1';
                        break;
                    case "DEP":
                        user_id = '2';
                        break;
                    case "SCE":
                        user_id = '3';
                        break;
                    default:
                        console.log("Check Your Id Please!")
                        break;
                }
            }
            values = `"${user_id}", "${this.nom}", "${this.prenoms}", "${this.fonction}", "${this.tel}", "${this.email}", PASSWORD("${this.password}"), "${this.path_photo}", "${this.work_id}", "${this.role}"`;
            query.addData(this.table, this.fields, values);
        } else {
            console.error("Can not add an undefined value!");
        }

    }

    async findAll(next) {
        const condition = `utilisateur.role=role.id_role`;
        const type = 'utilisateur.user_id as id, utilisateur.nom, utilisateur.prenoms, utilisateur.email, utilisateur.fonction, utilisateur.path_photo, utilisateur.tel , role.libelle as role, utilisateur.role as id_role, utilisateur.work_id';
        const tables = `${this.table}, role`
        await query.getDataby_(tables, condition, type, (data) => {
            return next(data);
        })
    
    }

    async findbyId(id, next) {
        const condition = `user_id = "${id}"`;
        const type = '*';
        await query.getDataby_(this.table, condition, type, (data) => {
            return next(data[0]);
        })
    }

    async findbyWorkId(id, next) {
        const condition = `work_id = "${id}"`;
        const type = '*';
        await query.getDataby_(this.table, condition, type, (data) => {
            return next(data);
        })
    }

    //select utilisateur.nom, role.libelle from utilisateur, role where utilisateur.role = role.id_role;
    async findbyEmail(next){
        const condition = `utilisateur.role=role.id_role AND email = "${this.email}"`;
        const type = 'utilisateur.user_id, utilisateur.nom, utilisateur.prenoms, utilisateur.email, utilisateur.fonction, utilisateur.path_photo, utilisateur.tel , role.libelle, utilisateur.work_id';
        const tables = `${this.table}, role`
        await query.getDataby_(tables, condition, type, (data) => {
            return next(data[0]);
        })
    }

    async update(id, _id, type, next) {
        const condition = `user_id = "${id}"`;
        let values ='';
        let message = "";
        
        //change password
        if(type === 1){
            values = `password = PASSWORD("${this.password}")`;
        }

        if(type === 2){
            values = `user_id = "${_id}", nom = "${this.nom}", prenoms = "${this.prenoms}", fonction = "${this.fonction}", tel = "${this.tel}",  email = "${this.email}", password = "${this.password}", work_id= "${this.work_id}", role =  "${this.role}"`;
        }

        if(type === 3){
            values = `path_photo = "${this.path_photo}"`;
        }

        if (typeof(this.nom) !== "undefined" && typeof(this.prenoms) !== "undefined" && typeof(this.fonction) !== "undefined" && typeof(this.tel) !== "undefined" && typeof(this.email) !== "undefined" && typeof(this.password) !== "undefined" && typeof(this.work_id) !== "undefined" && typeof(this.role) !== "undefined" && typeof(this.path_photo) !== "undefined") {
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        } else {
            message = "Can not add an undefined value!";
        }
        return next(message);
    }

    async delete(id) {
        const condition = `user_id = "${id}"`;
        query.deletebyId(this.table, condition);
    }

    async check(id, type, next) {
        let condition = ''
        if (type === 0) {
            condition = `email = "${this.email}"`;
        }
        if (type === 1) {
            condition = `email= "${this.email}" AND user_id = "${id}"`;
        }

        query.checkIfExist(this.table, condition, (exist) => {
            return next(exist);
        })
    }

    async check_pwd(email, pwd, next){
        let condition = `email= "${email}" AND password = PASSWORD("${pwd}")`;
        query.checkIfExist(this.table, condition, (exist)=>{
            return next(exist);
        })
    }
    
    //Select * from client where nom like ‘%A’ ;
    async search(val, next){
        let condition = `nom like '%${val}' OR nom like '%${val}%' OR nom like '${val}%' OR prenoms like '%${val}' OR prenoms like '%${val}%' OR prenoms like '${val}%'`;
        await query.getDataby_(this.table, condition, '*', (data) => {
            return next(data);
        })
    }
}

var _utilisateur = new Utilisateur();
module.exports = { Utilisateur, _utilisateur };