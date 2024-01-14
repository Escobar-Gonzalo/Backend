import { promises as fs } from "fs";

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
                console.error("There's no product yet")
            }
        };

        saveProducts = async () =>{
            try{
                await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
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

        updateProductById = async (pId, updatedInfo) => {
            const index = this.products.findIndex(product => product.id === pId);
            if (index === -1) {
                console.error(`Product with ID ${pId} not found`);
                return;
            }
            this.products[index] = {...this.products[index], ...updatedInfo };
            await this.saveProducts();
            console.log(`Product with ID ${pId} updated successfully`);
        };


        deleteProduct = async (pId) =>{
            const updateProducts = this.products.filter(item => item.id != pId);
            this.products = updateProducts;
            await this.saveProducts();
        };
        
            
};
    
//Testing:

//--Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager();
//--Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(manager.getProducts());
//--Se llamará al método “addProduct” con los campos especificados en la documentación.
//--El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
manager.addProduct("producto prueba","Este es un producto de prueba", 200, "Sin imagen", "abc123",25);
//--Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(manager.getProducts());
//--Agrego otros 2 productos para ver que el id no se repita y la busqueda sea correcta
manager.addProduct("producto prueba 02","Este es un producto de prueba", 300, "Sin imagen", "abc1234",25);
manager.addProduct("producto prueba 03","Este es un producto de prueba", 100, "Sin imagen", "abc12345",25);
//--chequeo que se hayan agregado correctamente
console.log(manager.getProducts());
//--Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
console.log(manager.getProductById(2));
//--Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
manager.updateProductById(1, { title: "Yerba Marolio" });
//--Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
manager.deleteProduct(1);