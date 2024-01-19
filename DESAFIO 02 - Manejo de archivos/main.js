import { promises as fs } from 'fs';

class ProductManager {

    static incrementId = 0;

    constructor() {
        this.products =[];
        this.path = './products.json';
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


        addProduct = async (title,description,price,img,code,stock) =>{

            if(!title || !description || !price || !img || !code || !stock){
                console.log("All fields are mandatory");
                return;
            };
            if(this.products.some(item => item.code === code)){
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
    
//Testing:

const manager = new ProductManager("./products.json");
//console.log(manager.getProducts());
//manager.addProduct("producto prueba","Esto es un producto de prueba",200,"Sin imagen","abc123",25);
//manager.addProduct("producto prueba 2","Esto es un producto de prueba",300,"Sin imagen","abc1234",25);
//manager.addProduct("producto prueba 3","Esto es un producto de prueba",100,"Sin imagen","abc1235",25);
//manager.getProductById(1);
//manager.updateProductById(1, {title: "Yerba Marolio"});
//manager.deleteProduct(2);