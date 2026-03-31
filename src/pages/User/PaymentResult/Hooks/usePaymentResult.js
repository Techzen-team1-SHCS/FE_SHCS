import { useState, useEffect } from "react";
import { parsePaymentResult } from "../Helpers/paymentHelpers";

export const usePaymentResult = (location) => {

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const paymentResult = parsePaymentResult(location.search);

        setResult(paymentResult);
        setLoading(false);

    }, [location]);

    return {
        result,
        loading
    };
};