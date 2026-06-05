import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainEditor } from './components/MainEditor';
import { SandboxEditor } from './components/sandbox/SandboxEditor';
import { TierProvider } from './contexts/TierContext';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PricingPage } from './pages/PricingPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';

// Legal pages
import { PrivacyPolicyPage } from './pages/legal/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/legal/TermsOfServicePage';
import { ContactUsPage } from './pages/legal/ContactUsPage';
import { RefundPolicyPage } from './pages/legal/RefundPolicyPage';
import { CompliancePage } from './pages/legal/CompliancePage';

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
                        
                        {/* Legal Routes */}
                        <Route path="/privacy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms" element={<TermsOfServicePage />} />
                        <Route path="/contact" element={<ContactUsPage />} />
                        <Route path="/refund" element={<RefundPolicyPage />} />
                        <Route path="/compliance" element={<CompliancePage />} />
                    </Routes>
                </BrowserRouter>
            </TierProvider>
        </AuthProvider>
    );
}

export default App;


