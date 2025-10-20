import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Security as SecurityIcon,
  QrCode as QrCodeIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  
  // eslint-disable-next-line no-console
  console.log('Dashboard component rendering');

  const summaryData = [
    {
      title: t('dashboard.lotBatches'),
      value: '89',
      icon: <QrCodeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
    },
    {
      title: t('dashboard.totalSuppliers'),
      value: '24',
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32',
    },
    {
      title: t('dashboard.activeProducts'),
      value: '156',
      icon: <InventoryIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02',
    },
    {
      title: t('dashboard.userAccounts'),
      value: '12',
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: '#9c27b0',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New lot batch created',
      item: 'LOT-2024-001',
      time: '2 minutes ago',
    },
    {
      id: 2,
      action: 'Product updated',
      item: 'SKU-001',
      time: '15 minutes ago',
    },
    {
      id: 3,
      action: 'Supplier added',
      item: 'ABC Manufacturing',
      time: '1 hour ago',
    },
    {
      id: 4,
      action: 'User login',
      item: 'admin@company.com',
      time: '2 hours ago',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {item.value}
                    </Typography>
                  </Box>
                  {item.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.systemOverview')}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Manufacturing traceback system overview showing key metrics and system status.
            </Typography>
            {/* Add charts or additional system information here */}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('dashboard.recentActivity')}
            </Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <TimelineIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={`${activity.item} • ${activity.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 