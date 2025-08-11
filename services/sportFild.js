
import axios from "axios";

const API_BASE_URL = 'https://localhost:44313/api/SportsFields';
const API_BASE_URL_BOOKING = 'https://localhost:44313/api/Booking';

export const fetchSportFild = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const fetchFilteredSportFild = async (filterParams) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/FilteredSportFild`, {
            params: {
                type: filterParams.type,
                searchTitleOrAddres: filterParams.searchTitleOrAddres,
                date: filterParams.date,
                startTime: filterParams.startTime,
                duration: filterParams.duration,
                city: filterParams.city
            },
            paramsSerializer: params => {
                return Object.entries(params)
                    .filter(([, value]) => value !== null && value !== undefined)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getBookingsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_BOOKING}/GetBookingByIdUser`, {
      params: { userId }
    });
    
    return response.data;
  } catch (error) {
    console.error('Помилка при отриманні бронювань:', error);
    throw error;
  }
};

// export const deleteBookingsByBookingId = async (bookingId) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL_BOOKING}/DeleteBookingByIdBooking`, {
//       params: { bookingId }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Помилка при отриманні бронювань:', error);
//     throw error;
//   }
// };



// export const deleteBookingsByBookingId = async (bookingId) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL_BOOKING}/DeleteBookingByIdBooking`, {
//       params: { bookingId }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Помилка при видаленні бронювання:', error);
//     throw error;
//   }
// };
export const cancelBookingsByBookingId = async (bookingId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_BOOKING}/cancel-booking`,
      null, // тіло порожнє
      {
        params: { bookingId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Помилка при скасуванні бронювання:", error);
    throw error;
  }
};

