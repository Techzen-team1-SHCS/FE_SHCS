import styles from './Loader.module.css';

const LoaderButton = ({ size = "small", color = "#fff" }) => {
    return (
        <div className={`${styles.loader} ${styles[size]}`}>
            <div 
                className={styles.spinner} 
                style={{ borderColor: color, borderTopColor: 'transparent' }}
            ></div>
        </div>
    );
};

export default LoaderButton;