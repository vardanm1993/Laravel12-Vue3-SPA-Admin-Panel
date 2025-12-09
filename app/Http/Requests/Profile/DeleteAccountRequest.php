<?php

namespace App\Http\Requests\Profile;

use App\Http\Requests\BaseFormRequest;
use Illuminate\Support\Facades\Hash;

class DeleteAccountRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'current_password' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'validation.required',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($v) {
            if (! Hash::check($this->current_password, $this->user()->password)) {
                $v->errors()->add('current_password', 'validation.password');
            }
        });
    }
}
