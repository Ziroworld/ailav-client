import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost:8080/api/V3/users';


export const getUsers = async () => {
  try {
    const response = await axios.get(`${USER_API_BASE_URL}/user`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${USER_API_BASE_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
