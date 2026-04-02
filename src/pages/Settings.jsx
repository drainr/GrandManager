import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useFamily } from "../hooks/useFamily";
import { createFamily, joinFamily, leaveFamily } from "../firebase/familyManager";
import GreenButton from "../components/GreenButton";
import PurpleButton from "../components/PurpleButton";
import RedButton from "../components/RedButton";
import Footer from "./Footer";

/**
 * Settings - Page for managing family connections.
 * Users can create a family, join one with a code,
 * view their code, or leave.
 */
const Settings = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  const { familyCode, familyName, loading, refresh } = useFamily(
    currentUser?.uid,
  );

  const [familyNameInput, setFamilyNameInput] = useState("");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [message, setMessage] = useState("");
  const [createdCode, setCreatedCode] = useState("");

  const handleCreate = async () => {
    if (!familyNameInput.trim()) {
      setMessage("Please enter a family name.");
      return;
    }
    const result = await createFamily(currentUser.uid, familyNameInput.trim());
    if (result.success) {
      setCreatedCode(result.familyCode);
      setMessage("Family created!");
      setFamilyNameInput("");
      refresh();
    } else {
      setMessage(result.message);
    }
  };

  const handleJoin = async () => {
    if (!joinCodeInput.trim()) {
      setMessage("Please enter a family code.");
      return;
    }
    const result = await joinFamily(currentUser.uid, joinCodeInput.trim());
    if (result.success) {
      setMessage(`Joined ${result.familyName}!`);
      setJoinCodeInput("");
      setCreatedCode("");
      refresh();
    } else {
      setMessage(result.message);
    }
  };

  const handleLeave = async () => {
    if (!familyCode) return;
    const result = await leaveFamily(currentUser.uid, familyCode);
    if (result.success) {
      setMessage("You left the family.");
      setCreatedCode("");
      refresh();
    } else {
      setMessage(result.message);
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen mt-15">
      <div className="flex-1 flex flex-col items-center p-4 mt-10">
        <div className="w-full max-w-md mb-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute left-0 scale-65">
              <GreenButton text="← Dashboard" onClick={() => navigate("/")} />
            </div>
            <h2 className="text-2xl font-bold text-[#EBB537] shrikhand-regular">
              Settings
            </h2>
          </div>
        </div>

        {/* Family Card */}
        <div className="bg-[#1B2851] rounded-xl p-6 w-full max-w-md shadow-2xl shadow-black border border-[#4d2c72]">
          <h3 className="text-lg font-bold text-[#EBB537] shrikhand-regular mb-4">
            Family Connection
          </h3>
          {familyCode ? (
            <div className="space-y-4">
              <div className="bg-[#405BA4] rounded-lg p-4">
                <p className="text-gray-300 text-xs mb-1">Family name</p>
                <p className="text-white font-bold text-lg">{familyName}</p>
              </div>

              <div className="bg-[#405BA4] rounded-lg p-4">
                <p className="text-gray-300 text-xs mb-1">
                  Your family code — share this with family
                </p>
                <p className="text-[#EBB537] text-2xl font-mono font-bold tracking-widest select-all text-center">
                  {familyCode}
                </p>
              </div>

              <p className="text-gray-400 text-xs text-center">
                Give this code to family members so they can connect with you in
                chat.
              </p>

              <div className="flex justify-center pt-2">
                <RedButton text="Leave Family" onClick={handleLeave} small />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Create family */}
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">Start a new family</p>
                <input
                  type="text"
                  className="input input-bordered w-full bg-[#405BA4] text-white border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#EBB537]"
                  placeholder="Family Name"
                  value={familyNameInput}
                  onChange={(e) => setFamilyNameInput(e.target.value)}
                />
                <div className="flex justify-center">
                  <GreenButton text="Create Family" onClick={handleCreate} />
                </div>
              </div>

              {/* Created code */}
              {createdCode && (
                <div className="bg-[#405BA4] rounded-lg p-4 text-center">
                  <p className="text-gray-300 text-xs mb-2">
                    Your new family code
                  </p>
                  <p className="text-[#EBB537] text-2xl font-mono font-bold tracking-widest select-all">
                    {createdCode}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    Share this with your family members.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="text-gray-400 text-xs">or</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              {/* Join family */}
              <div className="space-y-3">
                <p className="text-gray-300 text-sm">Join an existing family</p>
                <input
                  type="text"
                  className="input input-bordered w-full bg-[#405BA4] text-white text-center text-xl font-mono tracking-widest uppercase border-gray-500 placeholder-gray-400 focus:outline-none focus:border-[#EBB537]"
                  placeholder="Enter 6-digit code"
                  value={joinCodeInput}
                  onChange={(e) =>
                    setJoinCodeInput(e.target.value.toUpperCase())
                  }
                  maxLength={6}
                />
                <div className="flex justify-center">
                  <PurpleButton text="Join Family" onClick={handleJoin} />
                </div>
              </div>
            </div>
          )}

          {/* Status message */}
          {message && (
            <p
              className={`text-sm text-center mt-4 ${
                message.includes("created") ||
                message.includes("Joined") ||
                message.includes("left")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
