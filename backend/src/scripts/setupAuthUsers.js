require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function setupUsers() {
  console.log("==================================================");
  console.log("🔐 PatchForge AI — Supabase Developer Auth Setup");
  console.log("==================================================");

  // Define the 2 developer accounts
  const devAccounts = [
    {
      email: "kaustubhavare0602@gmail.com",
      password: "PatchForgeDev#2026",
      displayName: "Kaustubh Aware",
      role: "admin"
    },
    {
      email: "dev@patchforge.ai",
      password: "PatchForgeLead#2026",
      displayName: "PatchForge Co-Developer",
      role: "developer"
    }
  ];

  for (const acc of devAccounts) {
    console.log(`\nProcessing account: ${acc.email}...`);

    // 1. Check if user already exists
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error(`❌ Error listing users:`, listError.message);
      continue;
    }

    const existingUser = usersData.users.find(u => u.email.toLowerCase() === acc.email.toLowerCase());

    if (existingUser) {
      console.log(`ℹ User already exists (ID: ${existingUser.id}). Updating & pre-confirming email...`);
      
      const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password: acc.password,
          email_confirm: true,
          user_metadata: {
            display_name: acc.displayName,
            role: acc.role
          }
        }
      );

      if (updateError) {
        console.error(`❌ Failed to update ${acc.email}:`, updateError.message);
      } else {
        console.log(`✅ User ${acc.email} successfully updated & pre-confirmed!`);
      }
    } else {
      console.log(`Creating new pre-confirmed user: ${acc.email}...`);

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          display_name: acc.displayName,
          role: acc.role
        }
      });

      if (createError) {
        console.error(`❌ Failed to create ${acc.email}:`, createError.message);
      } else {
        console.log(`✅ User ${acc.email} successfully created & pre-confirmed! (ID: ${newUser.user.id})`);
      }
    }

    // 2. Also ensure a matching profile in public.profiles table
    try {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("email", acc.email)
        .maybeSingle();

      if (!existingProfile) {
        await supabaseAdmin.from("profiles").insert({
          email: acc.email,
          display_name: acc.displayName,
          role: acc.role
        });
        console.log(`✅ Added to public.profiles table`);
      }
    } catch (e) {
      // Ignore if profiles table is not used
    }
  }

  console.log("\n==================================================");
  console.log("🎉 Setup complete! Both developer credentials are now active & confirmed.");
  console.log("==================================================");
}

setupUsers();
