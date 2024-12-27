import { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganisation } from '../../../api/src/services/organisationService';

interface AddOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddOrgModal = ({ 
  isOpen, 
  onClose,
}: AddOrgModalProps) => {
  const initialFormValues = {
    name: '',
  };
  
  const [formValues, setFormValues] = useState(initialFormValues);

  const queryClient = useQueryClient();

  const { mutateAsync: addOrgMutation } = useMutation({
    mutationFn: createOrganisation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      setFormValues(initialFormValues);
      onClose();
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    await addOrgMutation({ name: formValues.name });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Create Organisation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-200 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              required
            />
          </div>
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
