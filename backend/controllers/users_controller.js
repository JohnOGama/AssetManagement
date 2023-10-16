/* 

    Date : 10 / 13 / 23
    Author : Jinshin
    Activities
    Purpose : 
      JWT is added: To update your node_modules, simple type in the terminal " npm install " to automatically install jsonwebtoken
      imported = const jwt = require('jsonwebtoken')
      Initialized: const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '7d' }  )
      Note: Add SECRET in the env file. ( e.g: SECRET = 1234 ) output = process.env.SECRET

------------------

    Date : 10 / 14 / 23
    Author : Jinshin
    Activities
    Purpose : 
      bcryptjs is added:
      imported: compare password = const { compare_password } = require('../utils/password_helper')
   
------------------      

      Date : 10 / 16 / 23
    Author : Jinshin
    Activities
    Purpose : 
      Added:
          - verifyUserToken

*/


// Packages
const mysql = require('../database')
const jwt = require('jsonwebtoken')
const { randomUUID } = require('crypto')
const { compare_password, hash_password } = require('../utils/password_helper')


// Date helper
const { utils_getDate } = require('../utils/date_helper')

// An instance to register a new user
const createUser = ( request, response ) => {

    const id = randomUUID() 
    const { username, email, password , positionID, categoryID } = request.body

    if( !username ) return response.status(400).send( { message: "Username is required" } )

    const stmt = "INSERT INTO tblUsers(userDisplayID,username,email,password,displayName,positionID,groupTypeID,isRegister,dateCreated) values (?)";
    const display = "Set your Display Name"
    const iRegister = '1'
    const values = [
        id,
        username,
        email,
        password,
        display,
        positionID,
        categoryID,
        iRegister,
        utils_getDate()
    ];
    
    mysql.query( stmt, [values], ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "Insert Error",
                message2: err.message
            }
        )
        
        response.status(200).send(
            {
                message: "Insert Success"
            }
        )

    })

}

// An Instance to logged a user in
const loginUser = ( request, response ) => {

    const { username, password } = request.body

    const checkUser = "select password from tblusers where username = ?"

    mysql.query( checkUser, [ username ], ( err, result ) => {
        
        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err
            }
        )
 
        const isValid = compare_password( password, result[0].password )

        if( !isValid ) return response.status(400).send(
            {
                message: "Password is incorrect"
            }
        )

        const stmt = "SELECT users.userDisplayID,users.displayName,CONCAT(users.lastname ,', ', users.firstname) as Name,"
        + "users.email,users.imgFilename,userCategory.categoryName as userRole,department.departmentDisplayID,"
        + "department.departmentName,users.password FROM tblUsers users"
        + " inner join tblUserCategory userCategory on users.groupTypeID = userCategory.categoryID"
        + " inner join tblPositions positions on positions.positionDisplayID = users.positionID"
        + " inner join tblDepartments department on department.departmentDisplayID = positions.departmentDisplayID"
        + " where users.username = ? and users.password = ? and users.active=1"

        mysql.query( stmt, [ username, result[0].password ], ( err, result ) => {

            if( err || !result.length ) return response.status(404).send(
                {
                    message: "No Record Found",
                    message2: err
                }
            )
    
            const token = jwt.sign( { result }, process.env.SECRET, { expiresIn: '1d' }  )
    
            response.status(200).send(
                {
                    message: "Record Found",
                    token
                }
            )
    
        })

    })

}


const verifyUserToken = ( request, response, next ) => {

    const { token } = request.body

    if( !token ) return response.status(401).send(
        {
            message: "Invalid token"
        }
    )

    try {
        
        const isValid = jwt.verify( token, process.env.SECRET )

        response.status(200).send("Token is valid")

        next()

    } catch (error) {

        if( error.name.includes("JsonWebTokenError") ) return response.status(400).send(
            {
                message: "Token Is Invalid",
                error
            }
        )

        if( error.name.includes("TokenExpiredError") ) return response.status(400).send(
            {
                message: "Token Is Expired",
                error
            }
        )

    }

}

// An Instance to get all the users
const getAllUsers = ( request, response ) => {

    const stmt = "SELECT users.userDisplayID as id,usercategory.categoryName,positions.positionName,"
    + "concat(users.lastname,', ' , users.firstname) as fullname,department.departmentName,"
    + "users.displayName,users.email,users.active"
    + " FROM tblUsers users"
    + " INNER JOIN tblUserCategory usercategory on usercategory.categoryID COLLATE utf8mb4_unicode_ci = users.groupTypeID"
    + " INNER JOIN tblPositions positions on positions.positionDisplayID COLLATE utf8mb4_unicode_ci = users.positionID"
    + " INNER JOIN tblDepartments department on department.departmentDisplayID COLLATE utf8mb4_unicode_ci = positions.departmentDisplayID"
    + " where users.active = 1"
    + " ORDER BY fullname"

    mysql.query( stmt, [], ( err,result ) => {

        if( err || !result.length ) return response.status(404).send(
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

// An Instance to get all the users by lastname
const getAllUsersByLastname = ( request, response ) => {

    const stmt = "SELECT * FROM tblUsers ORDER BY lastname";

    mysql.query( stmt, [], ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "No Record Found",
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

// An Instance to get users by active
const getUserByActive = ( request, response ) => {

    const stmt = "SELECT userDisplayID, concat(lastname,', ' , firstname) as fullname FROM tblUsers where active = 1";

    mysql.query( stmt, [], ( err, result) => {

        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Found",
                result
            }
        )

    })

}

// An Instance to get a user's profile
const getUserProfile = ( request, response ) => {

    const { userid } = request.params

    const stmt = "SELECT a.groupTypeID,b.categoryName,a.positionID,a.firstname,a.lastname,a.displayName,"
    + "a.email,a.imgFilename FROM tblUsers a INNER JOIN tblUserCategory b ON a.groupTypeID = b.categoryID " 
    + "WHERE a.userDisplayID = ?";

    mysql.query( stmt, [ userid ], ( err, result ) => {
        
        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Profile Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Profile Found",
                result
            }
        )

    })

}

// An Intance to update a user
const updateUserProfile = ( request, response ) => {

    const { userDisplayID } = request.params

    const {

        firstname,
        lastname,
        email,
        positionID,
        categoryID,
        displayname

    } = request.body

    const stmt = "UPDATE tblUsers SET `firstname` = ?,`lastname`= ?,`email`= ?,positionID = ?,"  
    + "`groupTypeID` = ?,`displayName`= ?,`updatedBy`=?,`dateUpdated`=? WHERE `userDisplayID` = ?";

    mysql.query( stmt, [
        firstname,
        lastname,
        email,
        positionID,
        categoryID,
        displayname,
        userDisplayID,
        utils_getDate()
    ], ( err, result ) => {

        if( err ) return response.status(400).send(
            {
                message: "Upload Error",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Upload Success"
            }
        )

    })

}

// An Instance to delete an old user data by ID
const deleteOldUserById = ( request, response ) => {

    const { irowSelectedID } = request.params

    const stmt = "UPDATE tblUsers SET active = 0 where userDisplayID = ?"

    mysql.query( stmt, [ irowSelectedID ], ( err, result ) => {

        if( err || !result.changedRows ) return response.status(404).send(
            {
                message: "No Record Deactivated",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Deactivated"
            }
        )

     })

}

// An Instance to delete all the old users data
const deleteAllOldUsers = ( request, response ) => {

    const { rowId } = request.body

    const stmt = "SELECT * FROM tblUserAssetDetails details"
    + " inner join tblAssetStatus stat on stat.assetStatusID COLLATE utf8mb4_unicode_ci = details.assetStatusID"
    + " where (stat.statusName = 'Deployed' or stat.statusName = 'For Deploy') "
    + " and details.userSelectedID = ?"

    mysql.query( stmt, [ rowId ], (err,result) => {

        if( err || !result.length ) return response.status(404).send(
            {
                message: "No Record Found",
                message2: err.message
            }
        )

        response.status(200).send(
            {
                message: "Record Found",
                result
            }
        )

     })

}




module.exports = {
    createUser,
    loginUser,
    verifyUserToken,
    getAllUsers,
    getAllUsersByLastname,
    getUserByActive,
    getUserProfile,
    updateUserProfile,
    deleteOldUserById,
    deleteAllOldUsers
}