export const Logout = ({ onLogoutSuccess }: { onLogoutSuccess: () => void }) => {
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("orgId");
      onLogoutSuccess();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-transparent text-gray-200 font-semibold hover:text-red-500 transition duration-200 ease-in-out focus:outline-none"
    >
      Logout
    </button>
  );
}
