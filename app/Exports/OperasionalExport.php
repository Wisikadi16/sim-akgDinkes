<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OperasionalExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles
{
    protected $data;
    protected $dari_tanggal;
    protected $sampai_tanggal;

    public function __construct($data, $dari_tanggal = null, $sampai_tanggal = null)
    {
        $this->data = $data;
        $this->dari_tanggal = $dari_tanggal;
        $this->sampai_tanggal = $sampai_tanggal;
    }


    public function collection()
    {
        return $this->data->map(function ($row, $index) {
            return [
                'No' => $index + 1,
                'Status' => strtoupper($row->status ?? '-'),
                'Tim Ambulan' => $row->tim_ambulan ? $row->tim_ambulan->nama_tim : '-',
                'Nama Pasien' => $row->nama_pasien ?? '-',
                'Alamat' => $row->alamat ?? ($row->alamat_kejadian ?? '-'),
                'Kelurahan' => $row->ref_kelurahan ? $row->ref_kelurahan->nama_kelurahan : ($row->nama_kelurahan ?? '-'),
                'Kecamatan' => $row->ref_kecamatan ? $row->ref_kecamatan->nama_kecamatan : ($row->nama_kecamatan ?? '-'),
                'Nama Penelepon' => $row->nama_penelepon ?? '-',
                'No Penelepon' => $row->no_penelepon ?? ($row->no_hp ?? '-'),
                'Kasus' => $row->kasus ?? ($row->keluhan ?? '-'),
                'Petugas' => $row->user ? $row->user->name : '-',
                'Cara Order' => $row->cara_order ?? '-',
                'Waktu Order' => $row->waktu_order ?? '-',
                'Waktu Terima' => $row->waktu_terima ?? '-',
                'Waktu Rujuk' => $row->waktu_rujuk ?? '-',
                'Waktu Sampai Lokasi' => $row->waktu_sampai_lokasi ?? '-',
                'Waktu Sampai Rujuk' => $row->waktu_sampai_rujuk ?? '-',
                'Waktu Selesai' => $row->waktu_selesai ?? '-',
                'Waktu Bersiap Kembali' => $row->waktu_bersiap_kembali ?? '-',
                'Catatan' => $row->catatan ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Status',
            'Tim Ambulan',
            'Nama Pasien',
            'Alamat',
            'Kelurahan',
            'Kecamatan',
            'Nama Penelepon',
            'No Penelepon',
            'Kasus',
            'Petugas',
            'Cara Order',
            'Waktu Order',
            'Waktu Terima',
            'Waktu Rujuk',
            'Waktu Sampai Lokasi',
            'Waktu Sampai Rujuk',
            'Waktu Selesai',
            'Waktu Bersiap Kembali',
            'Catatan',
        ];
    }



    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $cellRange = 'A1:' . $highestColumn . $highestRow;

        return [
            // Styling Header Tabel Baris 1
            1    => [
                'font' => ['bold' => true, 'size' => 12],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],

            // Garis pembatas (Border)
            $cellRange => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['argb' => 'FF000000'],
                    ],
                ],
                'alignment' => [
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ]
        ];
    }
}
