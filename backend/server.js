/** Comments
 *  Date : 10/12/23 
    Author : Nole
    Activities 
    Purpose : Create new server.js class
            Initiate the DB Connection
            app.listen(process.env.PORT,() => {..}

--------------------

    Date : 10 / 12 / 23
    Author : jinshin
    Activities
    Purpose : 
            - remove mysql package ( e.g: const mysql = require('mysql2') )
            - imported userRoutes = const usersRoutes = require('./routes/users_routes')
            - to use the userRoutes = app.use('/api', usersRoutes)
            - Imported positionsRoutes = const positionsRoutes = require('./routes/positions_routes')
            - to use the positionsRoutes = app.use('/api', positionsRoutes)
            - Imported categoriesRoutes = const categoriesRoutes = require('./routes/categories_routes')
            - to use the categoriesRoutes = app.use('/api', categoriesRoutes)

    Date : 10 / 15 / 23
    Author : jinshin
    Activities
    Purpose : 
            - imported : const logsRoutes = require('./routes/log_routes')
            - Used : app.use('/api', logsRoutes)
            - imported : const departmentRoutes = require('./routes/department_routes')
            - Used : app.use('/api', departmentRoutes)

    Date : 10 / 16 / 23
    Author : jinshin
    Activities
    Purpose : 
        configured:
            - app.use(cors(
                {
                        origin: "*" // changed to wildcard temporarily
                }
              ));

 */

// Packages
require('dotenv').config()
var express = require("express");
var cors = require('cors');

// Routes
const usersRoutes = require('./routes/users_routes')
const positionsRoutes = require('./routes/positions_routes')
const categoriesRoutes = require('./routes/categories_routes')
const departmentRoutes = require('./routes/department_routes')
const logsRoutes = require('./routes/log_routes')
const asset_status_routes = require('./routes/asset_status_routes')

// Server Initialization
var app = express();

// Middlewares
app.use(express.json());
app.use(cors(
        {
                origin: "*"
        }
));

app.get("/",(req,res) => 
{
    res.json("Hello Test")
}
)


app.listen(process.env.PORT,() => {
    
    console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}/`)
}
);

// Api's Routes
app.use('/api', usersRoutes)
app.use('/api', positionsRoutes)
app.use('/api', categoriesRoutes)
app.use('/api', departmentRoutes)
app.use('/api', logsRoutes)
app.use('/api', logsRoutes)
app.use('/api', asset_status_routes)