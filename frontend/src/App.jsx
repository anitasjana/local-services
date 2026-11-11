import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Categories from "./pages/Categories";
import Providers from "./pages/Providers";
import ProviderProfile from "./pages/ProviderProfile";
import Booking from "./pages/Booking";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Chat from "./pages/Chat";
import WriteReview from "./pages/WriteReview";
import ProviderOnboarding from "./pages/ProviderOnboarding";
import AddService from "./pages/AddService";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/write-review" element={<WriteReview />} />
        <Route path="/provider-onboarding" element={<ProviderOnboarding />} />
        <Route path="/admin/add-service" element={<AddService />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
