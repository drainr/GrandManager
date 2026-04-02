import { useState, useEffect } from 'react';
import { getUsers } from '../firebase/chatManager';
import { getFamilyMembers } from '../firebase/familyManager';

/**
 * useUsers - Fetches all registered users from real time database for dropdown, excluding the current user.
 */
export const useUsers = (currentUid, familyCode) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid || !familyCode) return;

    const fetchUsers = async () => {
      setLoading(true);

      const memberUids = await getFamilyMembers(familyCode);
      const allUsers = await getUsers();

      const familyUsers = allUsers.filter(
        (u) => u.uid !== currentUid && memberUids.includes(u.uid)
      );

      setUsers(familyUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUid, familyCode]);

  return { users, loading };
};