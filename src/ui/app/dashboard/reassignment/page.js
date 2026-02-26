"use client"
import * as React from 'react';
import {
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  Button,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  Business,
  Phone,
  Email,
  Assignment,
  SwapHoriz,
  CheckCircle,
  Cancel,
  Warning,
  ArrowBack,
  FiberManualRecord,
  SmartToy,
} from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import mockData from '../bob-data-mock.json';
import agentResponse from './agent-response.json';
import failureResponseRaw from './failure_j.json';

const reasons = [
  'Advisor Retirement',
  'Business Consolidation',
  'Organization Restructuring',
  'Terminated',
];

const steps = ['Select Contracts & Agent', 'AI Agent Processing', 'Complete'];

function parsePossiblyStringifiedJson(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return value ?? {};
}

function normalizeAgentResponse(rawResponse) {
  const response = parsePossiblyStringifiedJson(rawResponse);

  const stepsPerformed = Array.isArray(response?.StepsPerformed)
    ? response.StepsPerformed.map((step) => {
        if (typeof step === 'string') {
          return step;
        }
        return [step?.action, step?.result_interpretation, step?.result]
          .filter(Boolean)
          .join(' — ');
      }).filter(Boolean)
    : [];

  if (response?.FinalOutput) {
    return {
      stepsPerformed,
      status: response?.FinalOutput?.Status || 'ACKnowledged',
      carrierResponse: response?.FinalOutput?.AgentChangeServiceResponse || 'N/A',
      bullets: response?.FinalOutput?.bullets ?? [],
      explanation: response?.FinalOutput?.Explanation_of_how_answer_was_determined ?? [],
      notes: response?.Notes ?? [],
    };
  }

  return {
    stepsPerformed,
    status: response?.FinalOutcome?.status || 'ACKnowledgement',
    carrierResponse: response?.FinalOutcome?.relevant_details?.carrier_response || 'N/A',
    bullets: [response?.FinalOutcome?.summary].filter(Boolean),
    explanation: [response?.FinalOutcome?.explanation_of_how_answer_was_arrived_at].filter(Boolean),
    notes: [
      ...(response?.FinalOutcome?.issues_noted_or_strange_findings ?? []),
      ...(response?.FinalOutcome?.next_steps_recommended ?? []),
    ],
  };
}

// ── small helpers ─────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="caption" fontWeight={600}>{value}</Typography>
    </Stack>
  );
}

function ContractStatusChip({ status }) {
  const orphaned = status === 'Orphaned';
  return (
    <Chip
      icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
      label={status}
      size="small"
      sx={{
        bgcolor: orphaned ? '#fce8e6' : '#e6f4ea',
        color: orphaned ? '#c0392b' : '#1e7e34',
        fontWeight: 600,
        '& .MuiChip-icon': { color: orphaned ? '#c0392b' : '#1e7e34' },
      }}
    />
  );
}

// ── main content ──────────────────────────────────────────────────────────────
function ReassignmentContent() {
  const searchParams = useSearchParams();
  const npn = searchParams.get('npn') ?? '';
  const isFailureCase = npn === '2342335';

  const { representatives } = mockData;
  const fromRep = representatives.find((r) => r.npn === npn) ?? null;
  const activeReps = representatives.filter((r) => r.status === 'Active');

  const aiResponse = React.useMemo(() => {
    const source = npn === '2342335' ? failureResponseRaw : agentResponse;
    return normalizeAgentResponse(source);
  }, [npn]);

  const [activeStep, setActiveStep] = React.useState(0);
  const [reason, setReason] = React.useState('');
  const [toNpn, setToNpn] = React.useState('');
  const [selectedContracts, setSelectedContracts] = React.useState([]);
  const [agentQuery, setAgentQuery] = React.useState('idle'); // idle | progress | success
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState('');
  const [snackSeverity, setSnackSeverity] = React.useState('success');
  const timerRef = React.useRef(undefined);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const contracts = fromRep?.contractList ?? [];
  const toRep = activeReps.find((r) => r.npn === toNpn) ?? null;
  const allSelected = selectedContracts.length === contracts.length && contracts.length > 0;

  const toggleContract = (num) => {
    setSelectedContracts((prev) =>
      prev.includes(num) ? prev.filter((c) => c !== num) : [...prev, num]
    );
  };
  const toggleAll = () => {
    setSelectedContracts(allSelected ? [] : contracts.map((c) => c.contractNumber));
  };

  const canConfirm = reason && toNpn && selectedContracts.length > 0;

  const handleConfirm = () => {
    if (!canConfirm) {
      setSnackMsg('Please select a reason, at least one contract, and a target agent.');
      setSnackSeverity('warning');
      setSnackOpen(true);
      return;
    }
    setActiveStep(1);
    setAgentQuery('progress');
    timerRef.current = setTimeout(() => setAgentQuery('success'), 2500);
  };

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnackOpen(false);
  };

  // ── STEP 0: Select contracts & target agent ───────────────────────────────
  const StepSelect = () => (
    <Box>
      <Grid container spacing={3}>
        {/* ── From Rep info card ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                FROM — Inactive Representative
              </Typography>
              {fromRep ? (
                <>
                  <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48, fontSize: 20 }}>
                      {fromRep.advisorName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={700}>{fromRep.advisorName}</Typography>
                      <Chip
                        label={fromRep.inactiveReason ?? fromRep.status}
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ fontSize: 10, height: 18 }}
                      />
                    </Box>
                  </Stack>
                  <Divider sx={{ mb: 1.5 }} />
                  <Stack gap={0.75}>
                    <InfoRow label="NPN" value={fromRep.npn} />
                    <InfoRow label="Rep Code" value={fromRep.repCode} />
                    <InfoRow label="Agency" value={fromRep.agencyName} />
                    <InfoRow label="Last Active" value={fromRep.lastActiveDate} />
                    <InfoRow label="Total Revenue" value={fromRep.revenue} />
                    <InfoRow label="License" value={fromRep.licenseStatus} />
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" gap={1}>
                    <Tooltip title={fromRep.email}><Chip icon={<Email sx={{ fontSize: 14 }} />} label="Email" size="small" variant="outlined" /></Tooltip>
                    <Tooltip title={fromRep.phone}><Chip icon={<Phone sx={{ fontSize: 14 }} />} label={fromRep.phone} size="small" variant="outlined" /></Tooltip>
                  </Stack>
                </>
              ) : (
                <Alert severity="warning">No representative found for NPN: {npn}</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ── Contracts table ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Contracts to Reassign
                </Typography>
                <Chip
                  label={`${selectedContracts.length} of ${contracts.length} selected`}
                  color={selectedContracts.length > 0 ? 'primary' : 'default'}
                  size="small"
                />
              </Stack>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={allSelected}
                          indeterminate={selectedContracts.length > 0 && !allSelected}
                          onChange={toggleAll}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Contract #</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Policy Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Client Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Premium</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Effective Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contracts.map((c) => (
                      <TableRow
                        key={c.contractNumber}
                        selected={selectedContracts.includes(c.contractNumber)}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => toggleContract(c.contractNumber)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox size="small" checked={selectedContracts.includes(c.contractNumber)} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace" fontWeight={600}>
                            {c.contractNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={c.policyType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{c.clientName}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.dark" fontWeight={600}>{c.premium}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{c.effectiveDate}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <ContractStatusChip status={c.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Reassignment details ── */}
        <Grid size={12}>
          <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Reassignment Details
              </Typography>
              <Grid container spacing={3} alignItems="flex-start">
                {/* Reason */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>Reason for Reassignment *</InputLabel>
                    <Select
                      value={reason}
                      label="Reason for Reassignment *"
                      onChange={(e) => setReason(e.target.value)}
                    >
                      {reasons.map((r) => (
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                </Grid>

                {/* To Agent */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel>To Producer (Active Agent) *</InputLabel>
                    <Select
                      value={toNpn}
                      label="To Producer (Active Agent) *"
                      onChange={(e) => setToNpn(e.target.value)}
                    >
                      {activeReps.map((r) => (
                        <MenuItem key={r.npn} value={r.npn}>
                          <Stack direction="row" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 11, bgcolor: 'primary.main' }}>
                              {r.advisorName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">{r.advisorName}</Typography>
                              <Typography variant="caption" color="text.secondary">{r.npn} · {r.agencyName}</Typography>
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Only licensed active agents shown</FormHelperText>
                  </FormControl>
                </Grid>

                {/* To Rep preview card */}
                <Grid size={{ xs: 12, sm: 4 }}>
                  {toRep ? (
                    <Card elevation={0} sx={{ bgcolor: isFailureCase ? '#fdecea' : '#e8f5e9', border: isFailureCase ? '1px solid #ef9a9a' : '1px solid #a5d6a7', borderRadius: 2 }}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                          {isFailureCase ? <Cancel color="error" fontSize="small" /> : <CheckCircle color="success" fontSize="small" />}
                          <Typography variant="caption" color={isFailureCase ? 'error.dark' : 'success.dark'} fontWeight={700}>
                            {isFailureCase ? 'Target Agent Validation Failed' : 'Selected Target Agent'}
                          </Typography>
                        </Stack>
                        <Stack gap={0.5}>
                          <InfoRow label="Name" value={toRep.advisorName} />
                          <InfoRow label="NPN" value={toRep.npn} />
                          <InfoRow label="Agency" value={toRep.agencyName} />
                          <InfoRow label="License" value={toRep.licenseStatus} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card elevation={0} sx={{ bgcolor: 'grey.100', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                        <Typography variant="caption" color="text.secondary">
                          Select a target agent to preview their details here.
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Action bar ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          href="/dashboard"
          sx={{ textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
        <Stack direction="row" alignItems="center" gap={2}>
          {!canConfirm && (
            <Typography variant="caption" color="text.secondary">
              {selectedContracts.length === 0 ? 'Select at least one contract' : !reason ? 'Choose a reason' : 'Choose a target agent'}
            </Typography>
          )}
          <Button
            variant="contained"
            color="warning"
            size="large"
            startIcon={<SwapHoriz />}
            onClick={handleConfirm}
            disabled={!canConfirm}
            sx={{ textTransform: 'none', fontWeight: 700, px: 4 }}
          >
            Confirm Reassignment ({selectedContracts.length})
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  // ── STEP 1: AI Agent processing / result ──────────────────────────────────
  const StepAgent = () => (
    <Box>
      {agentQuery === 'progress' && (
        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'info.light', borderRadius: 2, bgcolor: '#e3f2fd' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
              <SmartToy color="info" />
              <Typography variant="subtitle1" fontWeight={600} color="info.dark">
                AI Agent Processing Reassignment…
              </Typography>
            </Stack>
            <LinearProgress color="info" sx={{ borderRadius: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Verifying license status, initiating AOR change with carrier, and generating summary…
            </Typography>
          </CardContent>
        </Card>
      )}

      <Fade in={agentQuery === 'success'} unmountOnExit>
        <Box>
          {/* ── Summary bar ── */}
          <Card elevation={0} sx={{ border: isFailureCase ? '1px solid #ef9a9a' : '1px solid #a5d6a7', borderRadius: 2, bgcolor: isFailureCase ? '#fdecea' : '#e8f5e9', mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 1 }}>
                {isFailureCase ? <Cancel color="error" /> : <CheckCircle color="success" />}
                <Typography variant="subtitle1" fontWeight={700} color={isFailureCase ? 'error.dark' : 'success.dark'}>
                  {isFailureCase ? 'Reassignment Failed — Manual Action Required' : 'Reassignment Acknowledged by Carrier'}
                </Typography>
                <Chip label={isFailureCase ? 'Failed' : aiResponse.status} color={isFailureCase ? 'error' : 'success'} size="small" />
              </Stack>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoRow label="From Agent" value={fromRep?.advisorName ?? npn} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoRow label="To Agent" value={toRep?.advisorName ?? toNpn} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoRow label="Contracts Moved" value={selectedContracts.length} />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoRow label="Carrier Response" value={aiResponse.carrierResponse} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Steps performed */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 2 }}>
                    <SmartToy color="info" fontSize="small" />
                    <Typography variant="subtitle2" color="text.secondary">Steps Performed by AI Agent</Typography>
                  </Stack>
                  <Stack gap={1.5}>
                    {aiResponse.stepsPerformed?.map((step, i) => (
                      <Stack key={i} direction="row" gap={1.5} alignItems="flex-start">
                        <Avatar sx={{ width: 22, height: 22, fontSize: 11, bgcolor: 'primary.main', mt: 0.2, flexShrink: 0 }}>
                          {i + 1}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">{step}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Output bullets */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Final Output Summary</Typography>
                  <Stack gap={1}>
                    {aiResponse.bullets?.map((b, i) => (
                      <Stack key={i} direction="row" gap={1} alignItems="flex-start">
                        {isFailureCase ? (
                          <Cancel color="error" sx={{ fontSize: 16, mt: 0.4, flexShrink: 0 }} />
                        ) : (
                          <CheckCircle color="success" sx={{ fontSize: 16, mt: 0.4, flexShrink: 0 }} />
                        )}
                        <Typography variant="body2">{b}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    How the Conclusion Was Reached
                  </Typography>
                  <Stack gap={1}>
                    {aiResponse.explanation?.map((e, i) => (
                      <Typography key={i} variant="body2" color="text.secondary">
                        {i + 1}. {e}
                      </Typography>
                    ))}
                  </Stack>

                  {aiResponse.notes?.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        Notes &amp; Recommendations
                      </Typography>
                      <Stack gap={1}>
                        {aiResponse.notes?.map((n, i) => (
                          <Stack key={i} direction="row" gap={1} alignItems="flex-start">
                            <Warning color="warning" sx={{ fontSize: 16, mt: 0.4, flexShrink: 0 }} />
                            <Typography variant="body2" color="text.secondary">{n}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Return button */}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color={isFailureCase ? 'error' : 'success'}
              size="large"
              startIcon={isFailureCase ? <Cancel /> : <CheckCircle />}
              href={`/dashboard?npn=${npn}&success=${isFailureCase ? 'false' : 'true'}`}
              sx={{ textTransform: 'none', fontWeight: 700, px: 4 }}
            >
              {isFailureCase ? 'Return to Dashboard (Failed)' : 'Return to Dashboard'}
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Box>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 3 }}>
      {/* ── Page header ── */}
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
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.25)', width: 52, height: 52 }}>
              <SwapHoriz fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>Contract Reassignment</Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {fromRep
                  ? `Reassigning contracts from ${fromRep.advisorName} (NPN: ${fromRep.npn})`
                  : `NPN: ${npn}`}
              </Typography>
            </Box>
          </Stack>
          {fromRep && (
            <Chip
              label={`${contracts.length} contract${contracts.length !== 1 ? 's' : ''} to reassign`}
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          )}
        </Stack>
      </Paper>

      {/* ── Stepper ── */}
      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* ── Step content ── */}
      {activeStep === 0 && <StepSelect />}
      {activeStep >= 1 && <StepAgent />}

      {/* ── Toast ── */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackClose} severity={snackSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading…</Typography></Box>}>
      <ReassignmentContent />
    </React.Suspense>
  );
}
