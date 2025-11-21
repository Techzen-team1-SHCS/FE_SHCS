import React from 'react'
import styles from "./Profile.module.css"

const UserPayment = () => {
    return (
        <div className={styles.profileContainer}>
            <div className={styles.headerContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.headerTitle}>Profile</div>
                </div>
                <div className='d-flex' style={{gap:"20px"}}>
                    <div className={styles.tab}>General</div>
                    <div className={styles.activeTab}>Payment</div>
                    <div className={styles.tab}>Security</div>
                </div>
            </div>
            <div className={styles.profileSection}>
                <div className={styles.paymentInfo}>
                    <div className={styles.paymentTitle}>
                        Add payment method
                    </div>
                    <div className={styles.paymentDescription}>
                        Pay quickly and securely on our website and other platforms when you add a payment method
                    </div>
                    <div className='mt-40'>
                        <img src='/assets/images/logos/payment.png'></img>
                    </div>
                    <div>
                        <button className={styles.addPaymentButton}>Add Payment Method</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPayment
