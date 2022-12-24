/*


                    Hybird Approach


*/

const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
// class
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();

Fawn.init(mongoose);

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
  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      // .remove()
      .run();
    res.send(rental);
  } catch (error) {
    res.status(500).send("Something failed");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;

/*





  //1
  rental = await rental.save();
  //bel relational database fi 3ana el concept of transactions
  //but in mongodb we dont have transaction...
  // there is technique that called
  // two phase commit which is beyond the scope of this course
  //thats an advanced topic related to mongodb
  // so lets see a npm package that simulate a transaction in mongoose.
  //
  //
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


*/
