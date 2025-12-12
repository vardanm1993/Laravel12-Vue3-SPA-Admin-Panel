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
            $msg = $fieldMessages[0] ?? 'validation.failed';

            if (is_string($msg) && str_starts_with($msg, 'validation.')) {
                $errors[$field] = [[
                    'message_key' => $msg,
                    'params'      => ['attribute' => $field],
                ]];
                continue;
            }

            $rule     = array_key_first($failed[$field] ?? []) ?? 'failed';
            $rawParams = $failed[$field][$rule] ?? [];

            $errors[$field] = [[
                'message_key' => $this->mapRuleToKey($rule),
                'params'      => array_merge(
                    ['attribute' => $field],
                    $this->normalizeRuleParams($rule, $rawParams)
                ),
            ]];
        }

        throw new HttpResponseException(
            response()->json([
                'message_key' => 'validation.failed',
                'errors'      => $errors,
            ], 422)
        );
    }

    protected function normalizeRuleParams(string $rule, array $params): array
    {
        $rule = strtolower($rule);

        if ($this->isAssoc($params)) return $params;

        return match ($rule) {
            'min'     => ['min' => $params[0] ?? null],
            'max'     => ['max' => $params[0] ?? null],
            'between' => ['min' => $params[0] ?? null, 'max' => $params[1] ?? null],
            'digits'  => ['digits' => $params[0] ?? null],
            'size'    => ['size' => $params[0] ?? null],
            'mimes', 'mimetypes' => ['values' => implode(', ', $params)],
            default   => $params,
        };
    }

    protected function isAssoc(array $arr): bool
    {
        if ($arr === []) return false;
        return array_keys($arr) !== range(0, count($arr) - 1);
    }

    protected function mapRuleToKey(string $rule): string
    {
        return match (strtolower($rule)) {
            'required'   => 'validation.required',
            'email'      => 'validation.email',
            'string'     => 'validation.string',
            'min'        => 'validation.min',
            'max'        => 'validation.max',
            'between'    => 'validation.between',
            'unique'     => 'validation.unique',
            'exists'     => 'validation.exists',
            'confirmed'  => 'validation.confirmed',
            'numeric'    => 'validation.numeric',
            'integer'    => 'validation.integer',
            'digits'     => 'validation.digits',
            'image'      => 'validation.image',
            'url'        => 'validation.url',
            'date'       => 'validation.date',
            'dimensions' => 'validation.dimensions',
            'size'       => 'validation.size',
            'mimes'      => 'validation.mimes',
            'mimetypes'  => 'validation.mimes',
            'password'   => 'validation.password',
            'boolean'      => 'validation.boolean',
            default      => 'validation.failed',
        };
    }
}
