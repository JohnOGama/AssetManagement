/* -------------------------------------------------------------------------- */
/*                                See Info Below                              */
/*               Write Updates , Activities and Comments Below                */
/*                              Before Coding                                 */
/* -------------------------------------------------------------------------- */


/* 

Info : The routes was made and controlled by Jinshin 
        The current Author can add and update the routes

   Date : 10 / 24 / 23
    Author : Nole
    Activities
    Purpose : 
      Import sqlStatement(/_sqlstatement/Four Grpahs) controller
*/

// Packages
const mysql = require('../database')
const jwt = require('jsonwebtoken')
const { randomUUID } = require('crypto')

// Date helper
const { utils_getDate } = require('../utils/date_helper')

const {
    getTotal_Assets,
    getCount_Assets_Deployed,
    getCount_Assets_Available,
    getCount_Assets_ForDeploy,
    getCount_Assets_PullOut

  }  = require('../_sqlstatement/FourGraphs')

  const fourgraphs_TotalAssetsAvailable = ( request, response ) => {
    
    mysql.query(getTotal_Assets(),  ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )
         response.status(200).send(
             {
                 message: "Records Found",
                 result
             }
         )

    })

}

const fourgraphs_NoAssetsDeployed = ( request, response ) => {
    
    mysql.query(getCount_Assets_Deployed(),  ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )

         response.status(200).send(
             {
                 message: "Records Found",
                 result
             }
         )

    })

}

const fourgraphs_AssetsAvailable = ( request, response ) => {
    
    mysql.query(getCount_Assets_Available(),  ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )

         response.status(200).send(
             {
                 message: "Records Found",
                 result
             }
         )

    })

}

const fourgraphs_AssetsForDeploy = ( request, response ) => {
    
    mysql.query(getCount_Assets_ForDeploy(),  ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )

         response.status(200).send(
             {
                 message: "Records Found",
                 result
             }
         )

    })

}

const fourgraphs_AssetsPullout = ( request, response ) => {
    
    mysql.query(getCount_Assets_PullOut(),  ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Records Found",
                message2: err.message
            }
        )

         response.status(200).send(
             {
                 message: "Records Found",
                 result
             }
         )

    })

}


module.exports = {
    fourgraphs_TotalAssetsAvailable,
    fourgraphs_NoAssetsDeployed,
    fourgraphs_AssetsAvailable,
    fourgraphs_AssetsForDeploy,
    fourgraphs_AssetsPullout
}