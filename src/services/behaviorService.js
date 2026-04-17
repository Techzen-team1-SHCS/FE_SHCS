import api from "./api";
export const behaviorService={
    async approveUser(id) {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found");
            }

            const response = await api.post(
                `auth/behaviors/approve/user/${id}`,
                {}, // body rỗng
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;

        } catch (error) {
            throw new Error(error.response?.data?.message || "Error approving user");
        }
    }

}