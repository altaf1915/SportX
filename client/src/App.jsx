import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Chat from "./pages/Chat";
import Community from "./pages/Community";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Matches from "./pages/Matches";
import Partners from "./pages/Partners";
import Premium from "./pages/Premium";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="partners" element={<Partners />} />
            <Route path="matches" element={<Matches />} />
            <Route path="chat" element={<Chat />} />
            <Route path="community" element={<Community />} />
            <Route path="profile" element={<Profile />} />
            <Route path="premium" element={<Premium />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
