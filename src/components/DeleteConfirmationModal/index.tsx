import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modelName: string;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  modelName
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200">
        <div className="flex items-center mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 mr-3" />
          <h2 className="text-lg font-semibold">Confirm Delete</h2>
        </div>
        <p>{`Are you sure you want to delete this ${modelName}? This action cannot be undone.`}</p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
