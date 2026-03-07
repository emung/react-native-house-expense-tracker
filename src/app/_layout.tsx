import { Slot } from 'expo-router';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    surface: '#1E1E1E',
    backdrop: 'rgba(0,0,0,0.6)'
  }
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}
