import { Link, Head } from '@inertiajs/react';

export default function Homepage({  }) {
    const baseUrl = window.location.origin;
    console.log("halo"+baseUrl);
    return (
        <>
            <section id="hero" className="py-5 flex overflow-x-hidden bg-gradient-to-r from-[#cf1b1b] to-[#fd2e2e] stops-[#ff5e5e]">
                <div className="container px-5">
                    <div className="row gx-5 align-items-center justify-content-center">
                        <div className="col-lg-8 col-xl-6 col-xxl-6">
                            <div className="my-5 text-center text-sm-center text-xl-start" data-aos="fade-up">
                                <h1 className="text-white mb-4">
                                    Layanan Ambulance Hebat Andalan Masyarakat Kota Semarang
                                </h1>
                                <p className="text-white mb-4">
                                    Ambulance Hebat siap melayani penanganan gawat darurat 24 Jam di Kota
                                    Semarang
                                </p>
                                <div className="row g-1 pt-4 align-items-center">
                                    <div className="col-lg-4 col-md-4 col-sm-6 text-center text-sm-center ">
                                        <div className="btn btn-outline-white">
                                        <a href="tel://1500132"><i className="bi bi-telephone-fill"></i> 1500-132</a>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-6 text-center text-sm-center">
                                        <a href="https://wa.me/6282139753077">
                                        <button className="btn btn-danger btn-circle btn-xl" type="button"> Panic Button</button>
                                        </a>            
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-6 text-center text-sm-center">
                                        <div className="btn btn-outline-red">
                                            <a href="#"><i className='bx bxs-ambulance'></i>PantauAmbulan</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-xl-6 col-xxl-6 d-none d-xl-block text-center text-sm-center" data-aos="fade-right" >
                            <img className="my-5" src="assets/img/aha.gif"  />
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .h1 {
                    @apply text-2xl;
                  }
            `}</style>
        </>
    );
}
