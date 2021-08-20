const app = require('./src/app');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const port = process.env.PORT || 3000;

//swagger
const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title:"Neoscrum-API",
            version:"1.0.0",
            description:"A simple Express application using MongoDB"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT"
          },
        }
      },
    apis: ["./src/routers/*router.js"]
}
const specs = swaggerJsdoc(options)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
)

app.listen(port, ()=>{
    console.log(`Server up and running on ${port}`);
})