import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGuideline } from '../../../api/src/services/guidelineService';
import { format } from 'date-fns';

interface AddEditGuidelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateGuidelineMutation: (data: {
    orgId: string;
    guidelineId: string;
    guidelineData: {
      name?: string;
      description?: string;
      wordLimit?: string;
      dueDate?: string;
    }
  }) => Promise<void>;
  guidelineToEdit: {
    _id: string;
    name: string;
    description: string;
    wordLimit: string;
    dueDate: string;
  } | null;
  orgId: string | null;
}

export const AddEditGuidelineModal = ({ 
  isOpen, 
  onClose,
  updateGuidelineMutation,
  guidelineToEdit, 
  orgId 
}: AddEditGuidelineModalProps) => {
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    wordLimit: '',
    dueDate: '',
  });

  const queryClient = useQueryClient();
  const isEditMode = Boolean(guidelineToEdit);

  useEffect(() => {
    if (isEditMode && guidelineToEdit) {
      setFormValues({
        name: guidelineToEdit.name,
        description: guidelineToEdit.description,
        wordLimit: guidelineToEdit.wordLimit,
        dueDate: format(new Date(guidelineToEdit.dueDate), 'yyyy-MM-dd'),
      });
    } else {
      setFormValues({
        name: '',
        description: '',
        wordLimit: '',
        dueDate: '',
      });
    }
  }, [isEditMode, guidelineToEdit]);

  const { mutateAsync: addGuidelineMutation } = useMutation({
    mutationFn: createGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      onClose();
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isEditMode) {
      await updateGuidelineMutation({
        orgId: orgId as string,
        guidelineId: guidelineToEdit?._id as string,
        guidelineData: formValues,
      });
    } else {
      await addGuidelineMutation({ orgId: orgId as string, guidelineData: formValues });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {isEditMode ? 'Edit Guideline' : 'Create Guideline'}
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
          <div>
            <label className="block font-medium text-gray-200 mb-1">Description</label>
            <textarea
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-200 mb-1">Word Limit</label>
            <input
              type="number"
              name="wordLimit"
              value={formValues.wordLimit}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-200 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formValues.dueDate}
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
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
