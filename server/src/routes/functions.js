const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const axios = require("axios");
const { Categoria, Producto } = require("../db.js");

// Get categories FROM firebase and save then into DB
const getCategories = async () => {
  const a = await Categoria.findAll();
  if (a.length === 0) {
    const response = await axios.get(
      "https://ecommerce-gld-default-rtdb.firebaseio.com/.json"
    );

    let category = response.data.Productos.map((e) => e.categoria);

    let result = [...category];

    result.forEach(async (e) => {
      const [category, created] = await Categoria.findOrCreate({
        where: { nombre: e },
      });
    });

    let allCategoriesDb = await Categoria.findAll();
    allCategoriesDb = allCategoriesDb.map((obj) => obj.nombre);
    return allCategoriesDb;
  } else {
    let allCategoriesDb = await Categoria.findAll();
    allCategoriesDb = allCategoriesDb.map((obj) => obj.nombre);
    return allCategoriesDb;
  }
};

// Get products FROM firebase and save then into DB
const getProductsFireBase = async () => {
  const a = await Producto.findAll();
  if (a.length === 0) {
    let response = await fetch(
      `https://ecommerce-gld-default-rtdb.firebaseio.com/.json`
    );
    let commits = await response.json();

    commits.Productos.forEach(async (e) => {
      const [instance, created] = await Producto.findOrCreate({
        where: { nombre: e.nombre },
        defaults: {
          URL: e.URL,
          marca: e.marca,
          precio: e.precio,
          stock: e.stock,
        },
      });

      let DatabaseCategory = await Categoria.findOne({
        where: { nombre: e.categoria },
      });
      instance.addCategoria(DatabaseCategory);
    });
  } else {
    let allProductsDb = await Producto.findAll();
    return allProductsDb;
  }
};

// Get Created Products from DB
const getDataBaseProducts = async () => {
  await getProductsFireBase();

  let allProductsDB = await Producto.findAll({
    include: [
      {
        model: Categoria,
        attributes: ["nombre"],
        through: { attributes: [] },
      },
    ],
  });

  allProductsDB.forEach((e) => {
    let newArr = e.dataValues.categoria.map((e) => e.nombre);
    e.dataValues.categoria = newArr.join(", ");
  });

  return allProductsDB;
};

module.exports = {
  getProductsFireBase,
  getCategories,
  getDataBaseProducts,
};
