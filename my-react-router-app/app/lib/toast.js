import { toast } from 'react-toastify';

// Fallback if toast doesn't work
function fallbackNotification(message, type = 'success') {
  console.log(`[FALLBACK ${type.toUpperCase()}]`, message);
  // Try using alert as fallback
  if (typeof window !== 'undefined') {
    window.alert(`[${type.toUpperCase()}] ${message}`);
  }
}

export function showSuccessToast(message) {
  console.log('✅ Showing success toast:', message);
  try {
    const id = toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('✅ Toast ID:', id);
    return id;
  } catch (err) {
    console.error('❌ Error showing toast:', err);
    fallbackNotification(message, 'success');
  }
}

export function showErrorToast(message) {
  console.log('❌ Showing error toast:', message);
  try {
    const id = toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('❌ Toast ID:', id);
    return id;
  } catch (err) {
    console.error('❌ Error showing toast:', err);
    fallbackNotification(message, 'error');
  }
}

export function showInfoToast(message) {
  console.log('ℹ️ Showing info toast:', message);
  try {
    const id = toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('ℹ️ Toast ID:', id);
    return id;
  } catch (err) {
    console.error('❌ Error showing toast:', err);
    fallbackNotification(message, 'info');
  }
}

export function showWarningToast(message) {
  console.log('⚠️ Showing warning toast:', message);
  try {
    const id = toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('⚠️ Toast ID:', id);
    return id;
  } catch (err) {
    console.error('❌ Error showing toast:', err);
    fallbackNotification(message, 'warning');
  }
}
