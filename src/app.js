import express from 'express'
import { ProductManager } from './ProductManager.js'

const app = express()
const PORT = 4000
app.use(express.urlencoded({extended:true}))
const productManager = new ProductManager("./src/productos.txt")


app.get('/products', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit)
    const productos = await productManager.getProducts()

    if (!isNaN(limit)) {
      res.json(productos.slice(0, limit))
    } else {
      res.json(productos)
    }
  } catch (error) {
    res.status(500).send('Error al obtener la lista de productos')
  }
})

app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid)
    const producto = await productManager.getProductById(productId)

    if (producto) {
      res.json(producto)
    } else {
      res.status(404).send('Producto no encontrado')
    }
  } catch (error) {
    res.status(500).send('Error al obtener el producto')
  }
})

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`)
})
