import Products from "../../../models/Products";
import dbConnect from "../../../middleware/DBconnect";
const path = require("path");
import nextConnect from "next-connect";
import multer from "multer";

let fileName = "";
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/assets/images", // destination folder
    filename: (req, file, cb) => {
      fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  async onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("file"));

apiRoute.post(async (req, res) => {
  dbConnect();
  const data = await JSON.parse(req.body.data);
  try {
    const newProduct = await Products.create({
      title: data.title,
      bname: data.bname,
      catagory: data.catagory,
      mrp: data.mrp,
      price: data.price,
      qty: data.qty,
      keywords: data.keywords,
      img: fileName,
    });
<<<<<<< HEAD
    res.status(200).json(newProduct); // response
  } catch (error) {
    res.status(400).json({ success: false });
  }
=======
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(400).json({ success: false });
  }
  // res.status(200).json({ data: `./public/assets/images/${fname}` }); // response
>>>>>>> 238c10d02ae2dfa8514f929a0b6b7f0cbf7b42ee
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};