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
            };
        };

        saveProducts = async (arrayProducts) =>{
            try{
                let existingData = [];
                    try{
                        const data = await fs.readFile(this.path, "utf-8");
                        existingData = JSON.parse(data);
                    }catch (error){
                        console.log("Error todos vamos a morir", error);
                    };

                const newProducts = arrayProducts.filter((newProduct)=> !existingData.some((existingProduct)=> existingProduct.code === newProduct.code));

                existingData.push(...newProducts);
                await fs.writeFile(this.path, JSON.stringify(existingData, null, 2));
                console.log("Products saving successfully!");
            }catch(error){
                console.error("An error has occur, try again", error);
            };
        };

        addProduct = async ({title,description,price,img,code,stock}) =>{  
            let products = await this.loadProducts();
            const isRepeat = products.some((product)=>product.code === code);
            if(isRepeat) {
                console.log(`The product with code: ${code} already exist`);
                return;
            };
            if(!title || !description || !price || !img || !code || !stock){
                console.log("All field are mandatory");
                return;
            };
            if(!isRepeat){
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
                await this.saveProducts(this.products);
                return newProduct;
            };
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

