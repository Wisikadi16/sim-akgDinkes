<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;

class OperasionalExport implements FromCollection, WithHeadings, ShouldAutoSize, WithStyles, WithCustomStartCell, WithEvents
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

    public function startCell(): string
    {
        return 'A3'; // Tabel data dan header akan dimulai dari baris ke-3
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

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Tulis Judul Laporan di A1 dan merge ke T2
                $event->sheet->setCellValue('A1', 'LAPORAN OPERASIONAL PELAYANAN AMBULAN');
                $event->sheet->mergeCells('A1:T2');

                // Styling Judul (Red Theme)
                $event->sheet->getDelegate()->getStyle('A1')->getFont()->setBold(true)->setSize(16)->getColor()->setARGB('FFFFFFFF');
                $event->sheet->getDelegate()->getStyle('A1:T2')->getFill()->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)->getStartColor()->setARGB('FFB91C1C'); // Merah Tua (Red-700)
                $event->sheet->getDelegate()->getStyle('A1:T2')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

                // Mengubah tinggi baris Header Tabel (Baris ke-3)
                $event->sheet->getDelegate()->getRowDimension(3)->setRowHeight(35);
            },
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $cellRange = 'A3:' . $highestColumn . $highestRow;

        return [
            // Styling Header Tabel Baris 3
            3    => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 12],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FFDC2626'] // Merah Terang (Red-600)
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],

            // Garis pembatas (Border) mulai baris 3 ke bawah
            $cellRange => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['argb' => 'FF000000'],
                    ],
                ],
                'alignment' => [
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER, // Isi data rata tengah vertikal
                ],
            ]
        ];
    }
}
