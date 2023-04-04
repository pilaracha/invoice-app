import axios from 'axios';

async function getRandomUsers() {
    try {
      const response = await axios.get('https://randomuser.me/api/?inc=name,location,email&nat=us&results=3000');
      return response.data.results;
    } catch (error) {
      console.error(error);
    }
}

export default {
    getRandomUsers
};