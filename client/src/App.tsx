import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainEditor } from './components/MainEditor';
import { SandboxEditor } from './components/sandbox/SandboxEditor';
import { TierProvider } from './contexts/TierContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';

function App() {
    return (
        <AuthProvider>
            <TierProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                        <Route path="/payment-success/pro" element={<PaymentSuccessPage planType="pro" />} />
                        <Route path="/payment-success/plus" element={<PaymentSuccessPage planType="pro_plus" />} />
                        <Route path="/payment-success" element={<PaymentSuccessPage />} />
                        <Route path="/templates" element={<MainEditor />} />
                        <Route path="/sandbox" element={<SandboxEditor />} />
                    </Routes>
                </BrowserRouter>
            </TierProvider>
        </AuthProvider>
    );
}

export default App;


