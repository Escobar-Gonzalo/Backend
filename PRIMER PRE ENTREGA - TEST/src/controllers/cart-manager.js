const fs = require("fs").promises;
const ProductManager = require("./product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.ultId = 0;
        this.cargarCarritos();
    }

    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            } else {
                this.ultId = 0;
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error);
            await this.guardarCarritos();
        }
    }

    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };
        this.carts.push(nuevoCarrito);
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    async getCarritoById(cartId) {
        try {
            const carrito = this.carts.find(c => c.id === cartId);
            if (!carrito) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }else{
                console.log(`Mostrando carrito con id ${carrito.id}`)
                return carrito;
            }
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }

    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        try{
            const carrito = await this.getCarritoById(cartId);
            const product = await productManager.getProductById(parseInt(productId));
            const existeProductoEnCarrito = carrito.products.find(p => p.product === productId);

            if (!product){
            console.log(`El producto con ID:${productId} no existe`);
            return;
            }
            if(!carrito){
                console.log(`El carrito con ID ${cartId} no existe`);
                return;
            }
            if (existeProductoEnCarrito) {
            existeProductoEnCarrito.quantity += quantity;
            } else {
            carrito.products.push({ product: productId, quantity });
            }
            await this.guardarCarritos();
            return carrito;
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            throw error;
        }
    }
}

module.exports = CartManager;