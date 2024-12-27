import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from '../../../api/src/services/assignmentService';
import { fetchGuidelines } from '../../../api/src/services/guidelineService';
import { fetchUsers } from '../../../api/src/services/userService';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string | null;
}

export const AddAssignmentModal = ({ 
  isOpen, 
  onClose,
  orgId 
}: AddAssignmentModalProps) => {
  const initialFormValues = {
    title: '',
    description: '',
    submittedTo: '',
    guideline: '',
    wordCount: 0,
    submission: [],
  };

  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState(initialFormValues);

  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(orgId ?? ''),
    enabled: true,
  });

  const { data: guidelines } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => fetchGuidelines(orgId ?? ''),
    enabled: true,
  });

  const { mutateAsync: addAssignmentMutation } = useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      setFormValues(initialFormValues);
      setSelectedGuidelineId(null);
      setSelectedTeacherId(null);
      onClose();
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    await addAssignmentMutation({
      orgId,
      assignmentData: formValues,
    });
  };

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      guideline: selectedGuidelineId ?? '',
      submittedTo: selectedTeacherId ?? '',
    }));
  }, [selectedGuidelineId, selectedTeacherId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Create Assignment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-200 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formValues.title}
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
            <label className="block font-medium text-gray-200 mb-1">Select Teacher:</label>
            <select
              name="teacher"
              value={selectedTeacherId ?? ""}
              onChange={(e) => setSelectedTeacherId(e.target.value || null)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              required
            >
              <option value="" disabled>Select Teacher</option>
              {users?.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-200 mb-1">Select Guideline:</label>
            <select
              name="guideline"
              value={selectedGuidelineId ?? ""}
              onChange={(e) => setSelectedGuidelineId(e.target.value || null)}
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
              required
            >
              <option value="" disabled>Select Guideline</option>
              {guidelines?.map((guideline) => (
                <option key={guideline._id} value={guideline._id}>
                  {guideline.name}
                </option>
              ))}
            </select>
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
