import SearchBar from '../../../../../components/SearchBar/SearchBar';

const HeroSection = () => {
    return (
        <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
            <div className="container-fluid px-0">
                <h1
                    className="hero-title"
                    data-aos="flip-up"
                    data-aos-delay="50"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                >
                    Smart Hotel
                </h1>
                <div
                    className="main-hero-image bgs-cover"
                    style={{ backgroundImage: 'url(/assets/images/hero/hero.png)' }}
                >
                </div>
            </div>
            <SearchBar />
        </section>
    );
};

export default HeroSection; 