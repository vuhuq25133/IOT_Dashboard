import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

import DashboardPage from "@/components/pages/DashboardPage.tsx";
import DataSensorPage from "./components/pages/DataSensorsPage";
import ProfilePage from "@/components/pages/ProfilePage.tsx";
import ActionHistoryPage from "./components/pages/ActionHistoryPage";
// import NotFoundPage from "@/pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Layout chính */}
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} /> 
        <Route path="/history" element={<ActionHistoryPage />} />
        <Route path="/sensors" element={<DataSensorPage />} /> 
        <Route path="/profile" element={<ProfilePage />} /> 
      </Route>

      {/* Trang 404 */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
