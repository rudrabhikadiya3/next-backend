import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slider,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dashboard = ({ user, borrowers }) => {
  const [formDialogue, setFormDialogue] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertData, setAlertData] = useState("");
  const [boData, setBoData] = useState({
    name: user.name,
    borrowAmount: "",
    duration: 1,
    intrest: 5,
    user_id: user._id,
  }); // form's data
  const [files, setFiles] = useState(null);

  const flieHandler = (file) => {
    setFiles(file);
  };

  const handleSubmit = async () => {
    if (boData.borrowAmount != "") {
      if (boData.borrowAmount >= 1000) {
        if (files !== null) {
          if (files.length === 2) {
            const fdata = new FormData();
            for (let i = 0; i < files.length; i++) {
              fdata.append("files", files[i]);
            }
            fdata.append("data", JSON.stringify(boData));
            console.log(fdata);
            const res = await fetch(
              `${process.env.BASE_URL}api/fin/borrowers`,
              {
                method: "POST",
                body: fdata,
                headers: {
                  Accept: "multipart/form-data",
                },
              }
            );
            const borrowersAPI = await res.json();
            if (borrowersAPI.success) {
              console.log("borrowersAPI", borrowersAPI.data);
              borrowers.data.push(borrowersAPI.data);
              toast.success("request successsully submitted");

              setBoData({
                name: user.name,
                borrowAmount: "",
                duration: 1,
                intrest: 5,
              });
              setFiles(null);
              setFormDialogue(false);
            } else {
              toast.error(borrowersAPI.error);
            }
          } else {
            toast.error("File limit : 2");
          }
        } else {
          toast.error("Please select a file");
        }
      } else {
        toast.error("minimum loan amount is $1000");
      }
    } else {
      toast.error("Please enter full details");
    }
  };

  const tableRows = () => {
    return borrowers.data.map((b, i) => {
      return (
        <tr key={i}>
          <th scope="row">{i + 1}</th>
          <td>{b.name}</td>
          <td>${b.borrowAmount}</td>
          <td>{b.intrest}%</td>
          <td>{b.duration}hr</td>
          <td>
            <Image
              src={`/assets/documents/${b.files[0]}`}
              width={30}
              height={30}
              alt="colletral"
            />
            <Image
              src={`/assets/documents/${b.files[1]}`}
              width={30}
              height={30}
              alt="colletral"
            />
          </td>
          <td>
            <button
              className="btn btn-primary"
              onClick={() => showDialogue(b._id)}
            >
              Approve
            </button>
          </td>
        </tr>
      );
    });
  };

  const showDialogue = (id) => {
    setAlert(true);
    setAlertData(id);
  };

  const handleApprove = () => {
    console.log(alertData);
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row p-5">
        <Button
          variant="contained"
          className="col-2 ms-auto"
          onClick={() => setFormDialogue(true)}
        >
          Request for borrow
        </Button>
        <table className="table table-hover border my-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Amount($)</th>
              <th scope="col">Intrest(%)</th>
              <th scope="col">Duration(hr)</th>
              <th scope="col">collateral</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>{tableRows()}</tbody>
        </table>
        <Dialog open={formDialogue} onClose={() => setFormDialogue(false)}>
          <DialogTitle>Request for borrow</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              type="number"
              margin="dense"
              label="Borrow Amount($)"
              fullWidth
              variant="standard"
              onChange={(e) =>
                setBoData({ ...boData, borrowAmount: e.target.value })
              }
            />
            <p className="m-0 mt-4">Intrest rate(%)</p>
            <Slider
              aria-label="intrest"
              defaultValue={5}
              valueLabelDisplay="auto"
              step={0.5}
              marks
              min={5}
              max={30}
              onChange={(e) =>
                setBoData({ ...boData, intrest: e.target.value })
              }
            />
            <p className="m-0 mt-2">Duration (in hours)</p>
            <Slider
              aria-label="hours"
              defaultValue={1}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={24}
              onChange={(e) =>
                setBoData({ ...boData, duration: e.target.value })
              }
            />
            <input
              className="mt-4 border"
              autoFocus
              type="file"
              margin="dense"
              variant="standard"
              onChange={(e) => flieHandler(e.target.files)}
              multiple
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormDialogue(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={alert} onClose={() => setAlert(false)}>
          <DialogTitle id="alert-dialog-title">
            Are you sure to approve loan?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {/* On approve the loan, loan ammount will automatically deduct from your wallet  */}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAlert(false)}>No</Button>
            <Button onClick={handleApprove} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  // 2FA status of current user
  if (req.cookies.uid != "" && req.cookies.uid != undefined) {
    const UserRes = await fetch(
      `${process.env.BASE_URL}api/users/${req.cookies.uid}`
    );
    const user = await UserRes.json();
    const BorrowRes = await fetch(`${process.env.BASE_URL}api/fin/borrowers`);
    const borrowers = await BorrowRes.json();
    return {
      props: {
        user: user.data,
        borrowers,
      },
    };
  } else {
    // privateRoute
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }
}

export default dashboard;
