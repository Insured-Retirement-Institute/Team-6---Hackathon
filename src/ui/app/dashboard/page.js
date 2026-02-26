"use client"
import * as React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Alert,
  Divider,
  Stack,
  Tooltip,
  Badge,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  PeopleAlt,
  CheckCircle,
  Warning,
  AttachMoney,
  Assignment,
  Email,
  Phone,
  SwapHoriz,
  Person,
  Business,
  FiberManualRecord,
} from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import mockData from './bob-data-mock.json';

// ── KPI summary card ──────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon, color }) {
  return (
    <Card elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color={color ?? 'text.primary'}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color ?? 'primary.main', width: 52, height: 52, opacity: 0.85 }}>
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ── Status chip helper ────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const active = status === 'Active';
  return (
    <Chip
      icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
      label={status}
      size="small"
      sx={{
        bgcolor: active ? '#e6f4ea' : '#fce8e6',
        color: active ? '#1e7e34' : '#c0392b',
        fontWeight: 600,
        '& .MuiChip-icon': { color: active ? '#1e7e34' : '#c0392b' },
      }}
    />
  );
}

// ── License chip helper ───────────────────────────────────────────────────────
function LicenseChip({ status }) {
  const ok = status === 'Licensed';
  return (
    <Chip
      label={status}
      size="small"
      variant="outlined"
      sx={{
        borderColor: ok ? '#1e7e34' : '#c0392b',
        color: ok ? '#1e7e34' : '#c0392b',
        fontWeight: 600,
      }}
    />
  );
}

// ── Main dashboard content ────────────────────────────────────────────────────
function DashboardContent() {
  const [open, setOpen] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState('');
  const [statusSeverity, setStatusSeverity] = React.useState('success');
  const [tab, setTab] = React.useState(0);

  const searchParams = useSearchParams();
  const completedNpn = searchParams.get('npn');
  const success = searchParams.get('success');

  const { distributor, summary, representatives } = mockData;
  const activeReps = representatives.filter((r) => r.status === 'Active');
  const inactiveReps = representatives.filter((r) => r.status === 'Inactive');

  React.useEffect(() => {
    if (completedNpn && success) {
      setOpen(true);
      setStatusMessage('Success! Your reassignment is now complete.');
      setStatusSeverity('success');
    }
  }, []);

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  // ── Rep table (shared) ──────────────────────────────────────────────────────
  const RepTable = ({ rows }) => (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.100' }}>
            <TableCell sx={{ fontWeight: 700 }}>Advisor Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>NPN</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Rep Code</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Agency</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Revenue</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">Contracts</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Last Active</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">License</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.npn}
              sx={{
                '&:last-child td': { border: 0 },
                bgcolor: row.npn === completedNpn ? '#f0fff4' : 'inherit',
              }}
            >
              <TableCell>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'primary.main' }}>
                    {row.advisorName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>{row.advisorName}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.email}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontFamily="monospace">{row.npn}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={row.repCode} size="small" variant="outlined" />
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Business sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="body2">{row.agencyName}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={600} color="success.dark">{row.revenue}</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2">{row.contracts}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{row.lastActiveDate}</Typography>
              </TableCell>
              <TableCell align="center">
                <StatusChip status={row.status} />
              </TableCell>
              <TableCell align="center">
                <LicenseChip status={row.licenseStatus} />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" gap={0.5} justifyContent="center">
                  <Tooltip title={row.email}>
                    <IconButton size="small" color="primary">
                      <Email fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={row.phone}>
                    <IconButton size="small" color="primary">
                      <Phone fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {row.status === 'Inactive' && (
                    <Tooltip title="Reassign contracts">
                      <span>
                        <Button
                          variant="contained"
                          size="small"
                          color="warning"
                          startIcon={<SwapHoriz />}
                          href={`/dashboard/reassignment?npn=${row.npn}`}
                          disabled={row.npn === completedNpn}
                          sx={{ whiteSpace: 'nowrap', textTransform: 'none' }}
                        >
                          Reassign
                        </Button>
                      </span>
                    </Tooltip>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* ── Distributor header ─────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)',
          color: 'white',
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between" gap={2}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.25)', fontSize: 24 }}>
              {distributor.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{distributor.name}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>{distributor.title} · {distributor.agency}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>Region: {distributor.region} · {distributor.email}</Typography>
            </Box>
          </Stack>
          <Box textAlign={{ xs: 'left', sm: 'right' }}>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>As of February 25, 2026</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ── KPI cards ──────────────────────────────────────────────────── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Total Reps" value={summary.totalReps} subtitle="In your book" icon={<PeopleAlt />} color="primary.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Active Reps" value={summary.activeReps} subtitle="Currently active" icon={<CheckCircle />} color="success.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Inactive Reps" value={summary.inactiveReps} subtitle="Need attention" icon={<Warning />} color="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Total Revenue" value={summary.totalRevenue} subtitle="Across all reps" icon={<AttachMoney />} color="success.dark" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Total Contracts" value={summary.totalContracts} subtitle="All reps" icon={<Assignment />} color="info.main" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <KpiCard title="Pending Reassign" value={summary.pendingReassignments} subtitle="Contracts at risk" icon={<SwapHoriz />} color="error.main" />
        </Grid>
      </Grid>

      {/* ── Inactive reps alert banner ──────────────────────────────────── */}
      {inactiveReps.length > 0 && (
        <Alert
          severity="warning"
          icon={<Warning />}
          sx={{ mb: 3, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => setTab(1)}>
              View All
            </Button>
          }
        >
          <strong>{inactiveReps.length} inactive representative{inactiveReps.length > 1 ? 's' : ''}</strong> with{' '}
          {inactiveReps.reduce((acc, r) => acc + r.contracts, 0)} contracts require reassignment.{' '}
          {inactiveReps.map((r) => r.advisorName).join(', ')}
        </Alert>
      )}

      {/* ── Tabs: All Reps / Inactive ───────────────────────────────────── */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab
              label={
                <Stack direction="row" alignItems="center" gap={1}>
                  <PeopleAlt fontSize="small" />
                  All Representatives ({representatives.length})
                </Stack>
              }
            />
            <Tab
              label={
                <Stack direction="row" alignItems="center" gap={1}>
                  <Badge badgeContent={inactiveReps.length} color="error">
                    <Warning fontSize="small" color="warning" />
                  </Badge>
                  &nbsp;Inactive Representatives
                </Stack>
              }
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 2 }}>
          {/* ── All reps tab ──────────────────────────────────────────────── */}
          {tab === 0 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Full book of business — {activeReps.length} active, {inactiveReps.length} inactive
              </Typography>
              <RepTable rows={representatives} />
            </>
          )}

          {/* ── Inactive tab ──────────────────────────────────────────────── */}
          {tab === 1 && (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The following representatives are inactive and their contracts need to be reassigned to an active producer.
              </Typography>

              {/* Inactive rep detail cards */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {inactiveReps.map((rep) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={rep.npn}>
                    <Card
                      elevation={0}
                      sx={{
                        border: '1px solid',
                        borderColor: 'warning.light',
                        borderRadius: 2,
                        bgcolor: '#fffde7',
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                            {rep.advisorName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight={700}>{rep.advisorName}</Typography>
                            <Typography variant="caption" color="text.secondary">NPN: {rep.npn}</Typography>
                          </Box>
                        </Stack>
                        <Divider sx={{ mb: 1.5 }} />
                        <Stack gap={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Agency</Typography>
                            <Typography variant="caption" fontWeight={600}>{rep.agencyName}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Revenue at Risk</Typography>
                            <Typography variant="caption" fontWeight={600} color="error.main">{rep.revenue}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Contracts</Typography>
                            <Typography variant="caption" fontWeight={600}>{rep.contracts}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Last Active</Typography>
                            <Typography variant="caption">{rep.lastActiveDate}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Reason</Typography>
                            <Chip label={rep.inactiveReason ?? 'Unknown'} size="small" color="warning" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">License</Typography>
                            <LicenseChip status={rep.licenseStatus} />
                          </Stack>
                        </Stack>
                        <Button
                          fullWidth
                          variant="contained"
                          color="warning"
                          size="small"
                          startIcon={<SwapHoriz />}
                          href={`/dashboard/reassignment?npn=${rep.npn}`}
                          disabled={rep.npn === completedNpn}
                          sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                          {rep.npn === completedNpn ? 'Reassigned ✓' : 'Reassign Contracts'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                Inactive Representatives — Detail Table
              </Typography>
              <RepTable rows={inactiveReps} />
            </>
          )}
        </Box>
      </Paper>

      {/* ── Toast notification ─────────────────────────────────────────── */}
      <Snackbar
        open={open}
        autoHideDuration={8000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={statusSeverity} variant="filled" sx={{ width: '100%' }}>
          {statusMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading Dashboard…</Typography></Box>}>
      <DashboardContent />
    </React.Suspense>
  );
}
