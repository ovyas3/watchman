import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
type SnackbarType = 'success' | 'error' | 'warning';

interface SnackbarState {
  open: boolean;
  message: string;
  type: SnackbarType;
}

const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const showSnackbar = (message: string, type: SnackbarType) => {
    setSnackbar({
      open: true,
      message,
      type,
    });
  };

  return {
    showSnackbar,
    snackbarState: snackbar,
  };
};

const SnackbarComponent: React.FC<SnackbarState> = ({
  open,
  message,
  type,
}) => {
  return (
    <Snackbar 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open} 
      autoHideDuration={3000} 
      className='z-[9999] fixed top-4 right-4'
      sx={{
        '& .MuiAlert-root': {
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          minWidth: '300px',
          fontWeight: 600,
          padding: '12px 16px',
          alignItems: 'center',
        },
        '& .MuiAlert-icon': {
          marginRight: '12px',
        },
        '& .MuiAlert-message': {
          padding: 0,
        }
      }}
    >
      <Alert 
        variant="filled" 
        severity={type} 
        onClose={() => {}}
        className='w-full'
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export { useSnackbar, SnackbarComponent };
