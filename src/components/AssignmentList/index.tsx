import { useQuery } from "@tanstack/react-query"
import { fetchAssignments } from "../../../api/src/services/assignmentService"
import { fetchGuidelines } from "../../../api/src/services/guidelineService"
import { LoadingAnimation } from "../LoadingAnimation";
import { Assignment, AssignmentListProps } from "./assignmentList.types";
import { format, formatDistanceToNow } from 'date-fns';
import moment from 'moment';
import { Role } from "../../../api/src/lib/enums/role.enum";
import { SubmissionStatus } from "../../../api/src/lib/enums/submissionStatus.enum";
import { useState } from "react";
import { Assignment as AssignmentComponent } from "../Assignment";
import { AddAssignmentModal } from "../AddAssignmentModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const AssignmentList = ({ userRole, orgId }: AssignmentListProps) => {
  const [selectedGuidelineId, setSelectedGuidelineId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: guidelines } = useQuery({
    queryKey: ["guidelines"],
    queryFn: () => fetchGuidelines(orgId ?? ''),
    enabled: userRole === Role.TEACHER,
  });

  const { data: assignments, isLoading } = useQuery({
    queryKey: ["assignments", selectedGuidelineId],
    queryFn: () => fetchAssignments(orgId ?? '', selectedGuidelineId),
    enabled: true,
  });

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  if (isLoading) {
    return <LoadingAnimation />
  }

  const handleClick = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleBack = () => {
    setSelectedAssignment(null);
  };

  if (selectedAssignment) {
    return <AssignmentComponent
              assignment={selectedAssignment}
              onBack={handleBack}
              userRole={userRole}
            />;
  }

  const getAssignmentStatus = (userRole: string | null, assignment: Assignment) => {
    const { isSubmitted, submittedAt, guideline } = assignment;
    const { dueDate } = guideline;
  
    if (userRole === Role.STUDENT) {
      return isSubmitted ? SubmissionStatus.STATUS_SUBMITTED : SubmissionStatus.STATUS_IN_PROGRESS;
    }
  
    if (!submittedAt || !dueDate) {
      return SubmissionStatus.STATUS_NOT_SUBMITTED;
    }
  
    const submittedDate = moment(submittedAt);
    const dueDateMoment = moment(dueDate);
    const isLate = submittedDate.isAfter(dueDateMoment);
    const difference = Math.abs(submittedDate.diff(dueDateMoment, 'days'));

    if (difference === 0) {
      return "On time";
    }

    const dayLabel = difference === 1 ? "day" : "days";
  
    return isLate ? `${difference} ${dayLabel} late` : `${difference} ${dayLabel} early`;
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="px-4 md:px-8 lg:px-16 pb-4 pt-2">
      <h2 className="text-4xl font-semibold text-gray-100 text-center mt-4 mb-2">Assignments</h2>
      <div className="flex justify-center mb-2">
        {userRole === Role.STUDENT && (
          <button
            onClick={() => setModalOpen(true)}
            className="text-blue-400 hover:text-blue-300 transition-colors font-semibold mt-1 mb-2"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Assignment
          </button>
        )}
      </div>
      {userRole === Role.TEACHER && (
        <div className="mb-4 flex justify-center">
          <select
            id="guidelineSelect"
            value={selectedGuidelineId ?? ""}
            onChange={(e) => setSelectedGuidelineId(e.target.value || null)}
            className="bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors font-semibold focus:outline-none cursor-pointer"
          >
            <option value="">
              All Guidelines
            </option>
            {guidelines?.map((guideline) => (
              <option key={guideline._id} value={guideline._id}>
                {guideline.name}
              </option>
            ))}
          </select>
        </div>
      )}
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-slate-800 text-gray-200">
        <thead>
          <tr className="bg-blue-500">
            <th className="p-4 text-left font-semibold">Title</th>
            <th className="p-4 text-left font-semibold">Description</th>
            <th className="p-4 text-left font-semibold">
                {userRole === "student" ? "Teacher" : "Student"}
              </th>
            <th className="p-4 text-left font-semibold">Words</th>
            <th className="p-4 text-left font-semibold">Due Date</th>
            <th className="p-4 text-left font-semibold">
              {userRole === "student" ? "Status" : "Submitted"}
            </th>
          </tr>
        </thead>
        <tbody>
          {assignments && assignments.length !== 0 ? (
            assignments?.map((assignment) =>  (
              <tr
                key={assignment._id}
                onClick={() => handleClick(assignment)}
                className="border-t border-gray-700 cursor-pointer hover:bg-slate-700"
              >
                <td className="p-4 font-semibold text-gray-100">{assignment.title}</td>
                <td className="p-4 text-gray-300">{assignment.description}</td>
                <td className="p-4">
                  {userRole === Role.STUDENT ? assignment.submittedTo.name : assignment.submittedBy.name}
                </td>
                <td className="p-4">{assignment.wordCount}/{assignment.guideline.wordLimit}</td>
                <td className="p-4">
                <span
                  title={format(new Date(assignment.guideline.dueDate), 'MMMM dd, yyyy')}
                  style={{ cursor: 'pointer' }}>
                  {formatDistanceToNow(new Date(assignment.guideline.dueDate), { addSuffix: true })}
                </span>
                </td>
                <td 
                  className="p-4"
                  title={userRole === 'teacher' ? format(new Date(assignment.submittedAt), 'MMMM dd, yyyy') : undefined}
                  style={{ cursor: 'pointer' }}>
                  {getAssignmentStatus(userRole, assignment)}
                </td>
              </tr>
            )
          )
        ) : (
          <td colSpan={6} className="p-6 font-semibold text-gray-400">
             No assignments
          </td>
        )
          }
        </tbody>
      </table>
    </div>
    <AddAssignmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        orgId={orgId}
      />
  </div>
  )
}