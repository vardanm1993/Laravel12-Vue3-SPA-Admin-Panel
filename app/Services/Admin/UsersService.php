<?php

namespace App\Services\Admin;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class UsersService
{
    public function list(array $filters): LengthAwarePaginator
    {
        $q = trim((string)($filters['q'] ?? ''));
        $role = trim((string)($filters['role'] ?? ''));
        $perPage = (int)($filters['per_page'] ?? 15);
        $perPage = max(5, min(50, $perPage));

        return User::query()
            ->select(['id', 'name', 'email', 'email_verified_at', 'created_at'])
            ->with(['roles:id,name'])
            ->when($q !== '', function ($qb) use ($q) {
                $qb->where(function ($qq) use ($q) {
                    $qq->where('name', 'like', "%{$q}%")
                        ->orWhere('email', 'like', "%{$q}%");
                });
            })
            ->when($role !== '', function ($qb) use ($role) {
                $qb->whereHas('roles', fn ($rq) => $rq->where('name', $role));
            })
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function roles(): array
    {
        return Role::query()
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->pluck('name')
            ->values()
            ->all();
    }

    public function update(User $user, array $data): User
    {
        $emailChanged = ($data['email'] ?? $user->email) !== $user->email;

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
        }

        return $user->fresh();
    }

    public function syncRoles(User $user, array $roles): array
    {
        $allowed = Role::query()
            ->where('guard_name', 'web')
            ->pluck('name')
            ->all();

        $roles = array_values(array_unique(array_filter(
            $roles,
            fn ($r) => is_string($r) && in_array($r, $allowed, true)
        )));

        if (empty($roles)) {
            $roles = ['user'];
        }

        $user->syncRoles($roles);

        return $user->getRoleNames()->values()->all();
    }
}
