import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../PaymentResult.module.css';
import PartLoading from '../../../../components/Loading/PartLoading';
import { usePaymentResult } from '../Hooks/usePaymentResult';
import PaymentResultCard from '../Component/PaymentResultCard/PaymentResultCard';

const PaymentResult = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const { result, loading } = usePaymentResult(location);

  if (loading) {
    return (
      <div className={styles.loading}>
        <PartLoading />
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <PaymentResultCard
        result={result}
        onGoHome={() => navigate("/")}
      />
    </div>
  );
};

export default PaymentResult;