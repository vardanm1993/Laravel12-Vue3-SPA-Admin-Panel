<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\URL;

class ResetPasswordNotification extends ResetPassword
{
    protected function resetUrl($notifiable): string
    {
        return URL::to('/admin/reset-password?token=' . $this->token . '&email=' . urlencode($notifiable->getEmailForPasswordReset()));
    }
}
