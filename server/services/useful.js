/* all usefull fonctions */

const { updateDatabyId } = require("./queries");

/* Integrité des données */
exports.checkValue_String = async(myString, next) => {
    let message = "";

    if (myString === '') {

        message = "Ouups..! Votre champs est vide";
        return next(message, null);

    } else {
        if (isNaN(parseInt(myString)) === false) {

            message = `Ouups..! ${myString} est un Chiffre!`
            return next(message, null);

        } else {

            let _myString = myString;
            let table = _myString.split('');
            let new_mot = []

            for (let i = 0; i < table.length; i++) {
                const elem = table[i];
                if (elem === '²' || elem === '&' || elem === '~' || elem === '"' || elem === '#' || elem === '{' || elem === '(' || elem === '[' || elem === '|' || elem === '`' || elem === '^' || elem === ')' || elem === '°' || elem === ']' || elem === '=' || elem === '+' || elem === '}' || elem === '/' || elem === '*' || elem === '>' || elem === '<' || elem === '!' || elem === '§' || elem === ':' || elem === ';' || elem === ',' || elem === '?' || elem === '£' || elem === '¤' || elem === '@' || elem === '%') {
                    //"Veuillez entrer seulement que des lettres";

                } else {
                    new_mot.push(elem);
                }
            }

            if (table.toString() == new_mot.toString()) {
                if (_myString.length >= 3) {
                    message = "success";
                    return next(message, _myString);
                } else {
                    message = `Ouups..! veuillez entrez un mot avec 3 lettres minimum!`;
                    return next(message, null);
                }
            } else {

                message = `Ouups..! Vous avez entré des caractères spéciaux: ${_myString}.`;
                return next(message, null);
            }
        }
    }
}

exports._checkValueString = async(myString, next)=>{
    if (isNaN(parseInt(myString)) === false) {

        message = `Ouups..! ${myString} est un Chiffre!`
        return next(message, null);

    } else {

        let _myString = myString;
        let table = _myString.split('');
        let new_mot = []

        for (let i = 0; i < table.length; i++) {
            const elem = table[i];
            if (elem === '²' || elem === '&' || elem === '~' || elem === '"' || elem === '#' || elem === '{' || elem === '(' || elem === '[' || elem === '|' || elem === '`' || elem === '^' || elem === ')' || elem === '°' || elem === ']' || elem === '=' || elem === '+' || elem === '}' || elem === '/' || elem === '*' || elem === '>' || elem === '<' || elem === '!' || elem === '§' || elem === ':' || elem === ';' || elem === ',' || elem === '?' || elem === '£' || elem === '¤' || elem === '@' || elem === '%') {
                //"Veuillez entrer seulement que des lettres";

            } else {
                new_mot.push(elem);
            }
        }

        if (table.toString() == new_mot.toString()) {
                message = "success";
                return next(message, _myString);
        } else {

            message = `Ouups..! Vous avez entré des caractères spéciaux: ${_myString}.`;
            return next(message, null);
        }
    }
}

exports.generate_id = (id, work_id)=>{
    let prefixe = work_id;
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

    return user_id + id.slice(1);
}

exports.setNullWork_id = (id, table)=>{
    let val = 'null';
    let value = `work_id = "${val}"`;
    condition = `work_id = "${id}"`;
    updateDatabyId(table, value, condition);
}

exports.setNullWork_id1 = (id, table)=>{
    let val = '';
    let value = `work_id = "${val}"`;
    condition = `work_id = "${id}"`;
    updateDatabyId(table, value, condition);
}
