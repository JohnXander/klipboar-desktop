import { useState } from 'react';
import { Assignment } from '../AssignmentList/assignmentList.types';

type SubmissionAnalysisProps = {
  assignment: Assignment;
  isDeleted: boolean;
};

const getBaseDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

export const SubmissionAnalysis = ({ assignment, isDeleted }: SubmissionAnalysisProps) => {
  const [highlightedWebsite, setHighlightedWebsite] = useState<string | null>(null);
  const { submission } = assignment;

  const websiteCounts = submission.reduce((acc, char) => {
    if (char.copiedFrom) {
      const baseDomain = getBaseDomain(char.copiedFrom);
      acc[baseDomain] = (acc[baseDomain] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const websites = Object.entries(websiteCounts).sort((a, b) => b[1] - a[1]);

  const getHighlightedText = (
    value: string,
    copiedFrom: string | null,
    copiedAt: string | null
  ) => {
    const baseDomain = getBaseDomain(copiedFrom || '');
    if (highlightedWebsite === baseDomain && baseDomain !== null) {
      return (
        <span className="text-gray-800 bg-blue-400 font-bold cursor-pointer" title={copiedAt || ''}>
          {value}
        </span>
      );
    }
    return <span>{value}</span>;
  };

  return (
    <div className="mt-6">
      {websites.length > 0 && !isDeleted && (
        <>
          <h3 className="text-lg font-semibold">Websites Used:</h3>
          <ul className="mt-2">
            {websites.map(([website, count]) => (
              <li
                key={website}
                onClick={() => setHighlightedWebsite(highlightedWebsite === website ? null : website)}
                className={`cursor-pointer hover:text-blue-400 ${highlightedWebsite === website ? 'font-bold text-blue-400' : ''}`}
              >
                {website} ({count} {count === 1 ? 'character' : 'characters'})
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-4">
        <div className="w-full h-48 p-3 mt-4 bg-gray-700 text-gray-200 rounded-lg overflow-auto focus:outline-none focus:ring-2 focus:ring-blue-500">
          {submission.map((char, index) => (
            <span key={index}>
              {getHighlightedText(char.value, char.copiedFrom, char.copiedAt)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
