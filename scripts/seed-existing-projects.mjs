// One-time migration: uploads the 5 existing static projects (currently
// hardcoded in the pre-dashboard version of src/lib/data.ts, and still
// sitting as files under public/images/projects/) into Supabase, so the
// public site doesn't go blank the moment it switches from static data to
// the database. Safe to run once, after:
//   1. the SQL migration has been applied, and
//   2. the client's Supabase Auth user has been created.
//
// Usage (from the project root):
//   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
//   SEED_CLIENT_EMAIL=you@example.com SEED_CLIENT_PASSWORD=... \
//   node scripts/seed-existing-projects.mjs
//
// Deliberately uses only the public anon key + a real sign-in — never the
// service role key — so every insert goes through the exact same RLS path
// a normal dashboard session would.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import path from "node:path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = process.env.SEED_CLIENT_EMAIL;
const PASSWORD = process.env.SEED_CLIENT_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !EMAIL || !PASSWORD) {
  console.error(
    "Missing env vars. Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SEED_CLIENT_EMAIL, SEED_CLIENT_PASSWORD."
  );
  process.exit(1);
}

const projects = [
  {
    slug: "yit-gala",
    title: "YIT Gala",
    category: "Event Coverage",
    project_year: "2025",
    client_name: "YIT",
    description:
      "A formal gala evening — candid table moments, speeches and the quiet in-between instants that a night like this is actually remembered by.",
    photos: [
      { file: "yit-gala-1.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-2.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-3.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-4.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-5.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-6.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-7.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-8.jpg", width: 1600, height: 2000 },
      { file: "yit-gala-9.jpg", width: 1600, height: 1280 },
      { file: "yit-gala-10.jpg", width: 1600, height: 1280 },
    ],
  },
  {
    slug: "myles-munroe-foundation",
    title: "Myles Munroe Foundation",
    category: "Event Coverage",
    project_year: "2024",
    client_name: "Myles Munroe Foundation",
    description:
      "Coverage of the Global Influence Leadership Award — speakers, presentations and the room itself, shot to hold up as a record of the occasion.",
    photos: [
      { file: "myles-munroe-foundation-1.jpg", width: 1600, height: 1066 },
      { file: "myles-munroe-foundation-2.jpg", width: 1600, height: 1066 },
      { file: "myles-munroe-foundation-3.jpg", width: 1600, height: 1454 },
      { file: "myles-munroe-foundation-4.jpg", width: 1600, height: 1467 },
      { file: "myles-munroe-foundation-5.jpg", width: 1600, height: 1600 },
    ],
  },
  {
    slug: "jazz-and-wine",
    title: "Jazz & Wine",
    category: "Event Coverage",
    project_year: "2026",
    client_name: "Jazz & Wine",
    description:
      "An evening event built around music and atmosphere — low light, live performance and a crowd at ease, documented as it actually happened.",
    photos: [
      { file: "jazz-and-wine-1.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-2.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-3.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-4.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-5.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-6.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-7.jpg", width: 1600, height: 2000 },
      { file: "jazz-and-wine-8.jpg", width: 1600, height: 1280 },
      { file: "jazz-and-wine-9.jpg", width: 1600, height: 1280 },
      { file: "jazz-and-wine-10.jpg", width: 1600, height: 1280 },
    ],
  },
  {
    slug: "50th-birthday",
    title: "50th Birthday",
    category: "Event Coverage",
    project_year: "2025",
    client_name: "Private Client",
    description: "A milestone birthday celebration — full-day coverage of the guests, the toasts and the small details that made the day theirs.",
    photos: [
      { file: "50th-birthday-1.jpg", width: 1600, height: 1493 },
      { file: "50th-birthday-2.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-3.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-4.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-5.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-6.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-7.jpg", width: 1600, height: 1066 },
      { file: "50th-birthday-8.jpg", width: 1600, height: 2400 },
      { file: "50th-birthday-9.jpg", width: 1600, height: 2400 },
      { file: "50th-birthday-10.jpg", width: 1600, height: 2505 },
    ],
  },
  {
    slug: "one-year-birthday",
    title: "1 Year Birthday",
    category: "Event Coverage",
    project_year: "2026",
    client_name: "Private Client",
    description: "A first birthday, photographed the way it deserves to be — warm, unposed and built to be looked back on for years.",
    photos: [
      { file: "one-year-birthday-1.jpg", width: 1600, height: 2139 },
      { file: "one-year-birthday-2.jpg", width: 1600, height: 2400 },
      { file: "one-year-birthday-3.jpg", width: 1600, height: 2400 },
      { file: "one-year-birthday-4.jpg", width: 1600, height: 2400 },
      { file: "one-year-birthday-5.jpg", width: 1600, height: 2400 },
      { file: "one-year-birthday-6.jpg", width: 1600, height: 2142 },
      { file: "one-year-birthday-7.jpg", width: 1600, height: 1066 },
      { file: "one-year-birthday-8.jpg", width: 1600, height: 1066 },
      { file: "one-year-birthday-9.jpg", width: 1600, height: 2400 },
      { file: "one-year-birthday-10.jpg", width: 1600, height: 2400 },
    ],
  },
];

const IMAGES_ROOT = path.join(process.cwd(), "public", "images", "projects");
const BUCKET = "gallery-photos";

function contentTypeFor(filename) {
  return filename.endsWith(".png") ? "image/png" : "image/jpeg";
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({ email: EMAIL, password: PASSWORD });
  if (signInError || !signIn.user) {
    console.error("Could not sign in:", signInError?.message);
    process.exit(1);
  }
  const userId = signIn.user.id;
  console.log(`Signed in as ${EMAIL} (${userId}).`);

  for (const project of projects) {
    const { data: existing } = await supabase.from("galleries").select("id").eq("slug", project.slug).maybeSingle();
    if (existing) {
      console.log(`Skipping "${project.title}" — a gallery with slug "${project.slug}" already exists.`);
      continue;
    }

    const { data: gallery, error: galleryError } = await supabase
      .from("galleries")
      .insert({
        owner_id: userId,
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        client_name: project.client_name,
        project_year: project.project_year,
        published: true,
        featured: true,
      })
      .select("id")
      .single();

    if (galleryError || !gallery) {
      console.error(`Failed to create gallery "${project.title}":`, galleryError?.message);
      continue;
    }

    console.log(`Created gallery "${project.title}" (${gallery.id}).`);

    let coverUpdate = null;

    for (let i = 0; i < project.photos.length; i += 1) {
      const photo = project.photos[i];
      const filePath = path.join(IMAGES_ROOT, project.slug, photo.file);
      const bytes = readFileSync(filePath);
      const storagePath = `${userId}/galleries/${gallery.id}/${photo.file}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, bytes, { contentType: contentTypeFor(photo.file), upsert: false });

      if (uploadError) {
        console.error(`  Failed to upload ${photo.file}:`, uploadError.message);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      const { error: photoError } = await supabase.from("photos").insert({
        gallery_id: gallery.id,
        storage_path: storagePath,
        image_url: publicUrl,
        width: photo.width,
        height: photo.height,
        display_order: i,
      });

      if (photoError) {
        console.error(`  Failed to save photo record for ${photo.file}:`, photoError.message);
        continue;
      }

      if (i === 0) {
        coverUpdate = { cover_image: publicUrl, cover_width: photo.width, cover_height: photo.height };
      }

      console.log(`  Uploaded ${photo.file} (${i + 1}/${project.photos.length}).`);
    }

    if (coverUpdate) {
      await supabase.from("galleries").update(coverUpdate).eq("id", gallery.id);
    }
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
