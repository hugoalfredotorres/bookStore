const express=require ("express");
const router=express.Router(); // esto es un metodo para generar las rutas

// endpoints (rutas) que lista todos losproductos
router.get("/", (req, res)=>{
    res.send("listados de todos los libros")
})

// endpoints (rutas) que lista un solo producto
router.get("/libro", (req, res)=>{
    res.send("danza de dragoes-cancion de hielo y fuego")
})

// endpoints (rutas) que agregam un solo producto
router.post ("/newBook", (req, res)=>{
   /* const newBook=req.body.title
    const bookPrice=req.body.price*/  // para no tener varios campso se hace desectruturado

    const {title,price}=req.body;
    res.send(` el nuevo libro se llama: ${title} || su valor es de : ${price}`)
})



module.exports=router;
