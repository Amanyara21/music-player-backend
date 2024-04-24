const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
const auth = require('./routes/auth');
const song = require('./routes/song');
const cookieParser = require('cookie-parser');


connectToMongo();
const app = express()
const port = 5000

app.use(cookieParser());
app.use(express.static('public'));

app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    return res.json({"okk":"okk"})
})
app.use('/api', auth)
app.use('/api/', song)

 
app.listen(port, () => {
    console.log(`Server start at http://localhost:${port}`)
})