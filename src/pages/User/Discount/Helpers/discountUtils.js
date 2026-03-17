export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const isExpired = (expiryDate) => {
  return new Date(expiryDate) < new Date();
};

