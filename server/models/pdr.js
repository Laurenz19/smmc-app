/* PDR Model */
const query = require('../services/queries');

class PDR {
    constructor(marque, description, nombre, dateArrivee){
        this.table = "pdr";
        this.fields = "marque, description, nombre, dateArrivee";
        this.marque = marque;
        this.description = description;
        this.nombre = nombre;
        this.dateArrivee = dateArrivee;
    }

    async create(){
        let values = `"${this.marque}", "${this.description}", ${this.nombre}, "${this.dateArrivee}"`;
        if(typeof(this.marque) !== "undefined" && typeof(this.description) !== "undefined" && typeof(this.nombre) !== "undefined" && typeof(this.dateArrivee) !== "undefined"){
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

    async findbyId(id, next) {
        const condition = `id_pdr = "${id}"`;
        const type='*';
        await query.getDataby_(this.table, condition, type, (data) => {
            return next(data[0]);
        })
    }

    async update(id, next){
        let values = `marque = "${this.marque}", description = "${this.description}", nombre = ${this.nombre}, dateArrivee = "${this.dateArrivee}"`;
        let message = '';
        const condition = `id_pdr = "${id}"`;
        if(typeof(this.marque) !== "undefined" && typeof(this.description) !== "undefined" && typeof(this.nombre) !== "undefined" && typeof(this.dateArrivee) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            message = "can not add an undefined value!";
        }
        return next(message);
    }

    async delete(id){
        const condition = `id_pdr = "${id}"`;
        query.deletebyId(this.table, condition);
    }
}

var piece = new PDR();
module.exports = {PDR, piece}