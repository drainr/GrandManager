import { useState, useEffect } from 'react';
import { getUsers } from '../firebase/chatManager';

/**
 * useUsers - Fetches all registered users from real time database for dropdown, excluding the current user.
 */
export const useUsers = (currentUid) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid) return;

    const fetchUsers = async () => {
      setLoading(true);
      const allUsers = await getUsers();
      const otherUsers = allUsers.filter((u) => u.uid !== currentUid);
      setUsers(otherUsers);
      setLoading(false);
    };

    fetchUsers();
  }, [currentUid]);

  return { users, loading };
};