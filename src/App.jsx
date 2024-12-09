import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {CirclesWithBar} from 'react-loader-spinner';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import NavBar from './components/dashboard/NavBar';
import AuthGuard from './components/auth/AuthGuard';
import CreatePassword from './components/auth/CreatePassword';
import ForgotPassword from './components/auth/ForgotPassword';
import Settings from './components/dashboard/Settings';
import Overview from './components/dashboard/Overview';
import Panel from './components/dashboard/Panel';
import Chat from './components/dashboard/Chat';
import Contact from './components/dashboard/Contact';
import Documentation from './components/dashboard/Documentation';
import Upload from './components/dashboard/Upload';
import Visualization from './components/dashboard/Visualization';
import Report from './components/dashboard/Report';
import authService from './services/authService';
import tokenUtils from './utils/tokenUtils';
import { LOGIN_SUCCESS, LOGIN_FAILURE } from './redux/actions/types';
import Notify from './components/dashboard/Notify';
import ReportCard from './components/dashboard/ReportCard';
import ReportCardInside from './components/dashboard/reportComponents/ReportCardInside';
import AnnualReportInside from './components/dashboard/reportComponents/AnnualReportInside';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            document.body.classList.add('dark');
        } else {
            localStorage.setItem('darkMode', 'false');
            document.body.classList.remove('dark');
        }
    }, []);
    useEffect(() => {
        const autoLogin = async () => {
            const token = tokenUtils.getToken();
            if (token) {
                try {
                    const response = await authService.validateToken();
                    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
                } catch (error) {
                    dispatch({ type: LOGIN_FAILURE, payload: error.response?.data?.message || error.message });
                }
            }
            setLoading(false); 
        };
        autoLogin();
    }, [dispatch, navigate]);

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                const currentPath = window.location.pathname;
                const publicPaths = ['/', '/login', '/create-password', '/forgot-password'];
                if (isAuthenticated && publicPaths.includes(currentPath)) {
                    navigate('/dashboard');
                }
            }
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CirclesWithBar color="#4F46E5" height={50} width={50} />
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-password" element={<CreatePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<AuthGuard component={NavBar} />}>
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="settings" element={<Settings />} />
                <Route path="panel" element={<Panel />} />
                <Route path="chat" element={<Chat />} />
                <Route path="contact" element={<Contact />} />
                <Route path="documentation" element={<Documentation />} />
                <Route path="upload" element={<Upload />} />
                <Route path="visualization" element={<Visualization />} />
                <Route path="report" element={<Report />} />
                <Route path="reportcard" element={<ReportCard />} />
                <Route path="reportcard/create" element={<ReportCardInside />} />
                <Route path="report/create" element={<AnnualReportInside />} />
                <Route path="notify" element={<Notify />} />
            </Route>
            <Route path='/*' element={<NavBar />} />
        </Routes>
    );
};

export default App;
