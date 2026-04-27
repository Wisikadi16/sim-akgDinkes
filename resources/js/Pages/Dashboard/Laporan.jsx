import React , {useState, useEffect} from "react";
import DataTable from "react-data-table-component";

export default function Laporan() {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);
    const [jenis, set_jenis] = useState([]);

    const [cari_tgl, set_cari_tgl] = useState({
        dari_tanggal:'',
        sampai_tanggal:'',
    });

    console.log(cari_tgl)

    useEffect(()=>{
        axios.post(window.location.origin+'/ref_laporan',
        {
            jenis:"jenis pelayanan"
        }).then(function (response){
            set_semua_order(response.data)
            set_semua_order_cari(response.data)
            set_jenis("jenis pelayanan")
            console.log("orderrr")
            console.log(response)
        })

        // axios.post(window.location.origin+'/ref_kecamatan',
        // {
        //     // kode_kecamatan:kode_kecamatan,
        // }).then(function (response){
        //     set_semua_kecamatan(response.data)
        //     // console.log(response)
        // })

        // axios.post(window.location.origin+'/ref_kelurahan',
        // {
        //     kode_kecamatan:kode_kecamatan,
        //     // kode_kecamatan:"",
        // }).then(function (response){
        //     set_semua_kelurahan(response.data)
        //     // console.log(response)
        // })

        // axios.post(window.location.origin+'/ref_tim_ambulan',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     // set_semua_ambulan_cari(response.data)
        //     // console.log(response)
        // })

    }, [])

    const columns = [
        {name:'No', selector:(row, index)=>(((page==0?1:page)-1)*10)+(index+1), width:"60px"},
        (jenis === 'jenis pelayanan')
            ? { name: 'Cara Order', selector: (row) => row.cara_order, width: '100px' }
            : null,
        (jenis === 'jenis pelayanan')
            ? { name: 'Total', selector: (row) => row.total, width: '130px' }
            : null,
    ].filter(Boolean);

    const [page, set_page] = useState([0]);

    const oc_cari = (e) => {
        axios.post(window.location.origin+'/ref_laporan',
        {
            jenis:jenis,
            dari_tanggal:cari_tgl.dari_tanggal,
            sampai_tanggal:cari_tgl.sampai_tanggal,
        }).then(function (response){
            // set_semua_kecamatan(response.data)
            console.log(response)
        })          
    }

    return (
        <div className="h-screen w-screen overflow-y-auto mt-3 relative">
            <div className="mb-3 font-bold text-[20px]">Laporan</div>
            <div className="mb-3 font-bold text-[20px]">{jenis}</div>

            <div className="flex gap-3">
                <div className="flex flex-col">
                    <div className="flex justify-center">Dari Tanggal</div>
                    <input
                    type="date"
                    name="dari_tanggal"
                    className="p-0 h-full"
                    onChange={(e) => set_cari_tgl((prev) => ({ ...prev, dari_tanggal: e.target.value }))}
                    ></input>
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-center">Sampai Tanggal</div>
                    <input
                    type="date"
                    name="sampai_tanggal"
                    className="p-0 h-full"
                    onChange={(e) => set_cari_tgl((prev) => ({ ...prev, sampai_tanggal: e.target.value }))}
                    ></input>
                </div>
                <div className="flex flex-col">
                    <button onClick={oc_cari} className="h-full bg-blue-500 text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out">
                    Cari
                    </button>
                </div>
            </div>


            <DataTable 
                columns={columns}
                data={semua_order_cari}
                pagination onChangePage={set_page} highlightOnHover />
        </div>
    );
}