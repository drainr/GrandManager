import { get, ref, set, update } from 'firebase/database';
import { rtdb } from './firebase.js';


// generateFamilyCode - Creates a random 6-character code.
const generateFamilyCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};


// createFamily - Creates a new family group with a unique code.
export const createFamily = async (uid, familyName) => {
  try {
    // Generate a unique code
    let familyCode = generateFamilyCode();
    let exists = await get(ref(rtdb, `families/${familyCode}`));

    // Retry if code already exists
    while (exists.exists()) {
      familyCode = generateFamilyCode();
      exists = await get(ref(rtdb, `families/${familyCode}`));
    }

    // Create the family in the database
    await set(ref(rtdb, `families/${familyCode}`), {
      name: familyName,
      createdBy: uid,
      members: { [uid]: true },
    });

    await update(ref(rtdb, `users/${uid}`), { familyCode });

    return { success: true, familyCode };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// joinFamily - Adds a user to an existing family using the code.
export const joinFamily = async (uid, familyCode) => {
  try {
    const upperCode = familyCode.toUpperCase().trim();
    const familyRef = ref(rtdb, `families/${upperCode}`);
    const snapshot = await get(familyRef);

    if (!snapshot.exists()) {
      return { success: false, message: 'Family code not found. Please check and try again.' };
    }

    const familyData = snapshot.val();

    // Add user to family members
    await update(ref(rtdb, `families/${upperCode}/members`), { [uid]: true });

    // Update the user's family code in DB
    await update(ref(rtdb, `users/${uid}`), { familyCode: upperCode });

    return { success: true, familyName: familyData.name };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// leaveFamily - Removes a user from their current family.
export const leaveFamily = async (uid, familyCode) => {
  try {
    // Remove user from family members
    await set(ref(rtdb, `families/${familyCode}/members/${uid}`), null);
    await update(ref(rtdb, `users/${uid}`), { familyCode: null });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// getFamilyMembers - Fetches all member UIDs for a given family code, similar to the old fetch all users
export const getFamilyMembers = async (familyCode) => {
  if (!familyCode) return [];

  const snapshot = await get(ref(rtdb, `families/${familyCode}/members`));
  if (!snapshot.exists()) return [];

  return Object.keys(snapshot.val());
};

// getFamilyInfo - Gets the family name and code for a user.
export const getFamilyInfo = async (uid) => {
  const userSnapshot = await get(ref(rtdb, `users/${uid}/familyCode`));
  if (!userSnapshot.exists()) return { familyCode: null, familyName: null };

  const familyCode = userSnapshot.val();
  const familySnapshot = await get(ref(rtdb, `families/${familyCode}/name`));

  return {
    familyCode,
    familyName: familySnapshot.exists() ? familySnapshot.val() : null,
  };
};