import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Organisations } from "./components/Organisations";
import { Role } from "../api/src/lib/enums/role.enum";
import { StudentView } from "./components/StudentView";
import { TeacherView } from "./components/TeacherView";
import { Header } from "./components/Header";
import { Tabs } from "../api/src/lib/enums/tabs.enum";

export const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true); 
  const [selectedOrganisation, setSelectedOrganisation] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState(Tabs.ASSIGNMENTS);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsUserLoggedIn(true);
    }

    window.ipcRenderer.on('app-closing', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('orgId');
      setIsUserLoggedIn(false);
      console.log('App is closing, logging out the user...');
    });
  }, []);

  const handleLoginSuccess = (userRole: string) => {
    setIsUserLoggedIn(true);
    setUserRole(userRole);
  };

  const handleLogoutSuccess = () => {
    setIsUserLoggedIn(false);
    setSelectedOrganisation(null);
    setShowLogin(true);
  };

  const toggleAuthView = () => {
    setShowLogin(!showLogin);
  };

  const handleOrgLoginSuccess = (orgId: string) => {
    setSelectedOrganisation(orgId);
    localStorage.setItem("orgId", orgId);
  };

  if (!isUserLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {
          showLogin ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              toggleAuthView={toggleAuthView}
            />
          ) : (
            <Register
              onRegisterSuccess={handleLoginSuccess}
              toggleAuthView={toggleAuthView}
            />
          )
        }
      </div>
    );
  }

  if (!selectedOrganisation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Organisations
          onOrgLoginSuccess={handleOrgLoginSuccess}
          userRole={userRole}
          onLogoutSuccess={handleLogoutSuccess}
        />
      </div>
    );
  }
  
  return (
    <div>
      <Header
        onLogoutSuccess={handleLogoutSuccess}
        userRole={userRole}
        setSelectedTab={setSelectedTab}
      />
      {
        userRole === Role.STUDENT && (
          <StudentView
            userRole={userRole}
            selectedTab={selectedTab}
          />
        )
      }
      {
        userRole === Role.TEACHER && (
          <TeacherView
            userRole={userRole}
            selectedTab={selectedTab}
          />
        )
      }
    </div>
  )
}
