import { useState, useEffect } from 'react';
import { getFamilyInfo } from '../firebase/familyManager';

// useFamily - Fetches and manages the current user's family info.
export const useFamily = (currentUid) => {
  const [familyCode, setFamilyCode] = useState(null);
  const [familyName, setFamilyName] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchFamily = async () => {
      const info = await getFamilyInfo(currentUid);
      setFamilyCode(info.familyCode);
      setFamilyName(info.familyName);
    };

    fetchFamily();
  }, [currentUid, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return { familyCode, familyName, refresh };
};