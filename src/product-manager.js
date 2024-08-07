import fs from "fs";
import { title } from "process";

class ProductManager {
    static id = 0;
    static arrayOfProducts = [];
    static path;

    constructor (path){
        ProductManager.path = path;
        fs.writeFileSync(path,JSON.stringify(ProductManager.arrayOfProducts, null, 2));
    };

    static async saveToFile () { //agregue static para ver si funciona llamandola como metodo de la clase
        try {
            // console.log ("Estoy dentro de saveToFile en product-manager.js");
            // console.log (`Lo que debería haber dentro del archivo es ${JSON.stringify(ProductManager.arrayOfProducts, null, 2)}`);
            await fs.promises.writeFile (ProductManager.path, JSON.stringify(ProductManager.arrayOfProducts, null, 2));
        } catch (error) {
            console.log (`Hay un error en saveToFile de product-manager.js. El error es ${error}`);
        }
    }

    static async readFromFile () {
        try {
            let fileContent = await fs.promises.readFile (ProductManager.path, "utf-8");
            let answer = JSON.parse (fileContent)
            //console.log (`Estoy dentro de readFromFile. El contenido del archivo es: ${JSON.stringify(answer, null, 2)}`);
            return answer;
        } catch (error) {
            console.log (`Hay un error en readFromFile de product-manager.js. El error es ${error}`);
        }
    };

    async addProduct ({title, description, code, price, status = true, category, thumbnails}) {

        if (!title || !description || !code || !price || !category) {
            console.log ("Estoy dentro de addProduct en product-manager.js y falta un campo obligatorio para poder agregar el producto.")
            console.log (`Title: ${title}, Descritpion: ${description}, Code: ${code}, Price: ${price}, Category: ${category}`)
            return console.log ("Producto no agregado.")
            //return console.log ("Estoy dentro de addProduct en product-manager.js y falta un campo obligatorio para poder agregar el producto.")
        }

        let product = {
            id : 0,
            title,
            description,
            code,
            price,
            status,
            category,
            thumbnails
        };

        //console.log (`Estoy dentro de addProduct antes de agregar el producto. Deberia agregar ${JSON.stringify(product,null,2)} `)

        if (!ProductManager.arrayOfProducts.some(elem => elem.code == code)){
            ProductManager.id++;
            product.id = ProductManager.id;
            ProductManager.arrayOfProducts.push (product);
            //console.log (`Estoy dentro de addProduct en product-manager.js el producto se agregó correctamente. El contenido del arreglo es ${JSON.stringify(ProductManager.arrayOfProducts, null, 2)} `)
            await ProductManager.saveToFile (); //Esto agregue
        } else {
            return console.log (`Estoy dentro de addProduct en product-manager.js. El codigo esta repetido. El producto no se agrego. `)
        }
    };

    async getProducts () { // Este metodo devuelve el array con los objetos dentro. No en fomato string.
        let answer = await ProductManager.readFromFile ();
        //console.log (`Esto es getProducts ${JSON.stringify(answer, null, 2)}`);
        return (answer)
        //return (JSON.parse(answer));
    };

    async getProductById (id) {
        try {
            let fileContent = await ProductManager.readFromFile ()
            //let answer = ProductManager.arrayOfProducts.find (elem => elem.id == id);
            let answer = fileContent.find (elem => elem.id == id);
            if (answer){
            //console.log (`Estoy dentro de getProductById en product-manager.js. El producto es: ${JSON.stringify(answer,null,2)}`);
            return answer;
            } else {
                console.log (`Estoy dentro de getProductById en product-manager.js. No pude encontrar el producto con el ID indicado.`)        
            }
        } catch (error) {
            console.log (`Estoy dentro de getProductById en product-manager.js. Dio un error: ${error}`)
        }
    }

    async deleteProductById (id){
        try {
            let loQueHayEnArchivo = await ProductManager.readFromFile();
            ProductManager.arrayOfProducts = loQueHayEnArchivo;
            //let answer = ProductManager.arrayOfProducts.findIndex (elem => elem.id == id);
            let answer = loQueHayEnArchivo.findIndex (elem => elem.id == id); 
            // console.log (`Estoy dentro de deleteProductById en product-manager.js. El indice del elemento a borrar es: ${answer}`);
            // console.log (`Estoy dentro de deleteProductById en product-manager.js. El arreglo queda asi: ${JSON.stringify(ProductManager.arrayOfProducts,null,2)}`)
            //loQueHayEnArchivo = await fs.promises.readFile (ProductManager.path, "utf-8");
            //console.log (`Estoy dentro de deleteProductById. Lo que hay en el archivo antes de guardar es: ${loQueHayEnArchivo}`);
            //loQueHayEnArchivo.splice (answer, 1);
            ProductManager.arrayOfProducts.splice (answer, 1);
            await ProductManager.saveToFile ();
            //loQueHayEnArchivo = await fs.promises.readFile (ProductManager.path, "utf-8");
            //console.log (`Estoy dentro de deleteProductById. Lo que hay en el archivo despues de guardar es: ${loQueHayEnArchivo}`);
            return ProductManager.arrayOfProducts;
        } catch (error) {
            console.log (`Estoy en el catch dentro de deleteProduct en product-manager.js. El error es el siguiente: ${error}`)
        }
    }
    
    async modifyProduct (id, dataToUpdate){ //Modificar este metodo para que no se pueda cambiar el indice o el codigo si este ultimo ya se encuentra en el arreglo
        let indexOfProductToBeModified = ProductManager.arrayOfProducts.findIndex (elem => elem.id == id);
        let keys = dataToUpdate.keys;

        console.log (`En modifyProduct los valores a modificar son: ${JSON.stringify(keys, null, 2)}`);
        // if (dataToUpdate.keys.every (elem => elem == "id")){
        //     return console.log (`No se puede modificar el id del producto`)
        // };

        if (indexOfProductToBeModified == -1) {
            return console.log ("Estoy dentro de modifyProduct en product-manager.js. Y no se encontro el producto que se quiere modificar.");
        } else {
            ProductManager.arrayOfProducts [indexOfProductToBeModified] = {...ProductManager.arrayOfProducts [indexOfProductToBeModified],...dataToUpdate}; //De esta forma solo se actualizan los campos del objeto que se pasen con el mismo nombre que los campos que habia
            console.log (`El producto ha sido modificado: ${JSON.stringify(ProductManager.arrayOfProducts[indexOfProductToBeModified], null, 2)}`);        // Tengo que encontrar una forma de validar que si un campo es nuevo o distinto no se haga el update
            await ProductManager.saveToFile ();
            return ProductManager.arrayOfProducts
        }   
    }
}

export default ProductManager;
