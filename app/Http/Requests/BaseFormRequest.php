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

        foreach ($validator->failed() as $field => $failures) {
            foreach ($failures as $rule => $params) {
                $errors[$field][] = [
                    'message_key' => $this->getMessageKey($rule),
                    'params'      => $this->extractParams($params, $field, $rule),
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

    protected function getMessageKey(string $rule): string
    {
        return match (strtolower($rule)) {
            'min'       => 'validation.min',
            'max'       => 'validation.max',
            'unique'    => 'validation.unique',
            'confirmed' => 'validation.confirmed',
            default     => "validation.$rule",
        };
    }

    protected function extractParams(array $params, string $field, string $rule): array
    {
        $data = ['attribute' => $field];

        $rule = strtolower($rule);

        if (in_array($rule, ['min', 'max'])) {
            $value = null;

            if (count($params)) {
                $first = reset($params);
                if (is_array($first) && count($first)) {
                    $value = reset($first);
                } else {
                    $value = $first;
                }
            }

            if ($value !== null) {
                $data[$rule] = $value;
            }
        }

        return $data;
    }
}
