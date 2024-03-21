export default function HeaderLogo(props) {
    return (
        <>
        <div className=" flex">
            <div>
                <img className="ml-3 mt-3 w-24" src={'/./assets/img/logo-kota-semarang2.png'}></img>
            </div>
            <div>
                <div className="mt-3 ml-1 font-bold">PEMERINTAH KOTA SEMARANG</div>
                <div className="ml-1 font-bold">DINAS KESEHATAN KOTA SEMARANG</div>
                <div className="ml-1 font-bold">AMBULANCE HEBAT</div>
                <div className="ml-1">Jalan Pandanaran No. 79 Kota Semarang</div>
                <div className="ml-1">Telp. (024) 8415269 - 8318070</div>
                <div className="ml-1">Fax. (024) 8318771</div>
                <div className="ml-1">Call Center. 112 / 119 / 1500-132</div>
            </div>
        </div>
        </>
    )
}