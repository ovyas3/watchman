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
    <Snackbar className='w-full' autoHideDuration={3000} open={open}>
    <Alert className='w-[95%]' variant="outlined" severity={type} >
        {message}
      </Alert>
      </Snackbar>
  );
};

export { useSnackbar, SnackbarComponent };
