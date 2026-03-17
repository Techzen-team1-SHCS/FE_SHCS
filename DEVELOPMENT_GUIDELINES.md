# Quy trình Phát triển và Hoàn thành Task (Development Guidelines)

Tài liệu này quy định các bước cần thực hiện để đảm bảo chất lượng mã nguồn và quy trình làm việc giữa các thành viên trong dự án.

---

## 1. Kiểm tra Mã nguồn (Code Quality)

Sau khi hoàn thành code, tất cả thành viên **BẮT BUỘC** chạy các lệnh sau để đảm bảo mã nguồn sạch và không có lỗi:

- **Linting**: Kiểm tra lỗi cú pháp và tiêu chuẩn code.
  ```bash
  npm run lint
  ```
- **Formatting**: Tự động định dạng code theo chuẩn dự án.
  ```bash
  npm run format
  ```

> **Điều kiện Pass**: Cả hai lệnh trên phải chạy thành công và không báo bất kỳ lỗi (error) nào. Chỉ khi đó, task mới được coi là hoàn thành về mặt kỹ thuật.

---

## 2. Quản lý Git & Merge

- Trước khi merge code vào nhánh chính (main/dev), Pull Request (PR) phải ở trạng thái **Ready to Merge**.
- Đảm bảo không có xung đột (conflict) xảy ra.
- Mọi thay đổi phải được review và tất cả các kiểm tra tự động phải vượt qua.

---

## 3. Quy trình Hoàn thành và Bàn giao Task

### Bước 1: Thu thập minh chứng (Evidence)
- Chụp ảnh màn hình (screenshot) hoặc quay video ghi lại kết quả các chức năng đã làm.
- Đính kèm minh chứng này vào task (Jira/Trello/v.v.) của bạn.

### Bước 2: Chuyển trạng thái Task
- Chuyển trạng thái task hiện tại sang **DONE**.

### Bước 3: Quy trình Review (Lead)
- Tạo một task mới (Task Review) ghi rõ nội dung: `Review task [ID_TASK_GỐC]`.
- Trạng thái: **Review**.
- Gán (Assign) cho: **Lead**.

### Bước 4: Quy trình Kiểm thử (Tester)
- Sau khi Lead đã duyệt (OK), Lead sẽ chuyển/gán task cho **Tester**.
- Tester sẽ căn cứ vào **Test Case** để thực hiện kiểm thử.
- Nếu có lỗi, Tester sẽ log bug để Dev xử lý.

---

*Lưu ý: Mọi thành viên cần tuân thủ nghiêm ngặt quy trình này để đảm bảo tiến độ và chất lượng dự án.*
