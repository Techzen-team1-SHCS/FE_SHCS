import React,{useState,useEffect} from 'react'
import { hotelService } from '../../services/hotelService'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../Button/Button';
import PartLoading from '../Loading/PartLoading';
function SimilarHotel({currentHotelId}) {
  const[similarHotel,setSimilarHotel]=useState([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState(null);
  const navigate=useNavigate();
  useEffect(()=>{
    const fetchSimilarHotel=async()=>{
      try {
        setLoading(true);
        const data=await hotelService.getSimilarHotel(currentHotelId);
        setSimilarHotel(data);
      } catch (error) {
        setError('Không thể tải danh sách khách sạn cùng tỉnh');
        toast.error(error);
      }finally{
        setLoading(false);
      }
    };
    if (currentHotelId) {
      fetchSimilarHotel();
    }
  },[currentHotelId]);
  if (loading) return <div><PartLoading /></div>;
  if (error) return <div>Lỗi: {error}</div>;
  return (
    <div className='similar-hotels'>
      {similarHotel.map((hotel)=>{
        return(
          <div className='maincontent' key={hotel.id}>
            <div className='container'>
                <div className='similar-hotels-img'>
                  <img src={hotel.images?.[0]?.url || '/default-hotel.jpg'}/> 
                </div>
                <div className='content1'>
                <span>{hotel.name}</span>
                <div className='content3'>
                  <div className='guest'>
                      <img src="/assets/images/about/icon-user-grey.svg" alt="" />
                      <span>{hotel.rooms?.[0]?.max_guest}</span>
                  </div>
                  <div className='ft'>
                      <img src="/assets/images/about/icon-plan-grey.svg" alt="" />
                      <span>70 ft</span>
                  </div>
                </div>
                <span className='contentDescription'>{hotel.description}</span>
                <Button props={'Book Now'}></Button>
                </div>
            </div>
          </div>
        )
      }
      )} 
    </div>
  )
}

export default SimilarHotel