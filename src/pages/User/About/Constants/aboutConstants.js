import {
  FaRobot,
  FaCalendarCheck,
  FaChartLine,
  FaHotel,
  FaUsers,
  FaCode,
  FaRocket,
  FaHeart
} from "react-icons/fa";

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Trần Quốc Vĩ",
    position: "Full Stack Developer",
    image: "/vi.jpg",
    instagram: "https://www.instagram.com/vitran712/",
    facebook: "https://www.facebook.com/tran.vi.209923?locale=vi_VN",
    skills: ["React", "Node.js", "MongoDB", "Php", "Laravel", "UI/UX"]
  },
  {
    id: 2,
    name: "Phan Minh Vân",
    position: "Frontend Developer",
    image: "/quan.jpg",
    instagram: "#",
    facebook: "https://www.facebook.com/van.phan.minh.563583?locale=vi_VN",
    skills: ["React", "Vite.js", "CSS/SCSS", "JavaScript"]
  },
  {
    id: 3,
    name: "Nguyễn Trần Minh Quân",
    position: "Product Owner",
    image: "/van.jpg",
    instagram: "https://www.instagram.com/nobitaco197/",
    facebook: "https://www.facebook.com/minhquan19072004",
    skills: ["Tester", "Q&A", "UI/UX"]
  },
  {
    id: 4,
    name: "Nguyễn Thiên Tú",
    position: "AI Developer",
    image: "/tu.jpg",
    facebook: "https://www.facebook.com/tu.nguyenthien.35",
    skills: ["MySQL", "PHP", "Machine Learning"]
  },
  {
    id: 5,
    name: "Nguyễn Thành Nhân",
    position: "AI Developer",
    image: "/nhan.jpg",
    facebook: "https://www.facebook.com/share/1AX2YpUXyD/",
    skills: ["Python", "Java", "Software Architecture"]
  }
];

export const PROJECT_FEATURES = [
  {
    icon: FaRobot,
    title: "Gợi ý thông minh",
    desc: "AI phân tích hành vi người dùng để đề xuất khách sạn phù hợp"
  },
  {
    icon: FaCalendarCheck,
    title: "Đặt phòng dễ dàng",
    desc: "Hệ thống booking tích hợp thanh toán trực tuyến"
  },
  {
    icon: FaChartLine,
    title: "Phân tích cá nhân hóa",
    desc: "Theo dõi và học hỏi từ sở thích du lịch của bạn"
  },
  {
    icon: FaHotel,
    title: "Đa dạng lựa chọn",
    desc: "Hàng nghìn khách sạn từ bình dân đến cao cấp"
  }
];

export const TEAM_STATS = [
  {
    icon: FaUsers,
    value: "05",
    label: "Thành viên năng động"
  },
  {
    icon: FaCode,
    value: "03",
    label: "Dự án demo & mini-project"
  },
  {
    icon: FaRocket,
    value: "Đang học",
    label: "Phát triển kỹ năng"
  },
  {
    icon: FaHeart,
    value: "100%",
    label: "Đam mê công nghệ"
  }
];