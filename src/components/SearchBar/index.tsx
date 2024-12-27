import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { addOrUpdateSite } from "../../../api/src/services/siteService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const SearchBar = () => {
  const [url, setUrl] = useState('');
  const queryClient = useQueryClient();
  const orgId = localStorage.getItem("orgId");

  const { mutateAsync: addOrUpdateSiteMutation } = useMutation({
    mutationFn: addOrUpdateSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleLoadUrl = () => {
    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl) && !/\./.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl + '.com';
    } else if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    } else if (/^http:\/\//i.test(formattedUrl)) {
      formattedUrl = formattedUrl.replace(/^http:\/\//i, 'https://');
    }

    formattedUrl = formattedUrl.replace(/^https?:\/\/(www\.)?/i, 'https://');

    try {
      const validUrl = new URL(formattedUrl);
      formattedUrl = validUrl.href;

      if (formattedUrl.endsWith('/')) {
        formattedUrl = formattedUrl.slice(0, -1);
      }
    } catch (err) {
      console.error('Invalid URL:', formattedUrl);
      return;
    }

    window.ipcRenderer.send('load-url', formattedUrl);

    const launchCount = 1;
    addOrUpdateSiteMutation({ url: formattedUrl, launchCount, orgId }).then(() => {
      setUrl('');
    });
  };

  return (
    <div className="flex justify-center mt-6">
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        className="text-black border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:border-blue-500 w-96"
        placeholder="Enter site name or URL"
      />
      <button
        onClick={handleLoadUrl}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
}