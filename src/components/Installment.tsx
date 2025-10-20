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
  TablePagination,
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

interface InstallmentRecord {
  id: string;
  customer: string;
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

const Installment: React.FC = () => {
  const [installments, setInstallments] = useState<InstallmentRecord[]>([
    {
      id: 'I-1001',
      customer: 'Acme Co.',
      product: 'Electronic Component A',
      totalAmount: 5000,
      paidAmount: 1500,
      remainingAmount: 3500,
      installmentCount: 5,
      paidInstallments: 1,
      monthlyAmount: 1000,
      startDate: '2025-01-15',
      endDate: '2025-05-15',
      status: 'active',
      nextPaymentDate: '2025-02-15',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<InstallmentRecord | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<InstallmentRecord | null>(null);
  const [selectedRow, setSelectedRow] = useState<InstallmentRecord | null>(null);
  const [panelHeight, setPanelHeight] = useState(220);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    customer: '',
    product: '',
    totalAmount: 0,
    installmentCount: 1,
    startDate: '',
  });

  const handleOpen = () => {
    setFormData({ customer: '', product: '', totalAmount: 0, installmentCount: 1, startDate: '' });
    setEditingInstallment(null);
    setOpenDialog(true);
  };

  const handleEdit = (installment: InstallmentRecord) => {
    setEditingInstallment(installment);
    setFormData({
      customer: installment.customer,
      product: installment.product,
      totalAmount: installment.totalAmount,
      installmentCount: installment.installmentCount,
      startDate: installment.startDate,
    });
    setOpenDialog(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, installment: InstallmentRecord) => {
    setAnchorEl(event.currentTarget);
    setSelectedInstallment(installment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInstallment(null);
  };

  const handleSave = () => {
    if (!formData.customer || !formData.product || !formData.startDate) return;
    
    const monthlyAmount = formData.totalAmount / formData.installmentCount;
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.installmentCount - 1);
    
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    if (editingInstallment) {
      // Update existing installment
      setInstallments(installments.map(inst => 
        inst.id === editingInstallment.id 
          ? {
              ...inst,
              customer: formData.customer,
              product: formData.product,
              totalAmount: formData.totalAmount,
              installmentCount: formData.installmentCount,
              monthlyAmount: monthlyAmount,
              startDate: formData.startDate,
              endDate: endDate.toISOString().split('T')[0],
              remainingAmount: formData.totalAmount - inst.paidAmount,
            }
          : inst
      ));
    } else {
      // Create new installment
      const newInstallment: InstallmentRecord = {
        id: `I-${Date.now()}`,
        customer: formData.customer,
        product: formData.product,
        totalAmount: formData.totalAmount,
        paidAmount: 0,
        remainingAmount: formData.totalAmount,
        installmentCount: formData.installmentCount,
        paidInstallments: 0,
        monthlyAmount: monthlyAmount,
        startDate: formData.startDate,
        endDate: endDate.toISOString().split('T')[0],
        status: 'active',
        nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
      };
      setInstallments([newInstallment, ...installments]);
    }
    setOpenDialog(false);
  };

  const handleDelete = () => {
    if (selectedInstallment) {
      setInstallments(installments.filter(inst => inst.id !== selectedInstallment.id));
    }
    handleMenuClose();
  };

  const handlePayment = () => {
    if (selectedInstallment) {
      const updatedInstallments = installments.map(inst => {
        if (inst.id === selectedInstallment.id) {
          const newPaidAmount = inst.paidAmount + inst.monthlyAmount;
          const newPaidInstallments = inst.paidInstallments + 1;
          const newRemainingAmount = inst.totalAmount - newPaidAmount;
          const newNextPaymentDate = new Date(inst.nextPaymentDate);
          newNextPaymentDate.setMonth(newNextPaymentDate.getMonth() + 1);
          
          const newStatus: 'active' | 'completed' | 'overdue' = newRemainingAmount <= 0 ? 'completed' : 'active';
          
          return {
            ...inst,
            paidAmount: newPaidAmount,
            paidInstallments: newPaidInstallments,
            remainingAmount: newRemainingAmount,
            status: newStatus,
            nextPaymentDate: newRemainingAmount <= 0 ? '' : newNextPaymentDate.toISOString().split('T')[0],
          };
        }
        return inst;
      });
      setInstallments(updatedInstallments);
    }
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
        Installment Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add New Installment
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ pb: selectedRow ? (panelCollapsed ? 56 : panelHeight + 16) : 0 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
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
            {installments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((installment) => (
              <TableRow
                key={installment.id}
                hover
                selected={selectedRow?.id === installment.id}
                onClick={() => setSelectedRow(installment)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{installment.customer}</TableCell>
                <TableCell>{installment.product}</TableCell>
                <TableCell>{installment.totalAmount.toLocaleString()}</TableCell>
                <TableCell>{installment.paidAmount.toLocaleString()}</TableCell>
                <TableCell>{installment.remainingAmount.toLocaleString()}</TableCell>
                <TableCell>
                  {installment.paidInstallments}/{installment.installmentCount}
                </TableCell>
                <TableCell>{installment.monthlyAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusText(installment.status)} 
                    color={getStatusColor(installment.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{installment.nextPaymentDate || '-'}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => handleMenuClick(e, installment)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={installments.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </TableContainer>

      {selectedRow && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedRow(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedRow.customer} — ${selectedRow.product}`}
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
        <DialogTitle>
          {editingInstallment ? 'Edit Installment' : 'Add New Installment'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
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
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!formData.customer || !formData.product || !formData.startDate}
          >
            {editingInstallment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handlePayment} disabled={selectedInstallment?.status === 'completed'}>
          <ListItemIcon>
            <PaymentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Record Payment</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedInstallment) handleEdit(selectedInstallment);
          handleMenuClose();
        }}>
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

export default Installment;
