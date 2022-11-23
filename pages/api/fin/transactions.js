import Transactions from "../../../models/Transactions";
import Users from "../../../models/Users";

export default async function handler(req, res) {
  try {
    const transactions = await Transactions.find({});

    const userIDarr = transactions.map((t, i) => t.user_id);
    const usersNames = await Users.find({ _id: { $in: userIDarr } }, "name");

    const fromIDarr = transactions.map((t, i) => t.user_id);
    const fromNames = await Users.find({ _id: { $in: fromIDarr } }, "name");
    const each_transaction = transactions.map((t) => t);

    let transactionsData = [];

    for (let i = 0; i < each_transaction.length; i++) {
      let indexOfName = usersNames.findIndex(
        (x) => x._id == each_transaction[i].user_id
      );
      let indexOfFrom = fromNames.findIndex(
        (x) => x._id == each_transaction[i].from_id
      );
      console.log("usersNames", usersNames);
      //   user_id: { type: String },
      //   from_id: { type: String },
      //   type: { type: Number },
      //   amount: { type: Number },
      //   transactedAt: { type: Number },
      transactionsData.push({
        _id: each_transaction[i]._id,
        user_id: each_transaction[i].user_id,
        user_name: usersNames[indexOfName].name,
        from_name: fromNames[indexOfFrom].name,
        from_id: each_transaction[i].from_id,
        type: each_transaction[i].type,
        amount: each_transaction[i].amount,
        transactedAt: each_transaction[i].transactedAt,
      });
    }

    res.status(200).json({
      success: true,
      data: transactionsData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: [],
      message: error.message,
    });
  }
}
