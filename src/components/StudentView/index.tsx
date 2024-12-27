import { Tabs } from "../../../api/src/lib/enums/tabs.enum"
import { AssignmentList } from "../AssignmentList"
import { FavouriteSites } from "../FavouriteSites"
import { SearchBar } from "../SearchBar"
import { StudentViewParams } from "./studentView.types"

export const StudentView = ({ userRole, selectedTab }: StudentViewParams) => {
  const orgId = localStorage.getItem("orgId");

  return (
    <div>
      <SearchBar />
      <FavouriteSites />
      {selectedTab === Tabs.ASSIGNMENTS && <AssignmentList userRole={userRole} orgId={orgId} />}
    </div>
  )
}