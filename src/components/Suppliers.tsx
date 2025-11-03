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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  DialogContentText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import DetailsPanel from './DetailsPanel';

interface Supplier {
  id: string;
  name: string;
  branch: string;
  contact: string;
  email: string;
  phone: string;
  status: string;
  lastUpdated: string;
}

const Suppliers: React.FC = () => {
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'ABC Manufacturing Co.',
      branch: 'Branch A',
      contact: 'John Smith',
      email: 'john@abc.com',
      phone: '+1-555-0123',
      status: 'active',
      lastUpdated: '2024-01-15',
    },
    {
      id: '2',
      name: 'XYZ Electronics Ltd.',
      branch: 'Branch B',
      contact: 'Sarah Johnson',
      email: 'sarah@xyz.com',
      phone: '+1-555-0456',
      status: 'active',
      lastUpdated: '2024-01-14',
    },
    {
      id: '3',
      name: 'Tech Solutions Inc.',
      branch: 'Branch C',
      contact: 'Mike Brown',
      email: 'mike@tech.com',
      phone: '+1-555-0789',
      status: 'inactive',
      lastUpdated: '2024-01-13',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
    contact: '',
    email: '',
    phone: '',
    status: 'active',
    lastUpdated: '',
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

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSuppliers = filteredSuppliers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      name: '',
      branch: '',
      contact: '',
      email: '',
      phone: '',
      status: 'active',
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditing(supplier);
    setFormData({
      name: supplier.name,
      branch: supplier.branch,
      contact: supplier.contact,
      email: supplier.email,
      phone: supplier.phone,
      status: supplier.status,
      lastUpdated: supplier.lastUpdated,
    });
    setOpenDialog(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setDeleting(supplier);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleting) {
      setSuppliers(suppliers.filter(s => s.id !== deleting.id));
      setDeleteDialog(false);
      setDeleting(null);
    }
  };

  const handleSave = () => {
    if (editing) {
      setConfirmDialog(true);
    } else {
      const newSupplier: Supplier = {
        ...formData,
        id: Date.now().toString(),
      };
      setSuppliers([...suppliers, newSupplier]);
      setOpenDialog(false);
    }
  };

  const confirmUpdate = () => {
    if (editing) {
      setSuppliers(suppliers.map(s =>
        s.id === editing.id
          ? { ...formData, id: editing.id }
          : s
      ));
      setOpenDialog(false);
      setConfirmDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('suppliers.title')}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('suppliers.addSupplier')}
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
          pb: selectedSupplier ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedSupplier ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedSupplier ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('suppliers.name')}</TableCell>
              <TableCell>{t('suppliers.branch')}</TableCell>
              <TableCell>{t('suppliers.contact')}</TableCell>
              <TableCell>{t('suppliers.email')}</TableCell>
              <TableCell>{t('suppliers.phone')}</TableCell>
              <TableCell>{t('suppliers.status')}</TableCell>
              <TableCell>{t('suppliers.lastUpdated')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSuppliers.map((supplier) => (
              <TableRow
                key={supplier.id}
                hover
                selected={selectedSupplier?.id === supplier.id}
                onClick={() => setSelectedSupplier(supplier)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.branch}</TableCell>
                <TableCell>{supplier.contact}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.status}</TableCell>
                <TableCell>{supplier.lastUpdated}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(supplier)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(supplier)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {selectedSupplier && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedSupplier(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={selectedSupplier.name}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.branch')}</Typography>
              <Typography variant="body2">{selectedSupplier.branch}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.contact')}</Typography>
              <Typography variant="body2">{selectedSupplier.contact}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.email')}</Typography>
              <Typography variant="body2">{selectedSupplier.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.phone')}</Typography>
              <Typography variant="body2">{selectedSupplier.phone}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.status')}</Typography>
              <Typography variant="body2">{selectedSupplier.status}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('suppliers.lastUpdated')}</Typography>
              <Typography variant="body2">{selectedSupplier.lastUpdated}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? t('common.edit') : t('suppliers.addSupplier')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('suppliers.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('suppliers.branch')}
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('suppliers.contact')}
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('suppliers.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('suppliers.phone')}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('suppliers.status')}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>{t('confirm.updateTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirm.supplierUpdateMessage')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmUpdate} variant="contained" color="primary">
            {t('common.update')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>{t('confirm.deleteTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('confirm.supplierDeleteMessage').replace('{name}', deleting?.name || '')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers; 