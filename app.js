/**
 * Created by Phanou on 25/03/2019.
 */
require ( 'babel-register' );
const bodyParser = require ( 'body-parser' );
const express = require ( 'express' );
const app = express ();
const {success,erreur}= require ( './functions' );
const config = require ( './config' );
const morgan = require ( 'morgan' );
const mysql = require ( 'mysql' );

let Routeur = express.Router ();
let db = mysql.createConnection ( {
    host : 'localhost' ,
    database : 'nan' ,
    user : 'root' ,
    password : ''
} );
let dbconnect = false;
db.connect ( ( err )=> {
    "use strict";
    if ( err )  res.json(erreur( err.message ));
    else {
        dbconnect = true;
        console.log ( 'connected to database succesfully !' )
    }
} );
app.use ( morgan ( 'dev' ) );
app.use ( bodyParser.json () );
app.use ( bodyParser.urlencoded ( { extended : true } ) );

Routeur.route ( '/list' )
    .get ( ( req , res )=> {
    "use strict";
    if ( dbconnect ) {

        db.query ( 'SELECT * FROM `article`' , ( err , result )=> {
            let data = [];
            let _data = [];
            if ( err ) {
                res.json ( erreur ( err.message ) )

            }
            else {
                for ( let i = 0 ; i < result.length ; i++ ) {
                    result[i].ingredients=result[ i ].ingredients.split ( ',' )

                }

                return res.json(success(result))
            }
        } )
    }
} );

Routeur.route ( '/connex' )
    .post ( ( req , res )=> {
    "use strict";
    let data = [
        req.body.email ,
        req.body.password
    ];
    if ( dbconnect ) {
        db.query ( 'SELECT * FROM `personne` WHERE emails=? AND passwords=?' , data , ( err , response )=> {
            if ( err ) {
                res.json ( erreur ( 'veuillez vous reconnecter' ) );
            } else {
                if ( response[ 0 ] == undefined ) {
                    res.json ( erreur ( 'vos information de connexion sont erroner' ) )
                } else {
                    res.json ( success ( response[ 0 ] ) );
                }
            }
        } )
    }
} );
Routeur.route ( '/menbre' )
    .post ( ( req , res )=> {
    "use strict";
    let data = [
        req.body.nom ,
        req.body.prenom ,
        req.body.email ,
        req.body.date ,
        req.body.password ,
        req.body.pseudo
    ];

    if ( dbconnect ) {
        db.query ( 'INSERT INTO `personne` (`noms`,`prenoms`,`emails`,`dates`,`passwords`,`pseudos`) VALUES(?,?,?,?,?,?)' , data , ( err , response )=> {

            if ( err ) {
                res.json ( erreur ( 'il y a un probleme avec votre inscription' ) )
            } else {
                res.json ( success ( response.insertId ) )
            }
        } )
    }

} );

Routeur.route ( '/' );

app.use ( config.rootAPI , Routeur );
app.listen ( config.port , ()=> console.log ( 'started on port: ' + config.port ) );
