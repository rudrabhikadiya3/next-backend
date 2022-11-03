import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
const addproduct = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    pname: "",
    bname: "",
    catagory: "",
    mrp: "",
    price: "",
    qty: "",
    keywords: "",
  });
  const [errors, seterror] = useState({});

  const catagories = ["fashion", "electronics", "mobile", "toys", "appliances"];

  const handleSubmit = () => {
    if (value.pname === "") {
      seterror({ pnameErr: "please enter product title" });
    } else if (value.bname === "") {
      seterror({ bnameErr: "enter brand name" });
    } else if (value.catagory === "") {
      seterror({ catagoryErr: "please select catagory" });
    } else if (value.mrp === "") {
      seterror({ mrpErr: "please enter MRP" });
    } else if (value.price === "") {
      seterror({ priceErr: "please select price" });
    } else if (value.qty === "") {
      seterror({ qtyErr: "please enter quantity" });
    } else if (value.keywords === "") {
      seterror({ keywordsErr: "please enter keywords" });
    }
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        className="d-inline-block col-2"
      >
        Add new product
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add new product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>

          <TextField
            margin="dense"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, pname: e.target.value })}
          />
          <span className="form-error">{errors.pnameErr}</span>

          <TextField
            margin="dense"
            label="Brand Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, bname: e.target.value })}
          />
          <span className="form-error">{errors.bnameErr}</span>
          <FormControl variant="standard" fullWidth margin="dense">
            <InputLabel>Catagory</InputLabel>
            <Select
              value=""
              label="Catagory"
              fullWidth
              onChange={(e) => setValue({ ...value, catagory: e.target.value })}
            >
              {catagories.map((c, i) => (
                <MenuItem value={c} key={i}>
                  {c}
                </MenuItem>
              ))}
            </Select>
            <span className="form-error">{errors.catagoriesErr}</span>
          </FormControl>
          <TextField
            margin="dense"
            label="MRP"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, mrp: e.target.value })}
          />
          <span className="form-error">{errors.mrpErr}</span>
          <TextField
            margin="dense"
            label="Selling Price"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, price: e.target.value })}
          />
          <span className="form-error">{errors.priceErr}</span>
          <TextField
            margin="dense"
            label="quantity"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, qty: e.target.value })}
          />
          <span className="form-error">{errors.qtyErr}</span>
          <TextField
            margin="dense"
            label="Key Words"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setValue({ ...value, keywords: e.target.value })}
          />
          <span className="form-error">{errors.kwordsErr}</span>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default addproduct;
