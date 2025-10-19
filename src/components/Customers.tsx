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
  email: string;
  phone: string;
  company: string;
  address: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

const Customers: React.FC = () => {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'C-1001',
      name: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0123',
      company: 'Acme Corporation',
      address: '123 Business St, City, State 12345',
      status: 'active',
      lastContact: '2025-01-15',
    },
    {
      id: 'C-1002',
      name: 'Jane Doe',
      email: 'jane.doe@techcorp.com',
      phone: '+1-555-0456',
      company: 'Tech Corp',
      address: '456 Tech Ave, City, State 12345',
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
    email: '',
    phone: '',
    company: '',
    address: '',
    status: 'active' as 'active' | 'inactive',
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpen = (customer?: Customer) => {
    if (customer) {
      setEditing(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        address: customer.address,
        status: customer.status,
      });
    } else {
      setEditing(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) return;

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
    return formData.name && formData.email;
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
              <TableCell>{t('customers.email')}</TableCell>
              <TableCell>{t('customers.phone')}</TableCell>
              <TableCell>{t('customers.company')}</TableCell>
              <TableCell>{t('customers.status')}</TableCell>
              <TableCell>{t('customers.lastContact')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow
                key={customer.id}
                hover
                selected={selectedCustomer?.id === customer.id}
                onClick={() => setSelectedCustomer(customer)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.company}</TableCell>
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
              <Typography variant="caption" color="text.secondary">{t('customers.email')}</Typography>
              <Typography variant="body2">{selectedCustomer.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('customers.phone')}</Typography>
              <Typography variant="body2">{selectedCustomer.phone}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('customers.company')}</Typography>
              <Typography variant="body2">{selectedCustomer.company}</Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: 'auto', sm: '1 / span 2' } }}>
              <Typography variant="caption" color="text.secondary">{t('customers.address')}</Typography>
              <Typography variant="body2">{selectedCustomer.address}</Typography>
            </Box>
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
              <TextField
                label={t('customers.email')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('customers.phone')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('customers.company')}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={t('customers.address')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                fullWidth
                multiline
                rows={2}
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
