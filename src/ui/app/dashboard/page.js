"use client"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

const rows = [
  { npn: "1234567", repCode: "CRGBF", advisorName: 'Raja Kumarasamy', revenue: "$11.11", lastActiveDate: "January 1st, 2021" },
  { npn: "7654321", repCode: "JPMC", advisorName: 'Leland Snyder', revenue: "$22.22", lastActiveDate: "Febuary 2nd, 2022" },
];

export default function Page() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
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
                <Button variant="contained" href={`/dashboard/reassignment?npn=${row.npn}`}>
                  Reassign
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
