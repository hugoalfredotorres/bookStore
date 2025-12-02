// mini crud de usuarios auth

const fs = require("fs"); //modulo sirve para poder trabajar con archivos. leer-escribir-borrar-etc
const path = require("path"); // modulo para hacer transferen a ubicacione o construir la rutade la ubicacion del recurso

const filePath = path.resolve(__dirname, "../data/users.json"); // aqui es la ruta donde guardo o leo mis datos

// leer usuarios
const readUsers = () => {
  const data = fs.readFileSync(filePath, "utf8"); // leee de manera asincro la info en users.json
  return JSON.parse(data); // funcion de parsearla json-convierto a un obj de js
};

// escribir usuarios

const writeUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2)); // creo un usuario y escribo el doc entero
};


// getallusers-- para ver todos los usuarios

const getAllusers=(req, res)=>{

    try {
      const users= readUsers();
      if(users.length===0){    //pregunto si la long es cero ... es xq no hay usuarios
        return res.status(404).json({
          ok:false,
          message:"No hay Usuarios en la base de datos"
        })
      }
       return res.status(200).json({
        ok:true,
        message: "lista de usuarios obtenida de base de datos",
        data:{
          length: users.length, // le digo cuantos usuarios son
          users,                // los usuarios mismos
        }

       })

  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
    
  }
}


// funcion para registrar los usuarios y validar que NO este vacio
const register = (req, res) => {
  try {
    const { email, password } = req.body;
    // validamos que llegue la info basica
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: " email y password son requeridos",
      });
    }

    // funcion para leer los ususarios y validar que el email NO este en uso
    const users = readUsers(); // leo los usuarios
    const exist = users.find((u) => u.email === email); // recorre los email y compara con el email que vino de req body
    if (exist) {
      return res.status(409).json({
        ok: false,
        message: " el usuario ya existe",
      });
    }

    // crear un objeto  el usuario con su info

    const newUser = {
      id: crypto.randomUUID(), // ide usuario unico con random
      email,
      password,
    };
    // sumo el nuevo ususario al array de usuario
    users.push(newUser);
    // sobre escribir el json con la info de usuarios actualizado
    writeUsers(users);
    // luego envio una repuesta al front
    return res.status(201).json({
      ok: true,
      message: "usuario registrado con exito",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });

    // error de comunicacion 500
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // validamos que llegue la info basica
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: " email y password son requeridos",
      });
    }

    const users=readUsers(); // funcion auxiliar que nos permite leer los usuariso
    const user=users.find(
      (u) =>u.email===email && u.password===password
    );
    if(!user){
      return res.status(401).json({
        ok:false,
        message:"credenciales incorrectas !!!"

      })
    }
    return res.status(200).json({
      ok:true,
      message:"login exitoso",
      user:{
        id:user.id , email:user.email
      }
       });

    
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
    
  }


};
// delete user-borrar un usuario

const deleteUser=(req, res)=>{

  try {

    //const {id}=req.params; // lineas para chekear que la toma del parametros desp de la barra/
    //return res.send(id);// aqui devuelvo el id del parametro

    const {id}=req.params; // capturamos el id que viaja en el parametro de la ruta
    const users= readUsers();
    const exist=users.find ((u) => u.id===id); 
    if(!exist){    //pregunto si no existe ese usurio con el id
        return res.status(404).json({
          ok:false,
          message:"usuario no encontrado"
        })
      }
      const filtered=users.filter((u)=> u.id!=id);
      writeUsers(filtered);


return res.status(200).json({
      ok:true,
      message:"usuario eliminado correctament",
      deleteUser:{
        id:exist.id,
        email:exist.email
      }
       });


       

  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
    
  }
}


module.exports = {
  register,
  login,
  getAllusers,
  deleteUser,
};
