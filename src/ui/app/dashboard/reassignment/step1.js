"use client"
import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
  Select,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
import { Search } from '@mui/icons-material';

const reasons = [
  "Advisor Retirement",
  "Business Consolidation",
  "Organization Restructuring"
];

/**
 * this doesn't play nice enough with the React Hooks on subsequent pages
 */
export default function Step1() {

  /*
  const [reason, setReason] = React.useState("");

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };
  */

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          Card content goes here
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </React.Fragment>
  );

  // use the MUI <Grid/> or <Stack/> layout component with the card
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'row', overflow: "auto", pt: 2, m: 3 }}>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Reason</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={""}
              label="Reason"
              onChange={ () => {} }
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
      {/*
      <div>
        <Box sx={{ m: 4, minWidth: 270, maxWidth: 450 }}>
          <Card variant="outlined">{card}</Card>
        </Box>
      </div>
      */}
    </React.Fragment>
  );
}
