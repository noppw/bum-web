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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const AccessManagement: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager1@company.com',
      role: 'Manager',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
    },
    {
      id: '3',
      username: 'operator1',
      email: 'operator1@company.com',
      role: 'Operator',
      status: 'inactive',
      lastLogin: '2024-01-14 16:45',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    status: 'active',
    lastLogin: '',
  });

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
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
      username: '',
      email: '',
      role: '',
      status: 'active',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });
    setOpenDialog(true);
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      lastLogin: user.lastLogin,
    });
    setOpenDialog(true);
  };

  const handleDelete = (user: User) => {
    setDeleting(user);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleting) {
      setUsers(users.filter(u => u.id !== deleting.id));
      setDeleteDialog(false);
      setDeleting(null);
    }
  };

  const handleSave = () => {
    if (editing) {
      setConfirmDialog(true);
    } else {
      const newUser: User = {
        ...formData,
        id: Date.now().toString(),
      };
      setUsers([...users, newUser]);
      setOpenDialog(false);
    }
  };

  const confirmUpdate = () => {
    if (editing) {
      setUsers(users.map(u =>
        u.id === editing.id
          ? { ...formData, id: editing.id }
          : u
      ));
      setOpenDialog(false);
      setConfirmDialog(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('access.title')}
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          {t('access.addUser')}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('access.username')}</TableCell>
              <TableCell>{t('access.email')}</TableCell>
              <TableCell>{t('access.role')}</TableCell>
              <TableCell>{t('access.status')}</TableCell>
              <TableCell>{t('access.lastLogin')}</TableCell>
              <TableCell>{t('common.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user)}>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editing ? t('common.edit') : t('access.addUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label={t('access.username')}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              fullWidth
            />
            <TextField
              label={t('access.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('access.role')}</InputLabel>
              <Select
                value={formData.role}
                label={t('access.role')}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="Administrator">Administrator</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Operator">Operator</MenuItem>
                <MenuItem value="Viewer">Viewer</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('access.status')}</InputLabel>
              <Select
                value={formData.status}
                label={t('access.status')}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
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
            {t('confirm.userUpdateMessage')}
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
            {t('confirm.userDeleteMessage').replace('{username}', deleting?.username || '')}
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

export default AccessManagement; 