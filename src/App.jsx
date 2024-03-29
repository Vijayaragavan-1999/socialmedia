import { useMemo, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import RouterRender from "./routes/routerRender";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import DashboardSkeleton from "./components/Skeleton/DashboardSkeleton/DashboardSkeleton";
import Loader from "./components/Loader/Loader";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchInterval: 30_000,
    },
  },
});


function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const fullURL = window.location.href;

  const loader = (url) => {
    if (url.includes("home")) {
      return <DashboardSkeleton />
    } else {
      return <Loader />
    }
  }
  
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={loader(fullURL)}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterRender />
              </ThemeProvider>
            </LocalizationProvider>
          </Suspense>
        </ErrorBoundary>
        <ToastContainer position="bottom-right" />
      </QueryClientProvider>

    </div>
  );
}

export default App;
