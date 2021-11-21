import React from 'react';
import { AuthProvider } from './Context/AuthContext';
import Program from './components/Program';

export default function App() {

  return (
    <AuthProvider>
      <Program />
    </AuthProvider>
  );
}