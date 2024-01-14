const fs = required("fs").promises;

class ProductManager {

    static incrementId = 0;

    constructor() {
        this.products =[];
        this.path = './products.json';
        this.loadProducts();
    };

        loadProducts = async () => {
            try{
                this.products = JSON.parse(await fs.readFile(this.path, 'utf-8'));
            } catch (error){ 
                console.error("Error loading the products")
            }
        };

        saveProducts = async () =>{
            try{
                await fs.writeFile(this.path, JSON.stringify(this.products));
                console.log("Products saving succes!");
            }catch(error){
                console.erros('Error saving the products');
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
            
            await this.saveProducts()
        };

        getProducts(){
            return this.products;
        };

        getProductById(pId){
            const product = this.products.find(product => product.id === pId);
            if(!product){
                console.error("Product not found");
            }else{
                console.log(product);
            };
        };

        updateProduct = async(id,title,description,price,img,code,stock) =>{
            const index = this.products.findIndex(item => item.id === id);

            if(index != -1){
                this.products[index].title = title
                this.products[index].description = description
                this.products[index].price = price
                this.products[index].img = img
                this.products[index].code = code
                this.products[index].stock = stock
                await this.saveProducts();
            }else{
                console.error("Product not found");
            };

        subProduct = async (pId) =>{
            const newProducts = this.products.filter(item => item.id != pId);
            this.products.push(newProducts);
            await this.saveProducts();
            };
        };    
};
    