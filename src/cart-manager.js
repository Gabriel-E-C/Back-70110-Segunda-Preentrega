import fs from "fs";

class CartManager {
    static id = 0;
    static arrayOfCarts = [];
    static path;

    constructor (path){
        CartManager.path = path;
        fs.writeFileSync(path,JSON.stringify(CartManager.arrayOfCarts, null, 2));
    };

    static async saveToFile () { //agregue static para ver si funciona llamandola como metodo de la clase
        try {
            //console.log ("Estoy dentro de saveToFile en cart-manager.js");
            //console.log (`Lo que debería haber dentro del archivo es ${JSON.stringify(CartManager.arrayOfCarts, null, 2)}`);
            await fs.promises.writeFile (CartManager.path, JSON.stringify(CartManager.arrayOfCarts, null, 2));
        } catch (error) {
            console.log (`Hay un error en saveToFile de product-manager.js. El error es ${error}`);
        }
    }

    static async readFromFile () {
        try {
            let fileContent = await fs.promises.readFile (CartManager.path, "utf-8");
            let answer = JSON.parse (fileContent);
            //console.log (`Estoy dentro de readFromFile. El contenido del archivo es: ${JSON.stringify(answer, null, 2)}`);
            return answer;
        } catch (error) {
            console.log (`Hay un error en readFromFile de product-manager.js. El error es ${error}`);
        }
    };

    async createNewCart () {
        
        let cart = {
            id : 0,
            products: []
        };

        CartManager.id++;
        cart.id = CartManager.id;
        CartManager.arrayOfCarts.push (cart);
        //console.log (`Estoy dentro de addCart en cart-manager.js el carrito se creó correctamente. El contenido del arreglo es ${JSON.stringify(CartManager.arrayOfCarts, null, 2)} `)
        await CartManager.saveToFile (); //Esto agregue
    };

    async getCartById (id) {
        try {
            let fileContent = await CartManager.readFromFile ()
            //let answer = CartManager.arrayOfCarts.find (elem => elem.id == id);
            let answer = fileContent.find (elem => elem.id == id);
            if (answer){
            console.log (`Estoy dentro de getCartById en cart-manager.js. El producto es: ${JSON.stringify(answer,null,2)}`);
            return answer;
            } else {
                console.log (`Estoy dentro de getcartById en cart-manager.js. No pude encontrar el carrito con el ID indicado.`)        
            }
        } catch (error) {
            console.log (`Estoy dentro de getCartById en cart-manager.js. Dio un error: ${error}`)
        }
    }

    async addProductsToCart (cartID, productID, quantity = 1) {
      
        //INTENTE HACERLO DE ESTA MANERA YA QUE FUE COMO LO VIMOS EN CLASE PERO NO FUNCIONABA DEBIDO A QUE
        //AL EJECUTAR LA PRIMER LINEA EL CARRITO A ACTUALIZAR SE COPIABA EN LA VARIABLE POR SEPARADO DEL ARREGLO DE CARRITOS
        //LUEGO HACIA TODO BIEN PERO AL FINAL NO ESTABA EN EL ARREGLO DE CARRITOS Y AL ESCRIBIRLO EN ARCHIVO EL ARREGLO DE CARRITOS NO SE HABIA MODIFICADO PARA NADA
        //SEGUIA CON LOS PRODUCTOS VACIOS. NO SE POR QUE SERA, SI TIENEN UNA RESPUESTA SE LOS AGRADECERIA.

        // let cartToUpdate = await CartManager.getCartById(cartID);
        // console.log(`Dentro de addProductsToCart. cartToUpdate tiene el valor ${JSON.stringify(cartToUpdate,null,2)}`);
        // let productToAdd = cartToUpdate.products.find (elem => elem.product == productID);
        // console.log(`Dentro de addProductsToCart. productToAdd tiene el valor ${JSON.stringify(productToAdd,null,2)}`);
                
        // try {
            
        //     if (productToAdd){
        //         productToAdd.quantity += quantity;
        //     } else {
        //         cartToUpdate.products.push({product:productID,quantity});
        //     }

        //     console.log(`Estoy en addProductsToCart antes del saveToFile. Lo que hay en arrayOfCarts es: ${JSON.stringify(CartManager.arrayOfCarts,null,2)}`)
        //     console.log(`Estoy en addProductsToCart antes del saveToFile. Lo que hay en cartToUpdate es: ${JSON.stringify(cartToUpdate,null,2)}`)
        //     await CartManager.saveToFile();
        //     return cartToUpdate;

        // } catch (error) {
        //     console.log (`Estoy dentro de addProductsToCart en cart-manager.js. Dio un error: ${error}`)
        // }
        
        let indexOfCartToUpdate = CartManager.arrayOfCarts.findIndex(elem => elem.id == cartID);
        //console.log(`Dentro de addProductsToCart. cartToUpdate tiene el valor ${JSON.stringify(cartToUpdate,null,2)}`);
        let productToAdd = CartManager.arrayOfCarts[indexOfCartToUpdate].products.find (elem => elem.product == productID);
        console.log(`Dentro de addProductsToCart. productToAdd tiene el valor ${JSON.stringify(productToAdd,null,2)}`);
                
        try {
            
            if (productToAdd){
                productToAdd.quantity += quantity;
            } else {
                CartManager.arrayOfCarts[indexOfCartToUpdate].products.push({product:productID,quantity});
            }
            //console.log(`Estoy en addProductsToCart antes del saveToFile. Lo que hay en arrayOfCarts es: ${JSON.stringify(CartManager.arrayOfCarts,null,2)}`)
            //console.log(`Estoy en addProductsToCart antes del saveToFile. Lo que hay en cartToUpdate es: ${JSON.stringify(cartToUpdate,null,2)}`)
            await CartManager.saveToFile();
            return CartManager.arrayOfCarts[indexOfCartToUpdate];

        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager.js. Dio un error: ${error}`)
        }
    }
}

export default CartManager;
