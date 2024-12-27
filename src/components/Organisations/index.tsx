import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrganisations, updateOrganisation } from "../../../api/src/services/organisationService";
import { LoadingAnimation } from "../LoadingAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faPlus, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Logout } from "../Logout";
import { useState } from "react";
import { AddEditOrgModal } from "../AddEditOrgModal";
import { ModifyUserInOrganisationAction } from '../../../api/src/lib/enums/modifyUserInOrganisationAction.enum';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Organisation {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  logoUrl?: string;
}

export const Organisations = ({
  onOrgLoginSuccess,
  userRole,
  onLogoutSuccess,
}: {
  onOrgLoginSuccess: (orgId: string) => void;
  userRole: string | null;
  onLogoutSuccess: () => void;
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organisation | null>(null);

  const queryClient = useQueryClient();

  const { data: organisations, isLoading } = useQuery({
    queryFn: () => fetchOrganisations(),
    queryKey: ["organisations"],
  });

  const { mutateAsync: updateOrgMutation } = useMutation({
    mutationFn: updateOrganisation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      toast.success('Organisation updated successfully');
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update organisation');
    },
  });

  if (isLoading) {
    return <LoadingAnimation />;
  }

  const openCreateOrgModal = () => {
    setSelectedOrg(null);
    setModalOpen(true);
  };

  const openEditOrgModal = (org: Organisation) => {
    setSelectedOrg(org);
    setModalOpen(true);
  };

  const handleLeaveOrg = async (orgId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    await updateOrgMutation({
      orgId: orgId,
      action: ModifyUserInOrganisationAction.LEAVE,
    });
  };

  const closeModal = () => setModalOpen(false);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-2xl" style={{ width: "600px" }}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">
          Your Organisations
        </h2>
        {userRole === "teacher" && (
          <button
            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold w-auto mx-auto mb-4"
            onClick={openCreateOrgModal}
            style={{ width: "fit-content" }}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Organisation
          </button>
        )}
        <div className="space-y-4">
          {organisations.userOrganisations.length === 0 ? (
            <p className="text-center text-white">
              You have not been added to any organisations
            </p>
          ) : (
            organisations.userOrganisations.map((org: Organisation) => (
              <div
                className="flex justify-between items-center bg-slate-700 hover:bg-slate-600 transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer"
                key={org._id}
                onClick={() => onOrgLoginSuccess(org._id)}
              >
                <div className="flex items-center">
                  {org.logoUrl ? (
                    <img
                      src={org.logoUrl}
                      alt={`${org.name} logo`}
                      className="w-8 h-8 mr-3 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 mr-3 rounded-full bg-green-500 flex items-center justify-center text-white">
                      {getInitials(org.name)}
                    </div>
                  )}
                  <h3 className="text-white font-medium">{org.name}</h3>
                </div>
                <div className="flex items-center">
                  {userRole === "teacher" && (
                    <button
                      className="bg-blue-500 text-white mr-3 px-2 py-1 rounded-lg hover:bg-blue-400 transition-colors duration-300"
                      onClick={(event) => {
                        event.stopPropagation();
                        openEditOrgModal(org);
                      }}
                    >
                      <FontAwesomeIcon icon={faUserPlus} size="sm" />
                    </button>
                  )}
                  <button
                    className="bg-red-500 text-white pl-2 pr-0.5 py-1 rounded-lg hover:bg-red-400 transition-colors duration-300"
                    onClick={(event) => handleLeaveOrg(org._id, event)}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} size="sm" className="mr-2" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-2 mx-auto">
          <Logout onLogoutSuccess={onLogoutSuccess} />
        </div>
      </div>
      {isModalOpen && (
        <AddEditOrgModal
          isOpen={isModalOpen}
          onClose={closeModal}
          orgToEdit={selectedOrg}
          updateOrgMutation={updateOrgMutation}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </div>
  );
};
