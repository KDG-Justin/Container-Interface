import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Container, Image, HardDrive, Network, LayoutDashboard } from 'lucide-react';
import {Link, useLocation} from "react-router-dom";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { text: 'Containers', path: '/containers', icon: <Container size={20} /> },
  { text: 'Images', path: '/images', icon: <Image size={20} /> },
  { text: 'Volumes', path: '/volumes', icon: <HardDrive size={20} /> },
  { text: 'Networks', path: '/networks', icon: <Network size={20} /> },
];


export function DrawerComponent({open, onClose} : DrawerProps){
    const location = useLocation();     

    
    return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 260,
            backgroundColor: '#285A48',
            color: '#f3f4f6',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#B0E4CC', 
            letterSpacing: '0.05em' 
          }}
        >
          Docker
        </Typography>
      </Box>

      <Divider sx={{ borderColor: '#408A71' }} />

      
      <List sx={{ pt: 1.5 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.8, px: 1.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onClose}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: isActive ? '#B0E4CC' : 'transparent',
                  color: isActive ? '#091413' : '#f3f4f6',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: isActive ? '#B0E4CC' : '#408A71',
                    color: isActive ? '#091413' : '#ffffff',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? '#091413' : '#B0E4CC', 
                    minWidth: '40px' 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}