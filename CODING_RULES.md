# Coding Rules & Branching Strategy

Tài liệu này quy chuẩn các nguyên tắc lập trình và chiến lược rẽ nhánh (Branching Strategy) cho toàn bộ front-end team.

## 1. Branching Strategy (Git Flow)

Team áp dụng luồng làm việc theo Git Flow cơ bản:

- **`main` / `master`**: Nhánh chứa code đã lên Production. Tuyệt đối không commit trực tiếp.
- **`dev`**: Nhánh chứa code chuẩn bị release ở môi trường Staging/Dev. Các feature branch sẽ merge vào đây.
- **`feature/*`**: Tên nhánh cho các tính năng mới.
  - Cú pháp: `feature/[ticket-id]-[tên-tính-năng]`
  - Ví dụ: `feature/SHCS-123-login-page`, `feature/hotel-analysis-chart`
- **`bugfix/*`**: Nhánh fix bug (từ dev).
  - Cú pháp: `bugfix/[ticket-id]-[lỗi-cần-fix]`
  - Ví dụ: `bugfix/SHCS-124-button-alignment`
- **`hotfix/*`**: Nhánh fix bug khẩn cấp trên Production (từ main).
  - Cú pháp: `hotfix/[ticket-id]-[lỗi-nghiêm-trọng]`

**Quy tắc chung:**
- Luôn tạo nhánh mới từ nhánh `dev` (trừ `hotfix` tạo từ `main`).
- Rebase hoặc Merge nhánh `dev` vào nhánh cá nhân để xử lý conflict trước khi tạo Pull Request.
- Khi merge vào `dev`/`main`, bắt buộc dùng **Squash and Merge** để giữ lịch sử commit gọn gàng.

## 2. Coding Rules (Quy tắc viết code)

Để đảm bảo tính nhất quán của source code, toàn bộ thành viên cần tuân thủ:

### Naming Convention (Đặt tên)
- **Biến và Hàm**: Sử dụng `camelCase` (VD: `getUserInfo`, `isLoggedIn`, `totalPrice`).
- **Component / Class**: Sử dụng `PascalCase` (VD: `HotelAnalysisChart`, `UserProfile`).
- **Hằng số (Constants)**: Sử dụng `UPPER_SNAKE_CASE` (VD: `MAX_UPLOAD_SIZE`, `API_BASE_URL`).
- **File & Folder**: Sử dụng `kebab-case` cho thư mục, và `PascalCase` hoặc `kebab-case` cho file tuỳ theo convention của framework, nhưng **phải thống nhất**. (Khuyến cáo dùng `PascalCase` cho file React Component).

### Clean Code & Best Practices
- **Độ dài file**: Tách nhỏ component nếu render file quá dài (ví dụ > 200 dòng).
- **Tránh code lặp (DRY)**: Rút trích logic chung vào custom hooks hoặc utils helper.
- **Type Safety**: Hạn chế sử dụng `any` nếu dự án dùng TypeScript. Khai báo Interface/Type rõ ràng.
- **Xử lý lỗi**: Luôn sử dụng `try/catch` khi gọi API (async/await) và hiển thị thông báo lỗi rõ ràng cho người dùng.
- **Comment Code**: Hạn chế comment giải thích "code đang làm gì", hãy viết code tự giải thích. Chỉ dùng comment để giải thích "TẠI SAO lại viết như vậy" khi có logic phức tạp.
