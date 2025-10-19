import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DetailsPanel from './DetailsPanel';

interface PurchaseRecord {
  id: string;
  date: string;
  supplier: string;
  product: string;
  quantity: number;
  totalAmount: number;
}

const PURCHASES_STORAGE_KEY = 'purchases';

const Purchase: React.FC = () => {
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([
    {
      id: 'P-1001',
      date: '2025-01-10',
      supplier: 'Electro Parts Co.',
      product: 'Capacitor Pack',
      quantity: 200,
      totalAmount: 8000,
    },
    {
      id: 'P-1002',
      date: '2025-01-12',
      supplier: 'MetalWorks Ltd.',
      product: 'Aluminum Housing',
      quantity: 50,
      totalAmount: 12500,
    },
    {
      id: 'P-1003',
      date: '2025-01-15',
      supplier: 'ChemTech Supplies',
      product: 'Solder Flux (1L)',
      quantity: 20,
      totalAmount: 3000,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseRecord | null>(null);
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
    date: '',
    supplier: '',
    product: '',
    quantity: 1,
    totalAmount: 0,
    createInstallment: false,
    installmentCount: 1,
    startDate: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem(PURCHASES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPurchases(parsed);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  }, [purchases]);

  const handleOpen = () => {
    setFormData({
      date: '',
      supplier: '',
      product: '',
      quantity: 1,
      totalAmount: 0,
      createInstallment: false,
      installmentCount: 1,
      startDate: '',
    });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.date || !formData.supplier || !formData.product) return;
    const newRecord: PurchaseRecord = {
      id: `P-${Date.now()}`,
      date: formData.date,
      supplier: formData.supplier,
      product: formData.product,
      quantity: formData.quantity || 0,
      totalAmount: formData.totalAmount || 0,
    };

    // Save purchase
    const updatedPurchases = [newRecord, ...purchases];
    setPurchases(updatedPurchases);

    // No installment linkage here per requirements

    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Purchase Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Purchase
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          pb: selectedPurchase ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedPurchase ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedPurchase ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell align="right">Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((p) => (
              <TableRow
                key={p.id}
                hover
                selected={selectedPurchase?.id === p.id}
                onClick={() => setSelectedPurchase(p)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{p.date}</TableCell>
                <TableCell>{p.supplier}</TableCell>
                <TableCell>{p.product}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell align="right">{p.totalAmount.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedPurchase && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedPurchase(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedPurchase.supplier} — ${selectedPurchase.product}`}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            {selectedPurchase.supplier} — {selectedPurchase.product}
          </Typography>
            <Box>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography variant="body2">{selectedPurchase.date}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Quantity</Typography>
              <Typography variant="body2">{selectedPurchase.quantity}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Total Amount</Typography>
              <Typography variant="body2">{selectedPurchase.totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Purchase</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
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
            <Grid item xs={12} md={3}>
              <TextField
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Total Amount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: parseFloat(e.target.value) || 0 })}
                fullWidth
                required
              />
            </Grid>

            {/* Installment creation removed as purchasing installments are separate */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.date || !formData.supplier || !formData.product}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Purchase;


