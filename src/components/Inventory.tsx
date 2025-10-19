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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DetailsPanel from './DetailsPanel';

interface InventoryRecord {
  id: string;
  sku: string;
  name: string;
  location: string;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
}

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryRecord[]>([
    {
      id: 'INV-1001',
      sku: 'SKU-001',
      name: 'Electronic Component A',
      location: 'Warehouse A',
      quantity: 120,
      status: 'in_stock',
      lastUpdated: '2025-01-10',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryRecord | null>(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    location: '',
    quantity: 0,
  });
  const [panelHeight, setPanelHeight] = useState(220);
  const [isResizing, setIsResizing] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);

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

  const computeStatus = (qty: number): InventoryRecord['status'] => {
    if (qty <= 0) return 'out_of_stock';
    if (qty < 20) return 'low_stock';
    return 'in_stock';
  };

  const statusChip = (status: InventoryRecord['status']) => {
    const map: Record<InventoryRecord['status'], { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
      in_stock: { label: 'In Stock', color: 'success' },
      low_stock: { label: 'Low Stock', color: 'warning' },
      out_of_stock: { label: 'Out of Stock', color: 'error' },
    };
    const s = map[status];
    return <Chip label={s.label} color={s.color} size="small" />;
  };

  const handleOpen = () => {
    setFormData({ sku: '', name: '', location: '', quantity: 0 });
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.sku || !formData.name || !formData.location) return;
    const now = new Date().toISOString().split('T')[0];
    const newItem: InventoryRecord = {
      id: `INV-${Date.now()}`,
      sku: formData.sku,
      name: formData.name,
      location: formData.location,
      quantity: formData.quantity,
      status: computeStatus(formData.quantity),
      lastUpdated: now,
    };
    setItems([newItem, ...items]);
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add Inventory Item
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          pb: selectedItem ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedItem ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedItem ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((i) => (
              <TableRow
                key={i.id}
                hover
                selected={selectedItem?.id === i.id}
                onClick={() => setSelectedItem(i)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{i.sku}</TableCell>
                <TableCell>{i.name}</TableCell>
                <TableCell>{i.location}</TableCell>
                <TableCell align="right">{i.quantity.toLocaleString()}</TableCell>
                <TableCell>{statusChip(i.status)}</TableCell>
                <TableCell>{i.lastUpdated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedItem && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedItem(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedItem.name} (${selectedItem.sku})`}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Location</Typography>
              <Typography variant="body2">{selectedItem.location}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Quantity</Typography>
              <Typography variant="body2">{selectedItem.quantity.toLocaleString()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography variant="body2">{selectedItem.status}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Last Updated</Typography>
              <Typography variant="body2">{selectedItem.lastUpdated}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Inventory Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 0 })}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!formData.sku || !formData.name || !formData.location}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;


