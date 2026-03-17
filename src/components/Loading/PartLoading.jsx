import styles from './PartLoading.module.css';

const PartLoading = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.loader}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

    );
};

export default PartLoading;