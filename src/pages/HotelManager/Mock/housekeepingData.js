export const housekeepingStatistics = {
  management: {
    clean: 789,
    cleaning: 456,
    dirty: 234,
    outOfOrder: 20
  },
  cleanliness: {
    clean: 700,
    cleaning: 500,
    dirty: 400,
    outOfOrder: 100
  }
};

export const housekeepingSchedules = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  roomNo: Math.floor(Math.random() * 900) + 1,
  roomType: ["Deluxe", "Standard", "Suite", "Single"][Math.floor(Math.random() * 4)],
  chores: [
    "Make beds: Change sheets and pillowcases, fluff pillows. Arrange pillows.",
    "Empty trash bins. Replace liners and dispose of waste.",
    "Wipe down countertops, tables, chairs, doorknobs, bathroom fixtures.",
    "Vacuum floors and carpets. Remove dust and debris.",
    "Restock amenities. Toilet paper tissues, soap, shampoo, conditioner, towels.",
    "Replenish coffee and tea supplies. Coffee pods, tea.",
    "Dust furniture and electronics.",
    "Wash dishes and clean kitchenette."
  ][Math.floor(Math.random() * 8)],
  staffAssigned: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"][
    Math.floor(Math.random() * 4)
  ],
  startDate: `10/12/2023 ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:00AM`,
  endDate: `10/12/2023 ${String(Math.floor(Math.random() * 24)).padStart(2, "0")}:00PM`,
  status: ["In Progress", "Pending", "Completed"][Math.floor(Math.random() * 3)]
}));
