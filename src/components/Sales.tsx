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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DetailsPanel from './DetailsPanel';
import { useLanguage } from '../contexts/LanguageContext';

interface SaleRecord {
  id: string;
  date: string;
  customer: string;
  product: string;
  quantity: number;
  total: number;
}

const Sales: React.FC = () => {
  const { t } = useLanguage();
  const [sales, setSales] = useState<SaleRecord[]>([
    {
      id: 'S-1001',
      date: '2025-01-15',
      customer: 'Acme Co.',
      product: 'Electronic Component A',
      quantity: 10,
      total: 2500,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [panelHeight, setPanelHeight] = useState(220);
  const [isResizing, setIsResizing] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
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
    date: '',
    customer: '',
    product: '',
    quantity: 1,
    total: 0,
  });

  const handleOpen = () => {
    setFormData({ date: '', customer: '', product: '', quantity: 1, total: 0 });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.date || !formData.customer || !formData.product) return;
    const newRecord: SaleRecord = {
      id: `S-${Date.now()}`,
      date: formData.date,
      customer: formData.customer,
      product: formData.product,
      quantity: formData.quantity || 0,
      total: formData.total || 0,
    };
    setSales([newRecord, ...sales]);
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('sales.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          {t('sales.addSale')}
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          pb: selectedSale ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedSale ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedSale ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('sales.date')}</TableCell>
              <TableCell>{t('sales.customer')}</TableCell>
              <TableCell>{t('sales.product')}</TableCell>
              <TableCell>{t('sales.quantity')}</TableCell>
              <TableCell align="right">{t('sales.total')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((s) => (
              <TableRow
                key={s.id}
                hover
                selected={selectedSale?.id === s.id}
                onClick={() => setSelectedSale(s)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{s.date}</TableCell>
                <TableCell>{s.customer}</TableCell>
                <TableCell>{s.product}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell align="right">{s.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sales.length}
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

      {selectedSale && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedSale(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedSale.customer} — ${selectedSale.product}`}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('sales.date')}</Typography>
              <Typography variant="body2">{selectedSale.date}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('sales.customer')}</Typography>
              <Typography variant="body2">{selectedSale.customer}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('sales.product')}</Typography>
              <Typography variant="body2">{selectedSale.product}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('sales.quantity')}</Typography>
              <Typography variant="body2">{selectedSale.quantity}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('sales.total')}</Typography>
              <Typography variant="body2">{selectedSale.total.toLocaleString()}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('sales.addSale')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('sales.date')}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('sales.customer')}
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('sales.product')}
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label={t('sales.quantity')}
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label={t('sales.total')}
                type="number"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) || 0 })}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained" disabled={!formData.date || !formData.customer || !formData.product}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sales;


