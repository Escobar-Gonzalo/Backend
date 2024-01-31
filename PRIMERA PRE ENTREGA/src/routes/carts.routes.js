import Router from "express";
import CartManager from "../controllers/cartManager.js";

const routerCart = Router();
const cManager = new CartManager("./src/models/carts.json");

routerCart.get("/:cId", async (req, res) => {
    const { cId } = req.params;
    try {
        const cart = await cManager.getCartsById(parseInt(cId));
        res.status(200).json(cart.products);
    } catch (error) {
        console.error("Unnable to obtain the cart", error);
        res.status(500).json( { error: "Internal server error"});
    };
});

routerCart.post("/", async (req, res) => {
    try {
        const newCart = await cManager.addCart();
        res.status(200).json(newCart);
    } catch (error) {
        console.error("Failed to add a new cart", error);
        res.status(500).json( { error: "Internal server error"});
    };
});

routerCart.post("/:cId/product/:pId", async (req, res) => {
    const { cId } = req.params;
    const { pId } = req.params;
    const quantity = req.body.quantity || 1;
    try {
        const cart = await cManager.addProductToCart(parseInt(cId), parseInt(pId), quantity);
        res.status(200).json(cart.products);
    } catch (error) {
        console.error("Unnable to add the product to the cart", error);
        res.status(500).json( { error: "Internal server error"});
    };
});

export default routerCart;

