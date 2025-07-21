<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin Role if it doesn't exist
        $superAdminRole = Role::firstOrCreate(['name' => 'en us']);

        // Create admin user if it doesn't exist
        $user = User::firstOrCreate(
            ['email' => 'carlos.alvarez@greenex.cl'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('Zguhdq1609$'), // Change this to a strong password in production
            ]
        );

        // Assign Super Admin role to the user
        $user->assignRole($superAdminRole);

        // Give all permissions to the super-admin role
        $allPermissions = Permission::all();
        $superAdminRole->syncPermissions($allPermissions);
    }
}
