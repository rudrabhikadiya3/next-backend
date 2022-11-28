import Lenders from "../../../models/Lenders";
import Users from "../../../models/Users";
export default async function handler(req, res) {
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

    res.status(200).json({ success: true, data: lendersData });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: `Something went wrong in GET` });
  }
}
