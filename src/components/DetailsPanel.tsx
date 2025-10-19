import React from 'react';
import { Box, Paper, IconButton, Tooltip, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, Close } from '@mui/icons-material';

interface DetailsPanelProps {
  open: boolean;
  height: number;
  onResizeStart: () => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  title?: string;
  children?: React.ReactNode;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  open,
  height,
  onResizeStart,
  onClose,
  onToggleCollapse,
  collapsed,
  title,
  children,
}) => {
  if (!open) return null;
  const panelHeight = collapsed ? 40 : height;

  return (
    <Box sx={{ position: 'sticky', bottom: 0, zIndex: 1, mt: 1.5 }}>
      <Paper
        sx={{
          p: 0,
          height: panelHeight,
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -6px 16px rgba(0,0,0,0.08)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, height: 40 }}>
          <Box onMouseDown={onResizeStart} sx={{ height: 8, width: 64, cursor: 'row-resize', bgcolor: 'divider', borderRadius: 4, mr: 1 }} />
          <Typography variant="subtitle2" sx={{ flexGrow: 1, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title || 'Details'}
          </Typography>
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
            <IconButton size="small" onClick={onToggleCollapse} aria-label={collapsed ? 'expand' : 'collapse'}>
              {collapsed ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Close">
            <IconButton size="small" onClick={onClose} aria-label="close">
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        {!collapsed && (
          <Box sx={{ p: 2, pt: 0, overflow: 'auto', flex: 1 }}>
            {children}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DetailsPanel;


