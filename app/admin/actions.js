"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

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

export const logout = keluar;
export const masuk = login;

