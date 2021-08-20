const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://neoscrum-dev.ivc3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    dbName:'neoscrum-dev',
    user:'matt-neo',
    pass:'LwCRjMyD3qPC6eBs',
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
}).then(() => {
    console.log(`Connected to Mongo Cluster neoscrum`);
}).catch(error => {
    console.log(`Eroor connecting to Mongo Cluster: ${error}\n`);
})
