// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our Todo model
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the items
  app.get("/api/items/", function(req, res) {
    db.Item.findAll({})
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });

    // GET route for single item
    app.get("/api/items/:id", function(req, res) {
      db.Item.findOne({
        where: {
          id: req.params.id
        }
      })
        .then(function(dbItem) {
          res.json(dbItem);
        });
    });

    // GET route for getting all of the items that are either perishable or non-perishable
    app.get("/api/items/perishables/:filter", function(req, res) {
      db.Item.findAll({
        where: {
          perishable: req.params.filter
        }
      })
        .then(function(dbItem) {
          res.json(dbItem);
        });
    });

  // Get route for returning items that are perishable/non-perishable/all in specific location
  app.get("/api/items/:location/:filter", function(req, res) {
    db.Item.findAll({
      where: {
        location: req.params.location,
        perishable: req.params.filter
      }
    })
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });

  // Get route for retrieving item by location
  app.get("/api/items/location/all/:location", function(req, res) {
    db.Item.findAll({
      where: {
        location: req.params.location
      }
    })
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });

  // POST route for saving a new item
  app.post("/api/items", function(req, res) {
    console.log(req.body);
    db.Item.create({
      name: req.body.name,
      category: req.body.category,
      location: req.body.location,
      perishable: req.body.perishable,
      expiration: req.body.expiration,
      expiration_date: req.body.expiration_date,
      when_obtained: req.body.when_obtained,
      quantity: req.body.quantity,
      unit_type: req.body.unit_type
    })
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });

  // DELETE route for deleting items
  app.delete("/api/items/:id", function(req, res) {
    db.Item.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });

  // PUT route for updating items
  app.put("/api/items", function(req, res) {
    db.Item.update(req.body,
      {
        where: {
          id: req.body.id
        }
      })
      .then(function(dbItem) {
        res.json(dbItem);
      });
  });
};
