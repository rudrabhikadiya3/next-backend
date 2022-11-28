import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { crrUserID } from "../../helper/common";

const Balance = ({ bal, reRender }) => {
  const [balanceDialogue, setBalanceDialogue] = useState(false);
  const [addedAmount, setaddedAmount] = useState("");
  const [balance, setBalance] = useState(bal);

  const addBalance = async () => {
    if (addedAmount !== "" && addedAmount > 0) {
      if (addedAmount <= 1e5) {
        const res = await fetch(`${process.env.BASE_URL}api/fin/wallet`, {
          method: "POST",
          body: JSON.stringify({ userID: crrUserID(), addedAmount }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const wallet = await res.json();
        if (wallet.success) {
          setBalance(wallet.balance);
          toast.success(wallet.message);
          reRender();
        } else {
          toast.error(wallet.message);
        }
      } else {
        toast.error("You can't add more than $100,000");
      }
    } else {
      toast.error("Please enter valid amount");
    }
    setBalanceDialogue(false);
    setaddedAmount("");
  };

  return (
    <div className="balance-box">
      <h5> account balance </h5>
      <h1>${balance}</h1>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setBalanceDialogue(true)}
      >
        +
      </Button>
      <Dialog open={balanceDialogue} onClose={() => setBalanceDialogue(false)}>
        <DialogTitle>Add ammount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            type="number"
            margin="dense"
            label="amount"
            fullWidth
            variant="standard"
            onChange={(e) => setaddedAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBalanceDialogue(false)}>Cancel</Button>
          <Button onClick={addBalance}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Balance;
