import { AssignmentList } from "../AssignmentList";
import { TeacherViewParams } from "./teacherView.types";
import { GuidelineList } from "../GuidelineList";
import { Tabs } from "../../../api/src/lib/enums/tabs.enum";

export const TeacherView = ({ userRole, selectedTab }: TeacherViewParams) => {
  const orgId = localStorage.getItem("orgId");

  return (
    <div>
      {selectedTab === Tabs.ASSIGNMENTS && <AssignmentList userRole={userRole} orgId={orgId} />}
      {selectedTab === Tabs.GUIDELINES && <GuidelineList />}
    </div>
  );
};
