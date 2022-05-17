/* Depannage Controller */
const moment = require("moment");
const { Depannage, depannage } = require("../models/depannage");
const { modification } = require("../models/modification");
const { piece } = require("../models/pdr");
const { Utilisateur } = require("../models/user");
const { direction } = require("../models/direction");
const { departement } = require("../models/departement");
const { service } = require("../models/service");
const {createCanvas, loadImage} = require('canvas');
var pdfMake = require('../../node_modules/pdfmake/build/pdfmake.js');
var pdfFonts = require('../../node_modules/pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { materiel } = require("../models/materiel");
const { utilisation } = require("../models/utilisation");

/* Add a new depannage */
//post
exports.postCreateDepannage = (req,res)=>{
    let technicien = req.body.technicien;
    let _materiel = req.body.materiel;
    let diagnostique = req.body.diagnostique;
    let _pieces = req.body.pdr;
    let date_dep = req.body.date_dep;
    let liste_piece = '';

    if(typeof(_pieces) === "undefined"){
        _pieces = [];
    }
    console.log('tonga')
    piece.findAll((pieces)=>{
        
        if(_pieces.length>0){
            _pieces.forEach(p1 => {
                pieces.forEach(p2 => {
                    if(p1 === p2.id_pdr){
                        if(liste_piece === ''){
                            liste_piece = `${p2.marque} / ${p2.description}`
                        }else{
                            liste_piece = liste_piece + `*${p2.marque} / ${p2.description}`
                        }
                    }
                });      
            });
            liste_piece = `${liste_piece}`;
        }else liste_piece = '';

            let user = new Utilisateur();
            user.findbyId(technicien, (tech)=>{
            
            let nom = `${tech.nom} ${tech.prenoms}`;

            materiel.findbyId(_materiel, (mat)=>{
                let info_mat = `${mat.type} ~ ${mat.marque} ~ ${mat.config}`;
                utilisation.findbyId('', _materiel, 0, (data)=>{
                    let user_mat = ''
                    if(data.length>0){
                           user_mat = `${data[0].nom} ${data[0].prenoms}`;
                    }else{
                           user_mat = '';
                    }
                    /*--------------------------------------------------------------------------------------------*/
                    let _depannage = new Depannage(technicien, _materiel, date_dep, diagnostique, liste_piece, nom, user_mat, info_mat)
                    /*--------------------------------------------------------------------------------------------*/
                    _depannage.create();
                    res.json({msg: 'success'})
                })
            })
        })
      
    })
}
/* End add Depannage */

/* Get all Depannage */
exports.getAllDepannage = (req, res)=>{
    let tab = [];
    let tab2 = [];
    depannage.findAll((depannages)=>{
        modification.findAll((mdf)=>{
            depannages.forEach(depannage => {
                tab2 = [];
                mdf.forEach(elem => {
                    if(elem.ref_dep === depannage.ref_dep){
                        tab2.push(elem.id_pdr);
                    }
                });

                let liste = depannage.liste_piece;
                let data = liste.split('*');
                let pieces = '';
                data.forEach(elem => {
                    pieces = pieces + `<li>${elem}</li>`
                });

                if(liste === ''){
                    pieces = '';
                }else {
                    pieces = `<ul>${pieces}</ul>`;
                }
                console.log(tab2);
                tab.push({
                   ref_dep: depannage.ref_dep,
                   tech_id: depannage.tech_id,
                   tech_name: depannage.tech_name,
                   mat_user: depannage.mat_user,
                   info_mat: depannage.mat_info,
                   id_mat: depannage.id_mat,
                   diagnostique : depannage.diagnostique,
                   pieces: pieces,
                   pieces_id: tab2, 
                   date_dep: moment(depannage.date_dep).format('DD-MM-YYYY'),
                   date_dep1: moment(depannage.date_dep).format('YYYY-MM-DD'),
                })
            });
            console.log(tab)
            res.json({msg:"success", data: tab})  
        })
    })
}

/* Update a Depannage */
//post
exports.postUpdateDepannage = (req, res)=>{
    let ref_dep = parseInt(req.body.ref_dep);
    let technicien = req.body.technicien;
    let _materiel = req.body.materiel;
    let diagnostique = req.body.diagnostique;
    let _pieces = req.body.pdr;
    let date_dep = req.body.date_dep;
    let liste_piece = '';

    if(typeof(_pieces) === "undefined"){
        _pieces = [];
    }

    piece.findAll((pieces)=>{
        
        if(_pieces.length>0){
            _pieces.forEach(p1 => {
                pieces.forEach(p2 => {
                    if(p1 === p2.id_pdr){
                        if(liste_piece === ''){
                            liste_piece = `${p2.marque} / ${p2.description}`
                        }else{
                            liste_piece = liste_piece + `*${p2.marque} / ${p2.description}`
                        }
                    }
                });      
            });
            liste_piece = `${liste_piece}`;
        }else liste_piece = '';

        materiel.findbyId(_materiel, (mat)=>{
            let info_mat = `${mat.type} ~ ${mat.marque} ~ ${mat.config}`;

            utilisation.findbyId('', _materiel, 0, (data)=>{
                console.log(data);
                console.log('hahu');

                let user_mat = ''
                if(data.length>0){
                       user_mat = `${data[0].nom} ${data[0].prenoms}`;
                }else{
                       user_mat = '';
                }
            let _depannage = new Depannage();
            _depannage.findby(ref_dep, '', '', '', '', 5, (dep)=>{
                if(dep[0].tech_id === technicien){
                   
                     /*--------------------------------------------------------------------------------------------*/
                     let _depannage1 = new Depannage(technicien, _materiel, date_dep, diagnostique, liste_piece, dep[0].tech_name, user_mat, info_mat)
                     /*--------------------------------------------------------------------------------------------*/
                
                    _depannage1.update(ref_dep, (messages)=>{
                        res.json({msg: messages})
                    });
                }else{
                    let user = new Utilisateur();
                    user.findbyId(technicien, (tech)=>{
                       console.log(tech)
                    let nom = `${tech.nom} ${tech.prenoms}`;
                    /*--------------------------------------------------------------------------------------------*/
                        let _depannage2 = new Depannage(technicien, _materiel, date_dep, diagnostique, liste_piece, nom, user_mat, info_mat)
                        /*--------------------------------------------------------------------------------------------*/
                        _depannage2.update(ref_dep, (messages)=>{
                            res.json({msg: messages})
                        });
                    })
                }
            })
        })    
     })
  })
}

/* End Update Depannage */

/* Delete Depannage */
exports.deleteDepannage = (req, res)=>{
    let id = req.body.id;
    
    depannage.delete(id);
    res.json({ msg: 'success' })
}

/*******************************/
// Generate PDF with pdfmake
/*******************************/

function getImage(url, size) {
    return loadImage(url).then(image => {
        const canvas = createCanvas(size, size);
        let ctx = canvas.getContext('2d');
       // ctx.drawImage(image, 0, 0);
       ctx.drawImage(image, 0, 0, 70, 70)
        return canvas.toDataURL();
    });
}

exports.generatepdf = async (req,res)=>{
    let filename = req.params.filename;
    const imageData = await getImage('assets/images/logo.png', 100);
    console.log(imageData)
   
    depannage.findAll((depannages)=>{
        materiel.findAll(0, (mats)=>{
            direction.findAll((dirs)=>{
                departement.findAll((deps)=>{
                    service.findAll((sces)=>{
                        let data = [];
                        let machine = [];

                        mats.forEach(elem => {
                            dirs.forEach(elem2 => {
                                if(elem.work_id === elem2.id){
                                    machine.push({
                                        id: elem.id_mat,
                                        info: `${elem.marque} ~ ${elem.config}`,
                                        local: elem2.nom_dir
                                    })
                                }
                            });
                            deps.forEach(elem2 => {
                                if(elem.work_id === elem2.id){
                                    machine.push({
                                        id: elem.id_mat,
                                        info: `${elem.marque} ~ ${elem.config}`,
                                        local: elem2.nom_dep
                                    })
                                }
                            });
                            sces.forEach(elem2 => {
                                if(elem.work_id === elem2.id){
                                    machine.push({
                                        id: elem.id_mat,
                                        info: `${elem.marque} ~ ${elem.config}`,
                                        local: elem2.nom_sce
                                    })
                                }
                            });
                        });

                        console.log(machine)
                        depannages.forEach(elem => {
                            machine.forEach(elem2 => {
                                if(elem.id_mat === elem2.id){
                                    data.push([
                                        {text: `${moment(elem.date_dep).format('DD/MM/YYYY')}`, fontSize: 9, alignment: 'center'},
                                        {text: `${elem.tech_name}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem2.info}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem2.local}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem.diagnostique}`, alignment: 'center', fontSize: 9},
                                    ]);
                                } 
                            });
                        });

                        let body = [
                            [{text: 'Date', alignment: 'center', fontSize:10, bold:true },
                            {text: 'Technicien', alignment: 'center', fontSize:10, bold:true },
                            {text: 'Matériel', alignment: 'center', fontSize:10, bold:true },
                            {text: 'Localité', alignment: 'center', fontSize:10, bold:true },
                            {text: 'Diagnostique', alignment: 'center', fontSize:10, bold:true }]
                        ];
                        data.forEach(element => {
                            body.push(element);
                        });
                            
                        let docDefinition = {
                            info: {
                                title: 'SMMM ~ Dépannage',
                                author: 'Laurenzio Sambany',
                                subject: 'Liste des dépannages',
                                keywords: 'keywords for document',
                              },
                            content: [
                                {
                                    image: imageData,
                                    width: 80,
                                    height: 40,
                                    alignment:'center',
                                    margin:[0, 0, 180, 0]
                                },
                                {
                                    columns:[
                                        {
                                            text:'Société de la Manutention des Marchandises\n',
                                            style: 'Titre1'
                                       },
                                       {
                                           text: 'Toamasina, le',
                                           style:'Titre1_1'
                                       }      
                                    ]
                                },
                               {
                                    text: 'Conventionnelles\n',
                                    style:'Titre2'
                               },
                               {
                                    text: 'DEPARTEMENT INFORMATIQUE\n',
                                    style:'Sous_titre1'
                                },
                                {
                                    text: '*********\n\n',
                                    style:'ligne1'
                                },
                                {
                                    text: 'LISTE DES DEPANNAGES EFFECTUES\n',
                                    style:'Sous_titre2'
                               },
                               {
                                    text: '********************\n',
                                    style:'ligne2'
                                 },
                               {
                                style: 'all_depannage',
                                table: {
                                    body: body,
                                }
                               }
                            ],
                            styles:{
                                Titre1:{
                                    fontSize:8,
                                    italics: true,
                                    alignment: 'left',
                                    margin: [0, 0, 100, 0],
                                },
                                Titre1_1:{
                                    fontSize:9,
                                    alignment: 'center',
                                },
                                Titre2:{
                                    fontSize:8,
                                    italics: true,
                                    alignment: 'center',
                                    margin: [0, 0, 370, 0],
                                },
                                Sous_titre1:{
                                    bold:true,
                                    fontSize:8,
                                    alignment: 'center',
                                    margin: [0, 0, 370, 0],
                                },
                                ligne1:{
                                    alignment: 'center',
                                    margin: [0, 0, 370, 0],
                                },
                                Sous_titre2:{
                                    bold:true,
                                    alignment: 'center',
                                },
                                ligne2:{
                                    alignment: 'center',
                                },
                                all_depannage:{
                                    margin: [0, 20, 0, 0],
                                    alignment: 'justify',
                                }
                            },
                          };
                          let pdfDoc = pdfMake.createPdf(docDefinition);
                            pdfDoc.getBase64((data)=>{
                              res.writeHead(200, 
                              {
                                  'Content-Type': 'application/pdf',
                                  'Content-Disposition':`attachment;filename="${filename}.pdf"`
                              });
                             
                              const download = Buffer.from(data.toString('utf-8'), 'base64');
                              res.end(download);
                            });      
                    })
                })
            })
        })
    })
}

exports.generatepdf1 = async (req,res)=>{
    let month = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    let annee = parseInt(req.params.annee);
    let mois = req.params.mois
    let filename = req.params.filename;
    let info = `Le rapport de suivi des dépannages effectués par les techniciens du parc Informatique de la SMMC en ${annee}.`;

    const imageData = await getImage('assets/images/logo.png', 100);
    console.log(imageData)

    if(mois !== "Tout"){
        mois = parseInt(req.params.mois);
        info = `Le rapport de suivi des dépannages effectués par les techniciens du parc Informatique de la SMMC au cours du mois de ${month[mois-1]} ${annee}.`;
    }
   
    depannage.findby('', '', '', annee, mois, 1, (depannages)=>{
        if(depannages.length>0){
            materiel.findAll(0, (mats)=>{
                direction.findAll((dirs)=>{
                    departement.findAll((deps)=>{
                        service.findAll((sces)=>{
                            let data = [];
                            let machine = [];
    
                            mats.forEach(elem => {
                                dirs.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dir
                                        })
                                    }
                                });
                                deps.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dep
                                        })
                                    }
                                });
                                sces.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_sce
                                        })
                                    }
                                });
                            });
    
                            console.log(machine)
                            depannages.forEach(elem => {
                                machine.forEach(elem2 => {
                                    if(elem.id_mat === elem2.id){
                                        data.push([
                                            {text: `${moment(elem.date_dep).format('DD/MM/YYYY')}`, fontSize: 9, alignment: 'center'},
                                            {text: `${elem.tech_name}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem2.info}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem2.local}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem.diagnostique}`, alignment: 'center', fontSize: 9},
                                        ]);
                                    } 
                                });
                            });
    
                            let body = [
                                [{text: 'Date', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Technicien', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Matériel', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Localité', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Diagnostique', alignment: 'center', fontSize:10, bold:true }]
                            ];
                            data.forEach(element => {
                                body.push(element);
                            });
                                
                            let docDefinition = {
                                info: {
                                    title: 'SMMM ~ Dépannage',
                                    author: 'Laurenzio Sambany',
                                    subject: 'Liste des dépannages',
                                    keywords: 'keywords for document',
                                  },
                                content: [
                                    {
                                        image: imageData,
                                        width: 80,
                                        height: 40,
                                        alignment:'center',
                                        margin:[0, 0, 180, 0]
                                    },
                                    {
                                        columns:[
                                            {
                                                text:'Société de la Manutention des Marchandises\n',
                                                style: 'Titre1'
                                           },
                                           {
                                               text: 'Toamasina, le',
                                               style:'Titre1_1'
                                           }      
                                        ]
                                    },
                                    {
                                        text: 'Conventionnelles\n',
                                        style:'Titre2'
                                   },
                                   {
                                        text: 'DEPARTEMENT INFORMATIQUE\n',
                                        style:'Sous_titre1'
                                    },
                                    {
                                        text: '*********\n\n',
                                        style:'ligne1'
                                    },
                                    {
                                        text: 'LISTE DES DEPANNAGES EFFECTUES\n',
                                        style:'Sous_titre2'
                                   },
                                   {
                                        text: '********************',
                                        style:'ligne2'
                                     },
                                     {
                                        text: `${info}\n\n`,
                                        style: 'info'
                                     },
                                   {
                                    style: 'all_depannage',
                                    table: {
                                        body: body,
                                    }
                                   }
                                ],
                                styles:{
                                    Titre1:{
                                        fontSize:8,
                                        italics: true,
                                        alignment: 'left',
                                        margin: [0, 0, 100, 0],
                                    },
                                    Titre1_1:{
                                        fontSize:9,
                                        alignment: 'center',
                                    },
                                    Titre2:{
                                        fontSize:8,
                                        italics: true,
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    Sous_titre1:{
                                        bold:true,
                                        fontSize:8,
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    ligne1:{
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    Sous_titre2:{
                                        bold:true,
                                        alignment: 'center',
                                    },
                                    ligne2:{
                                        alignment: 'center',
                                    },
                                    all_depannage:{
                                        margin: [0, 20, 0, 0],
                                        alignment: 'justify',
                                    },
                                    info:{
                                        fontSize:9,
                                        margin: [0, 10, 0, 0],
                                        alignment: 'center',
                                    }
                                },
                              };
                              let pdfDoc = pdfMake.createPdf(docDefinition);
                                pdfDoc.getBase64((data)=>{
                                  res.writeHead(200, 
                                  {
                                      'Content-Type': 'application/pdf',
                                      'Content-Disposition':`attachment;filename="${filename}.pdf"`
                                  });
                                 
                                  const download = Buffer.from(data.toString('utf-8'), 'base64');
                                  res.end(download);
                                });      
                        })
                    })
                })
            })
    
        }
    })
}

exports.generatepdf2 = async (req,res)=>{
    let date1 = req.params.date1;
    let date2 = req.params.date2;
    let filename = req.params.filename;
    let _date1 = new Date(date1);
    let _date2 = new Date(date2);

    console.log(moment(_date1).format('DD/MM/YYYY'));
    const imageData = await getImage('assets/images/logo.png', 100);

    let info =  `Liste des dépannages éffectués entre les dates suivantes ${moment(_date1).format('DD/MM/YYYY')} ~ ${moment(_date2).format('DD/MM/YYYY')} au sein de la société.`;
   
    depannage.findby('','','', date2, date1, 6, (depannages)=>{
        if(depannages.length>0){
            console.log(depannages)
            materiel.findAll(0, (mats)=>{
                direction.findAll((dirs)=>{
                    departement.findAll((deps)=>{
                        service.findAll((sces)=>{
                            let data = [];
                            let machine = [];
    
                            mats.forEach(elem => {
                                dirs.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dir
                                        })
                                    }
                                });
                                deps.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dep
                                        })
                                    }
                                });
                                sces.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_sce
                                        })
                                    }
                                });
                            });
    
                            console.log(machine)
                            depannages.forEach(elem => {
                                machine.forEach(elem2 => {
                                    if(elem.id_mat === elem2.id){
                                        data.push([
                                            {text: `${moment(elem.date_dep).format('DD/MM/YYYY')}`, fontSize: 9, alignment: 'center'},
                                            {text: `${elem.tech_name}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem2.info}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem2.local}`, alignment: 'center', fontSize: 9},
                                            {text: `${elem.diagnostique}`, alignment: 'center', fontSize: 9},
                                        ]);
                                    } 
                                });
                            });
    
                            let body = [
                                [{text: 'Date', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Technicien', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Matériel', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Localité', alignment: 'center', fontSize:10, bold:true },
                                {text: 'Diagnostique', alignment: 'center', fontSize:10, bold:true }]
                            ];
                            data.forEach(element => {
                                body.push(element);
                            });
                                
                            let docDefinition = {
                                info: {
                                    title: 'SMMM ~ Dépannage',
                                    author: 'Laurenzio Sambany',
                                    subject: 'Liste des dépannages',
                                    keywords: 'keywords for document',
                                  },
                                  content: [
                                    {
                                        image: imageData,
                                        width: 80,
                                        height: 40,
                                        alignment:'center',
                                        margin:[0, 0, 180, 0]
                                    },
                                    {
                                        columns:[
                                            {
                                                text:'Société de la Manutention des Marchandises\n',
                                                style: 'Titre1'
                                           },
                                           {
                                               text: 'Toamasina, le',
                                               style:'Titre1_1'
                                           }      
                                        ]
                                    },
                                    {
                                        text: 'Conventionnelles\n',
                                        style:'Titre2'
                                   },
                                   {
                                        text: 'DEPARTEMENT INFORMATIQUE\n',
                                        style:'Sous_titre1'
                                    },
                                    {
                                        text: '*********\n\n',
                                        style:'ligne1'
                                    },
                                    {
                                        text: 'LISTE DES DEPANNAGES EFFECTUES\n',
                                        style:'Sous_titre2'
                                   },
                                   {
                                        text: '********************',
                                        style:'ligne2'
                                     },
                                     {
                                        text: `${info}\n\n`,
                                        style: 'info'
                                     },
                                   {
                                    style: 'all_depannage',
                                    table: {
                                        body: body,
                                    }
                                   }
                                ],
                                styles:{
                                    Titre1:{
                                        fontSize:8,
                                        italics: true,
                                        alignment: 'left',
                                        margin: [0, 0, 100, 0],
                                    },
                                    Titre1_1:{
                                        fontSize:9,
                                        alignment: 'center',
                                    },
                                    Titre2:{
                                        fontSize:8,
                                        italics: true,
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    Sous_titre1:{
                                        bold:true,
                                        fontSize:8,
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    ligne1:{
                                        alignment: 'center',
                                        margin: [0, 0, 370, 0],
                                    },
                                    Sous_titre2:{
                                        bold:true,
                                        alignment: 'center',
                                    },
                                    ligne2:{
                                        alignment: 'center',
                                    },
                                    all_depannage:{
                                        margin: [0, 20, 0, 0],
                                        alignment: 'justify',
                                    },
                                    info:{
                                        fontSize:9,
                                        margin: [0, 10, 0, 0],
                                        alignment: 'center',
                                    }
                                },
                              };
                              let pdfDoc = pdfMake.createPdf(docDefinition);
                                pdfDoc.getBase64((data)=>{
                                  res.writeHead(200, 
                                  {
                                      'Content-Type': 'application/pdf',
                                      'Content-Disposition':`attachment;filename="${filename}.pdf"`
                                  });
                                 
                                  const download = Buffer.from(data.toString('utf-8'), 'base64');
                                  res.end(download);
                                });      
                        })
                    })
                })
            })
        }
    })
}

exports.generatepdfbyMateriel = async (req, res)=>{
    let filename = req.params.filename;
    let _materiel = req.params.idmat;
    const imageData = await getImage('assets/images/logo.png', 100);

    let info = '';
    console.log(_materiel)
   
    depannage.findAll((depannages)=>{
        if(depannages.length>0){
            console.log(depannages)
            materiel.findAll(0, (mats)=>{
                direction.findAll((dirs)=>{
                    departement.findAll((deps)=>{
                        service.findAll((sces)=>{
                            let data = [];
                            let machine = [];
    
                            mats.forEach(elem => {
                                dirs.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dir
                                        })
                                    }
                                });
                                deps.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_dep
                                        })
                                    }
                                });
                                sces.forEach(elem2 => {
                                    if(elem.work_id === elem2.id){
                                        machine.push({
                                            id: elem.id_mat,
                                            info: `${elem.marque} ~ ${elem.config}`,
                                            local: elem2.nom_sce
                                        })
                                    }
                                });
                            });
    
                            let data2 =[];
                            depannages.forEach(elem => {
                                machine.forEach(elem2 => {
                                    if(elem.id_mat === elem2.id && elem.id_mat === _materiel){
                                        info =  `Le rapport des suivis de dépannage du matériel identifié par ${elem2.id} ayant les caractéristiques suivantes: ${elem2.info}`;
                                        data2.push({
                                            date: elem.date,
                                            tech_name: elem.tech_name,
                                            info:elem2.info,
                                            local:elem2.local,
                                            diagnostique: elem.diagnostique
                                        })
                                    } 
                                });
                            });

                            if(data2.length>0){
                                data2.forEach(elem => {
                                    data.push([
                                        {text: `${moment(elem.date_dep).format('DD/MM/YYYY')}`, fontSize: 9, alignment: 'center'},
                                        {text: `${elem.tech_name}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem.info}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem.local}`, alignment: 'center', fontSize: 9},
                                        {text: `${elem.diagnostique}`, alignment: 'center', fontSize: 9},
                                    ]); 
                                });
        
                                let body = [
                                    [{text: 'Date', alignment: 'center', fontSize:10, bold:true },
                                    {text: 'Technicien', alignment: 'center', fontSize:10, bold:true },
                                    {text: 'Matériel', alignment: 'center', fontSize:10, bold:true },
                                    {text: 'Localité', alignment: 'center', fontSize:10, bold:true },
                                    {text: 'Diagnostique', alignment: 'center', fontSize:10, bold:true }]
                                ];
                                data.forEach(element => {
                                    body.push(element);
                                });
                                    
                                let docDefinition = {
                                    info: {
                                        title: 'SMMM ~ Dépannage',
                                        author: 'Laurenzio Sambany',
                                        subject: 'Liste des dépannages',
                                        keywords: 'keywords for document',
                                      },
                                      content: [
                                        {
                                            image: imageData,
                                            width: 80,
                                            height: 40,
                                            alignment:'center',
                                            margin:[0, 0, 180, 0]
                                        },
                                        {
                                            columns:[
                                                {
                                                    text:'Société de la Manutention des Marchandises\n',
                                                    style: 'Titre1'
                                               },
                                               {
                                                   text: 'Toamasina, le',
                                                   style:'Titre1_1'
                                               }      
                                            ]
                                        },
                                        {
                                            text: 'Conventionnelles\n',
                                            style:'Titre2'
                                       },
                                       {
                                            text: 'DEPARTEMENT INFORMATIQUE\n',
                                            style:'Sous_titre1'
                                        },
                                        {
                                            text: '*********\n\n',
                                            style:'ligne1'
                                        },
                                        {
                                            text: 'LISTE DES DEPANNAGES EFFECTUES\n',
                                            style:'Sous_titre2'
                                       },
                                       {
                                            text: '********************',
                                            style:'ligne2'
                                         },
                                         {
                                            text: `${info}\n\n`,
                                            style: 'info'
                                         },
                                       {
                                        style: 'all_depannage',
                                        table: {
                                            body: body,
                                        }
                                       }
                                    ],
                                    styles:{
                                        Titre1:{
                                            fontSize:8,
                                            italics: true,
                                            alignment: 'left',
                                            margin: [0, 0, 100, 0],
                                        },
                                        Titre1_1:{
                                            fontSize:9,
                                            alignment: 'center',
                                        },
                                        Titre2:{
                                            fontSize:8,
                                            italics: true,
                                            alignment: 'center',
                                            margin: [0, 0, 370, 0],
                                        },
                                        Sous_titre1:{
                                            bold:true,
                                            fontSize:8,
                                            alignment: 'center',
                                            margin: [0, 0, 370, 0],
                                        },
                                        ligne1:{
                                            alignment: 'center',
                                            margin: [0, 0, 370, 0],
                                        },
                                        Sous_titre2:{
                                            bold:true,
                                            alignment: 'center',
                                        },
                                        ligne2:{
                                            alignment: 'center',
                                        },
                                        all_depannage:{
                                            margin: [0, 20, 0, 0],
                                            alignment: 'justify',
                                        },
                                        info:{
                                            fontSize:9,
                                            margin: [0, 10, 0, 0],
                                            alignment: 'center',
                                        }
                                    },
                                  };
                                  let pdfDoc = pdfMake.createPdf(docDefinition);
                                    pdfDoc.getBase64((data)=>{
                                      res.writeHead(200, 
                                      {
                                          'Content-Type': 'application/pdf',
                                          'Content-Disposition':`attachment;filename="${filename}.pdf"`
                                      });
                                     
                                      const download = Buffer.from(data.toString('utf-8'), 'base64');
                                      res.end(download);
                                    });
                            }else{
                                res.json({msg:"error"})
                            }      
                        })
                    })
                })
            })
        }
    })
}