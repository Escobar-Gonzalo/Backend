class ProductManager {

    static incrementId = 0;

    constructor() {
        this.products =[];
    }

        addProduct(title,description,price,img,code,stock){

            if(!title || !description || !price || !img || !code || !stock){
                console.log("All fields are mandatory");
                return;
            };
            if(this.products.some(item => item.code === code)){
                console.log("The code already exist");
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
};
    

//Testing:

//Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager();
//Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(manager.getProducts());
//Se llamará al método “addProduct” con los campos especificados en la documentación.
manager.addProduct("producto prueba", "Esto es un producto prueba", 200, "Sin imagen", "abc123", 25);
//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE.
//Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado.
console.log(manager.getProducts());
//Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
manager.addProduct("producto prueba", "Esto es un producto prueba", 200, "Sin imagen", "abc123", 25);
//Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo.
console.log(manager.getProductById(1));
console.log(manager.getProductById(5));