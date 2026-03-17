function Breadcrumb({ items = [] }) {
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol
                    className="breadcrumb justify-content-center mb-20"
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                >
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className={`breadcrumb-item ${item.active ? "active" : ""}`}
                        >
                            {item.active ? (
                                item.label
                            ) : (
                                <a href={item.href}>{item.label}</a>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    )
}



export default Breadcrumb
