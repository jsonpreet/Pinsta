import axios from 'axios';
import {PINSTA_API_URL} from './constants';

const instance = axios.create({
    baseURL: PINSTA_API_URL
})

export default instance;