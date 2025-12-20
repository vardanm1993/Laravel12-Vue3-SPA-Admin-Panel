import * as yup from 'yup'

const getRuleName = (r) => String(r).split(':')[0]
const getRuleArgs = (r) => String(r).split(':').slice(1).join(':')

export function buildYupSchema(fields, t) {
    const shape = {}

    Object.entries(fields).forEach(([name, rules]) => {
        const ruleList = Array.isArray(rules) ? rules : []
        const attribute = t(`fields.${name}`)

        const has = (x) => ruleList.some((r) => getRuleName(r) === x)

        let schema
        if (has('boolean')) schema = yup.boolean()
        else if (has('number') || has('numeric')) schema = yup.number().typeError(() => t('validation.numeric', { attribute }))
        else schema = yup.string().nullable()

        for (const r of ruleList) {
            const rule = getRuleName(r)
            const args = getRuleArgs(r)

            if (rule === 'required') {
                schema = schema.required(() => t('validation.required', { attribute }))
            }

            if (rule === 'string') {
                schema = yup.string().nullable().required(schema.spec?.optional ? undefined : undefined)
            }

            if (rule === 'email') {
                schema = schema.email(() => t('validation.email', { attribute }))
            }

            if (rule === 'min') {
                const n = Number(args)
                schema = schema.min(n, () => t('validation.min', { attribute, min: n }))
            }

            if (rule === 'max') {
                const n = Number(args)
                schema = schema.max(n, () => t('validation.max', { attribute, max: n }))
            }

            if (rule === 'integer') {
                schema = schema.integer(() => t('validation.integer', { attribute }))
            }

            if (rule === 'between') {
                const [a, b] = args.split(',').map(Number)
                schema = schema.min(a).max(b).test(
                    'between',
                    () => t('validation.between', { attribute, min: a, max: b }),
                    (v) => v === undefined || v === null || (v >= a && v <= b)
                )
            }

            if (rule === 'confirmed') {
                const target = args || name.replace('_confirmation', '')
                schema = schema.test(
                    'confirmed',
                    () => t('validation.confirmed', { attribute }),
                    function (value) {
                        if (value === undefined || value === null || value === '') return true
                        return value === this.resolve(yup.ref(target))
                    }
                )
            }
        }

        shape[name] = schema
    })

    return yup.object(shape)
}
