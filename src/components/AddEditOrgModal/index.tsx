import { useState, useEffect, FormEvent } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganisation } from '../../../api/src/services/organisationService';
import { ModifyUserInOrganisationAction } from '../../../api/src/lib/enums/modifyUserInOrganisationAction.enum';

interface AddEditOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgToEdit: {
    _id: string;
    name: string;
    members: string[];
  } | null;
  updateOrgMutation: (data: {
    orgId: string;
    action: ModifyUserInOrganisationAction.ADD | ModifyUserInOrganisationAction.REMOVE;
    email: string;
  }) => Promise<void>;
}

export const AddEditOrgModal = ({ 
  isOpen, 
  onClose, 
  orgToEdit,
  updateOrgMutation
}: AddEditOrgModalProps) => {
  const [orgName, setOrgName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [action, setAction] = useState<ModifyUserInOrganisationAction.ADD | ModifyUserInOrganisationAction.REMOVE>(
    ModifyUserInOrganisationAction.ADD
  );
  
  const queryClient = useQueryClient();
  const isEditMode = Boolean(orgToEdit);

  useEffect(() => {
    if (isEditMode && orgToEdit) {
      setOrgName(orgToEdit.name);
    } else {
      setOrgName('');
      setUserEmail('');
    }
  }, [isEditMode, orgToEdit]);

  const { mutateAsync: addOrgMutation } = useMutation({
    mutationFn: createOrganisation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      onClose();
    },
  });

  const handleOrgSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditMode) {
      await updateOrgMutation({
        orgId: orgToEdit?._id as string,
        action,
        email: userEmail,
      });
    } else {
      await addOrgMutation({ name: orgName });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {isEditMode ? 'Add / Remove User' : 'Create Organisation'}
        </h2>
        <form onSubmit={handleOrgSubmit} className="space-y-4">
          {!isEditMode && (
            <div>
              <label className="block font-medium text-gray-200 mb-1">Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                required
                disabled={isEditMode}
              />
            </div>
          )}
          {isEditMode && (
            <>
              <div>
                <label className="block font-medium text-gray-200 mb-1">Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value as ModifyUserInOrganisationAction.ADD | ModifyUserInOrganisationAction.REMOVE)}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                >
                  <option value="add">Add User</option>
                  <option value="remove">Remove User</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-200 mb-1">User Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
                  required
                />
              </div>
            </>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
