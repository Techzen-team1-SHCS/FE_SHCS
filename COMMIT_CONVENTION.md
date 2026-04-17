# Commit Convention

Dự án áp dụng chuẩn **Conventional Commits**. Tất cả commit trong dự án bắt buộc phải tuân theo định dạng sau:

## 1. Cấu trúc Commit

```
<type>(<scope>): <short description>
```
*(Lưu ý: phần `scope` không bắt buộc nhưng khuyến cáo dùng khi cần chỉ rõ thành phần)*

## 2. Các Loại Commit (Types)

| Type | Ý nghĩa | Ví dụ |
|---|---|---|
| `feat` | Thêm một tính năng mới (Feature) | `feat: add user login page` |
| `fix` | Sửa một lỗi (Bug fix) | `fix(auth): handle null token exception` |
| `refactor` | Viết lại code nhưng không đổi logic/tính năng (Tối ưu code) | `refactor: optimize data parsing loop` |
| `style` | Cập nhật format, dấu câu, khoảng trắng (CSS/Lint) | `style: fix eslint warnings` |
| `docs` | Thêm, sửa tài liệu (README, JSDoc...) | `docs: update API documentation` |
| `chore` | Cập nhật cấu hình build, package, thư viện | `chore: update vite config` |
| `test` | Thêm hoặc sửa Test case | `test: add unit test for login component` |
| `perf` | Cải thiện hiệu năng (Performance) | `perf: lazy load heavy images` |

## 3. Quy tắc viết Description
- Viết bằng **tiếng Anh** (tối thiểu là ngắn gọn, dễ hiểu).
- Viết bắt đầu bằng **động từ nguyên thể** (Ví dụ: dùng `add`, `change`, `remove`, không dùng `added`, `changed`, `adding`).
- **Không viết hoa chữ cái đầu** của mô tả (trừ tên riêng/biến/component đặc thù).
- **Không có dấu chấm (`.`)** ở cuối câu để tiết kiệm không gian.
- Chiều dài mô tả không nên vượt quá 50-72 ký tự.

## 4. Ví dụ Commit Chuẩn
- ✅ `feat(cart): add validation for quantity input`
- ✅ `fix: resolve crash when navigating to profile`
- ✅ `chore(deps): bump react version to 18`
- ✅ `style(header): fix alignment of logo in mobile view`

*(Tuyệt đối KHÔNG commit với nội dung vô nghĩa như: "update", "fix bug", "test again".)*
