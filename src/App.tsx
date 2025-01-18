import merge from "lodash/merge";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfigProvider } from "tdesign-react";
import enConfig from "tdesign-react/es/locale/en_US";

import { MultiTrackProvider } from "@/hooks/useMultiTrackContext";
import { WaveSurferProvider } from "@/hooks/useWaveSurferContext";

import { Footer, LoadingOverlay, TopNav } from "@/components/layout";
import { Dashboard, Mixing, Processing } from "@/pages";

function Layout() {
  return (
    <>
      <LoadingOverlay />
      <TopNav />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  const globalConfig = merge(enConfig, {});

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Dashboard />
        },
        {
          path: "/processing",
          element: (
            <WaveSurferProvider>
              <Processing />
            </WaveSurferProvider>
          )
        },
        {
          path: "/mixing",
          element: (
            <MultiTrackProvider>
              <Mixing />
            </MultiTrackProvider>
          )
        }
      ]
    }
  ]);

  return (
    <>
      <ConfigProvider globalConfig={globalConfig}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  );
}

export default App;
