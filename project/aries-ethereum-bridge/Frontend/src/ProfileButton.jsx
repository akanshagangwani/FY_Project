import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser       } from "react-icons/fa";
import "./ProfileButton.css"; // Import the CSS file

const PopUpBox = ({ handleSignOut, handleSwitchAccount, setShowPopUp }) => {
  return (
    <div className="pop-up-box">
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={handleSwitchAccount}>Switch Account</button>
    </div>
  );
};

const ProfileButton = () => {
  const [showPopUp, setShowPopUp] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Sign out logic here
    console.log("Sign out clicked");
    navigate("/");
  };

  const handleSwitchAccount = () => {
    // Switch account logic here
    console.log("Switch account clicked");
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest(".pop-up-box") && !event.target.classList.contains("user-icon1")) {
      setShowPopUp(false);
    }
  };

  const handleIconClick = (event) => {
    event.stopPropagation();
    setShowPopUp(!showPopUp);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <FaUser       className="user-icon1" onClick={handleIconClick} />
      {showPopUp && (
        <PopUpBox
          handleSignOut={handleSignOut}
          handleSwitchAccount={handleSwitchAccount}
          setShowPopUp={setShowPopUp}
        />
      )}
    </div>
  );
};

export default ProfileButton;