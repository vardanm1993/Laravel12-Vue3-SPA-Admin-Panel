<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Users\SyncUserRolesRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Requests\Users\UsersIndexRequest;
use App\Models\User;
use App\Services\Admin\UsersService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private readonly UsersService $service)
    {
    }

    public function roles(): JsonResponse
    {
        return response()->json([
            'roles' => $this->service->roles(),
        ]);
    }

    public function index(UsersIndexRequest $request): JsonResponse
    {
        $p = $this->service->list($request->validated());

        $p->getCollection()->transform(function (User $u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'email_verified_at' => $u->email_verified_at,
                'roles' => $u->roles->pluck('name')->values(),
                'created_at' => $u->created_at,
            ];
        });

        return response()->json([
            'users' => $p,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $u = $this->service->update($user, $request->validated());

        return response()->json([
            'message_key' => 'users.updated',
            'user' => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'email_verified_at' => $u->email_verified_at,
                'roles' => $u->getRoleNames()->values(),
                'created_at' => $u->created_at,
            ],
        ]);
    }

    public function syncRoles(SyncUserRolesRequest $request, User $user): JsonResponse
    {
        $roles = $this->service->syncRoles($user, $request->validated()['roles']);

        return response()->json([
            'message_key' => 'users.roles_updated',
            'roles' => collect($roles)->values(),
        ]);
    }
}
