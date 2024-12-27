import { SITES, SITE_BY_ID } from "../lib/constants/routes";
import { axiosInstance } from "./axiosInstance";

interface Site {
  siteId?: string;
  url?: string;
  launchCount?: number;
  orgId: string | null;
}

export const fetchSites = async (orgId: string | null) => {
  if (!orgId) {
    throw new Error("orgId is required to increment launch count");
  }
  
  const { data } = await axiosInstance.get(SITES.replace(':orgId', orgId));
  
  return [...data];
}

export const addSite = async ({ url, launchCount, orgId }: Site) => {
  if (!orgId) {
    throw new Error("orgId is required to increment launch count");
  }

  try {
    const { data } = await axiosInstance.post(SITES.replace(':orgId', orgId), { url, launchCount });
    
    return data;
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
}

export const incrementSiteLaunchCount = async ({ siteId, orgId }: Site) => {
  if (!siteId || !orgId) {
    throw new Error("siteId and orgId are required to increment launch count");
  }

  try {
    const { data } = await axiosInstance.patch(SITE_BY_ID.replace(":orgId", orgId).replace(":siteId", siteId));

    return data;
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
}

export const addOrUpdateSite = async ({ url, launchCount, orgId }: Site) => {
  try {
    const sites = await fetchSites(orgId);

    const existingSite = sites.find(site => site.url === url);

    if (existingSite) {
      const siteId = existingSite._id;
      return await incrementSiteLaunchCount({ siteId, orgId });
    } else {
      return await addSite({ url, launchCount, orgId });
    }
  } catch (error) {
    console.error("Error adding or updating site:", error);
    throw error;
  }
}
