import { useDispatch, useSelector } from 'react-redux';

// Typed hooks for Redux - Use throughout your app instead of plain `useDispatch` and `useSelector`
// These are useful for consistency and future TypeScript migration
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

