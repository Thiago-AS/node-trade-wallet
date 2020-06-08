const router = require("express").Router();
const stockModel = require("../models/stock");
const walletModel = require("../models/wallet");

router.post("/operation", async (req, res) => {
  const { userId, stockId, amount, ticker, price, operationType } = req.body;
  try {
    const wallet = await walletModel.findOne({ userId });
    if (wallet.stocks[stockId]) {
      wallet.stocks[stockId].averagePrice =
        operationType === "buy"
          ? (wallet.stocks[stockId].averagePrice *
              wallet.stocks[stockId].amount +
              price * amount) /
            (wallet.stocks[stockId].amount + amount)
          : (wallet.stocks[stockId].averagePrice *
              wallet.stocks[stockId].amount -
              price * amount) /
            (wallet.stocks[stockId].amount - amount);

      wallet.stocks[stockId].amount =
        operationType === "buy"
          ? wallet.stocks[stockId].amount + amount
          : wallet.stocks[stockId].amount - amount;
    } else {
      wallet.stocks[stockId] = {
        amount,
        ticker,
        averagePrice: price,
      };
    }
    wallet.markModified("stocks");
    wallet.history.push({
      ticker,
      amount,
      date: Date.now(),
      price,
      operationType,
      stockId
    });
    wallet.updatedAt = Date.now();
    console.log(wallet);
    await wallet.save();
    return res.status(200).send(wallet);
  } catch (err) {
    console.log(err);
    return res.status(400).send({});
  }
});

module.exports = (app) => app.use("/wallet", router);
