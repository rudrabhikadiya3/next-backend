import Borrowers from "../../../models/Borrowers";
import Collateral from "../../../models/Collateral";
import Users from "../../../models/Users";
import dbConnect from "../../../helper/DBconnect";
const path = require("path");
import nextConnect from "next-connect";
import multer from "multer";

let fileName = [];
let mimeTypes = ["image/jpeg", "image/png", "image/jpg"];
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/assets/documents", // destination folder
    filename: (req, file, cb) => {
      let name =
        Math.floor(Math.random() * 1e8) + path.extname(file.originalname);
      fileName.push(name);
      cb(null, name);
    },
  }),

  fileFilter: function (req, file, callback) {
    if (!mimeTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPG, PNG, JPEG, files are allowed"));
    }

    callback(null, true);
  },

  limits: {
    fileSize: 5242880,
    files: 2,
  },
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({
      status: false,
      error: error.message,
    });
  },
  async onNoMatch(req, res) {
    return res.json({
      status: false,
      data: [],
      messsage: `Method '${req.method}' Not Allowed`,
    });
  },
});

apiRoute.use(upload.array("files", 2));

apiRoute.post(async (req, res) => {
  dbConnect();
  const data = await JSON.parse(req.body.data);
  console.log("borrow_request", data);
  const { user_id, borrowAmount, duration, intrest, borrower_id } = data;

  try {
    const borrowReq = await Borrowers.create({
      borrowAmount: borrowAmount,
      duration: duration,
      intrest: intrest,
      files: fileName,
      status: 0,
      borrower_id: borrower_id,
      createdAt: Date.now(),
    });

    const collateral = await Collateral.create({
      owner_id: borrower_id,
      child_owner_id: null,
      borrow_id: borrowReq._id,
      files: fileName,
      status: 0,
      createdAt: Date.now(),
    });

    console.log("new collateral", collateral);
    res.status(200).json({ success: true, data: borrowReq }); // response
  } catch (error) {
    res.status(400).json({ success: true, message: error.message });
  }
  fileName = [];
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
