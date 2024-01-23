import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog(props) {
  const { id, handleClose, handleDeleteId, dialogOpen, name } = props;
  return (
    <React.Fragment>
      <Dialog
        open={dialogOpen}
        onClose={() => dialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert!! "}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your trying to remove the {name} {id} from the main database, Are you
            sure with your action ??
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            NO
          </Button>
          <Button
            onClick={() => {
              handleDeleteId(id);
              handleClose();
            }}
          >
            YES, Im sure
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
