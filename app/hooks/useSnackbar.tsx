import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackBarProps {
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  open?: boolean;
  autoHideDuration?: number;
}

export const useSnackBar = () => {
  const [snackBarProps, setSnackBarProps] = React.useState<SnackBarProps>({
    message: '',
    severity: 'info',
    open: false,
    autoHideDuration: 6000
  });

  const showSnackBar = React.useCallback((props: SnackBarProps) => {
    setSnackBarProps({
      message: props.message,
      severity: props.severity || 'info',
      open: true,
      autoHideDuration: props.autoHideDuration || 6000
    });
  }, []);

  const handleClose = React.useCallback((
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarProps(prev => ({ ...prev, open: false }));
  }, []);

  const SnackBarComponent = React.useMemo(() => {
    return (
      <Snackbar 
        open={snackBarProps.open} 
        autoHideDuration={snackBarProps.autoHideDuration} 
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackBarProps.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBarProps.message}
        </Alert>
      </Snackbar>
    );
  }, [snackBarProps, handleClose]);

  return { 
    showSnackBar, 
    SnackBarComponent 
  };
};