import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-44089.firebaseio.com/'
});

export default instance;