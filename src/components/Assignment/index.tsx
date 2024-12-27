import { format, formatDistanceToNow } from "date-fns";
import { Assignment as AssignmentType } from "../AssignmentList/assignmentList.types";
import { Role } from "../../../api/src/lib/enums/role.enum";
import { useEffect, useState } from "react";
// Redacted: TextArea import
import { CharValue } from "../TextArea/textArea.types";
import { updateAssignment } from "../../../api/src/services/assignmentService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmissionAnalysis } from "../SubmissionAnalysis";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";
import { SubmitConfirmationModal } from "../SubmitConfirmationModal";

type AssignmentProps = {
  assignment: AssignmentType;
  onBack: () => void;
  userRole: string | null;
};

const countWords = (textArray: CharValue[]) => {
  const combinedText = textArray.map(text => text.value).join('');
  return combinedText.trim() === '' ? 0 : combinedText.split(/\s+/).length;
};

export const Assignment = ({ assignment, onBack, userRole }: AssignmentProps) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [totalTextareaValue, setTotalTextareaValue] = useState<CharValue[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(assignment.isSubmitted);
  const [hasChanges, setHasChanges] = useState(false);
  const [wordCount, setWordCount] = useState(assignment.wordCount);
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(assignment.isDeleted);

  useEffect(() => {
    setHasChanges(
      title !== assignment.title
      || description !== assignment.description
      || totalTextareaValue.length !== assignment.submission.length);
  }, [
    title, 
    description, 
    assignment.title, 
    assignment.description, 
    totalTextareaValue, 
    assignment.submission
  ]);

  useEffect(() => {
    if (userRole === Role.STUDENT) {
      setWordCount(countWords(totalTextareaValue));
    } else {
      setWordCount(assignment.wordCount);
    }
  }, [totalTextareaValue, assignment.wordCount, userRole]);

  const { mutateAsync: updateAssignmentMutation } = useMutation({
    mutationFn: updateAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });

  const handleSave = async () => {
    await updateAssignmentMutation({
      orgId: assignment.organisation,
      assignmentId: assignment._id,
      assignmentData: {
        title,
        description,
        submission: totalTextareaValue,
        wordCount,
      },
    });

    setHasChanges(false);
  };

  const handleConfirmSubmit = async () => {
    await updateAssignmentMutation({
      orgId: assignment.organisation,
      assignmentId: assignment._id,
      assignmentData: {
        isSubmitted: true,
        submittedAt: new Date().toISOString(),
      },
    });

    setIsSubmitted(true);
  };

  const openDeleteModal = (assignmentId: string) => {
    setAssignmentToDelete(assignmentId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openSubmitModal = () => {
    setSubmitModalOpen(true);
  };

  const closeSubmitModal = () => setSubmitModalOpen(false);

  const handleConfirmDelete = async () => {
    if (assignmentToDelete) {
      try {
        await updateAssignmentMutation({
          orgId: assignment.organisation,
          assignmentId: assignment._id,
          assignmentData: { isDeleted: true },
        });

        setIsDeleted(true);
      } catch (error) {
        console.error("Error deleting guideline", error);
      } finally {
        setAssignmentToDelete(null);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 bg-gray-800 text-gray-200 rounded-lg shadow-lg mt-6">
      <button
        onClick={onBack}
        className="text-blue-400 hover:text-blue-300 transition-colors mb-6 font-semibold"
      >
        &larr; Back to List
      </button>
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <p>
          <strong>{userRole === Role.STUDENT ? "Teacher: " : "Student: "}</strong>
          {userRole === Role.STUDENT ? assignment.submittedTo.name : assignment.submittedBy.name}
        </p>
        <p>
          <strong>Word Count: </strong>
          {wordCount}/{assignment.guideline.wordLimit}
        </p>
        <p>
          <strong>Due Date: </strong>
          <span
            title={format(new Date(assignment.guideline.dueDate), 'MMMM dd, yyyy')}
            style={{ cursor: 'pointer' }}>
            {formatDistanceToNow(new Date(assignment.guideline.dueDate), { addSuffix: true })}
          </span>
        </p>
      </div>
      {userRole === Role.STUDENT ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          disabled={isSubmitted || isDeleted}
          className="text-3xl font-semibold text-blue-300 bg-gray-700 p-2 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Assignment title"
        />
      ) : (
        <h2 className="text-3xl font-semibold text-blue-300">{title}</h2>
      )}
      {userRole === Role.STUDENT ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          disabled={isSubmitted || isDeleted}
          className="mt-2 text-gray-300 w-full h-20 p-3 bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Assignment description"
        />
      ) : (
        <p className="mt-4 text-gray-300">{description}</p>
      )}
      {userRole === Role.STUDENT ? (
        // Redacted: TextArea component
      ) : (
        <SubmissionAnalysis
          assignment={assignment}
          isDeleted={isDeleted}
        />
      )}
      <div className="flex justify-between items-center mt-4">
        <div>
          {userRole === Role.STUDENT && (
            <>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSubmitted || isDeleted}
                className={`py-2 px-4 rounded-md cursor-pointer text-white mr-2 ${
                  !hasChanges || isSubmitted || isDeleted ? "bg-gray-500 cursor-not-allowed opacity-50 mr-2" : "bg-blue-500 hover:bg-blue-400 mr-2"
                }`}
              >
                Save
              </button>
              <button
                onClick={openSubmitModal}
                disabled={isSubmitted || isDeleted}
                className={`ml-2 py-2 px-4 rounded-md cursor-pointer text-white ${
                  isSubmitted || isDeleted ? "bg-gray-500 cursor-not-allowed opacity-50" : "bg-green-500 hover:bg-green-400"
                }`}
              >
                {isSubmitted ? "Submitted" : "Submit"}
              </button>
            </>
          )}
        </div>
        {(userRole === Role.STUDENT || userRole === Role.TEACHER) && (
          <button
            onClick={() => openDeleteModal(assignment._id)}
            disabled={
              isDeleted || (userRole === Role.STUDENT && isSubmitted)
            }
            className={`flex items-center gap-2 px-4 py-2 bg-transparent text-gray-200 font-semibold transition duration-200 ease-in-out focus:outline-none ${
              isDeleted || (userRole === Role.STUDENT && isSubmitted)
                ? "bg-gray-500 opacity-50 cursor-not-allowed"
                : "hover:text-red-500 cursor-pointer"
            }`}
          >
            {isDeleted ? "Deleted" : "Delete"}
          </button>
        )}
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        modelName="assignment"
      />
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={closeSubmitModal}
        onConfirm={handleConfirmSubmit}
        modelName="assignment"
      />
    </div>
  );
};
