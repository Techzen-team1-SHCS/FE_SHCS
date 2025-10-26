import React, { useState, useEffect } from 'react'
import styles from './BookingInfo.module.css'

const BookingInfo = ({ hotelData, onBookingSubmit }) => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)

    // State cho form data
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        telephone: '',
        address: '',
        city: '',
        country: '',
        request: '',
        arrival: '',
        coupon: ''
    })

    useEffect(() => {
        if (hotelData && hotelData.amenities) {
            try {
                const amenitiesArray = JSON.parse(hotelData.amenities)
                const servicesData = amenitiesArray.map((amenity, index) => ({
                    id: index + 1,
                    name: amenity
                }))
                setServices(servicesData)
            } catch (error) {
                console.error('Error parsing amenities:', error)
                setServices([])
            } finally {
                setLoading(false)
            }
        } else {
            setServices([])
            setLoading(false)
        }
    }, [hotelData])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitted(true)
        if (onBookingSubmit) {
            onBookingSubmit(formData)
        }
    }

    const handleEdit = () => {
        setIsSubmitted(false)
    }

    const handleCheckout = () => {
        // Xử l thanh toán thực tế ở đây
        alert('Proceeding to payment...')
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div>Loading services...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Extra Services Section */}
            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Services :</h3>
                <div className={styles.serviceContainer}>
                    {services.length === 0 ? (
                        <div className={styles.noServices}>
                            No services available
                        </div>
                    ) : (
                        services.map(service => (
                            <div key={service.id} className={styles.serviceItem}>
                                <span className={styles.serviceName}>{service.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <hr className={styles.divider} />

            {/* Review Section (khi đã submit) */}
            {isSubmitted ? (
                <div className={styles.reviewSection}>
                    <h3 className={styles.sectionTitle}>Your informations:</h3>

                    <div className={styles.reviewInfo}>
                        <div className={styles.reviewRow}>
                            <strong>Name:  {formData.name}</strong>
                            <strong>Phone:{formData.telephone}</strong> 
                            <strong>Country: {formData.country}</strong>
                        </div>

                        <div className={styles.reviewRow}>
                            <strong >Surname: {formData.surname}</strong>
                            <strong >Address: {formData.address}</strong>
                            <strong >Email*: {formData.email}</strong>
                        </div>

                        <div className={styles.reviewRow}>
                            <strong >City: {formData.city}</strong>
                            <strong >Arrival: {formData.arrival}</strong>
                            
                        </div>
                    </div>
                    <div>
                        <div className={styles.reviewRow}>
                            <strong>Request: {formData.request || 'None'}</strong>
                        </div>

                        <div className={styles.reviewRow}>
                            <strong>Coupon: {formData.coupon || 'Not set'}</strong>
                        </div>
                    </div>

                    {/* Tax Information */}
                    <div className={styles.taxSection}>
                        <h4>Tax:</h4>
                        <div className={styles.taxItem}>Included 3 $ City Tax</div>
                        <div className={styles.taxItem}>Included 22 % VAT</div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Payment Options */}
                    <div className={styles.paymentSection}>
                        <h4>Payment Options:</h4>
                        {/* Thêm các option thanh toán ở đây */}
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            className="book-btn"
                            style={{ width: "30%", borderRadius: '10px' }}
                            onClick={handleEdit}
                        >
                            EDIT INFORMATION
                        </button>
                        <button
                            className="book-btn"
                            style={{ width: "30%", borderRadius: '10px' }}
                            onClick={handleCheckout}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            ) : (
                /* Form Section (khi chưa submit) */
                <form className={styles.formSection} onSubmit={handleSubmit}>
                    <h3 className={styles.sectionTitle}>Add your informations :</h3>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.required}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.required}>Surname</label>
                            <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label className={styles.required}>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.required}>Telephone</label>
                            <input
                                type="tel"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Country</label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Country</option>
                                <option value="us">United States</option>
                                <option value="uk">United Kingdom</option>
                                <option value="ca">Canada</option>
                                <option value="vervienn">Vervienn</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Request</label>
                            <textarea
                                placeholder="Any special requests..."
                                name="request"
                                value={formData.request}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Arrival</label>
                            <select
                                name="arrival"
                                value={formData.arrival}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Arrival Time</option>
                                <option value="3.00 pm - 4.00 pm">3.00 pm - 4.00 pm</option>
                                <option value="4.00 pm - 5.00 pm">4.00 pm - 5.00 pm</option>
                                <option value="5.00 pm - 6.00 pm">5.00 pm - 6.00 pm</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Coupon</label>
                            <input
                                type="text"
                                name="coupon"
                                value={formData.coupon}
                                onChange={handleInputChange}
                                placeholder="Enter coupon code"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="book-btn"
                        style={{ width: "30%", borderRadius: '10px' }}
                    >
                        SUBMIT PAYMENT
                    </button>
                </form>
            )}
        </div>
    )
}

export default BookingInfo