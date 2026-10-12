import bcrypt from "bcryptjs";
import User from "@/models/User";

let hasSeeded = false;

export async function ensureAdminInDB() {
  if (hasSeeded) {
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  try {
    const existingUser = await User.findOne({ email: adminEmail });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`[MongoDB] Admin user created in database: ${adminEmail}`);
    } else {
      let needsSave = false;

      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        needsSave = true;
      }

      const passwordMatches = await bcrypt.compare(
        adminPassword,
        existingUser.password
      );

      if (!passwordMatches) {
        existingUser.password = await bcrypt.hash(adminPassword, 10);
        needsSave = true;
      }

      if (needsSave) {
        await existingUser.save();
        console.log(`[MongoDB] Admin user synchronized in database: ${adminEmail}`);
      }
    }

    hasSeeded = true;
  } catch (error) {
    console.error("[MongoDB] Error ensuring admin in database:", error);
  }
}
