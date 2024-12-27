import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addOrUpdateSite, fetchSites } from "../../../api/src/services/siteService"
import { LoadingAnimation } from "../LoadingAnimation"

export const FavouriteSites = () => {
  const queryClient = useQueryClient();
  const orgId = localStorage.getItem("orgId");

  const { data: sites, isLoading } = useQuery({
    queryFn: () => fetchSites(orgId),
    queryKey: ["sites"],
  })

  const { mutateAsync: addOrUpdateSiteMutation } = useMutation({
    mutationFn: addOrUpdateSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  })

  if (isLoading) {
    return <LoadingAnimation />
  }

  const sortedSites = sites
    ?.sort((a, b) => b.launchCount - a.launchCount)
    .slice(0, 10);

  const handleLoadUrl = (url: string) => {
    window.ipcRenderer.send('load-url', url);
  
    const launchCount = 1;
    addOrUpdateSiteMutation({ url, launchCount, orgId });
  };
  
  return (
    <div className="flex justify-center mt-4 mb-1">
      {sortedSites?.map((site) => (
        <div
          key={site.id}
          onClick={() => handleLoadUrl(site.url)}
          className="mx-2 cursor-pointer"
        >
          <img
            key={site.id}
            src={site.favicon}
            alt={`${site.url} favicon`}
            className="w-6 h-6"
            title={site.url}
          />
        </div>
      ))}
    </div>
  );
}
