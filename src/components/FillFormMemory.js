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

  // Generate all possible photo URLs with better matching
  const generatePhotoUrls = (name, sportName) => {
    if (!name || !sportName) return [];

    // Map sport names to folder names (handle special cases)
    const sportToFolderMap = {
      'Board Games': 'Board Games',
      'Indian Games': 'Indian Games', 
      'Lawn Tennis': 'Lawn Tennis',
      'Table Tennis': 'Table Tennis',
      'Institute Sports Council':'Council',
      // Add other mappings if folder names differ from sport names
    };

    // Get the correct folder name
    const sportFolder = sportToFolderMap[sportName] || sportName.replace(/\s+/g, '');
    
    // Split name into parts
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // Generate various name combinations
    const nameVariants = [];
    
    // First name variations
    if (firstName) {
      nameVariants.push(
        firstName,
        firstName.toLowerCase(),
        firstName.toUpperCase(),
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      );
    }
    
    // Full name variations with underscores
    if (name) {
      const fullNameUnderscore = name.replace(/\s+/g, '_');
      nameVariants.push(
        fullNameUnderscore,
        fullNameUnderscore.toLowerCase(),
        fullNameUnderscore.toUpperCase(),
        // Capitalize each word
        fullNameUnderscore.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('_')
      );
    }
    
    // Last name variations (if exists)
    if (lastName) {
      const lastNameUnderscore = lastName.replace(/\s+/g, '_');
      nameVariants.push(
        lastNameUnderscore,
        lastNameUnderscore.toLowerCase(),
        lastNameUnderscore.toUpperCase(),
        lastNameUnderscore.charAt(0).toUpperCase() + lastNameUnderscore.slice(1).toLowerCase()
      );
    }
    
    // Special handling for names that might have different patterns
    // Handle names like "Aditya_Goswami" vs "Aditya Pratap Goswami"
    if (name.includes(' ')) {
      const compactName = name.replace(/\s+/g, '');
      nameVariants.push(
        compactName,
        compactName.toLowerCase(),
        compactName.toUpperCase(),
        compactName.charAt(0).toUpperCase() + compactName.slice(1).toLowerCase()
      );
      
      // Try first and last name only
      if (nameParts.length > 2) {
        const firstLast = `${firstName}_${nameParts[nameParts.length - 1]}`;
        nameVariants.push(
          firstLast,
          firstLast.toLowerCase(),
          firstLast.toUpperCase(),
          firstLast.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join('_')
        );
      }
    }
    
    // Remove duplicates
    const uniqueVariants = [...new Set(nameVariants)];
    
    const extensions = ['jpg', 'jpeg', 'png', 'JPG', 'JPEG', 'PNG'];
    
    const urls = [];
    for (const nameVar of uniqueVariants) {
      for (const ext of extensions) {
        urls.push(`${sportFolder}/${nameVar}.${ext}`);
      }
    }
    
    // Add some additional common patterns based on the directory structure shown
    // Sometimes names might be stored differently
    const additionalPatterns = [];
    
    // Pattern: FirstName_LastName format
    if (nameParts.length >= 2) {
      const patterns = [
        `${firstName}_${nameParts[nameParts.length - 1]}`,
        `${firstName.toLowerCase()}_${nameParts[nameParts.length - 1].toLowerCase()}`,
        `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}_${nameParts[nameParts.length - 1].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].slice(1).toLowerCase()}`
      ];
      
      patterns.forEach(pattern => {
        extensions.forEach(ext => {
          additionalPatterns.push(`${sportFolder}/${pattern}.${ext}`);
        });
      });
    }
    
    return [...urls, ...additionalPatterns];
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
        marginBottom: '2rem',
        marginLeft: "-2rem",
        padding: '2rem',
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
        marginLeft: "-2rem",
        padding: '2rem',
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
      marginLeft: "-2rem",
      padding: '2rem',
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
    Aquatics: [
      // Add your aquatics players here
    ],
    Athletics: [
      // Add your athletics players here
    ],
    Badminton: [
      "Gopal Maheshwari", "Tanay Tayal", "Soumya Mandal", "Ayush Narwal", "Aditya Pratap Goswami",
      "Sanika", "Shainal Jain", "Srinithya", "Tejal Sharan", "Jathin Sai Ganesh", "Lokesh Soni"
    ],
    Basketball: [
      // Add your basketball players here
    ],
    "Board Games": [
      "Jatin Deshpande", "Chavda Pankitkumar", "Yash Kulkarni", "Harsshh Wankayday",
      "Arham Jain", "Nitish Bhat"
    ],
    "Institute Sports Council": [
      "Siddharth Farkiya", "Rituraj Choudhary", "Pratham Chandra", "Srajan Jain"
    ],
    Cricket: [
      "Ashwin Kumar", "Himanshu Raj", "Bhawesh Chhajed", "Eswar", "Sayan", "Pratham Kulkarni",
      "Harshvardhan Chouhan", "Saransh", "Utkarsh Patidar", "Kandarp Solanki", "Nachiket",
      "Aakash Verma", "Soham", "Satya"
    ],
    Football: [
      "Dhritiman Sriram", "Arya Agarwal", "Sahil Zodge", "Ishaan Kothari", "Ayush Dhole",
      "Suyash Bhandare", "Aditya Kumar", "Siddharth Kaushik", "Sridhar Sahu", "Harshraj Chaudhri",
      "Himank Gupta", "Rubul Gogoi", "Johan Julio"
    ],
    Hockey: [
      // Add your hockey players here
    ],
    "Indian Games": [
      "Kamlesh Mali", "Ajit Pal Singh", "Abhishek Madike", "Abhishek Kushwah", "Pooja",
      "Samiksha Yadav", "Shreyas Lipare", "Isha Dev", "Sanjyot Bhure", "Korimi Vennela",
      "Naveen Depavath", "Ganesh", "Sai Deepthi", "Aryan Chourasia", "Jaswanthi Masada",
      "Sri Nithya Soupati", "Eswar", "Nikita Kanwar", "Prashasti Abojwar", "Tejashwini Palithya",
      "Bhuvan", "Siddarth"
    ],
    Hockey: ["Aayush","Alok","Diljit","Harsh","Karan","Nikhil","Shani","Shrikant","Utkarsh","Varun"],
    "Lawn Tennis": [
      "Aryan Chourasia", "Siyona Bansal", "Mudit Sethia", "Ayush Raisoni", "Ashank Deo",
      "Arunjoy", "Himanshu"
    ],
    Squash: ["Krithika Mittal", "Atharva Arora", "Prateek Neema", "Soumya Kedia"],
    "Table Tennis": [
      "Kanishk Garg", "Neeraja Patil", "Harshwardhan", "Priyam", "Mohit", "Suman", "Shreya", "Hrithik"
    ],
    Volleyball: [
      "Srajan Jain", "Yameesh Kulhar", "Pratiksha Deka", "Tanisha Kumari", "Akhilesh Kumar",
      "Kunj Patel", "Akhilesh Prasad", "Dhurba Hazarika", "Sushmita Negi"
    ],
    Weightlifting: ["Loveneesh Lawaniya", "Sourabh Chouhan", "Faheem Yoonus", "Priya Singh"]
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