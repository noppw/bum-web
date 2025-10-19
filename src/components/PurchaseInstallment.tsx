import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DetailsPanel from './DetailsPanel';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';

interface PurchaseInstallmentRecord {
  id: string;
  supplier: string;
  product: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  installmentCount: number;
  paidInstallments: number;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'overdue';
  nextPaymentDate: string;
}

const PurchaseInstallment: React.FC = () => {
  const [rows, setRows] = useState<PurchaseInstallmentRecord[]>([
    {
      id: 'PI-1001',
      supplier: 'Electro Parts Co.',
      product: 'Capacitor Pack',
      totalAmount: 8000,
      paidAmount: 2000,
      remainingAmount: 6000,
      installmentCount: 8,
      paidInstallments: 2,
      monthlyAmount: 1000,
      startDate: '2025-01-01',
      endDate: '2025-08-01',
      status: 'active',
      nextPaymentDate: '2025-03-01',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<PurchaseInstallmentRecord | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<PurchaseInstallmentRecord | null>(null);
  const [selectedRow, setSelectedRow] = useState<PurchaseInstallmentRecord | null>(null);
  const [panelHeight, setPanelHeight] = useState(220);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newHeight = Math.min(Math.max(160, window.innerHeight - e.clientY - 24), window.innerHeight * 0.8);
      setPanelHeight(newHeight);
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing]);
  const [formData, setFormData] = useState({
    supplier: '',
    product: '',
    totalAmount: 0,
    installmentCount: 1,
    startDate: '',
  });

  const handleOpen = () => {
    setFormData({ supplier: '', product: '', totalAmount: 0, installmentCount: 1, startDate: '' });
    setEditing(null);
    setOpenDialog(true);
  };

  const handleEdit = (row: PurchaseInstallmentRecord) => {
    setEditing(row);
    setFormData({
      supplier: row.supplier,
      product: row.product,
      totalAmount: row.totalAmount,
      installmentCount: row.installmentCount,
      startDate: row.startDate,
    });
    setOpenDialog(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, row: PurchaseInstallmentRecord) => {
    setAnchorEl(event.currentTarget);
    setSelected(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelected(null);
  };

  const handleSave = () => {
    if (!formData.supplier || !formData.product || !formData.startDate) return;
    const monthlyAmount = formData.totalAmount / formData.installmentCount;
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.installmentCount - 1);
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    if (editing) {
      setRows(rows.map(r => r.id === editing.id ? {
        ...r,
        supplier: formData.supplier,
        product: formData.product,
        totalAmount: formData.totalAmount,
        installmentCount: formData.installmentCount,
        monthlyAmount,
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        remainingAmount: formData.totalAmount - r.paidAmount,
      } : r));
    } else {
      const newRow: PurchaseInstallmentRecord = {
        id: `PI-${Date.now()}`,
        supplier: formData.supplier,
        product: formData.product,
        totalAmount: formData.totalAmount,
        paidAmount: 0,
        remainingAmount: formData.totalAmount,
        installmentCount: formData.installmentCount,
        paidInstallments: 0,
        monthlyAmount,
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        status: 'active',
        nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      };
      setRows([newRow, ...rows]);
    }
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (selected) setRows(rows.filter(r => r.id !== selected.id));
    handleMenuClose();
  };

  const handlePayment = () => {
    if (!selected) return;
    const updated = rows.map(r => {
      if (r.id !== selected.id) return r;
      const newPaidAmount = r.paidAmount + r.monthlyAmount;
      const newPaidInstallments = r.paidInstallments + 1;
      const newRemainingAmount = r.totalAmount - newPaidAmount;
      const next = new Date(r.nextPaymentDate);
      next.setMonth(next.getMonth() + 1);
      const newStatus: 'active' | 'completed' | 'overdue' = newRemainingAmount <= 0 ? 'completed' : 'active';
      return {
        ...r,
        paidAmount: newPaidAmount,
        paidInstallments: newPaidInstallments,
        remainingAmount: newRemainingAmount,
        status: newStatus,
        nextPaymentDate: newRemainingAmount <= 0 ? '' : next.toISOString().split('T')[0],
      };
    });
    setRows(updated);
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'overdue': return 'Overdue';
      default: return status;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Purchase Installment Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Purchase Installment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ pb: selectedRow ? (panelCollapsed ? 56 : panelHeight + 16) : 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Paid Amount</TableCell>
              <TableCell>Remaining</TableCell>
              <TableCell>Installments</TableCell>
              <TableCell>Monthly Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Payment</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                selected={selectedRow?.id === row.id}
                onClick={() => setSelectedRow(row)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{row.supplier}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell>{row.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{row.paidAmount.toLocaleString()}</TableCell>
                <TableCell>{row.remainingAmount.toLocaleString()}</TableCell>
                <TableCell>
                  {row.paidInstallments}/{row.installmentCount}
                </TableCell>
                <TableCell>{row.monthlyAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(row.status)} 
                    color={getStatusColor(row.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.nextPaymentDate || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuClick(e, row)} size="small">
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedRow && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelected(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedRow.supplier} — ${selectedRow.product}`}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Total</Typography>
              <Typography variant="body2">{selectedRow.totalAmount.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Paid</Typography>
              <Typography variant="body2">{selectedRow.paidAmount.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Remaining</Typography>
              <Typography variant="body2">{selectedRow.remainingAmount.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Installments</Typography>
              <Typography variant="body2">{selectedRow.paidInstallments}/{selectedRow.installmentCount}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Monthly</Typography>
              <Typography variant="body2">{selectedRow.monthlyAmount.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Next Payment</Typography>
              <Typography variant="body2">{selectedRow.nextPaymentDate || '-'}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Purchase Installment' : 'Add Purchase Installment'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product"
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Number of Installments"
                type="number"
                value={formData.installmentCount}
                onChange={(e) => setFormData({ ...formData, installmentCount: parseInt(e.target.value, 10) || 1 })}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.supplier || !formData.product || !formData.startDate}>
            {editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handlePayment} disabled={selected?.status === 'completed'}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Record Payment</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { if (selected) handleEdit(selected); handleMenuClose(); }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PurchaseInstallment;


