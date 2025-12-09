<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class BaseFormRequest extends FormRequest
{
    protected function failedValidation(Validator $validator)
    {
        $errors = [];

        $failed   = $validator->failed();
        $messages = $validator->errors()->messages();

        foreach ($messages as $field => $fieldMessages) {

            foreach ($fieldMessages as $msg) {

                if (str_starts_with($msg, 'validation.')) {

                    $errors[$field][] = [
                        'message_key' => $msg,
                        'params'      => [
                            'attribute' => $field,
                        ],
                    ];

                    continue;
                }

                $rule   = array_key_first($failed[$field] ?? []) ?? 'failed';
                $params = $failed[$field][$rule] ?? [];

                $errors[$field][] = [
                    'message_key' => $this->mapRuleToKey($rule),
                    'params'      => array_merge(
                        ['attribute' => $field],
                        $params
                    ),
                ];
            }
        }

        throw new HttpResponseException(
            response()->json([
                'message_key' => 'validation.failed',
                'errors'      => $errors,
            ], 422)
        );
    }

    protected function mapRuleToKey(string $rule): string
    {
        return match (strtolower($rule)) {
            'required'     => 'validation.required',
            'email'        => 'validation.email',
            'string'       => 'validation.string',
            'min'          => 'validation.min',
            'max'          => 'validation.max',
            'between'      => 'validation.between',
            'unique'       => 'validation.unique',
            'exists'       => 'validation.exists',
            'confirmed'    => 'validation.confirmed',
            'numeric'      => 'validation.numeric',
            'integer'      => 'validation.integer',
            'digits'       => 'validation.digits',
            'image'        => 'validation.image',
            'url'          => 'validation.url',
            'date'         => 'validation.date',
            'dimensions'   => 'validation.dimensions',
            'size'         => 'validation.size',
            'mimes'        => 'validation.mimes',

            'password'     => 'validation.password',

            default        => 'validation.failed',
        };
    }
}
