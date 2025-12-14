import api from './api';
export const wishListService = {
    async getWishList() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const response=await api.get('auth/Mywishlist',{
                headers:{ Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
             throw new Error(error.response?.data?.message || 'Failed to fetch wish list');
        }
    },
    async addToWishList(wishlistData) {
       try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication token not found');
        }
        const response = await api.post('auth/wishlist', wishlistData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return response.data;
       } catch (error) {
         throw new Error(error.response?.data?.message || 'Đã có trong danh sách yêu thích');
       }
    },
    async removeFromWishList(hotelId, userId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await api.delete(`auth/remove/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            hotel_id: hotelId,
            user_id: userId
          }
        });

        return response.data;

      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to remove from wish list');
      }
    },
    async deleteWishList(id){
      try {
          const token=localStorage.getItem('token');
          if(!token){
            throw new Error('Authentication token not found ');
          }
          const response=await api.delete(`auth/wishlist/${id}`,{
            headers:{Authorization:`Bearer ${token}`}
          });
          return response.data;
      } catch (error) {
         console.log('Error deleting wishlist:',error);
         throw error;
        
      }

    }
    

  
};  