"use client"
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const rows = [
  { npn: "1234567", repCode: "CRGBF", advisorName: 'Raja Kumarasamy', revenue: "$11.11", lastActiveDate: "January 1st, 2021" },
  { npn: "7654321", repCode: "JPMC", advisorName: 'Leland Snyder', revenue: "$22.22", lastActiveDate: "Febuary 2nd, 2022" },
];

export default function Page() {

  const [open, setOpen] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [statusSeverity, setStatusSeverity] = React.useState("");
  const searchParams = useSearchParams();
  const npn = searchParams.get( "npn" );
  const success = searchParams.get( "success" );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  React.useEffect( () => {

    if( !!npn && !!success ) {
      setOpen( true );
      setStatusMessage("Success! Your reassignment is now complete.");
      setStatusSeverity("success");
    }

  },[])

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "lightgrey" }}>
            <TableRow>
              <TableCell align="right">NPN</TableCell>
              <TableCell align="right">Advisor Name</TableCell>
              <TableCell align="right">Rep Code</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Last Active Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.npn}</TableCell>
                <TableCell align="right">{row.advisorName}</TableCell>
                <TableCell align="right">{row.repCode}</TableCell>
                <TableCell align="right">{row.revenue}</TableCell>
                <TableCell align="right">{row.lastActiveDate}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" href={`/dashboard/reassignment?npn=${row.npn}`} disabled={row.npn === npn}>
                    Reassign
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  );
}
