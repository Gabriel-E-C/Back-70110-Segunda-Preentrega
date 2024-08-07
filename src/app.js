import Express from "express";
import productRouter from "./routes/product.routes.js";
import cartsRouter from "./routes/cart.routes.js";
import exphbs from "express-handlebars";

const app = Express();
const PUERTO = 8080;

//Middleware
app.use(Express.json());
app.use(Express.urlencoded({extended: true}));

//Configuracion de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine","handlebars")
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);

app.listen(PUERTO,() => {
    console.log (`El servidor está escuchando en el puerto: ${PUERTO}`)
});