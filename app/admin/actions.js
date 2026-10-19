"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Memeriksa apakah admin sedang login di sisi server.
 * Wajib dipanggil sebelum setiap aksi yang mengubah data.
 */
export async function periksaLogin() {
  const supabase = await createSessionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(`/admin/login?error=${encodeURIComponent("Silakan login terlebih dahulu.")}`);
  }

  return { supabase, user };
}

export async function login(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect(`/admin/login?error=${encodeURIComponent("Email dan password wajib diisi.")}`);
  }

  const supabase = await createSessionClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let pesan = "Login gagal. Periksa kembali email dan password Anda.";
    const pesanAsli = error.message.toLowerCase();

    if (pesanAsli.includes("invalid login credentials")) {
      pesan = "Email atau password salah.";
    } else if (pesanAsli.includes("email not confirmed")) {
      pesan = "Email belum dikonfirmasi.";
    } else if (pesanAsli.includes("too many requests")) {
      pesan = "Terlalu banyak percobaan masuk. Coba lagi beberapa saat lagi.";
    } else {
      pesan = error.message;
    }

    redirect(`/admin/login?error=${encodeURIComponent(pesan)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function keluar() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/admin/login");
}

export async function gantiPassword(arg1, arg2) {
  const formData = arg2 instanceof FormData ? arg2 : arg1;

  // Verifikasi login di server sebelum mengubah data
  const { supabase } = await periksaLogin();

  const passwordBaru = (
    formData.get("password_baru") ||
    formData.get("passwordBaru") ||
    formData.get("password")
  )?.toString();
  const konfirmasiPassword = (
    formData.get("konfirmasi_password") ||
    formData.get("konfirmasi") ||
    formData.get("konfirmasiPassword")
  )?.toString();

  if (!passwordBaru || !konfirmasiPassword) {
    redirect(
      `/admin/password?error=${encodeURIComponent("Password baru dan konfirmasi password wajib diisi.")}`
    );
  }

  if (passwordBaru.length < 8) {
    redirect(
      `/admin/password?error=${encodeURIComponent("Password baru minimal 8 karakter.")}`
    );
  }

  if (passwordBaru !== konfirmasiPassword) {
    redirect(
      `/admin/password?error=${encodeURIComponent("Konfirmasi password tidak sama dengan password baru.")}`
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: passwordBaru,
  });

  if (error) {
    redirect(
      `/admin/password?error=${encodeURIComponent(error.message || "Gagal mengganti password.")}`
    );
  }

  revalidatePath("/admin/password");
  redirect(
    `/admin/password?sukses=${encodeURIComponent("Password berhasil diganti.")}`
  );
}

export const requireAuth = periksaLogin;
export const ubahPassword = gantiPassword;
export const logout = keluar;
export const masuk = login;
