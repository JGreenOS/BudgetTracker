const router = require("express").Router();
const Transaction = require("../models/transaction.js");

router.post("/api/transaction", ({ body }, res) => {
Transaction.create(body)
.then(dbTransaction => {
    res.json(dbTransaction);
})//end of .then function
  .catch(err => {
      res.status(400).json(err);
  }); //end of .catch 
});
//end of router single post function

router.post("/api/transaction/bulk", ( { body }, res) => {
    Transaction.insertMany(body)
    .then(dbTransaction => {
        res.json(dbTransaction);
    })//end of .then transation
    .catch(err => {
        res.status(400).json(err);
    }) //end of .catch function

});//end of arrow function for bulk insert

router.get("/api/transaction", (req, res) => {
    Transaction.find( {} )
    .sort({ date: -1 })
    .then(dbTransaction => {
        res.json(400).json(err);

    });//end of .then

});//end of router.get route for sort  by date

module.exports = router;