import React, { useEffect, useState } from 'react';
import './ViewProfile.css';
import { FaUserCircle } from 'react-icons/fa';

const ViewProfile = ({ onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
  });
  const [createdAt, setCreatedAt] = useState('');

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            fullName: data.fullName,
            email: data.email,
            mobile: data.mobile,
          });
          setCreatedAt(data.created_at);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const showPopup = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.mobile) {
      showPopup('All fields are required.', 'error');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showPopup('Profile updated successfully!', 'success');
        setIsEditing(false);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1500);
      } else {
        showPopup('Failed to update profile. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showPopup('An error occurred. Please try again later.', 'error');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div id="profile-modal">
      <div className="profile-overlay" onClick={onClose}>
        <div className="profile-card" onClick={(e) => e.stopPropagation()}>
          <div className="profile-top"></div>
          <div className="profile-icon-container">
            <FaUserCircle className="profile-icon" />
            <h3 className="profile-name">{formData.fullName}</h3>
          </div>
          <div className="profile-content">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Full Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Mobile"
                />
                <button className="view-button" onClick={handleSubmit}>Save</button>
              </>
            ) : (
              <>
                <p className="profile-email">{formData.email}</p>
                <p className="profile-mobile">{formData.mobile}</p>
                <p className="profile-created">Joined on {formatDate(createdAt)}</p>
                <button className="view-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
              </>
            )}
          </div>
          {message && (
            <div className={`popup-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
