import React, { useEffect, useMemo, useState } from 'react'
import styles from './PaymentMethod.module.css'
import { formatVND } from '../../utils/dateUtils';
import paymentService from '../../services/paymentService';
import { authService } from '../../services/authService';
import CurrentTime from '../CurrentTime/CurrentTime';
import { useQuery } from '@tanstack/react-query';

const PaymentMethod = ({ user }) => {
    const [activeFilter, setActiveFilter] = useState('all');

     const { data: payments = [], isLoading: loadingPayments } = useQuery({
        queryKey: ["payments", user?.id],
        queryFn: async () => {
            const res = await paymentService.getMyPayments();
            return Array.isArray(res.data) ? res.data : [];
        },
        staleTime: 1000 * 60 * 3, // 3 phút cache
    });

    // ⚡ Query 2: Get user info
    const { data: userData, isLoading: loadingUser } = useQuery({
        queryKey: ["user-info", user?.id],
        queryFn: () => authService.getUserById(user.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 3,
    });

    const loading = loadingPayments || loadingUser;

    // ⚡ Tính totalAmount cực nhanh
    const totalAmount = useMemo(() => {
        return payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    }, [payments]);
    
    // Filter payments based on active filter
    const filteredPayments = payments.filter(payment => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'completed') return payment.status === 'paid';
        if (activeFilter === 'pending') return payment.status !== 'paid';
        return true;
    });

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div>Loading payment history...</div>
            </div>
        );
    }

    const walletBalance = parseFloat(userData?.wallet_balance) || 0;

    return (  
        <div className={styles.profileContainer}>
            {/* Header Section */}
            <div className={styles.headerContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.headerTitle}>Balance & Payments</h1>
                        <p className={styles.headerSubtitle}>Manage your transactions and refunds</p>
                    </div>
                    <div className={styles.headerGroup}>
                        <button className={styles.helpBtn}>
                            <span>?</span>
                            <span className={styles.tooltip}>Get help</span>
                        </button>
                        <div className={styles.userAvatar}>
                            <img
                                src={user?.image || 'assets/images/avatar/avatar_default.png'}
                                alt="avatar"
                                className={styles.avatarImage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Balance Overview Cards */}
                <div className={styles.overviewSection}>
                    <div className={styles.balanceCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                <img src="assets/images/icons/payment.png" alt="Wallet" />
                            </div>
                            <h3>Total Balance</h3>
                        </div>
                        <div className={styles.cardAmount}>{formatVND(walletBalance)}</div>
                        <div className={styles.cardSubtitle}>Available for refund</div>
                    </div>

                    <div className={styles.balanceCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                <img src="assets/images/icons/paid.png" alt="Payments" />
                            </div>
                            <h3>Total Paid</h3>
                        </div>
                        <div className={styles.cardAmount}>{formatVND(totalAmount)}</div>
                        <div className={styles.cardSubtitle}>Lifetime payments</div>
                    </div>

                    <div className={styles.balanceCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                <img src="assets/images/icons/transaction.png" alt="Transactions" />
                            </div>
                            <h3>Transactions</h3>
                        </div>
                        <div className={styles.cardAmount}>{payments.length}</div>
                        <div className={styles.cardSubtitle}>Total transactions</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>
                    {/* Transactions Section */}
                    <div className={styles.transactionsSection}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>Transaction History</h2>
                            <div className={styles.filterTabs}>
                                <button 
                                    className={`${styles.filterTab} ${activeFilter === 'all' ? styles.active : ''}`}
                                    onClick={() => setActiveFilter('all')}
                                >
                                    All
                                </button>
                                <button 
                                    className={`${styles.filterTab} ${activeFilter === 'completed' ? styles.active : ''}`}
                                    onClick={() => setActiveFilter('completed')}
                                >
                                    Completed
                                </button>
                                <button 
                                    className={`${styles.filterTab} ${activeFilter === 'pending' ? styles.active : ''}`}
                                    onClick={() => setActiveFilter('pending')}
                                >
                                    Pending
                                </button>
                            </div>
                        </div>

                        <div className={styles.transactionsList}>
                            {filteredPayments.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <img src="assets/images/icons/no-transactions.png" alt="No transactions" />
                                    <h3>No transactions found</h3>
                                    <p>Your transaction history will appear here</p>
                                </div>
                            ) : (
                                filteredPayments.map((payment) => {
                                    const dateObj = new Date(payment.created_at);
                                    const month = dateObj.toLocaleString('default', { month: 'short' });
                                    const day = dateObj.getDate();
                                    const time = dateObj.toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                    });
                                    const amount = Number(payment.amount);
                                    const isCompleted = payment.status === 'paid';

                                    return (
                                        <div key={payment.id} className={styles.transactionItem}>
                                            <div className={styles.transactionIcon}>
                                                <div className={styles.dateBadge}>
                                                    <span className={styles.month}>{month}</span>
                                                    <span className={styles.day}>{day}</span>
                                                </div>
                                                <div className={`${styles.statusIndicator} ${isCompleted ? styles.completed : styles.pending}`}></div>
                                            </div>
                                            
                                            <div className={styles.transactionDetails}>
                                                <div className={styles.transactionMain}>
                                                    <h4 className={styles.serviceName}>Service Purchase</h4>
                                                    <p className={styles.transactionTime}>{time}</p>
                                                </div>
                                                <div className={styles.transactionMeta}>
                                                    <span className={styles.transactionId}>ID: {payment.id}</span>
                                                    <span className={`${styles.status} ${isCompleted ? styles.completedText : styles.pendingText}`}>
                                                        {isCompleted ? 'Completed' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className={styles.transactionAmount}>
                                                <div className={styles.amount}>+{formatVND(amount)}</div>
                                                <div className={styles.paymentMethod}>
                                                    <img 
                                                        src="assets/images/icons/Group.png" 
                                                        alt="VNPay" 
                                                        className={styles.methodIcon}
                                                    />
                                                    VNPay
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Refund & Quick Actions Section */}
                    <div className={styles.sidebarSection}>
                        {/* Refund Card */}
                        <div className={styles.refundCard}>
                            <div className={styles.refundHeader}>
                                <h3>Refund Service</h3>
                                <div className={styles.infoBadge}>50% fee</div>
                            </div>
                            
                            <div className={styles.refundVisual}>
                                <div className={styles.refundIcon}>
                                    <img src="assets/images/icons/refund.png" alt="Refund" />
                                </div>
                                <div className={styles.refundAmounts}>
                                    <div className={styles.currentBalance}>
                                        <span>Current Balance</span>
                                        <strong>{formatVND(walletBalance)}</strong>
                                    </div>
                                    <div className={styles.refundArrow}>↓</div>
                                    <div className={styles.refundableAmount}>
                                        <span>Refundable</span>
                                        <strong>{formatVND(walletBalance * 0.5)}</strong>
                                    </div>
                                </div>
                            </div>

                            <button className={styles.refundButton}>
                                Request Refund
                            </button>
                        </div>

                        {/* Quick Transfer */}
                        <div className={styles.quickActions}>
                            <h3>Quick Actions</h3>
                            <div className={styles.actionButtons}>
                                <button className={styles.actionButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(240,187,64,1)"><path d="M12.0049 22.0027C6.48204 22.0027 2.00488 17.5256 2.00488 12.0027C2.00488 6.4799 6.48204 2.00275 12.0049 2.00275C17.5277 2.00275 22.0049 6.4799 22.0049 12.0027C22.0049 17.5256 17.5277 22.0027 12.0049 22.0027ZM8.50488 14.0027V16.0027H11.0049V18.0027H13.0049V16.0027H14.0049C15.3856 16.0027 16.5049 14.8835 16.5049 13.5027C16.5049 12.122 15.3856 11.0027 14.0049 11.0027H10.0049C9.72874 11.0027 9.50488 10.7789 9.50488 10.5027C9.50488 10.2266 9.72874 10.0027 10.0049 10.0027H15.5049V8.00275H13.0049V6.00275H11.0049V8.00275H10.0049C8.62417 8.00275 7.50488 9.12203 7.50488 10.5027C7.50488 11.8835 8.62417 13.0027 10.0049 13.0027H14.0049C14.281 13.0027 14.5049 13.2266 14.5049 13.5027C14.5049 13.7789 14.281 14.0027 14.0049 14.0027H8.50488Z"></path></svg>
                                    <span>Add Money</span>
                                </button>
                                <button className={styles.actionButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(150,218,183,1)"><path d="M4.99958 12.9999C4.99958 7.91198 7.90222 3.5636 11.9996 1.81799C16.0969 3.5636 18.9996 7.91198 18.9996 12.9999C18.9996 13.8229 18.9236 14.6264 18.779 15.4027L20.7194 17.2353C20.8845 17.3913 20.9238 17.6389 20.815 17.8383L18.3196 22.4133C18.1873 22.6557 17.8836 22.7451 17.6412 22.6128C17.5993 22.59 17.5608 22.5612 17.5271 22.5274L15.2925 20.2928C15.1049 20.1053 14.8506 19.9999 14.5854 19.9999H9.41379C9.14857 19.9999 8.89422 20.1053 8.70668 20.2928L6.47209 22.5274C6.27683 22.7227 5.96025 22.7227 5.76498 22.5274C5.73122 22.4937 5.70246 22.4552 5.67959 22.4133L3.18412 17.8383C3.07537 17.6389 3.11464 17.3913 3.27975 17.2353L5.22014 15.4027C5.07551 14.6264 4.99958 13.8229 4.99958 12.9999ZM6.47542 19.6957L7.29247 18.8786C7.85508 18.316 8.61814 17.9999 9.41379 17.9999H14.5854C15.381 17.9999 16.1441 18.316 16.7067 18.8786L17.5237 19.6957L18.5056 17.8955L17.4058 16.8568C16.9117 16.3901 16.6884 15.7045 16.8128 15.0364C16.9366 14.3722 16.9996 13.6911 16.9996 12.9999C16.9996 9.13037 15.0045 5.69965 11.9996 4.04033C8.99462 5.69965 6.99958 9.13037 6.99958 12.9999C6.99958 13.6911 7.06255 14.3722 7.18631 15.0364C7.31078 15.7045 7.08746 16.3901 6.59338 16.8568L5.49353 17.8955L6.47542 19.6957ZM11.9996 12.9999C10.895 12.9999 9.99958 12.1045 9.99958 10.9999C9.99958 9.89537 10.895 8.99994 11.9996 8.99994C13.1041 8.99994 13.9996 9.89537 13.9996 10.9999C13.9996 12.1045 13.1041 12.9999 11.9996 12.9999Z"></path></svg>
                                    <span>Transfer</span>
                                </button>
                                <button className={styles.actionButton}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(159,207,248,1)"><path d="M4 2H20V6.45994L13.5366 12L20 17.5401V22H4V17.5401L10.4634 12L4 6.45994V2ZM16.2967 7L18 5.54007V4H6V5.54007L7.70326 7H16.2967ZM12 13.3171L6 18.4599V20H7L12 17L17 20H18V18.4599L12 13.3171Z"></path></svg>
                                    <span>Full History</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className={styles.recentActivity}>
                            <h3>Recent Activity</h3>
                            <div className={styles.activityList}>
                                {payments.slice(0, 3).map((payment, index) => (
                                    <div key={index} className={styles.activityItem}>
                                        <div className={styles.activityIcon}>
                                            <img src="assets/images/icons/Group.png" alt="Payment" />
                                        </div>
                                        <div className={styles.activityDetails}>
                                            <p>Payment #{payment.id}</p>
                                            <span className={styles.activityAmount}>+{formatVND(payment.amount)}</span>
                                        </div>
                                        <div className={styles.activityTime}>
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Time Footer */}
            <div className={styles.footer}>
                <div className={styles.currentTime}>
                    <CurrentTime />
                </div>
                <div className={styles.footerNote}>
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    )
}

export default PaymentMethod;