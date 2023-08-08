import { promises as fs } from 'fs'

export class ProductManager {
  constructor(path) {
    this.path = path
    // this.products = []
  }

  async initializeProducts() {
    try {
      const productData = await fs.readFile(this.path, 'utf-8')
      this.products = JSON.parse(productData)
    } catch (error) {
      console.error("Se produjo un error al leer el archivo de productos:", error.message)
    }
  }

  async addProduct(product) {
    try {
      await this.initializeProducts()

      if (this.products.some(prod => prod.code === product.code)) {
        console.log(`El producto con ese código ya existe: ${product.code}`)
        return
      }

      if (product.title === "" || product.description === "" || product.price === "" || product.thumbnail === "" || product.code === "" || product.stock < 0) {
        console.log("Todos los campos son obligatorios")
        return
      } else {
        this.products.push(product)
      }

      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
      console.error("Error al agregar el producto:", error.message)
    }
  }

  async getProducts() {
    try {
      await this.initializeProducts()
      return this.products
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error.message)
    }
  }

  async getProductById(id) {
    try {
      await this.initializeProducts()
      return this.products.find(prod => prod.id === id) // Devuelve el producto encontrado
    } catch (error) {
      console.error("Ha ocurrido un error al obtener el producto por ID:", error.message)
      return null
    }
  }
  

  async updateProduct(id, title, description, price, thumbnail, code, stock) {
    try {
      await this.initializeProducts()

      if (!id || !title || !description || !price || !thumbnail || !code || !stock) {
        console.error("Todos los campos son obligatorios para actualizar el producto")
        return
      } else {
        const codigoRepetido = this.products.find(elemento => elemento.code === code)

        if (codigoRepetido && codigoRepetido.id !== id) {
          console.error("El código del producto está repetido")
          return
        } else {
          this.products = this.products.map(elemento => {
            if (elemento.id === id) {
              return {
                ...elemento,
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
              }
            } else {
              return elemento
            }
          })

          await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        }
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error.message)
    }
  }

  async deleteProduct(id) {
    try {
      await this.initializeProducts()

      this.products = this.products.filter(prod => prod.id != id)

      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
    } catch (error) {
      console.error("Error al eliminar el producto:", error.message)
    }
  }
}

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.stock = stock
    this.id = Product.incrementID()
  }

  static idIncrement = 1

  static incrementID() {
    return this.idIncrement++
  }
}

// const product = new Product("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25)

 const productManager = new ProductManager("./src/productos.txt")

// testeo de producto
async function prueba() {
  // await productManager.addProduct(product)
  // await productManager.getProducts()
  // await productManager.updateProduct(1, "producto de prueba modificado", "producto modificado", 201, "prenda.jpg", "abc123", 12)
  // await productManager.getProducts()
  // await productManager.deleteProduct(1)
  await productManager.getProducts()
}

// prueba()
