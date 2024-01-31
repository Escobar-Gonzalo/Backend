import { promises as fs} from "fs";

class CartManager {
    constructor(path){
        this.carts = [];
        this.path = path;
        this.cartId = 0;
        this.loadCarts();
    }

    loadCarts = async () => {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.cartId = Math.max( ...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error("Error loading the carts", error);
            await this.saveCarts();
        };
    };

    saveCarts = async () => {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error("Unnnable to save the carts", error);
            throw error;
        };
    };

    addCart = async () => {
        const newCart = {
            id: ++this.cartId,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    };

    getCartsById = async (cId) => {
        try {
            const cart = this.carts.find(cart => cart.id === cId);
            if (!cart) {
                console.log(`Cart with id:${cId} is not found`);
                return null;
            };
            return cart;
        } catch (error) {
            console.error("Unnable to obtain the cart", error);
            throw error;
        };
    };

    addProductToCart = async (cId, pId, quantity = 1) => {
        try{
            const cart = await this.getCartsById(cId);
            const product = cart.products.find(prod => prod.product === pId);
            if (product) {
                product.quantity += quantity;
            } else {
                cart.products.push( { product: pId, quantity } );
            };
            await this.saveCarts();
            return cart;
        } catch (error) {
            console.error("Unnable to add the product to the cart", error);
            throw error;
        };
    };
};

export default CartManager;