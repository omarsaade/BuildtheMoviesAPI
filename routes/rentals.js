/*


                    Hybird Approach


*/

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  // -   yaane kbir lal sgir
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  //1
  rental = await rental.save();
  // here we could have a problem..we have 2 separate operations
  // its possible that after we save the rental something goes wrong
  //maybe our server crushes or connection to mongodb drops.
  //so perhaps the second operation will not complete
  // that's were we need a transaction
  // so with transaction we can ensure that both these operations
  //will update the state of our data in database or none of them
  //will be applied. so they are atomic they both complete or they both
  //role back
  // concept of transaction
  // in mongodb we dont have this concept..there is technique that called
  // two face commit which is beyond
  // so lets see a npm package that simulate a transaction in mongoose
  movie.numberInStock--;
  //2
  movie.save();

  res.send(rental);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
