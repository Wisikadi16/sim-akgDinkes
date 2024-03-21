<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //admin
        User::updateOrCreate(
            ['username' => 'adminaha'],
            [
                'name' => 'Admin',
                'password' => Hash::make('@Pandanaran79'),
                'role' => 'admin',
            ]
        );

        //operator
        User::updateOrCreate(
            ['username' => 'Operator1'],
            [
                'name' => 'Operator1',
                'password' => Hash::make('operator1'),
                'role' => 'Operator',
            ]
        );

        //yankes
        User::updateOrCreate(
            ['username' => 'Yankes'],
            [
                'name' => 'Yankes',
                'password' => Hash::make('yankes79'),
                'role' => 'Yankes',
            ]
        );

        //tim ambulan
        User::updateOrCreate(
            ['username' => 'Elang'],
            [
                'name' => 'Elang',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );

        User::updateOrCreate(
            ['username' => 'Rusa'],
            [
                'name' => 'Rusa',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );

        User::updateOrCreate(
            ['username' => 'Kuda'],
            [
                'name' => 'Kuda',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );

        User::updateOrCreate(
            ['username' => 'Rajawali'],
            [
                'name' => 'Rajawali',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );

        User::updateOrCreate(
            ['username' => 'Singa'],
            [
                'name' => 'Singa',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );

        User::updateOrCreate(
            ['username' => 'Harimau'],
            [
                'name' => 'Harimau',
                'password' => Hash::make('123456'),
                'role' => 'Tim Ambulan',
            ]
        );
    }
}
