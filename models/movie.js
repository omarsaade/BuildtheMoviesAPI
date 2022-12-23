const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

/*
define the shape of document in the collection
mongo schema
what we have here is the representation of our model in
 the application that's our persistent model thats what were going
to store as document in mongodb
*/
const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);
// validation when user send a data
function validateMovie(movie) {
  // what we here is what the client sends us
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;

// createMovie("Terminator", "63a4a3c09220403918c4cc19"); ref
// createMovie("Fast Five", new Genre({ name: "Action" })); emb
// createMovie("Dangerous","63a5ad51546ae031b4c86d95")

// 3-Hybrid approach
/*
let genre = {
  name: "Action",
  // 50 other properties
};

let movie = {
  genre: {
    id: "ref",
    name: "Action",
  },
};
*/
