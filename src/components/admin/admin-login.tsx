"use client";

import { ArrowLeft, LockSimpleOpen } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import {
  ADMIN_DEMO_CREDENTIALS,
  ADMIN_DEMO_SESSION_KEY,
  credentialsMatch,
} from "@/lib/admin-demo-auth";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      !credentialsMatch(
        String(data.get("username") ?? ""),
        String(data.get("password") ?? ""),
      )
    ) {
      setError("اطلاعات نمایشی را مطابق راهنمای کنار فرم وارد کنید.");
      return;
    }
    // This flag is not authentication. It only keeps the presentation UI tidy.
    window.sessionStorage.setItem(ADMIN_DEMO_SESSION_KEY, "active");
    router.replace("/admin/");
  }

  return (
    <main className="admin-login" id="main-content">
      <section className="admin-login__identity">
        <div>
          <p className="admin-kicker font-technical">AUTOSAFIR / OPERATIONS</p>
          <h1 className="font-technical" dir="ltr">
            Quiet control.
            <br />
            Clear inventory.
          </h1>
        </div>
        <p>
          داشبورد مدیریت نسخه نمایشی؛ برای ارائه جریان ثبت، نگهداری و انتشار
          خودروها.
        </p>
      </section>
      <section className="admin-login__panel" aria-labelledby="login-title">
        <div className="admin-login__badge">
          <LockSimpleOpen size={22} />
          <span>دروازه نمایشی ناامن</span>
        </div>
        <h2 id="login-title">ورود به پنل دمو</h2>
        <p>
          این فرم فقط رابط کاربری را در همین تب پنهان می‌کند. احراز هویت واقعی،
          رمز امن یا مجوز دسترسی ندارد.
        </p>
        <div className="admin-credentials" aria-label="اطلاعات ورود نمایشی">
          <span>نام کاربری</span>
          <code>{ADMIN_DEMO_CREDENTIALS.username}</code>
          <span>رمز نمایشی</span>
          <code>{ADMIN_DEMO_CREDENTIALS.password}</code>
        </div>
        <form onSubmit={submit} noValidate>
          <label htmlFor="admin-username">نام کاربری</label>
          <input id="admin-username" name="username" autoComplete="username" />
          <label htmlFor="admin-password">رمز نمایشی</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          {error ? (
            <p className="admin-form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="admin-primary-button">
            ورود به نسخه نمایشی <ArrowLeft size={18} />
          </button>
        </form>
        <small>
          در نسخه Production این نقطه با نشست HttpOnly، احراز هویت سمت سرور و
          کنترل نقش جایگزین می‌شود.
        </small>
      </section>
    </main>
  );
}
