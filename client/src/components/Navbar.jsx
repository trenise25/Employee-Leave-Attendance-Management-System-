import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-brand">
                        <span className="brand-icon">👥</span>
                        <span className="brand-text">Employee Management</span>
                    </Link>

                    <div className="navbar-menu">
                        {user && (
                            <>
                                <Link to="/" className="nav-link">Dashboard</Link>

                                {isAdmin() && (
                                    <>
                                        <Link to="/employees" className="nav-link">Employees</Link>
                                        <Link to="/leave-approval" className="nav-link">Leave Requests</Link>
                                    </>
                                )}

                                {!isAdmin() && (
                                    <>
                                        <Link to="/leave-request" className="nav-link">Apply Leave</Link>
                                        <Link to="/my-leaves" className="nav-link">My Leaves</Link>
                                    </>
                                )}

                                <Link to="/attendance" className="nav-link">Attendance</Link>

                                <div className="navbar-user">
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-role">{user.role}</span>
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
