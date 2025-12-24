<?php

namespace App\Http\Requests\Profile;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Support\Facades\Hash;

class UpdatePasswordRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required'],

            'new_password' => [
                'required',
                'string',
                'min:8',
                'max:40',
                'confirmed',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($v) {

            if (! Hash::check($this->current_password, $this->user()->password)) {
                $v->errors()->add('current_password', 'validation.password');
            }
        });
    }
}
