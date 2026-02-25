"use client"
import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputLabel,
  InputAdornment,
  Select,
  FormControl,
  FormHelperText,
  TextField,
  MenuItem,
  StepLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';

const steps = [
  "Select Advisor & Confirm",
  //"Manage Accounts",
  //"Verify",
  //"Confirm"
];
const reasons = [
  "Advisor Retirement",
  "Business Consolidation",
  "Organization Restructuring"
];

export default function Page() {

  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [statusSeverity, setStatusSeverity] = React.useState("");
  const [isLiscensed, setIsLiscensed] = React.useState( false );
  const [reason, setReason] = React.useState("");
  const searchParams = useSearchParams();
  const npn = searchParams.get("npn");

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleNext = () => {
    /*
    if( activeStep === 0 ) {

      if( !isLiscensed ) {
        setOpen( true );
        setStatusMessage("Your liscense is not in good order.");
        setStatusSeverity("error");
        // block the next step
        //return;
      }
      else {
        // continue as usual
      }
    }
    else if( activeStep === 3 ) {
      setOpen( true );
      setStatusMessage("Success! Your reassignment is now complete.");
      setStatusSeverity("success");
    }
    */
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const postSuccessMessage = () => {
    setOpen( true );
    setStatusMessage("Success! Your reassignment is now complete.");
    setStatusSeverity("success");
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ m: 3 }}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        <React.Fragment>
          <>
            <Box sx={{ display: 'flex', flexDirection: 'row', overflow: "auto", pt: 2, m: 3 }}>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Reason</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={reason}
                    label="Reason"
                    onChange={handleReasonChange}
                  >
                    { reasons.map( ( item ) => (
                      <MenuItem value={item}>{item}</MenuItem>
                    ) ) }
                  </Select>
                  <FormHelperText>* Reason for reassignment</FormHelperText>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <TextField id="outlined-search" label="Contract Number" type="search"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search/>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormHelperText></FormHelperText>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <TextField id="outlined-search" label="From Producer" type="search"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search/>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormHelperText>* Current contract owner</FormHelperText>
                </FormControl>
              </div>
              <div>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <TextField id="outlined-search" label="To Producer" type="search"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Search/>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormHelperText>* Producer to reassign contract to</FormHelperText>
                </FormControl>
              </div>
            </Box>
          </>

          {/* if user clicks 'Confirm' show the AI Agent response */
            activeStep === steps.length ?

            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                {/* happy path - return to the dashboard and mark the reassignment as successfully complete */}
                <Button onClick={postSuccessMessage} href={`/dashboard?npn=${npn}&success=true`}>Return to Dashboard</Button>
              </Box>
            </React.Fragment>

            :
            ""
          /* else don't show anything */}

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, m: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      }
      <Snackbar open={open} autoHideDuration={8000} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          onClose={handleClose}
          severity={statusSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {statusMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
