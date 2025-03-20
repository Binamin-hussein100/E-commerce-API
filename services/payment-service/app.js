const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const paymentRoutes = require("./src/routes/paymentRoute") 
// const { swaggerUi, swaggerDocs } = require('./src/config/swagger'); 


// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(compression());


const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
  
}));

// Routes
app.use("/payments", paymentRoutes)

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/',(req,res)=>{
    console.log(process.env.DATABASE_URL)
    res.send("Hello: DONE")
  })  

module.exports = app;

// 