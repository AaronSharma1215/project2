import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn(
    "Supabase env vars missing. Copy .env.local.example to .env.local and fill in your project URL and anon key."
  );
}

export const supabase = createClient(url ?? "", key ?? "");

// Example real query - swap this in for the MOCK data in app/student/page.js:
//
// export async function getAccommodations(studentId) {
//   const { data, error } = await supabase
//     .from("accommodations").select("*").eq("student_id", studentId);
//   if (error) throw error;
//   return data;
// }
