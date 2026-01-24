import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import { toast, type ToastContentProps } from 'react-toastify';

// Fallback if toast doesn't work
function fallbackNotification(message: any, type = 'success') {
  console.log(`[FALLBACK ${type.toUpperCase()}]`, message);
  // Try using alert as fallback
  if (typeof window !== 'undefined') {
    window.alert(`[${type.toUpperCase()}] ${message}`);
  }
}

export function showSuccessToast(message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) {
  console.log(' Showing success toast:', message);
  try {
    const id = toast.success(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log(' Toast ID:', id);
    return id;
  } catch (err) {
    console.error(' Error showing toast:', err);
    fallbackNotification(message, 'success');
  }
}

export function showErrorToast(message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) {
  console.log(' Showing error toast:', message);
  try {
    const id = toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log(' Toast ID:', id);
    return id;
  } catch (err) {
    console.error(' Error showing toast:', err);
    fallbackNotification(message, 'error');
  }
}

export function showInfoToast(message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) {
  console.log('ℹ Showing info toast:', message);
  try {
    const id = toast.info(message, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log('ℹ Toast ID:', id);
    return id;
  } catch (err) {
    console.error(' Error showing toast:', err);
    fallbackNotification(message, 'info');
  }
}

export function showWarningToast(message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) {
  console.log(' Showing warning toast:', message);
  try {
    const id = toast.warning(message, {
      position: 'top-right',
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    console.log(' Toast ID:', id);
    return id;
  } catch (err) {
    console.error(' Error showing toast:', err);
    fallbackNotification(message, 'warning');
  }
}

// Generic showToast function that accepts type parameter
export function showToast(message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined, type = 'success') {
  console.log(` Showing ${type} toast:`, message);
  
  switch (type) {
    case 'success':
      return showSuccessToast(message);
    case 'error':
      return showErrorToast(message);
    case 'info':
      return showInfoToast(message);
    case 'warning':
      return showWarningToast(message);
    default:
      return showSuccessToast(message);
  }
}
