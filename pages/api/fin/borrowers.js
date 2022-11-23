import Borrowers from "../../../models/Borrowers";
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
  try {
    const borrowReq = await Borrowers.create({
      borrowAmount: data.borrowAmount,
      duration: data.duration,
      intrest: data.intrest,
      files: fileName,
      status: 0,
      borrower_id: data.borrower_id,
      createdAt: Date.now(),
    });
    res.status(200).json({ success: true, data: borrowReq }); // response
  } catch (error) {
    res.status(400).json();
  }
  fileName = [];
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
