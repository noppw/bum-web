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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import DetailsPanel from './DetailsPanel';

interface Customer {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

const Customers: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'C-1001',
      name: 'John Smith',
      status: 'active',
      lastContact: '2025-01-15',
    },
    {
      id: 'C-1002',
      name: 'Jane Doe',
      status: 'active',
      lastContact: '2025-01-14',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
    name: '',
    status: 'active' as 'active' | 'inactive',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpen = (customer?: Customer) => {
    if (customer) {
      setEditing(customer);
      setFormData({
        name: customer.name,
        status: customer.status,
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editing) {
      setCustomers(customers.map(c =>
        c.id === editing.id
          ? { ...formData, id: editing.id, lastContact: editing.lastContact }
          : c
      ));
    } else {
      const newCustomer: Customer = {
        id: `C-${Date.now()}`,
        ...formData,
        lastContact: new Date().toISOString().split('T')[0],
      };
      setCustomers([newCustomer, ...customers]);
    }
    setOpenDialog(false);
  };

  const handleDelete = (customer: Customer) => {
    setCustomers(customers.filter(c => c.id !== customer.id));
  };

  const isFormValid = () => {
    return formData.name;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('customers.title')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          {t('customers.addCustomer')}
        </Button>
        <TextField
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          pb: selectedCustomer ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedCustomer ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedCustomer ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('customers.name')}</TableCell>
              <TableCell>{t('customers.status')}</TableCell>
              <TableCell>{t('customers.lastContact')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((customer) => (
              <TableRow
                key={customer.id}
                hover
                selected={selectedCustomer?.id === customer.id}
                onClick={() => setSelectedCustomer(customer)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: customer.status === 'active' ? 'success.light' : 'error.light',
                      color: customer.status === 'active' ? 'success.dark' : 'error.dark',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {customer.status === 'active' ? t('customers.active') : t('customers.inactive')}
                  </Box>
                </TableCell>
                <TableCell>{customer.lastContact}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(customer)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCustomers.length}
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

      {selectedCustomer && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedCustomer(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={selectedCustomer.name}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('customers.lastContact')}</Typography>
              <Typography variant="body2">{selectedCustomer.lastContact}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? t('common.edit') : t('customers.addCustomer')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('customers.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>{t('customers.status')}</InputLabel>
                <Select
                  value={formData.status}
                  label={t('customers.status')}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <MenuItem value="active">{t('customers.active')}</MenuItem>
                  <MenuItem value="inactive">{t('customers.inactive')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={!isFormValid()}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Customers;
