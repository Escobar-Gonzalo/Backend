import Router from "express";
import ProductManager from "../controllers/productManager.js";

const routerProd = Router();
const pManager = new ProductManager("./src/models/products.json");

routerProd.get("/", async (res, req) => {
    const { limit } = req.query;
    try {
        const products = await pManager.getProducts();
        if(products){
            limit ? res.status(200).json(products.slice(0, limit)) : res.status(200).json(products);
        }else{
            res.status(400).send("No hay productos creados");
        }
    } catch (error) {
        console.error("Unnable to obtain the products", error);
        res.status(500).json( { error: "Internal server error"});
    };
});

routerProd.get("/:pId", async (req, res) => {
    const { pId } = req.params;
    try{
        const product = await pManager.getProductsById(parseInt(pId));
        if (!product) {
            return res.status(404).json( {error: "Product not found"});
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Unnable to obtain the product", error);
        res.status(500).json ( { error: "Internal server error"});
    };
});

routerProd.post("/", async (res, req) => { 
    const newProduct = req.body;
    try {
        await pManager.addProduct(newProduct);
        res.status(200).json( { message: "Product added successfully"} );
    } catch (error) {
        console.error("Unnable to add the product", error);
        res.status(500).json( { error: "Internal server error"});
    };
});

routerProd.put("/:pId", async (req, res) => {
    const { pId } = req.params;
    const updatedInfo = req.body;
    try {
        await pManager.updateProduct(parseInt(pId), updatedInfo);
        res.status(200).json( { message: "Product updated successfully!"});
    } catch (error) {
        console.error("Unnable to update the current product", error);
        res.status(500).json({ error: "Internal server error"});
    };
});

routerProd.delete("/:pId", async (req, res) => {
    const { pId } = req.params;
    try {
        await pManager.deleteProduct(parseInt(pId));
        res.status(200).json({ message: "The selected product was successfully deleted"});
    } catch (error) {
        console.error("Something went wrong deleting the product", error);
        res.status(500).json({ error: "Internal server error"});
    };
});

export default routerProd;