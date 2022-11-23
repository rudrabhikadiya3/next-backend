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
    if (req.method) {
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
