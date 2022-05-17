/* Message Model */

const query = require('../services/queries');

class Message{
    constructor(description_msg, contenu_msg, status, id_sender, id_receiver, date_msg){
        this.table = "message";
        this.fields = "description_msg, contenu_msg, status, id_sender, id_receiver, date_msg";
        this.description_msg = description_msg;
        this.contenu_msg = contenu_msg;
        this.status = status;
        this.id_sender = id_sender;
        this.id_receiver = id_receiver;
        this.date_msg = date_msg; 
    }

    async create(){
        let values = `"${this.description_msg}", '${this.contenu_msg}', ${this.status}, "${this.id_sender}", "${this.id_receiver}", "${this.date_msg}"`;

        if(typeof(this.description_msg) !== "undefined" && typeof(this.contenu_msg) !== "undefined" && typeof(this.status) !== "undefined" && typeof(this.id_sender) !== "undefined" && typeof(this.id_receiver) !== "undefined" && typeof(this.date_msg) !== "undefined"){
            query.addData(this.table, this.fields, values);
        }else{
            console.error("can not add an undefined value!")
        }
    }

    async findbyIds(id_sender, id_receiver, date1, date2, type, next){
        let condition = '';
        let _data = '*';
        let table = this.table;

        if(type == 0){
            condition = `id_sender = "${id_sender}" AND id_receiver = "${id_receiver}"`;
        }

        if(type == 1){
            _data = `message.id_message, message.contenu_msg, message.id_sender, message.id_receiver, message.date_msg, utilisateur.path_photo as sender_photo, utilisateur.nom as sender_name, utilisateur.role as sender_role, utilisateur.work_id as sender_work, utilisateur.user_id as sender_id, utilisateur.prenoms as sender_firstname`
            table = `${this.table}, utilisateur`;
            condition = `utilisateur.user_id = message.id_sender AND date_msg between "${date1}" and "${date2}" AND id_sender = "${id_sender}" AND id_receiver = "${id_receiver}"`;
        }

        if(type == 2){
            _data = `message.id_message, message.contenu_msg, message.id_sender, message.id_receiver, message.date_msg, message.status, utilisateur.path_photo as sender_photo, utilisateur.nom as sender_name, utilisateur.role as sender_role, utilisateur.work_id as sender_work, utilisateur.user_id as sender_id, utilisateur.prenoms as sender_firstname`
            table = `${this.table}, utilisateur`;
            condition = `utilisateur.user_id = message.id_sender AND date_msg between "${date1}" and "${date2}" AND id_receiver = "${id_receiver}"`;
        }

        await query.getDataby_(table, condition, _data, (data) => {
            return next(data);
        })
    }

    async getDiscubyUser(id_user, next){
        //SELECT id_message, id_sender, id_receiver, date_msg, contenu_msg FROM message WHERE id_sender ='200021' OR id_receiver = '200021';
        let condition = `id_sender = "${id_user}" OR id_receiver = "${id_user}"`;
        let _data = '*';

        await query.getDataby_(this.table, condition, _data, (data) => {
            return next(data);
        })
    }

    async update(id_sender, id_receiver, contenu_msg, date_msg, type, next){
        let values = `description_msg = "${this.description_msg}", status = ${this.status}, id_sender = "${this.id_sender}", id_receiver = "${this.id_receiver}"`;
        let message = '';
        let condition = '';
        
        if(type === 1){
            condition = `id_sender = "${id_sender}" AND id_receiver = "${id_receiver}"`;
        }

        if(type === 2){
            condition = `id_receiver = "${id_receiver}" AND contenu_msg = "${contenu_msg}" AND date_msg = "${date_msg}"`;
        }
        
        if(typeof(this.description_msg) !== "undefined" && typeof(this.contenu_msg) !== "undefined" && typeof(this.status) !== "undefined" && typeof(this.id_sender) !== "undefined" && typeof(this.id_receiver) !== "undefined" && typeof(this.date_msg) !== "undefined"){
            message = "success";
            query.updateDatabyId(this.table, values, condition);
        }else{
            message = "can not update an undefined value!";
        }
        
        return next(message);
    }

    async delete(id){
        let condition = `id_message = "${id}"`;

        query.deletebyId(this.table, condition);
    }
}

var message = new Message();
module.exports = {Message, message}