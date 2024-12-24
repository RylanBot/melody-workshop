import merge from "lodash/merge";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ConfigProvider } from "tdesign-react";
import enConfig from "tdesign-react/es/locale/en_US";

import { MultiTrackProvider } from "@/hooks/useMultiTrackContext";
import useSettings from "@/hooks/useSettings";
import { WaveSurferProvider } from "@/hooks/useWaveSurferContext";

import Mixing from "@/pages/Mixing";
import Dashboard from "@/pages/Dashboard";
import Processing from "@/pages/Processing";

import TopNav from "@/components/layout/TopNav";
import LoadingOverlay from "@/components/layout/LoadingOverlay";

function Layout() {
  return (
    <div>
      <LoadingOverlay />
      <TopNav />
      <Outlet />
    </div>
  );
}

function App() {
  useSettings();

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
