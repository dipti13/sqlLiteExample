const express = require("express");
let cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
let { open } = require("sqlite");

const app = express();
const port = process.env.port || 3030;

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: "./sqlLiteExample/database.sqlite",
    driver: sqlite3.Database,
  });
})();

//Restaurents API's
async function fetchRestaurantsById(id) {
  let query = " SELECT * FROM restaurants WHERE id = ?";
  const response = await db.all(query, [id]);
  return { restaurants: response };
}
app.get("/restaurants/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchRestaurantsById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "Restaurant not found with id " + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cusine) {
  let query = " SELECT * FROM restaurants WHERE cuisine = ?";
  let response = await db.all(query, [cusine]);
  return { restaurants: response };
}
app.get("/restaurants/cuisine/:cuisine", async (req, res) => {
  try {
    let cuisine = req.params.cuisine;
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: "No restaurant found with cuisine " + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    "SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ? ";
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
app.get("/restaurants/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let hasOutdoorSeating = req.query.hasOutdoorSeating;
    let isLuxury = req.query.isLuxury;
    let result = await fetchRestaurantByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury,
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function sortByRating() {
  let query = "SELECT * FROM restaurants ORDER BY rating DESC";
  let response = await db.all(query);
  return { restaurants: response };
}
app.get("/restaurants/sort-by-rating", async (req, res) => {
  try {
    let result = await sortByRating();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchAllRestaurants() {
  let query = " SELECT * FROM restaurants";
  const response = await db.all(query, []);
  return { restaurants: response };
}
app.get("/restaurants", async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: "Restaurants not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Dishes API's
async function fetchDishesById(id) {
  let query = " SELECT * FROM dishes WHERE id = ?";
  const response = await db.all(query, [id]);
  return { dishes: response };
}
app.get("/dishes/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let result = await fetchDishesById(id);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: "Dish not found with id " + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchDishesByFilter(isVeg) {
  let query = "SELECT * FROM restaurants WHERE isVeg = ?";
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}
app.get("/dishes/filter", async (req, res) => {
  try {
    let isVeg = req.query.isVeg;
    let result = await fetchDishesByFilter(isVeg);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function sortByPrice() {
  let query = "SELECT * FROM dishes ORDER BY price";
  let response = await db.all(query);
  return { restaurants: response };
}
app.get("/dishes/sort-by-price", async (req, res) => {
  try {
    let result = await sortByPrice();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  let query = " SELECT * FROM dishes";
  const response = await db.all(query, []);
  return { dishes: response };
}
app.get("/dishes", async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: "Dishes not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
