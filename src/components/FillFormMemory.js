import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './p.css';

// Component to handle photo display with fallback
const PersonPhotoDisplay = ({ personName, sport }) => {
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(null);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidPhoto, setHasValidPhoto] = useState(false);

  // Optimized photo URL generation - only essential variations
  const generatePhotoUrls = (name, sportName) => {
    if (!name || !sportName) return [];

    // Map sport names to folder names
    const sportToFolderMap = {
      'Board Games': 'Board Games',
      'Indian Games': 'Indian Games', 
      'Lawn Tennis': 'Lawn Tennis',
      'Table Tennis': 'Table Tennis',
      'Institute Sports Council': 'Council',
      'Ultimate Frisbee': 'Frisbee'
    };

    const sportFolder = sportToFolderMap[sportName] || sportName.replace(/\s+/g, '');
    const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'PNG'];
    
    // Only generate the most likely name variations
    const nameVariants = [];
    
    // 1. Exact name with underscores (most common pattern)
    const nameWithUnderscore = name.replace(/\s+/g, '_');
    nameVariants.push(nameWithUnderscore);
    
    // 2. First name only (common for single names)
    const firstName = name.split(' ')[0];
    if (firstName !== nameWithUnderscore) {
      nameVariants.push(firstName);
    }
    
    // 3. Capitalize first letter of each word pattern
    const capitalizedName = name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('_');
    if (capitalizedName !== nameWithUnderscore) {
      nameVariants.push(capitalizedName);
    }

    // Generate URLs for all combinations
    const urls = [];
    for (const nameVar of nameVariants) {
      for (const ext of extensions) {
        urls.push(`${sportFolder}/${nameVar}.${ext}`);
      }
    }
    
    return urls;
  };

  useEffect(() => {
    if (personName && sport) {
      const urls = generatePhotoUrls(personName, sport);
      setPhotoUrls(urls);
      setCurrentIndex(0);
      setIsLoading(true);
      setHasValidPhoto(false);
      
      console.log('Generated photo URLs for', personName, ':', urls); // Debug log
      
      if (urls.length > 0) {
        setCurrentPhotoUrl(urls[0]);
      } else {
        setCurrentPhotoUrl(null);
        setIsLoading(false);
      }
    } else {
      setCurrentPhotoUrl(null);
      setPhotoUrls([]);
      setIsLoading(false);
      setHasValidPhoto(false);
    }
  }, [personName, sport]);

  const handleImageError = () => {
    console.log('Failed to load:', currentPhotoUrl); // Debug log
    const nextIndex = currentIndex + 1;
    if (nextIndex < photoUrls.length) {
      setCurrentIndex(nextIndex);
      setCurrentPhotoUrl(photoUrls[nextIndex]);
    } else {
      // No more URLs to try
      setCurrentPhotoUrl(null);
      setIsLoading(false);
      setHasValidPhoto(false);
    }
  };

  const handleImageLoad = () => {
    console.log('Successfully loaded:', currentPhotoUrl); // Debug log
    setIsLoading(false);
    setHasValidPhoto(true);
  };

  if (!personName || !sport) {
    return null;
  }

  if (isLoading && currentPhotoUrl) {
    return (
      <div className="selected-person-photo" style={{
        textAlign: 'center',
        marginLeft: "-1rem",
        backgroundColor: 'transparent'
      }}>
        <div style={{ 
          width: '200px', 
          height: '200px', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '8px',
          margin: '0 auto'
        }}>
          Loading photo...
        </div>
        <h4 style={{ 
          margin: '10px 0 0 0', 
          color: '#333', 
          fontSize: '1.1rem', 
          fontWeight: '500' 
        }}>
          {personName}
        </h4>
        <img 
          src={currentPhotoUrl} 
          alt={`${personName}'s photo`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  if (!currentPhotoUrl || !hasValidPhoto) {
    return (
      <div className="selected-person-photo" style={{
        textAlign: 'center',
        marginBottom: '2rem',
        padding:'0.5rem',
        backgroundColor: 'transparent'
      }}>
        <div style={{ 
          width: '200px', 
          height: '200px', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '8px',
          margin: '0 auto',
          color: '#666',
          fontSize: '14px'
        }}>
          No photo available
        </div>
        <h4 style={{ 
          margin: '10px 0 0 0', 
          color: '#333', 
          fontSize: '1.1rem', 
          fontWeight: '500' 
        }}>
          {personName}
        </h4>
      </div>
    );
  }

  return (
    <div className="selected-person-photo" style={{
      textAlign: 'center',
      marginBottom: '2rem',
      marginLeft: "-1rem",
      padding: '1rem',
      backgroundColor: 'transparent'
    }}>
      <img 
        src={currentPhotoUrl} 
        alt={`${personName}'s photo`}
        className="responsive-photo"
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{
          maxWidth: '200px',
          maxHeight: '200px',
          objectFit: 'cover',
          borderRadius: '8px',
          border: '2px solid #ddd'
        }}
      />
      <h4 style={{ 
        margin: '10px 0 0 0', 
        color: '#333', 
        fontSize: '1.1rem', 
        fontWeight: '500' 
      }}>
        {personName}
      </h4>
    </div>
  );
};

const FillMemoryForm = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedName, setSelectedName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
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
    "Institute Sports Council": [
      "Siddharth Farkiya","Kanishk Garg","Akanksha Kadam","Ishaan Kothari", "Rituraj Chaudhary","Ayush Dhole","Pratham Chandra", "Srajan Jain","Karan","Arushi",
      "Ajit Pal Singh","Jatin Deshpande","Kavan Vavadiya","Aryan Chourasia", "Ritam", "Saloni Kajal",
    ],
    Aquatics: [
      "Anubha","Riddhi","Sania","Sarthak","Suyash","Utkarsh","Utsav"
    ],

    Athletics: [
  "Annie D Souza", "Dhruv Sorathiya", "Kanad", "Lakshay Bhadana",
  "Nitin Kumar", "Rangaswamy","Samiksha Yadav",
  "Shashank Joshi", "Tejas Bhosale"
  ],

    Badminton: [
      "Gopal Maheshwari", "Tanay Tayal", "Soumya Mandal", "Ayush Narwal", "Aditya Pratap Goswami",
      "Sanika", "Shainal Jain", "Srinithya", "Tejal Sharan", "Jathin Sai Ganesh", "Lokesh Soni"
    ],
    Basketball: [
    "Aabir","Ajay Raj", "Akanksha Jain","Alfia Zareen Khan","Nidhi Pandey","Prasanth","Rohit Auti", "Shrunoti",
    "Sudeshna Dhar","Yaamesh"
    ],
    "Board Games": [
      "Chavda Pankitkumar", "Yash Kulkarni", "Harsshh Wankayday",
      "Arham Jain", "Nitish Bhat"
    ],
    Cricket: [
      "Ashwin Kumar", "Himanshu Raj", "Bhawesh Chhajed", "Eswar", "Sayan", "Pratham Kulkarni",
      "Harshvardhan Chouhan", "Saransh", "Utkarsh Patidar", "Kandarp Solanki", "Nachiket",
      "Aakash Verma", "Soham", "Satya"
    ],
    Football: [
      "Dhritiman Sriram", "Arya Agarwal", "Sahil Zodge",
      "Suyash Bhandare", "Aditya Kumar", "Siddharth Kaushik", "Sridhar Sahu", "Harshraj Chaudhri",
      "Himank Gupta", "Rubul Gogoi", "Johan Julio"
    ],
    Hockey: ["Aayush","Alok","Diljit","Harsh","Nikhil","Shani","Shrikant","Utkarsh","Varun"],
    "Indian Games": [
      "Kamlesh Mali", "Abhishek Madike", "Abhishek Kushwah", "Pooja",
      "Samiksha Yadav", "Shreyas Lipare", "Isha Dev", "Sanjyot Bhure", "Korimi Vennela",
      "Naveen Depavath", "Ganesh", "Sai Deepthi", "Aryan Chourasia", "Jaswanthi Masada",
      "Sri Nithya Soupati", "Eswar", "Nikita Kanwar", "Prashasti Abojwar", "Tejashwini Palithya",
      "Bhuvan", "Siddarth"
    ],
    "Lawn Tennis": [
      "Siyona Bansal", "Mudit Sethia", "Ayush Raisoni", "Ashank Deo",
      "Arunjoy", "Himanshu"
    ],
    Squash: ["Krithika Mittal", "Atharva Arora", "Prateek Neema", "Soumya Kedia"],
    "Table Tennis": [
      "Neeraja Patil", "Harshwardhan", "Priyam", "Mohit", "Suman", "Shreya", "Hrithik"
    ],
    Volleyball: [
      "Yameesh Kulhar", "Pratiksha Deka", "Tanisha Kumari", "Akhilesh Kumar",
      "Kunj Patel", "Akhilesh Prasad", "Dhurba Hazarika", "Sushmita Negi"
    ],
    Weightlifting: ["Loveneesh Lawaniya", "Sourabh Chouhan", "Faheem Yoonus", "Priya Singh"],
    "Ultimate Frisbee": ["Ayush Vanmore", "Deepak Solanki", "Faheem M Yoonus", "Kaushikraj", "Ketan Sakalkale", "Mayur", "Prem Kant", "Tanay Tayal", "Vighnu"]

  };

  const handleSportChange = (e) => {
    setSelectedSport(e.target.value);
    setSelectedName('');  // Reset selected name when sport changes
  };

  const handleNameChange = (e) => {
    const selectedPersonName = e.target.value;
    setSelectedName(selectedPersonName);
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
        {/* Selected Person Photo Display */}
        <PersonPhotoDisplay 
          personName={selectedName} 
          sport={selectedSport}
        />

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
            <label htmlFor="photo">Add Photo: (Max 50MB)</label>
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