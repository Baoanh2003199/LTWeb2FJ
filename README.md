# 1. Phân hệ độc giả vãng lai - guest
- [ ] Hệ thống Menu
    - Hiển thị danh sách chuyên mục
   - Có 2 cấp chuyên mục
       - Kinh Doanh ➠ Nông Sản
       - Kinh Doanh ➠ Hải Sản
- [ ] Trang chủ
   - Hiển thị 3-4 bài viết nổi bật nhất trong tuần qua
   - Hiển thị 10 bài viết được xem nhiều nhất (mọi chuyên mục)
   - Hiển thị 10 bài viết mới nhất (mọi chuyên mục)
   - Hiển thị top 10 chuyên mục, mỗi chuyên mục 1 bài mới nhất
Lưu ý: Bài viết hiển thị trên trang chủ gồm các thông tin
   - Tiêu đề
   - Chuyên mục
   - Ngày đăng
   - Ảnh đại diện bài viết
- [ ] Khuyến khích hiệu ứng ở trang chủ
   - slideshow
   - carousel
 - [ ] Xem danh sách bài viết
   - Theo chuyên mục category
   - Theo nhãn tag
   - Có phân trang
   - Ảnh đại diện bài viết
   - Tiêu đề
   - Chuyên mục
   - Danh sách nhãn tag
   - Ngày đăng
   - Nội dung tóm tắt abstract
- [ ] Xem chi tiết bài viết
   - Nội dung đầy đủ của bài viết
       - Ảnh đại diện (size lớn)
       - Tiêu đề
       - Ngày đăng
       - Nội dung
       - Chuyên mục category
       - Danh sách nhãn tag
 - [ ] Danh sách bình luận của độc giả
      - Ngày bình luận
      - Tên độc giả
      - Nội dung bình luận
 - [ ] Đăng bình luận mới
 - [ ] 5 bài viết ngẫu nhiên cùng chuyên mục

> Độc giả có thể click vào category hoặc tag để chuyển nhanh sang phần XEM DANH SÁCH BÀI VIẾT
 - [ ] Tìm kiếm bài viết
    > Sử dụng kỹ thuật Full-text search
   - Tiêu đề
   - Nội dung tóm tắt abstract
   - Nội dung đầy đủ
## 2.Phân hệ độc giả - subscriber
  - [ ] Độc giả có đăng ký tài khoản (thực tế là mua) sẽ được phép xem & download ấn bản (.pdf) một số bài viết premium.
  - [ ] Tài khoản độc giả có thời hạn 7 ngày (nên cài đặt N phút), tính từ ngày được cấp.
  - [ ]  Khi hết hạn, tài khoản độc giả cần được gia hạn để có thể tiếp tục truy cập các bài viết premium.
  - [ ] Các bài viết premium được ưu tiên hiển thị trước trong kết quả khi độc giả thực hiện chức năng xem danh sách hoặc tìm kiếm bài viết.
## 3.Phân hệ phóng viên - writer
- [ ] Đăng bài viết

    > Hỗ trợ WYSIWYG
        tinymce (http://tiny.cloud)
        ckeditor (https://ckeditor.com)
        quilljs (https://quilljs.com)
        summernote (https://summernote.org)
    Hỗ trợ upload hình ảnh & link YouTube trong bài viết
    Khi đăng bài, phóng viên chỉ nhập tiêu đề, tóm tắt, nội dung, chuyên mục & gán nhãn cho bài viết

- [ ] Xem danh sách bài viết (do phóng viên viết)

   - Đã được duyệt & chờ xuất bản
   - Đã xuất bản
   - Bị từ chối
   - Chưa được duyệt

- [ ] Hiệu chỉnh bài viết

   - Chi được phép hiệu chỉnh các bài viết bị từ chối hoặc chưa được duyệt

## 4. Phân hệ biên tập viên - editor
    - Biên tập viên khi làm việc sẽ xem được danh sách bài viết draft do phóng viên đăng vào chuyên mục do mình quản lý.
    - Tại đây, biên tập viên có thể duyệt hoặc từ chối bài viết của phóng viên
       - Nếu từ chối, biên tập viên cần ghi chú rõ lý do để phóng viên có thể hiệu chỉnh lại bài viết cho phù hợp
       - Nếu duyệt, biên tập viên cần hiệu chỉnh các thông tin: chuyên mục category, nhãn tag của bài viết, đồng thời xác định thời điểm bài viết sẽ được xuất bản lên hệ thống
## 5. Phân hệ quản trị viên - administrator
   > Lưu ý: Quản lý bao gồm các thao tác Xem danh sách, Xem chi tiết, Thêm, Xoá, Cập nhật và các thao tác chuyên biệt khác
- Quản lý chuyên mục category
- Quản lý nhãn tag
- Quản lý bài viết
   - Có thể cập nhật trạng thái bài viết từ draft sang xuất bản
- Quản lý danh sách người dùng (phóng viên, biên tập viên, độc giả, …)
    - Phân công chuyên mục cho biên tập viên
    - Gia hạn tài khoản độc giả
## 6. Các tính năng chung cho các phân hệ người dùng
- [x] Đăng nhập
- [ ] Cập nhật thông tin cá nhân
    - Họ tên
    - Bút danh (trong trường hợp là writer)
    - Email liên lạc
    - Ngày tháng năm sinh
- [ ] Đổi mật khẩu
    - Mật khẩu được mã hoá bằng thuật toán bcrypt
- [ ] Quên mật khẩu
    - Yêu cầu xác nhận bằng email OTP
## 7.Config information

- https://tintuc14.herokuapp.com
- Admin Account:
  - username: admin
  - password: admin-123
- Mail:
  - username: tintuc14@gmail.com
  - password: tintuc14web@mail
- Database:
  - host: us-cdbr-east-05.cleardb.net
  - database: heroku_5e52d97f3932ec5
  - Username: beaaf53cb24cb4
  - Password: b1834857
- "npm install"
- run localhost
  - "npm start" or "npx nodemon" ( Auto update sources when ctrl + s )

  
