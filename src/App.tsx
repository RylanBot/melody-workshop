import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { ConfigProvider } from "tdesign-react";
import enConfig from "tdesign-react/es/locale/en_US";
import merge from "lodash/merge";

import Composition from "@/pages/Composition";
import Conversion from "@/pages/Conversion";
import Dashboard from "@/pages/Dashboard";
import Processing from "@/pages/Processing";

import TopNav from "@/components/TopNav";
import useSettings from "@/hooks/useSettings";

function Layout() {
  return (
    <div>
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
          path: "/conversion",
          element: <Conversion />
        },
        {
          path: "/processing",
          element: <Processing />
        },
        {
          path: "/composition",
          element: <Composition />
        }
      ]
    }
  ]);

  return (
    <>
      <ConfigProvider globalConfig={globalConfig}>
        <RouterProvider router={router} />;
      </ConfigProvider>
    </>
  );
}

export default App;
