import Borrowers from "../../../models/Borrowers";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  try {
    const borrowers = await Borrowers.find({});

    const userIDarr = borrowers.map((b, i) => b.borrower_id);
    const usersName = await Users.find({ _id: { $in: userIDarr } }, "name");
    const each_borrower = borrowers.map((b) => b);

    let borrowersData = [];

    for (let i = 0; i < each_borrower.length; i++) {
      let index = usersName.findIndex(
        (x) => x._id == each_borrower[i].borrower_id
      );

      borrowersData.push({
        _id: each_borrower[i]._id,
        borrower_id: each_borrower[i].borrower_id,
        name: usersName[index].name,
        borrowAmount: each_borrower[i].borrowAmount,
        intrest: each_borrower[i].intrest,
        duration: each_borrower[i].duration,
        files: each_borrower[i].files,
        status: each_borrower[i].status,
        createdAt: each_borrower[i].createdAt,
      });
    }

    res.status(201).json({ status: true, data: borrowersData });
  } catch (error) {
    res.status(201).json({ status: false, data: error.message });
  }
}
