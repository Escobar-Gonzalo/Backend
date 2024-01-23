import express from "express";
import ProductManager from "./ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());

const manager = new ProductManager("./src/products.json");

app.get("/", (req,res)=>{
    res.status(200).send("Welcome to my first wonderfull server");
})

app.get("/products", async (req,res)=>{
    const {limit} = req.query;
    const products = await manager.getProducts();
    limit ? res.status(200).send(products.slice(0,limit)) : res.status(200).send(products);
})

app.get("/products/:pId", async (req,res)=>{
    let pId = req.params.pId
    const product = await manager.getProductById(parseInt(pId));
    product ? res.status(201).send(product) : res.status(404).send(`Product with id:${pId} not founded`);
})

app.post("/products", async (req,res)=>{
    const newProduct = req.body;
    await manager.addProduct(newProduct);
    res.status(201).send({status:"success", message: "Product added successfully "})
})

app.listen(PORT, ()=>{
    console.log(`Listening on https://localhost:${PORT}`);
});



