import React from 'react';
import { Box, Container } from '@mui/material';
import { SignIn } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const location = useLocation();
  
  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <SignIn 
          routing="path" 
          path={location.pathname}
          signUpUrl="/login#sign-up" 
          afterSignInUrl="/dashboard" 
          appearance={{ 
            elements: { 
              formButtonPrimary: { backgroundColor: '#2e7d32' }
            }
          }} 
        />
      </Box>
    </Container>
  );
};

export default Login;