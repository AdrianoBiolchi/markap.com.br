import { Outlet } from 'react-router-dom';
import Sidebar from './ui/Sidebar';

export default function Layout() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <Sidebar />
            <main style={{
                marginLeft: '320px',
                transition: 'all 0.3s ease',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>
        </div>
    );
}
