/* Packages*/
const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const {Server} = require("socket.io");




const app = express();
const appRoutes = require('./server/routes/app_routes');
const directionRoutes = require('./server/routes/direction_routes');
const departementRoutes = require('./server/routes/departement_routes');
const serviceRoutes = require('./server/routes/service_routes');
const userRoutes = require('./server/routes/user_routes');
const error = require('./server/controllers/404');
const materielRoutes = require('./server/routes/materiel_routes');
const pdrRoutes = require('./server/routes/pdr_routes');
const utilisationRoutes = require('./server/routes/utilisation_routes');
const messageRoutes = require('./server/routes/message_routes');
const depannageRoutes = require('./server/routes/depannage_routes');
const modificationRoutes = require('./server/routes/modification');

/* Required to use the file .env */
dotenv.config({ path: ".env" });

/* Required to use Morgan */
app.use(logger('dev'));


/* Set view engine  */
app.set("view engine", "ejs");
app.set('views', 'views');

/* Parse Request to bodyParser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* load assets folder */
app.use(express.static(path.join(__dirname, "/assets")));

/* set the path of the jquery file to be used from the node_module jquery & sweetalert2 package */
app.use('/jquery', express.static(path.join(__dirname + '/node_modules/jquery/dist/')));
app.use('/sweetalert', express.static(path.join(__dirname + '/node_modules/sweetalert2/dist/')));

/* set the path of socket.io to the client side */
app.use('/socket', express.static(path.join(__dirname + '/node_modules/socket.io/client-dist/')));

/* CKEditor */
app.use('/ckeditor', express.static(path.join(__dirname + '/node_modules/ckeditor4/')));

/* bootstrap-notify */
app.use('/notify',  express.static(path.join(__dirname + '/node_modules/bootstrap-notify/')));

/* Splidejs */
app.use('/splidejs', express.static(path.join(__dirname + '/node_modules/@splidejs')));

/* momentjs */
app.use('/moment', express.static(path.join(__dirname + '/node_modules/moment/dist')));

/* bootstrap file input */
app.use('/bootstrap-fileinput', express.static(path.join(__dirname + '/node_modules/bootstrap-fileinput')));

/* Required to read cookies */
app.use(cookieParser());

/* Configuring the express-session middleware */
app.use(session({
    secret: 'Secret session',
    resave: true,
    saveUninitialized: true
}));

let app_server = app.listen(process.env.PORT, () => {
    console.log(`The server is running on http://${process.env.HOST}:${process.env.PORT}`);
})

/* Set the socket's configuration */
//creating socket io instance
const io = new Server(app_server);

var users = [];
io.on('connection', (socket)=>{
    console.log("New user connected " + socket.id);

    //socket to store user connected on the plateform
    socket.on("user_connected", (user)=>{
            if(users.length == 0){
                user.socketId = socket.id;
                users.push(user);
            }else{
                let n = 0;
                users.forEach(_user => {
                    if(_user.id == user.id){
                      _user.socketId = socket.id;
                    }else n++;
                });

                if(n === users.length){
                    user.socketId = socket.id;
                    users.push(user);
                }
            }
       
		io.emit("user_connected", user);
	});

    //get All User Connected
    socket.on("get_userConnected", (cb)=>{
        console.log(users);
		return cb(users);
	});

    //Update user connected after log out
    socket.on("log_out", (user)=>{
        let data = [];
        console.log(users);

        users.forEach(_user => {
            if(_user.id !== user.id){
             data.push(_user);
            }
        });

        users = data;
        console.log(data);
        io.emit("get_user", users);
    })

    //Send Message
    socket.on("send_message", (data)=> {
        console.log(data);
		let receiver_socketId = '';
        users.forEach(user => {
            if(user.id == data.receiver){
                receiver_socketId = user.socketId;
            }
        });
		socket.to(receiver_socketId).emit("new_message", data);
	});

});

/* Routes */
app.use(appRoutes);
app.use(directionRoutes);
app.use(departementRoutes);
app.use(serviceRoutes);
app.use(userRoutes);
app.use(materielRoutes);
app.use(pdrRoutes);
app.use(utilisationRoutes);
app.use(messageRoutes);
app.use(depannageRoutes);
app.use(modificationRoutes);
app.use(error.get404);