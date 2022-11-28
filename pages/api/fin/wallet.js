import dbConnect from "../../../helper/DBconnect";
import Users from "../../../models/Users";
import Transactions from "../../../models/Transactions";
export default async function handler(req, res) {
  dbConnect();

  try {
    const { userID, addedAmount } = req.body;
    const addBalance = await Users.updateOne(
      { _id: userID },
      { $inc: { balance: addedAmount } }
    );
    const creditInUser = await Transactions.create({
      user_id: userID,
      from_id: "Wallet Reload",
      type: 1,
      amount: addedAmount,
      transactedAt: Date.now(),
    });
    const findUser = await Users.findOne({ _id: userID }, "balance");
    res.status(200).json({
      success: true,
      balance: findUser.balance,
      message: `$${addedAmount} has been credited in your account`,
    });
  } catch (err) {
    res.status(200).json({ success: false, message: err.message });
  }
}
