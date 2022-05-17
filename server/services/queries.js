/* common queries for all table */

const { getConnection } = require("../../database/db_connection");

/* add new data in a table */
exports.addData = async(table, fields, values) => {

    getConnection((conn) => {
        sql = `INSERT INTO ${table} (${fields}) VALUES (${values})`;
        conn.query(sql)
            .then(() => {
                console.log("Created!")
                conn.end();
            })
            .catch(err => {
                console.log(err);
            })
    })
}

/* Get all data from a table */
exports.getAllData = async(table, next) => {
    await getConnection((conn) => {
        try {
            sql = `SELECT * FROM ${table}`;
            conn.query(sql)
                .then((result) => {
                    conn.end();
                    if (result.length > 0) {
        
                        return next(result);
                    } else {
                        return next([]);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        } catch (error) {
          
        }
    })
}

/* Get data by id */
exports.getDataby_ = async(table, condition, _data, next) => {
    await getConnection((conn) => {
        sql = `SELECT ${_data} FROM ${table} WHERE ${condition}`;
        conn.query(sql)
            .then(result => {
                conn.end();
                if (result.length > 0) {
                    return next(result);
                } else {
                    return next([]);
                }
            })
            .catch(err => {
                console.log(err);
            })
    })
}

/* Update data */
exports.updateDatabyId = async(table, values, condition) => {
    await getConnection((conn) => {
        sql = `UPDATE ${table} SET ${values} WHERE ${condition}`;
        conn.query(sql)
            .then(() => {
                console.log("Mise à jour effectuée avec succès!");
                conn.end();
            })
            .catch(err => console.log(err));
    })
}

/* Delete data */
exports.deletebyId = async(table, condition) => {
        getConnection((conn) => {
            sql = `DELETE FROM ${table} WHERE ${condition}`;
            conn.query(sql)
                .then(() => {
                    console.log("delete!");
                    conn.end();
                })
                .catch(err => console.log(err));
        })
}
   
 //select * from departement where nom_dep = "departement";
exports.checkIfExist = async(table, condition, next) => {
    getConnection((conn) => {
        sql = `SELECT * FROM ${table} WHERE ${condition}`;
        conn.query(sql)
            .then((data) => {
                conn.end();
                if (data.length > 0) return next(true);
                else return next(false);
            })
            .catch(err => console.log(err));
    })
}

//get Last Id
exports.getLastId = async(table, id, next)=>{
    getConnection((conn) => {
        sql = `SELECT MAX(${id}) AS val FROM ${table}`;
        conn.query(sql)
            .then((id) => {
                conn.end();
                return next(id[0]);
            })
            .catch(err => console.log(err));
    })
}