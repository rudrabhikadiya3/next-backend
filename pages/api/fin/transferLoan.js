import Borrowers from "../../../models/Borrowers";
import Lenders from "../../../models/Lenders";
import Users from "../../../models/Users";
import dbConnect from "../../../helper/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  if (req.method == "POST") {
    try {
      const body = await JSON.parse(req.body);
      console.log("transLoanBody", body);
      const {
        loan_amount,
        borrower_id,
        lender_id,
        borrowReq_id,
        duration,
        intrest,
      } = body;

      let borrowers = await Borrowers.findOne({ _id: borrowReq_id });
      if (borrowers.status === 0) {
        // create lender
        const lender = await Lenders.create({
          borrower_id: borrower_id,
          lender_id: lender_id,
          loan_amount: loan_amount,
          duration: duration,
          intrest: intrest,
          status: 1,
          ApprovedAt: Date.now(),
        });

        const changeStatus = await Borrowers.updateOne(
          { _id: borrowReq_id },
          { status: 1 }
        );

        let borrowers = await Borrowers.findOne({ _id: borrowReq_id });
        if (borrowers.status === 1 && changeStatus.acknowledged) {
          // transfer amount
          const debitToLender = await Users.updateOne(
            { _id: lender_id },
            { $inc: { balance: -loan_amount } }
          );

          const creditToBorrower = await Users.updateOne(
            { _id: borrower_id },
            { $inc: { balance: loan_amount } }
          );
          res.status(200).json({
            success: true,
            message: "Loan amount has been transfered",
          });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Loan request already approved" });
        }
      } else {
        res
          .status(400)
          .json({ success: false, message: "Loan request already approved" });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  } else {
    // pass data
    try {
      const lenders = await Lenders.find({});

      const userIDarr = lenders.map((b, i) => b.borrower_id);
      const usersNames = await Users.find({ _id: { $in: userIDarr } }, "name");
      const each_lender = lenders.map((b) => b);

      let lendersData = [];

      for (let i = 0; i < each_lender.length; i++) {
        let index = usersNames.findIndex(
          (x) => x._id == each_lender[i].borrower_id
        );
        lendersData.push({
          _id: each_lender[i]._id,
          borrower_id: each_lender[i].borrower_id,
          lender_id: each_lender[i].lender_id,
          name: usersNames[index].name,
          loan_amount: each_lender[i].loan_amount,
          intrest: each_lender[i].intrest,
          duration: each_lender[i].duration,
          status: each_lender[i].status,
          ApprovedAt: each_lender[i].ApprovedAt,
        });
      }

      res.status(400).json({ success: true, data: lendersData });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: `Something went wrong in GET` });
    }
  }
}
