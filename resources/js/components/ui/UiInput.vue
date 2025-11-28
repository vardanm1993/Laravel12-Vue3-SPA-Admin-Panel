<script setup>
import { computed } from "vue";
import { cn } from "@/utils/cn.js";

defineOptions({ inheritAttrs: false })

const props = defineProps({
    modelValue: [String, Number],

    /** LABEL */
    label: String,
    required: Boolean,
    labelPosition: { type: String, default: 'top' },
    labelClass: String,

    /** INPUT */
    type: { type: String, default: 'text' },
    placeholder: String,
    disabled: Boolean,

    /** VALIDATION */
    status: { type: String, default: 'default' },
    message: String,
    messageClass: String,

    /** CLASSES */
    wrapperClass: String,
    inputClass: String,
});

const emit = defineEmits([
    'update:modelValue',
    'input',
    'blur',
    'focus',
    'change',
    'enter',
]);


const handleInput  = e => { emit('update:modelValue', e.target.value); emit('input', e.target.value); }
const handleBlur   = e => emit('blur', e.target.value);
const handleFocus  = e => emit('focus', e.target.value);
const handleChange = e => emit('change', e.target.value);
const handleKeyup  = e => e.key === 'Enter' && emit('enter', e.target.value);

/* STATUS COLORS */
const statusClasses = {
    default: 'border-gray-300 focus:ring-blue-300',
    success: 'border-green-500 focus:ring-green-300',
    error:   'border-red-500 focus:ring-red-300',
    warning: 'border-yellow-500 focus:ring-yellow-300',
};

const baseInput = 'w-full px-3 py-2 rounded-xl border text-sm outline-none transition';

const mergedInputClass = computed(() =>
    cn(
        baseInput,
        statusClasses[props.status] || statusClasses.default,
        props.disabled && 'bg-gray-100 cursor-not-allowed',
        props.inputClass
    )
);

const mergedLabelClass = computed(() =>
    cn(
        'text-sm font-medium',
        props.required && 'after:content-["*"] after:text-red-500 after:ml-1',
        props.labelClass
    )
);

const mergedMessageClass = computed(() =>
    cn(
        'text-xs',
        {
            default: 'text-gray-500',
            success: 'text-green-600',
            error: 'text-red-600',
            warning: 'text-yellow-600',
        }[props.status],
        props.messageClass
    )
);
</script>

<template>
    <div :class="wrapperClass">
        <div class="flex flex-col gap-1">
            <label v-if="label && labelPosition === 'top'" :class="mergedLabelClass">
                {{ label }}
            </label>

            <input
                v-if="type !== 'textarea'"
                :value="modelValue"
                :type="type"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="mergedInputClass"
                v-bind="$attrs"
                @input="handleInput"
                @blur="handleBlur"
                @focus="handleFocus"
                @change="handleChange"
                @keyup="handleKeyup"
            />

            <textarea
                v-else
                :value="modelValue"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="cn(mergedInputClass, 'min-h-[110px] resize-y')"
                v-bind="$attrs"
                @input="handleInput"
                @blur="handleBlur"
                @focus="handleFocus"
                @change="handleChange"
                @keyup="handleKeyup"
            />

            <p v-if="message" :class="mergedMessageClass">
                {{ message }}
            </p>
        </div>
    </div>
</template>
