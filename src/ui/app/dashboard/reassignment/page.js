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
  LinearProgress,
  CircularProgress,
  Fade,
  StepLabel
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import agentResponse from "./agent-response.json";

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
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState('idle');
  const timerRef = React.useRef(undefined);

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
    handleClickQuery();
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

  React.useEffect(
    () => () => {
      clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClickLoading = () => {
    setLoading((prevLoading) => !prevLoading);
  };

  const handleClickQuery = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query !== 'idle') {
      setQuery('idle');
      return;
    }

    setQuery('progress');
    timerRef.current = setTimeout(() => {
      setQuery('success');
    }, 2000);
  };

  return (
    <React.Suspense>
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
              <Typography sx={{ m: 2 }}>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ height: 40 }}>
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress/>
        </Fade>
      </Box>
      <Box sx={{ height: 40 }}>
        {query === 'success' ? (
          <Typography>
            AI Agent response successfully retrieved:
            {
              /* display agent ai response here */
              agentResponse["Steps perfromed"].map( (item) => (
                <div>
                <Fade
                  in={true}
                  style={{
                    transitionDelay: '100ms',
                  }}
                  unmountOnExit
                >
                  <CircularProgress/>
                </Fade>
                  {item}
                </div>
              ))
            }
            {
              agentResponse["FinalOutput"].bullets.map( (item) => (
                setTimeout( () => {
                  <div>
                    {item}
                  </div>
                }, 1000 )
              ))
            }
            {
              <div>
                How I arrived at this conclusion: {agentResponse["FinalOutput"].explanation_of_how_i_arrived_at_this}
              </div>
            }
            <div>Recommendations:</div>
            {
              agentResponse["FinalOutput"].unexpected_problems_and_recommendations.map( (item) => (
                setTimeout( () => {
                  <div>
                    {item}
                  </div>
                }, 1000 )
              ))
            }
          </Typography>
        ) : (
          <Fade
            in={query === 'progress'}
            style={{
              transitionDelay: query === 'progress' ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <CircularProgress/>
          </Fade>
        )}
      </Box>
    </Box>
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                {/* happy path - return to the dashboard and mark the reassignment as successfully complete */}
                <Button href={`/dashboard?npn=${npn}&success=true`}>Return to Dashboard</Button>
              </Box>
            </React.Fragment>
            :
            /* else display the 'Next' / 'Confirm' options */
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
          }

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
    </React.Suspense>
  );
}
