import axios from 'axios';

import { setDonors, setReceivers } from '../Redux/userinfoslice';
import { connectWebSocket } from '../RealTime/socket';


export const loginUser = async (loginData,navigator) => {
  try 
  {
    const response = await axios.post(`/api/auth/login`, loginData);
    if (response.data === 'Please register first') {
    alert('Please register first'); return}
    localStorage.setItem('usernameforreact', response.data.usernameforreact);
    localStorage.setItem('profilePicURL', response.data.profilePicURL);  // 
    connectWebSocket(response.data.usernameforreact); 
    navigator('/userdashboard/content')
    console.log('Login Successful:', response.data); // Handle the token or success message
    return response.data;
    } 
  catch (error) 
  {
  if (error.response && error.response.data === 'Please register first') {
    alert('Please register first');
  } else if (error.response && error.response.data === 'incorrect password') {
    alert('Incorrect password. Try again.');
  } else {
    console.error('Login Failed:', error.response ? error.response.data : error.message);
    alert('An unexpected error occurred. Please try again later.');
  }
  throw error; // Re-throw for further handling if needed
  }

};



/*register api. unfinished*/
export const registerUser = async (registerData, navigator) => {
  try {
    const {username,password,email,fileExt,contentType,imageFile,useDefaultImage} = registerData;
    const payload = {username,password,email,useDefaultImage};

    // Only send image metadata if an image was selected
    if (!useDefaultImage) {
      payload.fileExt = fileExt;
      payload.contentType = contentType;
    }
    // Call backend to register
    const response = await axios.post(`/api/auth/register`, payload);
    const { profile_pic_upload_url } = response.data;

    // If image was selected, upload it to S3
    if (!useDefaultImage && imageFile) {
      await fetch(profile_pic_upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": contentType
        },
        body: imageFile,
      });
    }
    alert('Registered successfully. Login now.');
    navigator('/');
    console.log('Registration Successful:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Registration Failed:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};



/*need cash unfinished*/

export const getcashguys = async (navigator, dispatch, amount) => {
  try {
    const response = await axios.put(
      `/api/exchanges/needcash`,
      { amount }, // Include the amount in the request body
      {
        withCredentials: true
      }
    );
    console.log('Active Users:', response); // Logs the list of users
    dispatch(setReceivers(response.data));
    localStorage.setItem('matchescash', 'true');

    navigator('/userdashboard/matches/true');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch active users:', error.response ? error.response.data : error.message);
    throw error;
  }
};


/*need digital unfinished*/
export const getdigitalguys = async (navigator, dispatch, amount) => {
  try {
    const response = await axios.put(
      `/api/exchanges/needdigital`,
      { amount }, // Include the amount in the request body
      {
        withCredentials: true
      }
    );
    console.log('Active Users:', response); 
    dispatch(setDonors(response.data));
    localStorage.setItem('matchescash', 'false');
    navigator('/userdashboard/matches/false');
    return response.data;
  } 
  catch (error) { // ✅  
    console.error('Error:', error.response?.data || error.message);
    throw error;
                }
};


export const userlogout = async (navigator) => {
  try {
    await axios.put(
      `/api/auth/logout`, // API endpoint
      {}, // Empty body for a PUT request
      {
        withCredentials: true 
      }
    );
    console.log('User logged out successfully');
    navigator('/home')
  } catch (error) {
    console.error('Error during logout:', error);
  }
};









