const express = require('express')
const app = express();
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
const dotenv = require("dotenv");
const multer=require('multer')
const cors=require('cors')
const ConversationRouter=require('./routes/Conversation')
const Userrouter = require('./routes/users');
const Authrouter = require('./routes/auth');
const Feedrouter = require('./routes/Feed');
const path = require("path");
const MessagesRouter = require('./routes/Messages');
const { header } = require('express/lib/request');
dotenv.config();
//connection
mongoose.connect(process.env.MongodbURL, () => {
    console.log('connected to mongo')
})


//middleware
app.use(express.json())
app.use(cors({
  origin:'http://localhost:3000',
  // Policy:cross-origin,
  credentials:true,
  allowedHeaders:true
}))
app.use(helmet())
app.use(morgan('common'))
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
     
    } catch (error) {
      console.error(error);
    }
  });
app.use('/users',Userrouter)
app.use('/auth',Authrouter)
app.use('/feed',Feedrouter)
app.use('/conversation',ConversationRouter)
app.use('/messages',MessagesRouter)

//operations
app.get('/',(req,res)=>{
    res.send("Hello there!!!")
})
app.listen(5000, () => {
    console.log("port is running")
}) 