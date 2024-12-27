import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingAnimation } from "../LoadingAnimation";
import { format, formatDistanceToNow } from 'date-fns';
import { fetchGuidelines, updateGuideline } from '../../../api/src/services/guidelineService';
import { AddEditGuidelineModal } from '../AddEditGuidelineModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GuidelineList = () => {
  const orgId = localStorage.getItem("orgId");
  const queryClient = useQueryClient();

  const { data: guidelines, isLoading } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => fetchGuidelines(orgId ?? ''),
    enabled: true,
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [guidelineToEdit, setGuidelineToEdit] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState<string | null>(null);

  const openModal = (guideline = null) => {
    setGuidelineToEdit(guideline);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const openDeleteModal = (guidelineId: string) => {
    setGuidelineToDelete(guidelineId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalOpen(false);

  const { mutateAsync: updateGuidelineMutation } = useMutation({
    mutationFn: updateGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guidelines"] });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update guideline');
    },
  });

  const handleConfirmDelete = async () => {
    if (guidelineToDelete) {
      try {
        await updateGuidelineMutation({
          orgId: orgId as string,
          guidelineId: guidelineToDelete,
          guidelineData: { isDeleted: true },
        });
      } catch (error) {
        console.error("Error deleting guideline", error);
      } finally {
        setGuidelineToDelete(null);
      }
    }
  };

  if (isLoading) {
    return <LoadingAnimation />
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-4">
      <h2 className="text-4xl font-semibold text-gray-100 text-center my-2">Guidelines</h2>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => openModal()}
          className="text-blue-400 hover:text-blue-300 transition-colors font-semibold"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 mt-2" />
          Create Guideline
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-gray-800 text-gray-200">
          <thead>
            <tr className="bg-blue-500">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Description</th>
              <th className="p-4 text-left font-semibold">Word Limit</th>
              <th className="p-4 text-left font-semibold">Due Date</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {guidelines && guidelines.length !== 0 ? (
              guidelines?.map((guideline) => (
                <tr
                  key={guideline._id}
                  className="border-t border-gray-700"
                >
                  <td className="p-4 font-semibold text-gray-100">{guideline.name}</td>
                  <td className="p-4 text-gray-300">{guideline.description}</td>
                  <td className="p-4">{guideline.wordLimit}</td>
                  <td className="p-4">
                  <span
                    title={format(new Date(guideline.dueDate), 'MMMM dd, yyyy')}
                    style={{ cursor: 'pointer' }}>
                    {formatDistanceToNow(new Date(guideline.dueDate), { addSuffix: true })}
                  </span>
                  </td>
                  <td className="p-4 flex gap-6">
                    <button
                      onClick={() => openModal(guideline)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(guideline._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 font-semibold text-gray-400">
                  No guidelines created
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AddEditGuidelineModal
        isOpen={isModalOpen}
        onClose={closeModal}
        updateGuidelineMutation={updateGuidelineMutation}
        guidelineToEdit={guidelineToEdit}
        orgId={orgId}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        modelName="guideline"
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
      />
    </div>
  );
};
