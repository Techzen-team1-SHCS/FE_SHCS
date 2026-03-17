import styles from '../Helpp.module.css';
import { useSupportForm } from '../Hooks/useSupportForm';
import { supportOptions, contactInfo } from '../Constants/helpConstants';

const Help = () => {
    const {
        helpPage,
        container,
        header,
        title,
        subtitle,
        supportGrid,
        supportCard,
        cardIcon,
        cardTitle,
        cardDescription,
        contactForm,
        formGroup,
        label,
        input,
        select,
        textarea,
        submitButton,
        buttonLoading,
        urgentOption,
        successMessage,
        errorMessage,
        contactMethods,
        methodItem,
        methodIcon,
        methodInfo,
    } = styles;

    const {
        formData,
        isSubmitting,
        submitStatus,
        handleChange,
        handleSubmit,
    } = useSupportForm();

    return (
        <div className={helpPage}>
            <div className={container}>
                <header className={header}>
                    <h1 className={title}>Trung tâm Hỗ trợ</h1>
                    <p className={subtitle}>
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Chọn hình thức liên hệ phù hợp nhất.
                    </p>
                </header>

                {/* Các phương thức hỗ trợ */}
                <section>
                    <h2>Chúng tôi có thể giúp gì cho bạn?</h2>
                    <div className={supportGrid}>
                        {supportOptions.map((option, index) => (
                            <div key={index} className={supportCard}>
                                <div className={cardIcon}>{option.icon}</div>
                                <h3 className={cardTitle}>{option.title}</h3>
                                <p className={cardDescription}>{option.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Form liên hệ */}
                <section>
                    <h2>Gửi yêu cầu hỗ trợ</h2>
                    <form className={contactForm} onSubmit={handleSubmit}>
                        <div className={formGroup}>
                            <label className={label} htmlFor="name">Họ và tên *</label>
                            <input
                                className={input}
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={formGroup}>
                            <label className={label} htmlFor="email">Email *</label>
                            <input
                                className={input}
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={formGroup}>
                            <label className={label} htmlFor="subject">Tiêu đề *</label>
                            <input
                                className={input}
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={formGroup}>
                            <label className={label} htmlFor="priority">Mức độ ưu tiên</label>
                            <select
                                className={select}
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Thấp</option>
                                <option value="medium">Trung bình</option>
                                <option value="high">Cao</option>
                                <option value="urgent" className={urgentOption}>Khẩn cấp</option>
                            </select>
                        </div>

                        <div className={formGroup}>
                            <label className={label} htmlFor="message">Mô tả chi tiết *</label>
                            <textarea
                                className={textarea}
                                id="message"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải..."
                                required
                            ></textarea>
                        </div>

                        {submitStatus === 'success' && (
                            <div className={successMessage}>
                                ✅ Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className={errorMessage}>
                                ❌ Có lỗi xảy ra! Vui lòng thử lại sau.
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`${submitButton} ${isSubmitting ? buttonLoading : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hỗ trợ'}
                        </button>
                    </form>
                </section>

                {/* Thông tin liên hệ khác */}
                <section>
                    <h2>Liên hệ trực tiếp</h2>
                    <div className={contactMethods}>
                        {contactInfo.map((contact, index) => (
                            <div key={index} className={methodItem}>
                                <div className={methodIcon}>{contact.icon}</div>
                                <div className={methodInfo}>
                                    <h3>{contact.method}</h3>
                                    <strong>{contact.info}</strong>
                                    <p>{contact.response}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Help;

