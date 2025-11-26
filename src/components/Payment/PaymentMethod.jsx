import React, { useEffect, useState } from 'react'
import styles from './PaymentMethod.module.css'
import { formatVND } from '../../utils/dateUtils';
import paymentService from '../../services/paymentService';
import { authService } from '../../services/authService';

const PaymentMethod = ({ user }) => {
    const {profileContainer,headerContainer,profileHeader,headerTitle,headerGroup,helpBtn,general,headerType
        ,profileSection,title_left,left_arrow,title_balance,title_right,image_vnpay
        ,content,contentLeft,contentRight,total_wallet,transaction,header_transaction,content_transaction,content_transaction_left,content_transaction_right,header_refund,image_refund,content_refund,amount_refund,info_Asset,transaction_information,content_transaction_information,info_note,footer_transaction,time,date}=styles;
    const [payments, setPayments] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                setLoading(true);
                
                // Fetch payments
                const paymentResponse = await paymentService.getMyPayments();
                console.log('💰 Payment response:', paymentResponse);
                
                // Sửa ở đây - kiểm tra cấu trúc response
                const paymentsData = paymentResponse.data || paymentResponse;
                const paymentsArray = Array.isArray(paymentsData) ? paymentsData : [];
                setPayments(paymentsArray);
                
                // Tính tổng tiền
                const total = paymentsArray.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
                setTotalAmount(total);
                
                // Fetch user data
                if (user?.id) {
                    console.log('🔍 Fetching user with ID:', user.id);
                    const userResponse = await authService.getUserById(user.id);
                    console.log('👤 User response:', userResponse);
                    
                    setUserData(userResponse);
                }
                
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchPayment();
    }, [user?.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Lấy wallet_balance an toàn
    const walletBalance = parseFloat(userData?.wallet_balance);
  return (  
    <div className={profileContainer}>
       <div className={headerContainer}>
            <div className={profileHeader}>
                <div className={headerTitle}>Balance</div>
                <div className={headerGroup}>
                    <button className={helpBtn}>?</button>
                    <img
                        src={'' || user?.image}
                        alt="avatar"
                        className="rounded-circle"
                        width={60}
                        height={60}
                    />
                </div>
            </div>
            <div className={headerType}>
                <div>General</div>
                <div className={general}>Balance</div>
                <div>Security</div>
            </div>
        </div>
        <div className={profileSection}>
            <div className={title_left}>
                <div className={left_arrow}>
                    <img src="assets/images/icons/left-arrow.png" alt="" style={{width:'63px',height:'63px',objectFit:'cover'}} />
                </div>
                <div className={title_balance} style={{fontWeight:'bold'}}>Primary Balance</div>
            </div>
            <div className={title_right}>
                <div className={image_vnpay}>
                    <img src="assets/images/icons/Group.png" alt="" style={{width:'90px',height:'100px',objectFit:'cover'}} />
                    <span style={{fontWeight:'bold',fontSize:'24px'}}>VNPay</span>
                    <div style={{color:'#888888',fontSize:'20px'}}>VND</div>
                </div>
            </div>
        </div>
        <hr style={{width:'90%'}} />
        <div className={content} style={{marginBottom:'50px'}}>
            <div className={contentLeft}>
                <div className={total_wallet}
                >
                    <div style={{fontSize:'20px',fontWeight:'bold'}}>Total amount paid</div>
                    <div style={{fontSize:'36px',fontWeight:'bold',color:'darkgray'}}>{formatVND(walletBalance)}</div>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    maxHeight: '500px', // giới hạn chiều cao
                    overflowY: 'auto', // scroll dọc
                }}>
                    {payments.length === 0 ? (
                        <div>No transactions found.</div>
                    ) : (
                        payments.map((payment) => {
                            const dateObj = new Date(payment.created_at);
                            const month = dateObj.toLocaleString('default', { month: 'short' });
                            const day = dateObj.getDate();
                            const amount = Number(payment.amount);

                            return (
                                <div key={payment.id} className={transaction}>
                                    <div className={header_transaction}>Transaction</div>
                                    <div className={content_transaction}>
                                        <div className={content_transaction_left}>
                                            <div>
                                                <div style={{ color: 'darkgray' }}>{month}</div>
                                                <div style={{ fontWeight: '600' }}>{day}</div>
                                            </div>
                                            <div>
                                                <img
                                                    style={{ width: '51px', height: '51px', objectFit: 'cover' }}
                                                    src="assets/images/icons/arrow.png"
                                                    alt=""
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>Bought Service</div>
                                                <div>{payment.status === 'paid' ? 'Completed' : 'Pending'}</div>
                                            </div>
                                        </div>

                                        <div className={content_transaction_right} style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '600' }}>Transaction code {payment.id}</div>
                                            <div>+{formatVND(amount)}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                </div>
            </div>
            <div className={contentRight}>
                <div className={header_refund}>
                    Refund Service
                </div>
                <div className={image_refund}>
                    <img style={{width:'107px',height:'107px',objectFit:'cover'}} src="assets/images/icons/refund.png" alt="" />
                </div>
                <div className={content_refund}>
                    <div className={amount_refund}>Refund amount (minus 50%)</div>
                    <div style={{color:'#d9d9d9',display:'flex',justifyContent:'center',gap:'5px',fontSize:'28px'}}>{formatVND(userData?.wallet_balance)}  &#8645;</div>
                </div>
                <div className={transaction_information}>
                    <div style={{fontWeight:'600'}}>Transaction Information</div>
                    <div className={content_transaction_information}>
                            <div className={info_Asset}>
                                <div>Asset</div>
                                <div style={{display:'flex' ,gap:'10px'}}>
                                    <div>
                                       <img src="assets/images/icons/Group.png" alt="" style={{width:'30px',height:'30px',objectFit:'cover'}} />
                                    </div>
                                    <div style={{fontWeight:'600',fontSize:'14px'}}>VnPay</div>
                                </div>
                            </div>
                            <div className={info_Asset}>
                                <div>To</div>
                                <div style={{display:'flex' ,gap:'10px'}}>
                                    <div>
                                       <img src="assets/images/icons/ballance.png" alt="" style={{width:'30px',height:'30px',objectFit:'cover'}} />
                                    </div>
                                    <div style={{fontSize:'14px'}}>Moblie , email or address</div>
                                </div>
                            </div>
                            <div className={info_note}>
                                <div>Note</div>
                                <div style={{display:'flex' ,gap:'10px'}}>
                                    <div>
                                       <img src="assets/images/icons/note.png" alt="" style={{width:'30px',height:'30px',objectFit:'cover'}} />
                                    </div>
                                    <div style={{fontSize:'14px'}}>Optional message</div>
                                </div>
                            </div>
                    </div>
                </div>
                <div className={footer_transaction}>
                    <div style={{fontWeight:'600'}}>The transaction was made at: </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                        <div className={time}>07:11</div>
                        <div className={date}>17/11/2025</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PaymentMethod