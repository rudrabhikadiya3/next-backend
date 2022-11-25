import Borrowers from "../../../models/Borrowers";
import Lenders from "../../../models/Lenders";
import Collateral from "../../../models/Collateral";
import Users from "../../../models/Users";
import Transactions from "../../../models/Transactions";
import dbConnect from "../../../helper/DBconnect";

export default async function handler(req, res) {
  dbConnect();
  if (req.method == "POST") {
    try {
      const body = await JSON.parse(req.body);
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

        let borrower = await Borrowers.findOne({ _id: borrowReq_id });
        if (borrower.status === 1 && changeStatus.acknowledged) {
          // transfer loan to borrower from lender
          const debitToLender = await Users.updateOne(
            { _id: lender_id },
            { $inc: { balance: -loan_amount } }
          );

          const creditToBorrower = await Users.updateOne(
            { _id: borrower_id },
            { $inc: { balance: loan_amount } }
          );
          // record money transaction
          const debitFromLender = await Transactions.create({
            user_id: lender_id,
            from_id: borrower_id,
            type: 0,
            amount: loan_amount,
            transactedAt: Date.now(),
          });
          const creditInBorrower = await Transactions.create({
            user_id: borrower_id,
            from_id: lender_id,
            type: 1,
            amount: loan_amount,
            transactedAt: Date.now(),
          });

          // lender involve in colleteral
          const collateral_status = await Collateral.updateOne(
            { borrow_id: borrowReq_id },
            { child_owner_id: lender_id, status: 1 }
          );
          // start deducting intrest
          if (collateral_status.acknowledged) {
            console.log("lender", lender);

            const {
              loan_amount,
              intrest,
              borrower_id,
              _id,
              duration,
              ApprovedAt,
            } = lender;

            let attemp = 0;
            let auto = setInterval(async () => {
              const borrower = await Users.findOne(
                { _id: borrower_id },
                "balance"
              );
              const lenderStatus = await Lenders.findOne(
                { _id: _id },
                "status"
              );
              let total_intrest = (loan_amount * intrest) / 100;
              if (borrower.balance > 0) {
                // const loanExTime = ApprovedAt + duration * 36e5;
                const loanExTime = ApprovedAt + duration * 60000; // 1min
                if (Date.now() >= loanExTime) {
                  if (
                    borrower.balance >=
                    Number(loan_amount) + Number(total_intrest)
                  ) {
                    // loan principle amount repayment
                    const debitFromBorrower = await Users.updateOne(
                      { _id: borrower_id },
                      { $inc: { balance: -loan_amount - total_intrest } }
                    );

                    const creditToLender = await Users.updateOne(
                      { _id: lender_id },
                      {
                        $inc: {
                          balance: Number(loan_amount) + Number(total_intrest),
                        },
                      }
                    );
                    const changeBorrowStatus = await Borrowers.updateOne(
                      { _id: borrowReq_id },
                      { status: 2 }
                    );
                    const changeLenderStatus = await Lenders.updateOne(
                      { _id: _id },
                      { status: 2 }
                    );

                    const changeCollateralOwner = await Collateral.updateOne(
                      { borrow_id: borrowReq_id },
                      { status: 2 }
                    );
                    clearInterval(auto);
                  } else {
                    // borrower cant pay principal
                    attemp++;
                    if (attemp >= 4) {
                      const debitFromBorrower = await Users.updateOne(
                        { _id: borrower_id },
                        { $inc: { balance: -borrower.balance } }
                      );

                      const creditToLender = await Users.updateOne(
                        { _id: lender_id },
                        {
                          $inc: {
                            balance: borrower.balance,
                          },
                        }
                      );

                      const changeBorrowStatus = await Borrowers.updateOne(
                        { _id: borrowReq_id },
                        { status: 3 }
                      );
                      const changeLenderStatus = await Lenders.updateOne(
                        { _id: _id },
                        { status: 3 }
                      );

                      const changeCollateralOwner = await Collateral.updateOne(
                        { borrow_id: borrowReq_id },
                        {
                          owner_id: lender_id,
                          child_owner_id: borrower_id,
                          status: 3,
                        }
                      );
                      clearInterval(auto);
                    }
                  }
                } else {
                  if (lenderStatus.status === 1) {
                    console.log("intrest", -total_intrest);
                    const debitFromBorrower = await Users.updateOne(
                      { _id: borrower_id },
                      { $inc: { balance: -total_intrest } }
                    );
                    const creditToLender = await Users.updateOne(
                      { _id: lender_id },
                      { $inc: { balance: total_intrest } }
                    );
                  }
                }
              } else {
                attemp++;
                if (attemp >= 4) {
                  // // borrower cant pay intrest
                  const changeBorrowStatus = await Borrowers.updateOne(
                    { _id: borrowReq_id },
                    { status: 3 }
                  );
                  const changeLenderStatus = await Lenders.updateOne(
                    { _id: _id },
                    { status: 3 }
                  );

                  const changeCollateralOwner = await Collateral.updateOne(
                    { borrow_id: borrowReq_id },
                    {
                      owner_id: lender_id,
                      child_owner_id: borrower_id,
                      status: 3,
                    }
                  );
                  clearInterval(auto);
                }
              }
            }, 5000);
          }

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
    res.status(400).json({
      success: false,
      message: `${req.method} is not allowed`,
      data: [],
    });
  }
}
