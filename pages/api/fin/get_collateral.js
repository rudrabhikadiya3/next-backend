import Collateral from "../../../models/Collateral";
import Users from "../../../models/Users";
export default async function handler(req, res) {
  try {
    const collateral = await Collateral.find({});

    const ownerIDarr = collateral.map((c, i) => c.owner_id);
    const ownerNames = await Users.find({ _id: { $in: ownerIDarr } }, "name");

    const child_ownerNamesarr = collateral.map((c, i) => c.child_owner_id);
    const child_ownerNames = await Users.find(
      { _id: { $in: child_ownerNamesarr } },
      "name"
    );

    const each_collateral = collateral.map((c) => c);
    let collateralData = [];
    for (let i = 0; i < each_collateral.length; i++) {
      let indexOfOwnerName = ownerNames.findIndex(
        (x) => x._id == each_collateral[i].owner_id
      );
      let indexOfCownerName = child_ownerNames.findIndex(
        (x) => x._id == each_collateral[i].child_owner_id
      );

      collateralData.push({
        _id: each_collateral[i]._id,
        owner_id: each_collateral[i].owner_id,
        owner_name: ownerNames[indexOfOwnerName].name,
        child_owner_id: each_collateral[i].child_owner_id,
        child_owner_name:
          indexOfCownerName >= 0
            ? child_ownerNames[indexOfCownerName].name
            : null,

        status: each_collateral[i].status,
        createdAt: each_collateral[i].createdAt,
      });
    }

    res.status(200).json({
      success: true,
      data: collateralData,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.messsage,
      data: [],
    });
  }
}
