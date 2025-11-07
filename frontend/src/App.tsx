import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/components/pages/DashboardPage.tsx";
import DataSensorPage from "./components/pages/DataSensorsPage";
import ProfilePage from "@/components/pages/ProfilePage.tsx";
import ActionHistoryPage from "./components/pages/ActionHistoryPage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/history" element={<ActionHistoryPage />} />
        <Route path="/sensors" element={<DataSensorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
