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
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UTStoDate } from "../helper/common";

const dashboard = ({ user, borrowers, lenderFilter }) => {
  const [formDialogue, setFormDialogue] = useState(false);
  const [alert, setAlert] = useState(false);
  const [rowData, setRowData] = useState("");
  const [boData, setBoData] = useState({
    user_id: user._id,
    borrowAmount: "",
    duration: 1,
    intrest: 5,
    borrower_id: user._id,
  }); // form's data
  const [files, setFiles] = useState(null);
  const [tab, setTab] = useState("1");

  // console.log(user._id);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

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
              borrowers.data.push({ name: user.name, ...borrowersAPI.data });
              toast.success("request successfully submitted");

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

  const BorrowersTable = () => {
    return (
      <>
        <Button
          variant="contained"
          className="col-2 ms-auto d-block"
          onClick={() => setFormDialogue(true)}
        >
          req for borrow
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
              <th scope="col">Requested at</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.data.map((b, i) => {
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
                  <td>{UTStoDate(b.createdAt)}</td>
                  <td>
                    {b.status === 0 && (
                      <span className="badge text-bg-primary">Pending</span>
                    )}
                    {b.status === 1 && (
                      <span className="badge text-bg-secondary">Approved</span>
                    )}
                    {b.status === 2 && (
                      <span className="badge text-bg-success">Completed</span>
                    )}
                    {b.status === 3 && (
                      <span className="badge text-bg-warning">Default</span>
                    )}
                  </td>
                  <td>
                    {b.status === 0 ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => showDialogue(b)}
                      >
                        Approve
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  const LendersTable = () => {
    if (lenderFilter.length) {
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Borrower name</th>
              <th scope="col">Amount($)</th>
              <th scope="col">Duration (hr)</th>
              <th scope="col">Intrest (%)</th>
              <th scope="col">Status</th>
              <th scope="col">Approved at</th>
            </tr>
          </thead>
          <tbody>
            {lenderFilter.map((l, i) => {
              return (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{l.name}</td>
                  <td>${l.loan_amount}</td>
                  <td>{l.duration}hr</td>
                  <td>{l.intrest}</td>
                  <td>
                    {l.status == 1
                      ? "Running"
                      : l.status == 2
                      ? "Completed"
                      : "Default"}
                  </td>
                  <td>{UTStoDate(l.ApprovedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    } else {
      return <p className="text-secondary">No lending records!</p>;
    }
  };

  const showDialogue = (rowData) => {
    setAlert(true);
    setRowData(rowData);
  };

  const handleApprove = async () => {
    const { borrowAmount } = rowData;
    const { balance } = user;
    console.log(rowData);

    if (rowData.borrower_id !== user._id) {
      if (borrowAmount <= balance) {
        // transfer amount
        const payload = {
          loan_amount: borrowAmount,
          borrower_id: rowData.borrower_id,
          lender_id: user._id,
          borrowReq_id: rowData._id,
          duration: rowData.duration,
          intrest: rowData.intrest,
        };
        const res = await fetch(`${process.env.BASE_URL}api/fin/transferLoan`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const transferLoanAPI = await res.json();
        setAlert(false);
        console.log("transferLoanAPI", transferLoanAPI);
        if (transferLoanAPI.success) {
          toast.success(transferLoanAPI.message);
        } else {
          toast.error(transferLoanAPI.message);
        }
      } else {
        toast.error("Not enought account balance");
      }
    } else {
      toast.error("You can't approve own loan");
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="row p-5">
        <h3 className="text-center">Hello, {user.name} 👋</h3>
        <Box sx={{ width: "90%", typography: "body1" }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Borrowers" value="1" />
                <Tab label="Given loans" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">{BorrowersTable()}</TabPanel>
            <TabPanel value="2">{LendersTable()}</TabPanel>
          </TabContext>
        </Box>
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
              On approve the loan, loan ammount will automatically deduct from
              your wallet
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

    const BorrowRes = await fetch(
      `${process.env.BASE_URL}api/fin/get_borrowers`
    );
    const borrowers = await BorrowRes.json();

    const LendersRes = await fetch(
      `${process.env.BASE_URL}api/fin/get_lenders`
    );
    const lenders = await LendersRes.json();
    const lenderFilter = lenders.data.filter(
      (d) => d.lender_id === req.cookies.uid
    );
    return {
      props: {
        user: user.data,
        borrowers,
        lenderFilter,
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
