const { default: mongoose } = require('mongoose')
const app = require('./app')
require('dotenv').config()

const db_url = process.env.MONGODB_URI
const port = process.env.PORT

app.listen(port,()=>{console.log(`Server Connected On Port ${port}`);
})

mongoose.connect(db_url).then(()=>{console.log("DB CONNECT SUCCESSFULY");
}).catch((err)=>{console.log("can't connect to the db due to this",err);
})