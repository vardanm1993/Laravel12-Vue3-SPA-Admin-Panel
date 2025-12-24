<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $guard = 'web';

        $permissionNames = [
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.roles.sync',
        ];

        $permissionModels = collect($permissionNames)->map(function ($name) use ($guard) {
            return Permission::firstOrCreate([
                'name' => $name,
                'guard_name' => $guard,
            ]);
        });

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => $guard,
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => $guard,
        ]);

        Role::firstOrCreate([
            'name' => 'user',
            'guard_name' => $guard,
        ]);

        $admin->syncPermissions($permissionModels);

        $manager->syncPermissions(
            $permissionModels->whereIn('name', ['users.view', 'users.update'])->values()
        );

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
