import { promises as fs } from 'fs';

class ProductManager {

    static incrementId = 0;

    constructor(path) {
        this.products =[];
        this.path = path;
    };

        loadProducts = async () => {
            try{
                let products = JSON.parse(await fs.readFile(this.path, 'utf-8'))
                return products;
            } catch (error){ 
                console.log("🚀 ~ ProductManager ~ loadProducts= ~ There's no product yet", console.error("There's no product yet"))
            }
            
        };

        saveProducts = async (array) =>{
            try{
                await fs.writeFile(this.path, JSON.stringify(array,null,2));
                console.log("🚀 ~ ProductManager ~ saveProducts= ~ Products saving succes!");
            }catch(error){
                console.log("🚀 ~ ProductManager ~ saveProducts= ~ Error saving the products:", console.error('Error saving the products'))
            };
        };


        addProduct = async ({title,description,price,img,code,stock}) =>{
            const productsArray = await this.loadProducts();
            if(!title || !description || !price || !img || !code || !stock){
                console.log("All fields are mandatory");
                return;
            };
            if(productsArray.some(item => item.code === code)){
                console.log(`The code ${code} already exist`);
                return;
            };

            const newProduct = {
                id: ++ProductManager.incrementId,
                title,
                description,
                price,
                img,
                code,
                stock
            };

            this.products.push(newProduct);
            console.log(this.products);
            await this.saveProducts(this.products)
        };

        getProducts =  async () =>{
            const products = await this.loadProducts();
            console.log(products);
            return products;
        };

        async getProductById(pId){
            const products = await this.loadProducts();
            const product = products.find(product => product.id === pId);
            if(!product){
                console.error("Product not found");
            }else{
                console.log("🚀 ~ ProductManager ~ getProductById ~:", console.log(product))
                return product;
            };
        };

        updateProductById = async (pId, updatedInfo) => {
            const products = await this.loadProducts();
            const index = products.findIndex(product => product.id === pId);
            if (index === -1) {
                console.error(`Product with ID ${pId} not found`);
                return;
            }
            products[index] = {...products[index], ...updatedInfo };
            console.log("🚀 ~ ProductManager ~ updateProductById=:", products[index])
            await this.saveProducts(products);
            console.log(`Product: ${products[index]} updated successfully`)
        };

        deleteProduct = async (pId) =>{
            const products = await this.loadProducts();
            let productFound = await this.getProductById(pId);
            if(productFound){
                const updateProducts = products.filter(item => item.id != pId);
                await this.saveProducts(updateProducts);
            }
        };
};

export default ProductManager;
