import express from "express";
import routerCart from "./routes/carts.routes.js";
import routerProd from "./routes/products.routes.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", routerProd);
app.use("/api/carts", routerCart);

app.listen(PORT, ()=>{
    console.log(`Listening on https://localhost:${PORT}`);
});