import { useColorModeValue } from '@chakra-ui/react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Helmet } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import ErrorFallback from './components/common/ErrorFallback';
import { GlobalLoading } from './components/common/Loading';
import router from './routes';
import { unregister } from './utils/serviceWorker';

function App() {
  const themeColor = useColorModeValue('white', '#121212');

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        unregister();
        window.location.reload();
      }}
    >
      <Helmet>
        <meta name="theme-color" content={themeColor} />
      </Helmet>
      <Suspense fallback={<GlobalLoading />}>
        <RouterProvider router={router} fallbackElement={<GlobalLoading />} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
