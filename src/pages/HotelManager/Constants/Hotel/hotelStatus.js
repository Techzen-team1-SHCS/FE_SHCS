export const HOTEL_STATUS = {
  OPEN: "Open",
  CLOSE: "Close",
  PENDING: "pending"
};export default function getStatusStyles(status) {
  switch(status) {
    case HOTEL_STATUS.OPEN: return { label: 'Open', color: 'green' };
    case HOTEL_STATUS.CLOSE: return { label: 'Close', color: 'red' };
    case HOTEL_STATUS.PENDING: return { label: 'Pending', color: 'orange' };
    default: return { label: status, color: 'gray' };
  }
}
