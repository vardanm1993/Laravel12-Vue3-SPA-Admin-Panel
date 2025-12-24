<?php

namespace App\Http\Requests\Users;

use App\Http\Requests\BaseFormRequest;

class SyncUserRolesRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['string', 'max:50'],
        ];
    }
}
