const Express = require('express')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Session = require('express-session')
const MongoDbSession = require('connect-mongodb-session')(Session)
const fs = require("fs");
const path = require("path");

const AuthRouter = require('./routes/Auth')
const BookingRouter = require('./routes/Bookings')
const OrderRouter = require('./routes/Orders')
const ProductRouter = require('./routes/Products')
const ServiceRouter = require('./routes/Services')
const UsersRouter = require('./routes/Users')

const app = Express()
const PORT = process.env.PORT || 5000
const MongoDbURI = process.env.MongoDbURI

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})

mongoose.connect(MongoDbURI)
.then(()=>console.log("Mongodb connected Successfully!"))
.catch(err=>console.log("Error in connecting to MongoDB:",err))

app.use(Express.json())
app.use(Express.urlencoded({extended: true}))
app.use(cors({
    origin: [`http://localhost:3000`, `https://asdstudio.vercel.app`, `http://192.168.0.110:3000`, `http://192.168.0.110:3001`, `http://192.168.0.34:5500`, `http://192.168.0.31:3000`],
    credentials: true
}))

app.use('/uploads', Express.static('uploads')); 

app.set("trust proxy", 1);

const Store = new MongoDbSession({
    uri: MongoDbURI,
    collection: 'session'
})

app.use(Session({
    secret: 'SKkey',
    saveUninitialized: false,
    resave: true,
    store: Store,
    // cookie: {
    //     secure: true,
    //     httpOnly: true,
    //     sameSite: 'none'
    // }
}))

app.use((req, res, next) => {
    next();
});

app.use(AuthRouter)
app.use(BookingRouter)
app.use(OrderRouter)
app.use(ProductRouter)
app.use(ServiceRouter)
app.use(UsersRouter)

app.get("/download/:filename", (req, res) => {
    const filePath = path.join(__dirname, "uploads", req.params.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    // Force download with correct headers
    res.setHeader("Content-Disposition", `attachment; filename="${req.params.filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    res.download(filePath, (err) => {
        if (err) {
            console.error("Error downloading file:", err);
            res.status(500).send("Error downloading file");
        }
    });
});