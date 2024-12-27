import { Role } from '../../../api/src/lib/enums/role.enum';
import { Logout } from '../Logout';
import { Tabs } from '../../../api/src/lib/enums/tabs.enum';

export const Header = ({
  onLogoutSuccess,
  userRole,
  setSelectedTab,
}: {
  onLogoutSuccess: () => void,
  userRole: string | null,
  setSelectedTab: (tab: Tabs) => void
}) => {
  return (
    <header className="bg-slate-800 text-gray-200 p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="/public/boarLogo.png"
          alt="Logo"
          className="h-10 mr-4 cursor-pointer"
          onClick={() => setSelectedTab(Tabs.ASSIGNMENTS)}
        />
      </div>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <p
            className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
            onClick={() => setSelectedTab(Tabs.ASSIGNMENTS)}
          >
            Assignments
          </p>
          {userRole === Role.TEACHER && (
            <p 
              className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
              onClick={() => setSelectedTab(Tabs.GUIDELINES)}
            >
              Guidelines
            </p>
          )}
        </nav>
        <Logout onLogoutSuccess={onLogoutSuccess} />
      </div>
    </header>
  );
};
