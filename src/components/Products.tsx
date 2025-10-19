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
  Grid,
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

interface Product {
  id: string;
  sku: string;
  name: string;
  model: string;
  category: string;
  imageUrl: string;
  tisi: string;
  lastUpdated: string;
}

const Products: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      sku: 'SKU-001',
      name: 'Electronic Component A',
      model: 'EC-A-2024',
      category: 'Electronics',
      imageUrl: 'https://example.com/image1.jpg',
      tisi: 'TISI-001',
      lastUpdated: '2024-01-15',
    },
    {
      id: '2',
      sku: 'SKU-002',
      name: 'Mechanical Part B',
      model: 'MP-B-2024',
      category: 'Mechanical',
      imageUrl: 'https://example.com/image2.jpg',
      tisi: 'TISI-002',
      lastUpdated: '2024-01-14',
    },
    {
      id: '3',
      sku: 'SKU-003',
      name: 'Chemical Material C',
      model: 'CM-C-2024',
      category: 'Chemical',
      imageUrl: 'https://example.com/image3.jpg',
      tisi: 'TISI-003',
      lastUpdated: '2024-01-13',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    model: '',
    category: '',
    imageUrl: '',
    tisi: '',
    lastUpdated: '',
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(
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
      sku: '',
      name: '',
      model: '',
      category: '',
      imageUrl: '',
      tisi: '',
      lastUpdated: new Date().toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      model: product.model,
      category: product.category,
      imageUrl: product.imageUrl,
      tisi: product.tisi,
      lastUpdated: product.lastUpdated,
    });
    setOpenDialog(true);
  };

  const handleDelete = (product: Product) => {
    setDeleting(product);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleting) {
      setProducts(products.filter(p => p.id !== deleting.id));
      setDeleteDialog(false);
      setDeleting(null);
    }
  };

  const handleSave = () => {
    if (editing) {
      setConfirmDialog(true);
    } else {
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
      };
      setProducts([...products, newProduct]);
      setOpenDialog(false);
    }
  };

  const confirmUpdate = () => {
    if (editing) {
      setProducts(products.map(p =>
        p.id === editing.id
          ? { ...formData, id: editing.id }
          : p
      ));
      setOpenDialog(false);
      setConfirmDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('products.title')}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('products.addProduct')}
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
          pb: selectedProduct ? (panelCollapsed ? 56 : panelHeight + 16) : 0,
          maxHeight: selectedProduct ? `calc(100vh - 200px - ${panelCollapsed ? 56 : panelHeight}px)` : 'none',
          overflowY: selectedProduct ? 'auto' : 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('products.sku')}</TableCell>
              <TableCell>{t('products.name')}</TableCell>
              <TableCell>{t('products.model')}</TableCell>
              <TableCell>{t('products.category')}</TableCell>
              <TableCell>{t('products.imageUrl')}</TableCell>
              <TableCell>{t('products.tisi')}</TableCell>
              <TableCell>{t('products.lastUpdated')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow
                key={product.id}
                hover
                selected={selectedProduct?.id === product.id}
                onClick={() => setSelectedProduct(product)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.model}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.imageUrl}</TableCell>
                <TableCell>{product.tisi}</TableCell>
                <TableCell>{product.lastUpdated}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product)}>
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {selectedProduct && (
        <DetailsPanel
          open
          height={panelHeight}
          onResizeStart={() => setIsResizing(true)}
          onClose={() => setSelectedProduct(null)}
          onToggleCollapse={() => setPanelCollapsed(!panelCollapsed)}
          collapsed={panelCollapsed}
          title={`${selectedProduct.name} (${selectedProduct.sku})`}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('products.model')}</Typography>
              <Typography variant="body2">{selectedProduct.model}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('products.category')}</Typography>
              <Typography variant="body2">{selectedProduct.category}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('products.tisi')}</Typography>
              <Typography variant="body2">{selectedProduct.tisi}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('products.imageUrl')}</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{selectedProduct.imageUrl}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('products.lastUpdated')}</Typography>
              <Typography variant="body2">{selectedProduct.lastUpdated}</Typography>
            </Box>
          </Box>
        </DetailsPanel>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editing ? t('common.edit') : t('products.addProduct')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.sku')}
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.model')}
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.category')}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.imageUrl')}
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label={t('products.tisi')}
                value={formData.tisi}
                onChange={(e) => setFormData({ ...formData, tisi: e.target.value })}
                fullWidth
              />
            </Grid>
          </Grid>
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
            {t('confirm.productUpdateMessage')}
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
            {t('confirm.productDeleteMessage').replace('{name}', deleting?.name || '')}
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

export default Products; 