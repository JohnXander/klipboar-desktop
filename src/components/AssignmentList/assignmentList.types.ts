export interface AssignmentListProps {
  userRole: string | null;
  orgId: string | null;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  organisation: string;
  guideline: {
    dueDate: Date;
    wordLimit: number;
  }
  wordCount: number;
  submittedBy: {
    _id: string;
    name: string;
  }
  submittedTo: {
    _id: string;
    name: string;
  }
  isSubmitted: boolean;
  isDeleted: boolean;
  submittedAt: Date;
  submission: Array<{
    value: string;
    copiedAt: string | null;
    copiedFrom: string | null;
  }>
}
