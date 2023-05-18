import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Nav />
      {/* Parent Container */}
      <div className="carousel w-full max-w-4xl mx-auto rounded-3xl overflow-hidden flex flex-col">
        {/* Blurb Section */}
        <div className="mx-auto mb-4 text-justify text-xl p-6">
          <p className="text-center mb-6 font-bold text-2xl uppercase text-cyan-500">
            Welcome to High Street Gym!
          </p>
          <p className="mb-4">
            We are a dedicated team of fitness professionals, committed to helping you achieve your
            health and fitness goals. Our gym is more than just a place to work out; it's a
            community where you can feel supported and encouraged every step of the way.
          </p>
          <p className="mb-4">
            At High Street Gym, we believe that fitness is for everyone, no matter what your current
            fitness level is. Our experienced trainers are here to guide you through every workout,
            offering personalized programs tailored to your individual needs and goals.
          </p>
          <p className="mb-4">
            Whether you're looking to lose weight, build muscle, or simply improve your overall
            fitness, our state-of-the-art facilities and equipment provide everything you need to
            reach your full potential. And with a wide range of classes and training options
            available, there's always something new to challenge you and keep you motivated.
          </p>
          <p>
            So why wait? Join our community today and take the first step towards a healthier,
            happier you. We can't wait to help you reach your goals!
          </p>
        </div>
        {/* Outer Container For Carousel */}
        <div className="carousel w-full">
          {/* Carousel */}
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg"
              className="w-full"
              loading="lazy"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide4" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide2" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src="https://images.pexels.com/photos/2204196/pexels-photo-2204196.jpeg"
              className="w-full"
              loading="lazy"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide1" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide3" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <img
              src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg"
              className="w-full"
              loading="lazy"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide2" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide4" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <img
              src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
              className="w-full"
              loading="lazy"
            />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href="#slide3" className="btn btn-circle">
                ❮
              </a>
              <a href="#slide1" className="btn btn-circle">
                ❯
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
