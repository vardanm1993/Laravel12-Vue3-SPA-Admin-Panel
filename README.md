# admin-panel-laravel12-vue3
Modern SPA Admin Panel built with **Laravel 12** and **Vue 3** — featuring **Sanctum session authentication**, **RBAC (Spatie Permissions)**, **i18n (EN/RU/AM)**, and a reusable **SmartForm** layer powered by **VeeValidate + Yup**.

---

## Highlights

- **SPA Auth (Sanctum / Session):** CSRF cookie + `withCredentials`, secure session flow
- **RBAC:** Roles & permissions via `spatie/laravel-permission`
- **Email Verification:** SPA-friendly redirect flow + resend endpoint
- **Password Reset:** Custom notification with SPA reset URL (`/admin/reset-password`)
- **Profile module:** update info, change password, delete account, avatar upload/delete
- **i18n everywhere:** EN/RU/AM with backend `Accept-Language` sync
- **DX-focused forms:** `SmartForm` + `useFormBuilder` + backend validation mapping (`message_key`)
- **UI kit:** reusable Tailwind-based components
- **Axios layer:** interceptors for language, auth, error normalization, toast notifications

---

## Tech Stack

**Backend**
- Laravel 12
- Sanctum (SPA session authentication)
- spatie/laravel-permission (RBAC)

**Frontend**
- Vue 3, Pinia, Vue Router
- Vite, Tailwind CSS v4
- Vue I18n (EN/RU/AM)
- VeeValidate v4 + Yup
- Toast notifications

---

## Repository Structure (high level)

- `app/Http/Controllers` — auth, profile, admin controllers
- `app/Http/Requests` — FormRequests with unified validation payload (`message_key`)
- `app/Http/Middleware` — locale sync, SPA security glue
- `routes/web.php` — `/api` routes + SPA fallback
- `resources/js` — Vue SPA (router, stores, composables, UI)
  - `components/ui` — UI kit
  - `composables` — API + form utilities
  - `stores` — Pinia stores (auth/toast/error/profile/etc.)
  - `pages` — Login/Register/Verify/Forgot/Reset/Profile/Admin Users
- `lang/*.json` — i18n dictionaries

---

## Core Concepts

### 1) Backend ↔ Frontend validation contract (`message_key`)
Validation errors return a stable, i18n-friendly schema:

```json
{
  "message_key": "validation.failed",
  "errors": {
    "email": [
      { "message_key": "validation.email", "params": { "attribute": "email" } }
    ]
  }
}
