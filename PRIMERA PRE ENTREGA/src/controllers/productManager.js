import { promises as fs } from "fs";

class ProductManager {
    
    static prodId = 0;

    constructor(path){
        this.path = path;
    }

    loadProducts = async () => {
        try {
            const res = await fs.readFile(this.path, "utf-8");
            if (!res.trim()) {
                console.log("The file is empty or has invalid content");
                return [];
            }
            const products = JSON.parse(res);
            return products;
        } catch (error) {
            console.error("Error loading the products", error.message);
            throw error;
        }
        /*
        try{
            const res = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(res);
            return products;
        } catch (error) {
            console.error("Error loading the products", error);
            throw error;
        };*/
    };

    saveProducts = async (productsArray) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(productsArray, null, 2));
        } catch (error) {
            console.error("Unnnable to save the products", error);
            throw error;
        };
    };

    addProduct = async (title, description, code, price, stock, category, img) => {
        try{
            const products = await this.loadProducts();

            if (!title || !description || !code || !price || !stock || !category || !img) {
                console.log("All fields are mandatory");
                return;
            } 
            if (products.some(prod => prod.code === code)) {
                console.log(`Code ${code} already in use. Try again`);
                return;
            }

            const newProduct = {
                title,
                description,
                code,
                price,
                stock,
                category,
                img: [] || img,
                status: true,
            };

            if (products.length > 0) {
                ProductManager.prodId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            }

            newProduct.id = ++ProductManager.prodId;

            products.push(newProduct);
            await this.saveProducts(products);

        } catch (error) {
            console.error("Something went wrong adding the new product", error);
            throw error;
        }
    };

    getProducts = async () => {
        try{
            const products = await this.loadProducts();
            return products;
        } catch (error) {
            console.error("Unnable to get the products", error);
            throw error;
        }
    };

    getProductsById = async (pId) => {
        try{
            const products = await this.loadProducts();
            const product = products.find(prod => prod.id === pId);
            if (!product) {
                console.log(`Product with id:${pId} is not found`);
                return null;
            } else {
                console.log("Search successful! :)");
                return product;
            };
        } catch (error) {
            console.error("Unnable to obtain the product", error);
            throw error;
        };
    };

    updateProduct = async (pId, updatedInfo) => {
        try {
            const products = await this.loadProducts();
            const index = products.findIndex(prod => prod.id === pId);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedInfo };
                await this.saveProducts(products);
                console.log("Product updated successfully!");
            } else {
                console.log(`Product with id:${pId} is not found`);
            }
        } catch (error) {
            console.error("Unnable to update the current product", error);
            throw error;
        };
    };

    deleteProduct = async (pId) => {
        try{
            const products = await this.loadProducts();
            const index = products.findIndex(prod => prod.id === pId);
            if (index !== -1) {
                products.splice(index, 1);
                await this.saveProducts(products);
                console.log("The selected product was successfully deleted");
            } else {
                console.log(`Product with id:${pId} is not found`);
            }
        } catch (error) {
            console.error("Something went wrong deleting the product", error);
            throw error;
        }
    };
};

export default ProductManager;