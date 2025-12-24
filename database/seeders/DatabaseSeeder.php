<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        if (!app()->environment(['local', 'development'])) {
            return;
        }

        $email = env('BOOTSTRAP_ADMIN_EMAIL');
        $pass  = env('BOOTSTRAP_ADMIN_PASSWORD');
        $name  = env('BOOTSTRAP_ADMIN_NAME', 'Admin');

        if (!$email || !$pass) {
            return;
        }

        $admin = User::firstOrCreate(
            ['email' => $email],
            ['name' => $name, 'password' => Hash::make($pass)]
        );

        $admin->assignRole('admin');
    }
}
