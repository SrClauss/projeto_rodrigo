import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import MainScreen from './screens/MainScreen/MainScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';
import AdminScreen from './screens/AdminScreen/AdminScreen';
import CadastroEntradaEstoque from './screens/CadastroEntradaEstoque/CadastroEntradaEstoque';
import { NavigationProvider, NavigationContext } from './NavigationContext';

const App = () => {
  const theme = createTheme({
    palette: {
      primary: { main: '#549b86' },
      secondary: { main: '#045b1c' },
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: { color: '#003000', borderRadius: '5px' },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <NavigationProvider>


        <ScreenRenderer />
      </NavigationProvider>
      
    </ThemeProvider>
  );
};

const ScreenRenderer = () => {
  const { activeScreen } = React.useContext(NavigationContext);

  switch (activeScreen) {
    case 'LoginScreen':
      return <LoginScreen />;
    case 'MainScreen':
      return <MainScreen />;
    case 'AdminScreen':
      return <AdminScreen />;
    case 'CadastroEntradaEstoque':
      return <CadastroEntradaEstoque />;
    default:
      return <LoginScreen />;
  }
};

export default App;