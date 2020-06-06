const mongoose = require("mongoose");

mongoURL = process.env.DB_URL || "mongodb://localhost/trade-wallet";
mongoose.connect(
  mongoURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  },
  err => {
    if (err) console.log(`[ERROR] ${err}`);
    else console.log("[INFO] Mongo connected successfuly");
  }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;