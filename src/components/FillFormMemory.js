import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './p.css';

const FillMemoryForm = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [video, setVideo] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [selectedPersonPhoto, setSelectedPersonPhoto] = useState(null);
  const navigate = useNavigate();

  // Get user data safely
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        setUserData({
          name: parsedData.name || '',
          email: parsedData.email || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Error loading user data. Please log in again.');
      }
    } else {
      setError('Please log in to continue.');
    }
  }, []);

  const sportsPlayers = {
    'Institute Sports Council': ['Anshul Panwar', 'Himanshu M Singhal', 'Riddhima Channa', 'Arpan Adak', 'Angoth Sai Vidhya', 'Anuj Partani', 'Aryan Aswani', 'Adithyan Rajesh', 'Sakshi Patil', 'Parth Dange', 'Goransh Gattani', 'Mukul Raj', 'Aum Jain', 'Sahil Kumar', 'Satyajeet Machale','Adwait Patwardhan','Param Shah','Snehal Naik','Harsshh Wankhayday','Tushnim Yuvaraj','Subh Verma','Srishti Sharma','Mrunal Lalwani','Atishay Jain','Palak Katiyar','Nandini Chandak','Uditi Malviya','Kaivaly Daga','Ayush Parmar','Kosika Bhanu Prakash','Akhilesh Narayan','Gourav Dhaka','Shubham Sharma','Almaas Ummu Salma','Aditya Wankhade','Pratham Sanghvi','Dhairya Jhunjhunwala'],
    Aquatics: ['Madhav Joshi', 'Mansi Khedekar', 'Onam Tamir', 'Aarushi','Preety','Vineet','Abinash','Rishabh','Palak Katiyar','Ritam Barai'],
    Athletics: ['Kapil Bhagat', 'Mayur Morey','Almaas Ummu Salma', 'Dhairya Jhunjhunwala', 'Angoth Sai Vidhya'],
    Badminton: ['Rupansh Parth','Lokesh Soni','Aanya Verma','Shardul','Darsh Yadav','Akshay Padakanti','Anuj Partani','Jathin','Dyuneesh','Soham','Parshant','Gaurav Dhaka','Aditya Wankhade'],
    Basketball: ['Varun Raipat','Atishay Jain','Aryan Aswani' ,'Mehul Vijay Chanda','Girish Kishore' ,'Sreetam Tripathi','Uditi Malviya','Shruti Singh','Sai Krishna','Mudit Goyal','Bitthal Parida','Aum Jain','Priyanshu Niranjan','Raghav Singhal' ],
    BoardGames: ['Shreyam Mishra', 'Siddhesh Yeram','Harsshh Wankhayday','Mrunal Lalwani','Himanshu M Singhal','Manav Gada','Rajvi'],
    Cricket: ['Prashant Jaiswal','Harsh Sapkale','Praharsh Shah','Yashas P R','Kunal Shahdeo','Ashutosh Kumar','Prathmesh Nachankar ','Siddhant Kalel','Bhagat ','Sanket Ambre ','Ayush Parmar','Adhityan','Adwait Patwardhan','Shubh Verma','Divyansh Shukla','Bitthal','Aditya Wankhede','Upendra'],
    Football: ['Manav Doshi', 'Kaustubh Chaurasia','Akhilesh ','Mokshit','Oshim','Adhi saran','Jatin Chaudhary','Shivanshu Kalia','Onam Tamir','Subhojit','Pushpak','Babu','Pratham Sanghvi','Sarjam Tudu','Karan Bayad','Sahil Kumar','Subhojit','Suvatman Dhar','Tushmin','Yash Singh'],
    Hockey: ['Chaitanya Ramprasad', 'Shubham Shaw','John Paul','Ankit Rathee','Ayush Patil','Nandini Chandak','Anshul Panwar','Kartikeya Chandra','Anmol','Kuldeep Sharma','Dheeraj'],
    IndianGames: ['Ashok','Param','Balbir','Chandmal','Kishore','Vinankara','Kiran','Rohinee','Sarika','Sravani','Himani','Snehal','Shubham Sharma'],
    LawnTennis: ['Shubham Shaw', 'Sahil Kumar','Prateek Jha','Aryan Thakur','Shubh Verma'],
    Sqaush: ['Aneesh Kamat', 'Ruhaan','Rati ','Namrata','Siddhant','Ayush Parmar'],
    TableTennis: ['Riddhima Channa', 'Rishi','Saurabh ','Mitali','Shantanu','Priyam','Kaivaly Daga'],
    Volleyball: ['Nishant', 'Abhigyan', 'Prakhar', 'Siva', 'kumar', 'Anil', 'Kiran', 'Sandeep','Sakshi', 'Pragati', 'Prerna', 'Jigmat', 'Surbhi', 'Garima', 'Navya', 'Mahek', 'Shristi', 'Riyali'],
    Weightlifting: ['Amit Meena','Kosika Bhanu Prakash','Almaas Ummu Salma A A','Adithyan Rajesh'],
    'Ultimate Frisbee':['Arti Kumar','Kapil Dedhia','Ishika Saini','Almaas Ummu Salma','Suraj Kumar','Karthickeyan V','Kuldeep Sankhat','Harshvardhan Ahirwar','Rujul Bhosale','Shruti Saraf','Dinesh Bomma','Arjun Sadananda','Sakthivel M','Utkarsh Tripathi','Vaibhav Verma','Chhavi','Pranav Adhyapak','Aswin Srivastava','Pooja Verma','Soumya Kedia'],
  };

  // Function to get person's photo URL based on their name
  const getPersonPhotoUrl = (personName) => {
    if (!personName) return null;
    // Convert name to a format suitable for filename
    // Replace spaces with underscores and convert to lowercase
    const fileName = personName.toLowerCase().replace(/\s+/g, '_');
    return `photos/${fileName}.jpg`; // Assuming photos are stored in a 'photos' folder with .jpg extension
  };

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
    setSelectedName('');  // Reset selected name when sport changes
    setSelectedPersonPhoto(null); // Reset person photo when sport changes
  };

  const handleNameChange = (e) => {
    const selectedPersonName = e.target.value;
    setSelectedName(selectedPersonName);
    
    // Set the selected person's photo
    if (selectedPersonName) {
      const photoUrl = getPersonPhotoUrl(selectedPersonName);
      setSelectedPersonPhoto(photoUrl);
    } else {
      setSelectedPersonPhoto(null);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setError('Photo size should be less than 50MB.');
        return;
      }

      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
      
      setError(''); // Clear any previous errors
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file.');
        return;
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('Video size should be less than 100MB.');
        return;
      }

      setVideo(file);
      
      // Create preview URL
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      
      setError(''); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!userData.name || !userData.email) {
      setError('User data not found. Please log in again.');
      return;
    }

    if (!selectedSport || !selectedName || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('selectedSport', selectedSport);
    formData.append('selectedName', selectedName);
    formData.append('description', description.trim());
    formData.append('userName', userData.name);
    formData.append('userEmail', userData.email);
    
    if (photo) {
      formData.append('photo', photo);
    }
    if (video) {
      formData.append('video', video);
    }
  
    try {
      const response = await axios.post(
        'https://yearbook-website-1.onrender.com/api/submit', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 second timeout for large files
        }
      );
      
      console.log('Form submitted successfully:', response.data);
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again with smaller files.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.status === 413) {
        setError('File too large. Please reduce file size and try again.');
      } else {
        setError('Error submitting form. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up video preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  if (submitted) {
    navigate('/response-submitted');
    return null;
  }

  return (
    <div className="fill-memory-page">
      <div className="fill-memory-left">
        <img src='isc-logo.png' alt='ISC Logo' className='logo' />
        <h2>SPORTS YEARBOOK</h2>
        <h3>Fill Your Memory</h3>
        <p>Share your experiences and moments!</p>
      </div>
      <div className="fill-memory-right">
        {/* Selected Person Photo Display - Moved to top */}
        {selectedPersonPhoto && (
          <div className="selected-person-photo" style={{
            textAlign: 'center',
            marginBottom: '2rem',
            marginLeft:"-2rem",
            padding: '2rem',
            backgroundColor: 'transparent'
          }}>
          <img 
              src={selectedPersonPhoto} 
              alt={`${selectedName}'s photo`}
              className="responsive-photo"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
          />
            <h4 style={{ margin: '0', color: '#333', fontSize: '1.1rem', fontWeight: '500' }}>
              {selectedName}
            </h4>
          </div>
        )}

        {error && (
          <div className="error-message" style={{ 
            color: 'red', 
            backgroundColor: '#ffebee', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '20px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sport">Select Sport: *</label>
            <select 
              id="sport" 
              value={selectedSport} 
              onChange={handleSportChange} 
              required
              disabled={loading}
            >
              <option value="">Select</option>
              {Object.keys(sportsPlayers).map((sport) => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>
          
          {selectedSport && (
            <div className="form-group">
              <label htmlFor="name">Select Name: *</label>
              <select 
                id="name" 
                value={selectedName} 
                onChange={handleNameChange} 
                required
                disabled={loading}
              >
                <option value="">Select</option>
                {sportsPlayers[selectedSport].map((player) => (
                  <option key={player} value={player}>{player}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="description">Write about them: *</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={handleDescriptionChange} 
              required
              disabled={loading}
              placeholder="Share your memories, experiences, or thoughts about this person..."
              rows="4"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="photo">Add Photo: (Max 20MB)</label>
            <input 
              type="file" 
              id="photo" 
              accept="image/*" 
              onChange={handlePhotoChange}
              disabled={loading}
            />
            {photoPreview && (
              <div className="preview" style={{ marginTop: '10px' }}>
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !userData.name || !userData.email}
            style={{
              backgroundColor: loading ? '#ccc' : '#007bff',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        
        {loading && (
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            color: '#666' 
          }}>
            <p>Uploading files... This may take a moment for large files.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillMemoryForm;