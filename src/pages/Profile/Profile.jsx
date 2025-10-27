import React, { useState } from 'react'
import styles from "./Profile.module.css"
import PersonalDetail from '../../components/PersonalDetail/PersonalDetail';
import Security from '../../components/Security/Security.jsx';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const { user } = useContext(AuthContext);
    const tabs = [
        { id: 'personal', label: 'Personal Details', icon: '' },
        { id: 'payment', label: 'Payment method', icon: '' },
        { id: 'security', label: 'Security', icon:''  },
    ];
    return (
        <div className='page-wrapper'>
            <div className={styles.profileContainer}>
                <div className={styles.sidebar}>
                    <nav className={styles.sidebarNav}>
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                {tab.label}
                            </div>
                        ))}
                    </nav>
                </div>
                <div className={styles.content}>
                    {activeTab === 'personal' && <PersonalDetail user={user} />}
                    {activeTab === 'security' && <Security user={user} />}
                </div>
            </div>

        </div>
    )
}

export default Profile
