export const filterSchedulesByTab = (schedules, activeTab) => {
  if (activeTab === "all") return schedules;
  if (activeTab === "inProgress") return schedules.filter((s) => s.status === "In Progress");
  if (activeTab === "pending") return schedules.filter((s) => s.status === "Pending");
  return schedules;
};

export const searchSchedules = (schedules, search) => {
  if (!search) return schedules;
  const term = search.trim().toLowerCase();
  return schedules.filter(
    (s) =>
      s.roomNo.toString().includes(term) ||
      s.roomType.toLowerCase().includes(term) ||
      s.chores.toLowerCase().includes(term) ||
      s.staffAssigned.toLowerCase().includes(term)
  );
};

export const getScheduleStatusClass = (status) => {
  switch (status) {
    case "In Progress":
      return "inProgress";
    case "Pending":
      return "pending";
    case "Completed":
      return "completed";
    default:
      return "";
  }
};
